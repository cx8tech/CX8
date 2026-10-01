import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PREVIEW_LIMIT = 60      // max single-model lookups per visitor per window
const WINDOW_MS     = 60 * 60 * 1000  // 1 hour

// Visitors are identified by a keyed hash of their IP so no raw IPs are stored.
function visitorId(req) {
  const ip = req.headers['x-real-ip']
    || req.headers['x-forwarded-for']?.split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown'
  return crypto.createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY).update(ip).digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Public index: names and actuator types only, enough to fill the pickers.
  if (req.query?.index === '1') {
    const { data, error } = await supabase
      .from('actuator_data')
      .select('brand, mode, m:record->>m')

    if (error) return res.status(500).json({ error: 'Failed to fetch index' })

    return res.status(200).json({
      data: data.map(row => ({ b: row.brand, m: row.m, mode: row.mode })),
    })
  }

  // Public preview: one model's full record, rate-limited per visitor so the
  // dataset can't be pulled in bulk. Equivalent-result generation stays Pro-only.
  if (req.query?.model) {
    const { brand, model, mode } = req.query
    if (typeof brand !== 'string' || typeof model !== 'string' || !['DA', 'SA'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid model' })
    }

    const visitor = visitorId(req)
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()
    const { count, error: countError } = await supabase
      .from('preview_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('visitor', visitor)
      .gte('requested_at', windowStart)

    // Head queries can report a missing table as a null count with no error
    if (countError || count === null) console.error('preview rate limit check failed:', countError?.message ?? 'no count')
    if (count >= PREVIEW_LIMIT) {
      return res.status(429).json({ error: 'Preview limit reached. Please try again later.' })
    }
    await supabase.from('preview_rate_limits').insert({ visitor })
    // Rows are only needed for the current window; prune now and then
    if (Math.random() < 0.05) {
      await supabase.from('preview_rate_limits').delete().lt('requested_at', windowStart)
    }

    const { data, error } = await supabase
      .from('actuator_data')
      .select('record')
      .eq('brand', brand)
      .eq('mode', mode)
      .eq('record->>m', model)
      .limit(1)
      .maybeSingle()

    if (error) return res.status(500).json({ error: 'Failed to fetch model' })
    if (!data) return res.status(404).json({ error: 'Model not found' })

    return res.status(200).json({ data: data.record })
  }

  // The full dataset is never sent to browsers; results come from
  // /api/tool5-compare, which matches on the server.
  return res.status(400).json({ error: 'Invalid request' })
}
