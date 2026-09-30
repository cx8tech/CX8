import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

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
  const userId = event.meta?.custom_data?.user_id
  const attrs = event.data?.attributes ?? {}

  if (!userId) return res.status(400).json({ error: 'No user_id in custom data' })

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

// LemonSqueezy subscription statuses that keep Pro access. 'cancelled' stays
// Pro until the period ends (LemonSqueezy then sends 'expired'); 'past_due'
// stays Pro while LemonSqueezy retries the payment.
const PRO_STATUSES = ['on_trial', 'active', 'past_due', 'cancelled']
