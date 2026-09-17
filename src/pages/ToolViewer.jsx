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

function GateModal({ onClose, toolPath, user, isPaid }) {
  const navigate = useNavigate()
  const variantId = import.meta.env.VITE_LEMONSQUEEZY_VARIANT_ID
  const checkoutBaseUrl = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL || `https://cx8technologies.lemonsqueezy.com/checkout/buy/${variantId}`
  const checkoutUrl = user
    ? `${checkoutBaseUrl}${checkoutBaseUrl.includes('?') ? '&' : '?'}checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${user.id}`
    : null

  return (
    <div className="gate-overlay" onClick={onClose}>
      <div className="gate-modal" onClick={e => e.stopPropagation()}>
        <div className="gate-icon"><IconLock /></div>
        {!user ? (
          <>
            <h2 className="gate-title">Login Required</h2>
            <p className="gate-sub">Log in to access cross-reference results.</p>
            <div className="gate-actions">
              <Link to={`/login?redirect=${encodeURIComponent(toolPath)}`} className="gate-btn-primary">Log In</Link>
              <a href="https://www.youtube.com/channel/UCPbeLgu2-X9W_dtl0fysBkg" target="_blank" rel="noopener noreferrer" className="gate-btn-secondary">
                <IconPlay /> See How It Works
              </a>
            </div>
          </>
        ) : (
          <>
            <h2 className="gate-title">CX8 Pro Required</h2>
            <p className="gate-sub">Upgrade to CX8 Pro to unlock the full cross-reference database.</p>
            <div className="gate-actions">
              <a href={checkoutUrl} className="gate-btn-primary">Upgrade to Pro — €9.99/mo</a>
              <a href="https://www.youtube.com/channel/UCPbeLgu2-X9W_dtl0fysBkg" target="_blank" rel="noopener noreferrer" className="gate-btn-secondary">
                <IconPlay /> See How It Works
              </a>
            </div>
          </>
        )}
        <button className="gate-btn-home" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  )
}

// Tool 5 is the only tool with a protected dataset
const DATA_TOOL_ID = 'actuator-cross-reference'

export default function ToolViewer() {
  const { toolId } = useParams()
  const location = useLocation()
  const tool = allTools.find(t => t.id === toolId)
  const [showGate, setShowGate] = useState(false)
  const [user, setUser]         = useState(null)
  const iframeRef               = useRef(null)
  const indexCacheRef           = useRef(null)
  const dbCacheRef              = useRef(null)   // holds fetched actuator data
  const iframeReadyRef          = useRef(false)  // true once iframe fires onLoad
  const pendingResultsRef        = useRef(false)

  const isDataTool = toolId === DATA_TOOL_ID
  const [isPaid, setIsPaid] = useState(false)

  // ── Track auth state ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session && isDataTool) {
        dbCacheRef.current = null
        iframeRef.current?.contentWindow.postMessage({ type: 'cx8-clear-data' }, '*')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Check paid status ──
  useEffect(() => {
    if (!isDataTool) return
    if (!user) {
      setIsPaid(false)
      return
    }
    supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const paid = data?.plan === 'pro'
        setIsPaid(paid)
        if (paid) setShowGate(false)
      })
  }, [user, isDataTool])

  // ── Fetch dataset when user is authenticated and paid ──
  useEffect(() => {
    if (!isDataTool) return

    if (!user || !isPaid) {
      fetch('/api/tool5-data?index=1')
        .then(r => r.json())
        .then(({ data }) => {
          if (Array.isArray(data)) {
            indexCacheRef.current = data
            pushIndexToIframe()
          }
        })
      return
    }

    if (dbCacheRef.current) {
      pushDataToIframe()
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      fetch('/api/tool5-data', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then(r => r.json())
        .then(({ data }) => {
          if (!data?.length) return
          dbCacheRef.current = data
          pushDataToIframe()
        })
    })
  }, [user, isDataTool, isPaid])

  // Send cached data into the iframe (no-op if either isn't ready)
  function pushDataToIframe() {
    if (!dbCacheRef.current || !iframeReadyRef.current || !iframeRef.current) return
    iframeRef.current.contentWindow.postMessage(
      { type: 'cx8-data', db: dbCacheRef.current },
      '*'
    )
    if (pendingResultsRef.current) {
      pendingResultsRef.current = false
      iframeRef.current.contentWindow.postMessage({ type: 'cx8-run-results' }, '*')
    }
  }

  function pushIndexToIframe() {
    if (!indexCacheRef.current || !iframeReadyRef.current || !iframeRef.current) return
    iframeRef.current.contentWindow.postMessage(
      { type: 'cx8-index', db: indexCacheRef.current },
      '*'
    )
  }

  // ── Listen for messages from the tool iframe ──
  useEffect(() => {
    const handler = async (e) => {
      if (e.data?.type !== 'cx8-gate') return
      // Re-fetch session so user is always fresh when the gate opens
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const { data } = await supabase.from('profiles').select('plan').eq('id', currentUser.id).single()
        const paid = data?.plan === 'pro'
        setIsPaid(paid)
        if (paid) {
          setShowGate(false)
          pendingResultsRef.current = true
          if (dbCacheRef.current) pushDataToIframe()
          return
        }
      }
      setShowGate(true)
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
      {showGate && <GateModal onClose={() => setShowGate(false)} toolPath={location.pathname} user={user} isPaid={isPaid} />}
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
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => {
          iframeReadyRef.current = true
          pushIndexToIframe()
          pushDataToIframe()
        }}
      />
    </div>
  )
}
