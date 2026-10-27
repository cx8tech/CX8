import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { allTools } from '../data/tools'
import { supabase } from '../lib/supabase'

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

// Login prompts: for PDF downloads (Tools 3, 4, 6) and Tool 5 results
function GateModal({ onClose, toolPath, reason }) {
  const navigate = useNavigate()
  // ?resume=1 lets Tool 5 restore the selection after login (only then)
  const redirect = encodeURIComponent(reason === 'pdf' ? toolPath : `${toolPath}?resume=1`)

  return (
    <div className="gate-overlay" onClick={onClose}>
      <div className="gate-modal" onClick={e => e.stopPropagation()}>
        <div className="gate-icon"><IconLock /></div>
        {reason === 'pdf' ? (
          <>
            <h2 className="gate-title">Log In to Download</h2>
            <p className="gate-sub">Log in or create a free CX8 account to download your results as a PDF.</p>
          </>
        ) : (
          <>
            <h2 className="gate-title">Log In to See Results</h2>
            <p className="gate-sub">Log in or create a free CX8 account to find equivalents. Then pay per model, or subscribe for unlimited comparisons.</p>
          </>
        )}
        <div className="gate-actions">
          <Link to={`/login?redirect=${redirect}`} className="gate-btn-primary">Log In</Link>
          <Link to={`/register?redirect=${redirect}`} className="gate-btn-secondary">Register for Free</Link>
        </div>
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

  async function handleCompare(request) {
    const result = await runCompare(request)
    if (typeof result === 'object') {
      if (checkoutReturnRef.current) waitForPayment(request)
      else setPayInfo(result)
      return
    }
    if (checkoutReturnRef.current) endCheckoutReturn()
    if (result === 'login') setGateReason('login')
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
      if (result === 'login') setGateReason('login')
    }, 3000)
  }

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
