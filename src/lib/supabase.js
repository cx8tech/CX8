import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Where the email confirmation link should land: the page the user came
// from (?redirect=), limited to paths on this site, else the homepage.
// Supabase must allow it (Authentication → URL Configuration → Redirect URLs).
export function confirmRedirectUrl(redirect) {
  const path = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
  return `${window.location.origin}${path}`
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,       // keeps session across browser close (cross-device login)
    autoRefreshToken: true,     // silently refreshes JWT before it expires
    detectSessionInUrl: true,   // handles email confirmation redirects
  },
})
