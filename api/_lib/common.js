import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Pricing rules (see the CX8 usage-first pricing model) ──
export const PRICE_PER_MODEL_CENTS = 200          // €2 per model compared
export const RERUN_WINDOW_MS = 24 * 60 * 60 * 1000 // paid models re-run free for 24h
export const REGULAR_JOBS_PER_MONTH = 3            // paid jobs before Pro is offered
export const MAX_MODELS = 50

// Logged-in user from the Supabase access token, or null
export async function getUser(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  const { data: { user }, error } = await supabase.auth.getUser(auth.slice(7))
  return error ? null : user
}

export async function getPlan(userId) {
  const { data } = await supabase.from('profiles').select('plan').eq('id', userId).single()
  return data?.plan ?? 'free'
}

// True if the user has made `limit` or more requests to `endpoint` this hour
export async function isRateLimited(userId, endpoint, limit) {
  const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('requested_at', windowStart)
  if (count >= limit) return true
  await supabase.from('rate_limits').insert({ user_id: userId, endpoint })
  if (Math.random() < 0.05) {
    await supabase.from('rate_limits').delete().lt('requested_at', windowStart)
  }
  return false
}

export const modelKey = m => `${m.b}|${m.m}|${m.mode}`

// Validated, de-duplicated list of {b, m, mode}, or null if malformed
export function parseModels(raw) {
  if (!Array.isArray(raw) || !raw.length || raw.length > MAX_MODELS) return null
  const seen = new Map()
  for (const m of raw) {
    if (typeof m?.b !== 'string' || typeof m?.m !== 'string' || !['DA', 'SA'].includes(m?.mode)) return null
    const clean = { b: m.b, m: m.m, mode: m.mode }
    seen.set(modelKey(clean), clean)
  }
  return [...seen.values()]
}

// Models the user has paid for within the re-run window
export async function getCoveredKeys(userId) {
  const { data } = await supabase
    .from('comparison_jobs')
    .select('models')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .gt('expires_at', new Date().toISOString())
  return new Set((data ?? []).flatMap(job => job.models.map(modelKey)))
}

// Paid jobs this calendar month, for the regular-user page
export async function getUsage(userId) {
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
  const { data } = await supabase
    .from('comparison_jobs')
    .select('model_count, amount_cents')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .gte('paid_at', monthStart)
  const jobs = data ?? []
  return {
    jobs: jobs.length,
    models: jobs.reduce((sum, j) => sum + j.model_count, 0),
    spentCents: jobs.reduce((sum, j) => sum + j.amount_cents, 0),
    regular: jobs.length >= REGULAR_JOBS_PER_MONTH,
  }
}
