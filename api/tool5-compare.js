import {
  supabase, getUser, getPlan, isRateLimited, parseModels, modelKey,
  getCoveredKeys, getUsage, PRICE_PER_MODEL_CENTS,
} from './_lib/common.js'
import { findBestEquivalent, getRefTorque } from './_lib/matching.js'

// POST { models: [{b, m, mode}], pressure, brands } → equivalents for those
// models only. Pro users always get results; everyone else needs every
// model covered by a paid job from the last 24 hours, otherwise this
// returns 402 with the price of the models still to pay for.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Login required' })

  const models = parseModels(req.body?.models)
  const pressure = Number(req.body?.pressure)
  const brands = req.body?.brands ?? []
  if (!models || !(pressure >= 2 && pressure <= 10) ||
      !Array.isArray(brands) || brands.length > 50 || !brands.every(b => typeof b === 'string')) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  if (await isRateLimited(user.id, 'tool5-compare', 120)) {
    return res.status(429).json({ error: 'Too many comparisons. Please try again later.' })
  }

  if (await getPlan(user.id) !== 'pro') {
    const covered = await getCoveredKeys(user.id)
    const unpaid = models.filter(m => !covered.has(modelKey(m)))
    if (unpaid.length) {
      return res.status(402).json({
        error: 'Payment required',
        requested: models.length,
        unpaid: unpaid.length,
        priceCents: unpaid.length * PRICE_PER_MODEL_CENTS,
        usage: await getUsage(user.id),
      })
    }
  }

  const { data, error } = await supabase.from('actuator_data').select('record')
  if (error || !data?.length) return res.status(500).json({ error: 'Failed to load data' })
  const db = data.map(row => row.record)

  const pairs = models.map(m => {
    const rec = db.find(r => modelKey(r) === modelKey(m))
    if (!rec) return { key: modelKey(m), rec: null, equivalent: null }
    return {
      key: modelKey(m),
      rec,
      refTorque: getRefTorque(rec, pressure),
      equivalent: findBestEquivalent(rec, pressure, brands, db),
    }
  })

  return res.status(200).json({ pairs })
}
