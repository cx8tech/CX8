import {
  supabase, getUser, getPlan, isRateLimited, parseModels, modelKey,
  getCoveredKeys, PRICE_PER_MODEL_CENTS,
} from './_lib/common.js'

// POST { models: [{b, m, mode}] } → { url } of a LemonSqueezy checkout
// priced at €2 per model not already paid for. The job is recorded as
// pending; the webhook marks it paid (see lemonsqueezy-webhook.js).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Login required' })

  const models = parseModels(req.body?.models)
  if (!models) return res.status(400).json({ error: 'Invalid request' })

  if (await isRateLimited(user.id, 'tool5-checkout', 20)) {
    return res.status(429).json({ error: 'Too many checkout attempts. Please try again later.' })
  }
  if (await getPlan(user.id) === 'pro') {
    return res.status(400).json({ error: 'Pro includes unlimited comparisons' })
  }

  const covered = await getCoveredKeys(user.id)
  const unpaid = models.filter(m => !covered.has(modelKey(m)))
  if (!unpaid.length) return res.status(400).json({ error: 'These models are already paid for' })

  const amountCents = unpaid.length * PRICE_PER_MODEL_CENTS
  const { data: job, error: jobError } = await supabase
    .from('comparison_jobs')
    .insert({ user_id: user.id, models: unpaid, model_count: unpaid.length, amount_cents: amountCents })
    .select('id')
    .single()
  if (jobError) return res.status(500).json({ error: 'Could not start checkout' })

  const origin = `https://${req.headers['x-forwarded-host'] || req.headers.host}`
  const n = unpaid.length
  const lsRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          custom_price: amountCents,
          product_options: {
            name: `Actuator cross-reference — ${n} model${n === 1 ? '' : 's'}`,
            description: unpaid.map(m => `${m.b} ${m.m}`).join(', ').slice(0, 500),
            redirect_url: `${origin}/tools/actuator-cross-reference?paid=1`,
          },
          checkout_data: {
            email: user.email,
            custom: { user_id: user.id, job_id: job.id },
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: String(process.env.LEMONSQUEEZY_STORE_ID || process.env.VITE_LEMONSQUEEZY_STORE_ID) } },
          variant: { data: { type: 'variants', id: String(process.env.LEMONSQUEEZY_QUERY_VARIANT_ID) } },
        },
      },
    }),
  })

  const checkout = await lsRes.json().catch(() => null)
  const url = checkout?.data?.attributes?.url
  if (!lsRes.ok || !url) {
    console.error('LemonSqueezy checkout failed:', lsRes.status, JSON.stringify(checkout?.errors ?? checkout))
    return res.status(502).json({ error: 'Could not start checkout' })
  }

  return res.status(200).json({ url })
}
