import {
  getUser, getPlan, isRateLimited, parseModels, parseBrands, modelKey,
  coverKey, getCoveredKeys, getUsage, getActuatorDb, PRICE_PER_MODEL_CENTS,
} from './_lib/common.js'
import { findBestEquivalent, getRefTorque } from './_lib/matching.js'

// POST { models: [{b, m, mode}], pressure, brands } → equivalents for those
// models only. Pro users always get results; everyone else needs every
// model covered by a paid job from the last 24 hours with the same
// manufacturer preferences (only the pressure may change), otherwise this
// returns 402 with the price of the models still to pay for (VAT included).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Login required' })

  const models = parseModels(req.body?.models)
  const pressure = Number(req.body?.pressure)
  const brands = parseBrands(req.body?.brands)
  if (!models || !(pressure >= 2 && pressure <= 10) || !brands) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  // Independent lookups run together rather than one after another
  const [limited, plan, covered, db] = await Promise.all([
    isRateLimited(user.id, 'tool5-compare', 120),
    getPlan(user.id),
    getCoveredKeys(user.id),
    getActuatorDb(),
  ])

  if (limited) {
    return res.status(429).json({ error: 'Too many comparisons. Please try again later.' })
  }

  if (plan !== 'pro') {
    const unpaid = models.filter(m => !covered.has(coverKey(m, brands)))
    if (unpaid.length) {
      return res.status(402).json({
        error: 'Payment required',
        requested: models.length,
        unpaid: unpaid.length,
        priceCents: unpaid.length * PRICE_PER_MODEL_CENTS,
        pricePerModelCents: PRICE_PER_MODEL_CENTS,
        usage: await getUsage(user.id),
      })
    }
  }

  if (!db) return res.status(500).json({ error: 'Failed to load data' })

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
