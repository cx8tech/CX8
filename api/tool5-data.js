import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const RATE_LIMIT = 20      // max requests per window
const WINDOW_MS  = 60 * 60 * 1000  // 1 hour

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // ── 1. Verify auth token ──
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // ── 2. Check pro plan ──
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    return res.status(403).json({ error: 'Pro subscription required' })
  }

  // ── 3. Rate limiting ──
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()
  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('endpoint', 'tool5-data')
    .gte('requested_at', windowStart)

  if (count >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' })
  }

  await supabase.from('rate_limits').insert({
    user_id: user.id,
    endpoint: 'tool5-data',
  })

  // ── 4. Return data ──
  const { data, error } = await supabase
    .from('actuator_data')
    .select('record')

  if (error || !data?.length) {
    return res.status(500).json({ error: 'Failed to fetch data' })
  }

  return res.status(200).json({ data: data.map(r => r.record) })
}
