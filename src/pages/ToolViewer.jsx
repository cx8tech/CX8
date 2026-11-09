import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { allTools } from '../data/tools'
import { supabase, confirmRedirectUrl } from '../lib/supabase'

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

// Pro Monthly price shown in the UI; the charged amount is set on the
// LemonSqueezy subscription product. All prices include VAT.
const PRO_MONTHLY_CENTS = 7500
const PRO_MONTHLY_PRICE = '€75'

const euros = cents => `€${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`

// Login prompt for PDF downloads and Tool 5 results. The forms live in the
// popup, so the tool underneath keeps everything the user has entered.
// ToolViewer closes it and carries on as soon as the user is logged in,
// including when they confirm their email in another tab.
function GateModal({ onClose, toolPath, reason }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')   // 'login' | 'register' | 'sent'
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resendStatus, setResendStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  // The email link opens a new tab; ?resume=1 restores Tool 5's selection there
  const emailRedirectTo = confirmRedirectUrl(reason === 'pdf' ? toolPath : `${toolPath}?resume=1`)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const switchMode = m => {
    setMode(m)
    setError('')
    setUnconfirmed(false)
    setResendStatus(null)
  }

  const logIn = async e => {
    e.preventDefault()
    setError('')
    setUnconfirmed(false)
    setResendStatus(null)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (!err) return
    setLoading(false)
    if (err.code === 'email_not_confirmed' || /not confirmed/i.test(err.message ?? '')) {
      setUnconfirmed(true)
      return setError('Please confirm your email first. Check your inbox (and spam folder) for the link we sent you.')
    }
    setError('Incorrect email or password.')
  }

  const register = async e => {
    e.preventDefault()
    setError('')
    const fullName = form.fullName.trim()
    if (fullName.length < 2) return setError('Please enter your full name.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo, data: { full_name: fullName } },
    })
    setLoading(false)
    if (err) return setError(err.message)
    // Supabase returns no identities, and sends no email, for an address that is already registered
    if (data.user?.identities?.length === 0) {
      setMode('login')
      return setError('This email already has an account. Please log in.')
    }
    if (!data.session) setMode('sent')
  }

  const resendConfirmation = async () => {
    setResendStatus('sending')
    const { error: err } = await supabase.auth.resend({ type: 'signup', email: form.email, options: { emailRedirectTo } })
    setResendStatus(err ? 'error' : 'sent')
  }

  const resendControl = resendStatus === 'sent' ? (
    <div className="auth-resend-note">Sent! Check your inbox.</div>
  ) : (
    <button type="button" className="auth-resend" onClick={resendConfirmation} disabled={resendStatus === 'sending'}>
      {resendStatus === 'sending' ? 'Sending…'
        : resendStatus === 'error' ? 'Could not send. Try again in a few minutes.'
        : 'Resend confirmation email'}
    </button>
  )

  const action = reason === 'pdf' ? 'download your results as a PDF' : 'find equivalents'

  return (
    <div className="gate-overlay pay-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="gate-modal pay-modal">
        {mode === 'sent' ? (
          <>
            <div className="auth-check">✓</div>
            <h2 className="gate-title">Check Your Email</h2>
            <p className="gate-sub">
              We sent a confirmation link to <strong>{form.email}</strong>. Click it, then come back to this tab. Everything you entered is still here.
            </p>
            <div className="gate-auth gate-auth-sent">{resendControl}</div>
            <p className="auth-switch">
              Confirmed on another device? <button type="button" onClick={() => switchMode('login')}>Log in</button>
            </p>
          </>
        ) : (
          <>
            <div className="gate-icon"><IconLock /></div>
            <h2 className="gate-title">{mode === 'login' ? 'Log In to Continue' : 'Create Your Free Account'}</h2>
            <p className="gate-sub">
              {mode === 'login' ? `Log in to ${action}.` : `Create a free CX8 account to ${action}.`} Your details stay on this page.
            </p>
            <form className="auth-form gate-auth" onSubmit={mode === 'login' ? logIn : register}>
              {mode === 'register' && (
                <div className="auth-field">
                  <label className="auth-label" htmlFor="gate-name">Full name</label>
                  <input id="gate-name" className="auth-input" type="text" placeholder="Jane Smith" value={form.fullName} onChange={set('fullName')} autoComplete="name" maxLength={50} required />
                </div>
              )}
              <div className="auth-field">
                <label className="auth-label" htmlFor="gate-email">Email address</label>
                <input id="gate-email" className="auth-input" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} autoComplete="email" required />
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="gate-password">Password</label>
                <input id="gate-password" className="auth-input" type="password" placeholder={mode === 'login' ? 'Your password' : 'Min. 6 characters'} value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
              </div>
              {mode === 'register' && (
                <div className="auth-field">
                  <label className="auth-label" htmlFor="gate-confirm">Confirm password</label>
                  <input id="gate-confirm" className="auth-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" required />
                </div>
              )}
              {mode === 'login' && (
                <a href="/reset-password" target="_blank" rel="noopener" className="auth-forgot">Forgot password?</a>
              )}
              {error && <div className="auth-error">{error}</div>}
              {unconfirmed && resendControl}
              <button className="auth-btn" type="submit" disabled={loading}>
                {mode === 'login'
                  ? (loading ? 'Logging in…' : 'Log In')
                  : (loading ? 'Creating account…' : 'Create Account')}
              </button>
            </form>
            <p className="auth-switch">
              {mode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => switchMode('register')}>Register for free</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => switchMode('login')}>Log in</button></>
              )}
            </p>
          </>
        )}
        <button className="gate-btn-home" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  )
}

