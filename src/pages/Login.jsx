import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resendStatus, setResendStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setUnconfirmed(false)
    setResendStatus(null)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (err?.code === 'email_not_confirmed' || /not confirmed/i.test(err?.message ?? '')) {
      setUnconfirmed(true)
      return setError('Please confirm your email first. Check your inbox (and spam folder) for the link we sent you.')
    }
    if (err) return setError('Incorrect email or password.')
    navigate(redirect)
  }

  const resendConfirmation = async () => {
    setResendStatus('sending')
    const { error: err } = await supabase.auth.resend({ type: 'signup', email: form.email })
    setResendStatus(err ? 'error' : 'sent')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="CX8" onError={e => { e.target.style.display = 'none' }} />
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Log in to your CX8 account</p>

        <form className="auth-form" onSubmit={submit}>
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set('email')}
              required
              autoFocus
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={set('password')}
              required
            />
          </div>

          <Link to="/reset-password" className="auth-forgot">Forgot password?</Link>

          {error && <div className="auth-error">{error}</div>}

          {unconfirmed && (
            resendStatus === 'sent' ? (
              <div className="auth-resend-note">Sent! Check your inbox.</div>
            ) : (
              <button type="button" className="auth-resend" onClick={resendConfirmation} disabled={resendStatus === 'sending'}>
                {resendStatus === 'sending' ? 'Sending…'
                  : resendStatus === 'error' ? 'Could not send. Try again in a few minutes.'
                  : 'Resend confirmation email'}
              </button>
            )
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to={redirect === '/' ? '/register' : `/register?redirect=${encodeURIComponent(redirect)}`}>Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
