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
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
  </svg>
)

const HOW_IT_WORKS_URL = 'https://www.youtube.com/channel/UCPbeLgu2-X9W_dtl0fysBkg'

// Pro Monthly price shown in the UI; the charged amount is set on the
// LemonSqueezy subscription product.
const PRO_MONTHLY_PRICE = '€99'

const euros = cents => `€${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`

// Login prompts: for PDF downloads (Tools 3, 4, 6) and Tool 5 results
function GateModal({ onClose, toolPath, reason }) {
  const navigate = useNavigate()
  const redirect = encodeURIComponent(toolPath)

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
            <p className="gate-sub">Log in or create a free CX8 account to find equivalents. You only pay for the models you compare.</p>
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

// Pay-per-query prompt. Regular users (3+ paid jobs this month) see their
// usage and the choice between pay-per-query and Pro Monthly instead.
function PayModal({ info, user, onClose }) {
  const [agreeQuery, setAgreeQuery] = useState(false)
  const [agreeSub, setAgreeSub] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { requested, unpaid, priceCents, usage } = info

  const checkoutBaseUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL
  const subscribeUrl = `${checkoutBaseUrl}${checkoutBaseUrl?.includes('?') ? '&' : '?'}checkout[email]=${encodeURIComponent(user?.email ?? '')}&checkout[custom][user_id]=${user?.id ?? ''}`

  const payPerQuery = async () => {
    setLoading(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/tool5-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ models: info.models }),
    })
    const body = await res.json().catch(() => ({}))
    if (res.ok && body.url) {
      window.location.href = body.url
      return
    }
    setLoading(false)
    setError(body.error || 'Could not start checkout. Please try again.')
  }

  const queryConsent = (
    <label className="pay-consent">
      <input type="checkbox" checked={agreeQuery} onChange={e => setAgreeQuery(e.target.checked)} />
      <span>I want my results immediately and understand that I lose my right of withdrawal once they are shown.</span>
    </label>
  )
  const n = unpaid
  const payLabel = loading ? 'Opening checkout…' : `Pay ${euros(priceCents)}`

  return (
    <div className="gate-overlay pay-overlay" onClick={onClose}>
      <div className={`gate-modal pay-modal ${usage.regular ? 'pay-modal-wide' : ''}`} onClick={e => e.stopPropagation()}>
        {usage.regular ? (
          <>
            <h2 className="gate-title">You're Using CX8 Regularly</h2>
            <p className="gate-sub pay-usage">
              This month: <strong>{usage.models} comparison{usage.models === 1 ? '' : 's'}</strong> · <strong>{euros(usage.spentCents)} spent</strong>
            </p>
            <div className="pay-options">
              <div className="pay-option">
                <div className="pay-option-name">Keep Pay-per-Query</div>
                <div className="pay-option-price">€2 <span>/ query</span></div>
                <ul className="pay-option-list">
                  <li>Pay only when you compare</li>
                  <li>No subscription, no commitment</li>
                </ul>
                {queryConsent}
                <button className="gate-btn-secondary" disabled={!agreeQuery || loading} onClick={payPerQuery}>
                  {loading ? payLabel : `Pay ${euros(priceCents)} for ${n} model${n === 1 ? '' : 's'}`}
                </button>
              </div>
              <div className="pay-option pay-option-featured">
                <div className="pay-option-name">CX8 Pro Monthly</div>
                <div className="pay-option-price">{PRO_MONTHLY_PRICE} <span>/ month</span></div>
                <ul className="pay-option-list">
                  <li>Unlimited queries</li>
                  <li>Cancel anytime</li>
                </ul>
                <label className="pay-consent">
                  <input type="checkbox" checked={agreeSub} onChange={e => setAgreeSub(e.target.checked)} />
                  <span>I agree to a monthly subscription of {PRO_MONTHLY_PRICE} that renews until I cancel.</span>
                </label>
                <button className="gate-btn-primary" disabled={!agreeSub} onClick={() => { window.location.href = subscribeUrl }}>
                  Subscribe — {PRO_MONTHLY_PRICE}/month
                </button>
              </div>
            </div>
            <p className="pay-note">At €2 per query, Pro pays off from about 50 queries a month.</p>
          </>
        ) : (
          <>
            <h2 className="gate-title">Find Equivalents</h2>
            <p className="gate-sub pay-price">
              {n} model{n === 1 ? '' : 's'} × €2 = <strong>{euros(priceCents)}</strong>
            </p>
            {unpaid < requested && (
              <p className="pay-note">{requested - unpaid} model{requested - unpaid === 1 ? '' : 's'} you paid for in the last 24 hours {requested - unpaid === 1 ? 'is' : 'are'} included free.</p>
            )}
            <p className="pay-note">After paying, change the pressure or brands as often as you like for 24 hours at no extra cost.</p>
            {queryConsent}
            <div className="gate-actions">
              <button className="gate-btn-primary" disabled={!agreeQuery || loading} onClick={payPerQuery}>{payLabel}</button>
              <a href={HOW_IT_WORKS_URL} target="_blank" rel="noopener noreferrer" className="gate-btn-secondary">
                <IconPlay /> See How It Works
              </a>
            </div>
          </>
        )}
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
    if (res.status === 402) return { ...body, models: request.models }
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