// Payment prompt: the user picks ONE option — the per-model fee for the
// selected models, or the monthly subscription — then agrees to that
// option's terms and continues. Regular users (3+ paid jobs this month)
// also see their usage.
function PayModal({ info, user, onClose }) {
  const [choice, setChoice] = useState(null)   // 'model' | 'monthly' | null
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { requested, unpaid, priceCents, pricePerModelCents, usage } = info
  const perQuery = euros(pricePerModelCents)
  const breakEven = Math.ceil(PRO_MONTHLY_CENTS / pricePerModelCents)

  const checkoutBaseUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL
  const subscribeUrl = `${checkoutBaseUrl}${checkoutBaseUrl?.includes('?') ? '&' : '?'}checkout[email]=${encodeURIComponent(user?.email ?? '')}&checkout[custom][user_id]=${user?.id ?? ''}`

  // Switching option clears the consent, so it always matches the choice
  const choose = c => {
    if (c === choice) return
    setChoice(c)
    setAgreed(false)
    setError('')
  }
  const optionProps = c => ({
    role: 'radio',
    'aria-checked': choice === c,
    tabIndex: 0,
    className: `pay-option ${choice === c ? 'pay-option-selected' : ''}`,
    onClick: () => choose(c),
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(c) } },
  })

  const proceed = () => {
    if (choice === 'model') return payPerQuery()
    setLoading(true)
    window.location.href = subscribeUrl
  }

  const payPerQuery = async () => {
    setLoading(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/tool5-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ models: info.models, brands: info.brands }),
    })
    const body = await res.json().catch(() => ({}))
    if (res.ok && body.url) {
      window.location.href = body.url
      return
    }
    setLoading(false)
    setError(body.error || 'Could not start checkout. Please try again.')
  }

  const n = unpaid
  const consentText = choice === 'model'
    ? 'I want my results immediately and understand that I lose my right of withdrawal once they are shown.'
    : `I agree to a monthly subscription of ${PRO_MONTHLY_PRICE} that renews until I cancel.`
  const buttonLabel = loading ? 'Opening checkout…'
    : choice === 'model' ? `Pay ${euros(priceCents)}`
    : choice === 'monthly' ? `Subscribe — ${PRO_MONTHLY_PRICE}/month`
    : 'Choose an option above'

  return (
    <div className="gate-overlay pay-overlay" onClick={onClose}>
      <div className="gate-modal pay-modal pay-modal-wide" onClick={e => e.stopPropagation()}>
        <h2 className="gate-title">Find Equivalents</h2>
        {usage.regular ? (
          <p className="gate-sub pay-usage">
            This month: <strong>{usage.models} comparison{usage.models === 1 ? '' : 's'}</strong> · <strong>{euros(usage.spentCents)} spent</strong>
          </p>
        ) : (
          <p className="gate-sub pay-usage">Choose how you'd like to pay.</p>
        )}
        <div className="pay-options" role="radiogroup" aria-label="Payment option">
          <div {...optionProps('model')}>
            <span className="pay-option-radio" aria-hidden="true" />
            <div className="pay-option-name">Per-Model Fee</div>
            <div className="pay-option-price">{perQuery} <span>/ model</span></div>
            <div className="pay-option-total">
              {n} model{n === 1 ? '' : 's'} × {perQuery} = <strong>{euros(priceCents)}</strong>
            </div>
            <ul className="pay-option-list">
              <li>Pay only for the models you selected</li>
            </ul>
            <div className="pay-rules">
              <div className="pay-rules-title">After paying, for 24 hours:</div>
              <ul>
                <li className="pay-rule-yes">Change the pressure as often as you like</li>
                <li className="pay-rule-no">Adding models or changing manufacturer preferences needs a new payment</li>
              </ul>
            </div>
            {unpaid < requested && (
              <p className="pay-note">{requested - unpaid} model{requested - unpaid === 1 ? '' : 's'} you paid for in the last 24 hours {requested - unpaid === 1 ? 'is' : 'are'} included free.</p>
            )}
          </div>
          <div {...optionProps('monthly')}>
            <span className="pay-option-radio" aria-hidden="true" />
            <div className="pay-option-name">Monthly Subscription</div>
            <div className="pay-option-price">{PRO_MONTHLY_PRICE} <span>/ month</span></div>
            <div className="pay-option-total">Unlimited models, every month</div>
            <ul className="pay-option-list">
              <li>Unlimited comparisons</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </div>
        {choice && (
          <label className="pay-consent">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>{consentText}</span>
          </label>
        )}
        <div className="gate-actions">
          <button className="gate-btn-primary" disabled={!choice || !agreed || loading} onClick={proceed}>{buttonLabel}</button>
        </div>
        <p className="pay-note">All prices include VAT. The subscription pays off from about {breakEven} models a month.</p>
        {error && <div className="auth-error pay-error">{error}</div>}
        <button className="gate-btn-home" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

// Shown after returning from checkout while the payment webhook catches up
function ConfirmPaymentModal({ timedOut }) {
  return (
    <div className="gate-overlay">
      <div className="gate-modal">
        <div className="gate-icon"><IconLock /></div>
        {timedOut ? (
          <>
            <h2 className="gate-title">Payment Still Processing</h2>
            <p className="gate-sub">Your payment is taking longer than usual to confirm. Please refresh this page in a minute. If Tool 5 is still locked, email us at sales@cx8motion.com.</p>
            <div className="gate-actions">
              <button className="gate-btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="gate-title">Confirming Your Payment…</h2>
            <p className="gate-sub">Thanks for your payment! This usually takes under a minute. Your results will appear automatically.</p>
          </>
        )}
      </div>
    </div>
  )
}

// Tool 5 is the only tool with a protected dataset
const DATA_TOOL_ID = 'actuator-cross-reference'

export default function ToolViewer() {
  const { toolId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const tool = allTools.find(t => t.id === toolId)
  const isDataTool = toolId === DATA_TOOL_ID

  const [user, setUser]             = useState(null)
  const [gateReason, setGateReason] = useState(null)   // 'pdf' | 'login' | null
  const [payInfo, setPayInfo]       = useState(null)   // 402 details from /api/tool5-compare
  const [confirming, setConfirming] = useState(null)   // 'waiting' | 'timeout' | null
  const iframeRef      = useRef(null)
  const iframeReadyRef = useRef(false)
  const indexCacheRef  = useRef(null)
  const pollRef        = useRef(null)
  const loginRetryRef  = useRef(null)   // Tool 5 request to re-run after login

  // LemonSqueezy sends buyers back to ?paid=1. The webhook that records the
  // payment can arrive after the user does, so results are polled for.
  const checkoutReturnRef = useRef(isDataTool && new URLSearchParams(location.search).has('paid'))

  const postToTool = msg => iframeRef.current?.contentWindow.postMessage(msg, window.location.origin)

  // ── Track auth state ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session && isDataTool) postToTool({ type: 'cx8-clear-data' })
    })
    return () => {
      subscription.unsubscribe()
      clearTimeout(pollRef.current)
    }
  }, [])

  // ── Tool 5: public model index (names only) for the pickers ──
  useEffect(() => {
    if (!isDataTool) return
    fetch('/api/tool5-data?index=1')
      .then(r => r.json())
      .then(({ data }) => {
        if (Array.isArray(data)) {
          indexCacheRef.current = data
          pushIndexToIframe()
        }
      })
  }, [isDataTool])

  function pushIndexToIframe() {
    if (!indexCacheRef.current || !iframeReadyRef.current) return
    postToTool({ type: 'cx8-index', db: indexCacheRef.current })
  }

  function endCheckoutReturn() {
    checkoutReturnRef.current = false
    navigate(location.pathname, { replace: true })
  }

  // Ask the server for equivalents. Returns 'done', 'login', 'error', or
  // the payment details when the models still need paying for.
  async function runCompare(request) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return 'login'
    const res = await fetch('/api/tool5-compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(request),
    })
    const body = await res.json().catch(() => ({}))
    if (res.ok) {
      postToTool({ type: 'cx8-results', pairs: body.pairs, pressure: request.pressure })
      return 'done'
    }
    if (res.status === 402) return { ...body, models: request.models, brands: request.brands }
    if (res.status === 401) return 'login'
    postToTool({ type: 'cx8-compare-error', message: body.error })
    return 'error'
  }

  // The login popup waits for a fresh login, so a session the server has
  // just rejected must not count as logged in
  function askToLogIn(request) {
    loginRetryRef.current = request
    setUser(null)
    setGateReason('login')
  }

  async function handleCompare(request) {
    const result = await runCompare(request)
    if (typeof result === 'object') {
      if (checkoutReturnRef.current) waitForPayment(request)
      else setPayInfo(result)
      return
    }
    if (checkoutReturnRef.current) endCheckoutReturn()
    if (result === 'login') askToLogIn(request)
  }

  // Retry every 3s for up to ~2 minutes until the payment is recorded
  function waitForPayment(request, tries = 0) {
    setConfirming('waiting')
    pollRef.current = setTimeout(async () => {
      const result = await runCompare(request)
      if (typeof result === 'object') {
        if (tries < 40) return waitForPayment(request, tries + 1)
        setConfirming('timeout')
        return
      }
      setConfirming(null)
      endCheckoutReturn()
      if (result === 'login') askToLogIn(request)
    }, 3000)
  }

  // ── Logged in while the popup is open: close it and finish what the user
  // was doing. The tool never reloads, so its entries stay as they were. ──
  useEffect(() => {
    if (!user || !gateReason) return
    setGateReason(null)
    if (gateReason === 'pdf') postToTool({ type: 'cx8-pdf-allowed' })
    else if (loginRetryRef.current) handleCompare(loginRetryRef.current)
  }, [user, gateReason])

  // ── Messages from the tool iframe ──
  useEffect(() => {
    const handler = async (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return

      // PDF downloads (Tools 3, 4, 6) require a logged-in user
      if (e.data?.type === 'cx8-pdf-request') {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session) e.source.postMessage({ type: 'cx8-pdf-allowed' }, window.location.origin)
        else setGateReason('pdf')
        return
      }

      // Tool 5 "Find Equivalents", re-runs after setting changes, and the
      // comparison restored after login/checkout
      if (e.data?.type === 'cx8-compare') handleCompare(e.data.request)
      if (e.data?.type === 'cx8-no-pending' && checkoutReturnRef.current) endCheckoutReturn()
      // The selection has been restored (or there was none): drop ?resume=1 so
      // a later refresh starts empty
      if ((e.data?.type === 'cx8-compare' || e.data?.type === 'cx8-no-pending') &&
          new URLSearchParams(window.location.search).has('resume')) {
        navigate(window.location.pathname, { replace: true })
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (!tool) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-badge">Not Found</div>
        <h2 className="coming-soon-title">Tool not found</h2>
        <p className="coming-soon-sub">The tool you're looking for doesn't exist.</p>
        <Link to="/tools" style={{ marginTop: 20, color: 'var(--teal2)', fontWeight: 600, fontSize: 14 }}>← Back to Tools</Link>
      </div>
    )
  }

  return (
    <div className="tool-viewer">
      {confirming && <ConfirmPaymentModal timedOut={confirming === 'timeout'} />}
      {gateReason && <GateModal onClose={() => setGateReason(null)} toolPath={location.pathname} reason={gateReason} />}
      {payInfo && <PayModal info={payInfo} user={user} onClose={() => setPayInfo(null)} />}
      <div className="tool-viewer-bar">
        <Link to="/tools" className="tool-back-btn">
          <IconBack /> Back to Tools
        </Link>
        <span className="tool-viewer-sep">/</span>
        <span className="tool-viewer-name">{tool.name}</span>
        {tool.badge === 'paid' && <span className="tool-pro-badge">PRO</span>}
      </div>
      <iframe
        ref={iframeRef}
        className="tool-viewer-iframe"
        src={tool.file}
        title={tool.name}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
        onLoad={() => {
          iframeReadyRef.current = true
          pushIndexToIframe()
        }}
      />
    </div>
  )
}
