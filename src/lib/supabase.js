import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,       // keeps session across browser close (cross-device login)
    autoRefreshToken: true,     // silently refreshes JWT before it expires
    detectSessionInUrl: true,   // handles email confirmation redirects
  },
})
