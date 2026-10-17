import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { RERUN_WINDOW_MS } from './_lib/common.js'

export const config = {
  api: { bodyParser: false },
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody = await getRawBody(req)
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  const signature = req.headers['x-signature']

  if (!secret || !signature) return res.status(401).json({ error: 'Missing signature or secret' })

  const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const hashBuf = Buffer.from(hash)
  const sigBuf  = Buffer.from(signature)
  const valid   = hashBuf.length === sigBuf.length && crypto.timingSafeEqual(hashBuf, sigBuf)
  if (!valid) return res.status(401).json({ error: 'Invalid signature' })

  const event = JSON.parse(rawBody)
  const eventName = event.meta?.event_name
  const attrs = event.data?.attributes ?? {}
  const ref = `${eventName} ${event.data?.type} ${event.data?.id}`

  // Checkouts from the site carry the CX8 user ID. A purchase made some other
  // way (e.g. a shared LemonSqueezy link) is matched by the buyer's email.
  // Unmatched events are acknowledged so LemonSqueezy doesn't keep retrying.
  const userId = event.meta?.custom_data?.user_id || await findUserIdByEmail(attrs.user_email)
  if (!userId) {
    console.warn(`LemonSqueezy webhook: no CX8 account for ${ref}; nothing unlocked`)
    return res.status(200).json({ received: true })
  }

  // Pay-per-query orders carry the comparison job they pay for. They unlock
  // that job's models for 24 hours and never change the user's plan.
  const jobId = event.meta?.custom_data?.job_id
  const isQueryProduct = String(attrs.first_order_item?.variant_id) === String(process.env.LEMONSQUEEZY_QUERY_VARIANT_ID)
  if (!jobId && isQueryProduct) {
    // Bought outside the site, so the models are unknown: refund it manually
    console.warn(`LemonSqueezy webhook: per-model order without a job, ${ref}; refund it in LemonSqueezy`)
    return res.status(200).json({ received: true })
  }
  if (jobId) {
    let jobUpdate = null
    if (eventName === 'order_created' && attrs.status === 'paid') {
      const paidAt = new Date()
      jobUpdate = {
        status: 'paid',
        order_id: String(event.data?.id),
        paid_at: paidAt.toISOString(),
        expires_at: new Date(paidAt.getTime() + RERUN_WINDOW_MS).toISOString(),
      }
    } else if (eventName === 'order_refunded' && attrs.status === 'refunded') {
      jobUpdate = { status: 'refunded' }
    }
    if (jobUpdate) {
      const { error } = await supabase.from('comparison_jobs').update(jobUpdate).eq('id', jobId).eq('user_id', userId)
      if (error) return res.status(500).json({ error: 'Failed to update job' })
    }
    return res.status(200).json({ received: true })
  }

  let update = null

  if (eventName?.startsWith('subscription_') && event.data?.type === 'subscriptions') {
    // The subscription's own status is the source of truth, so events arriving
    // out of order still settle on the right plan.
    update = {
      subscription_id: String(event.data.id),
      subscription_status: attrs.status,
      plan: PRO_STATUSES.includes(attrs.status) ? 'pro' : 'free',
    }
  } else if (eventName === 'order_created' && attrs.status === 'paid') {
    update = { subscription_status: 'active', plan: 'pro' }
  } else if (
    (eventName === 'order_refunded' || eventName === 'subscription_payment_refunded') &&
    attrs.status === 'refunded'
  ) {
    // Full refunds only; partial refunds (status 'partial_refund') keep access
    update = { subscription_status: 'refunded', plan: 'free' }
  }

  if (update) {
    const { error } = await supabase.from('profiles').update(update).eq('id', userId)
    if (error) return res.status(500).json({ error: 'Failed to update profile' })
  }

  return res.status(200).json({ received: true })
}

async function findUserIdByEmail(email) {
  if (typeof email !== 'string' || !email) return null
  const { data } = await supabase.from('profiles').select('id').eq('email', email.trim().toLowerCase()).limit(1).maybeSingle()
  return data?.id ?? null
}

// LemonSqueezy subscription statuses that keep Pro access. 'cancelled' stays
// Pro until the period ends (LemonSqueezy then sends 'expired'); 'past_due'
// stays Pro while LemonSqueezy retries the payment.
const PRO_STATUSES = ['on_trial', 'active', 'past_due', 'cancelled']
