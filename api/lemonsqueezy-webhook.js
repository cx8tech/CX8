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

  if (!userId) return res.status(400).json({ error: 'No user_id in custom data' })

  if (eventName === 'subscription_created' || eventName === 'order_created') {
    const subscriptionId = event.data?.id
    await supabase
      .from('profiles')
      .update({
        subscription_id: String(subscriptionId),
        subscription_status: 'active',
        plan: 'pro',
      })
      .eq('id', userId)
  }

  if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
    await supabase
      .from('profiles')
      .update({ subscription_status: 'cancelled', plan: 'free' })
      .eq('id', userId)
  }

  return res.status(200).json({ received: true })
}
