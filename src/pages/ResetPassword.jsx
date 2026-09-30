import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Two steps on one page: request a reset email, then (arriving from the
// email link) choose a new password.
export default function ResetPassword() {
  const navigate = useNavigate()
  const [recovering, setRecovering] = useState(() => window.location.hash.includes('type=recovery'))
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const requestReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) return setError(err.message)
    setSent(true)
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: form.password })
    setLoading(false)
    if (err) return setError('This reset link has expired. Please request a new one.')
    navigate('/')
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-check">✓</div>
          <h2 className="auth-title">Check your email</h2>
          <p className="auth-sub">If an account exists for <strong>{email}</strong>, we sent a link to reset your password.</p>
          <Link to="/login" className="auth-back">Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="CX8" onError={e => { e.target.style.display = 'none' }} />
        </div>

        {recovering ? (
          <>
            <h2 className="auth-title">Choose a new password</h2>
            <p className="auth-sub">Enter a new password for your CX8 account</p>

            <form className="auth-form" onSubmit={updatePassword}>
              <div className="auth-field">
                <label className="auth-label">New password</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoFocus
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save Password'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="auth-title">Reset your password</h2>
            <p className="auth-sub">We'll email you a link to choose a new password</p>

            <form className="auth-form" onSubmit={requestReset}>
              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-switch">
              Remembered it? <Link to="/login">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
