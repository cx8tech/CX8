import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { allTools } from '../data/tools'

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

function GateModal({ onClose, toolPath }) {
  const navigate = useNavigate()
  return (
    <div className="gate-overlay" onClick={onClose}>
      <div className="gate-modal" onClick={e => e.stopPropagation()}>
        <div className="gate-icon"><IconLock /></div>
        <h2 className="gate-title">Subscription Required</h2>
        <p className="gate-sub">Login with an active CX8 Pro subscription to view cross-reference results.</p>
        <div className="gate-actions">
          <Link to={`/login?redirect=${encodeURIComponent(toolPath)}`} className="gate-btn-primary">Login to Get Results</Link>
          <a
            href="https://www.youtube.com/channel/UCPbeLgu2-X9W_dtl0fysBkg"
            target="_blank"
            rel="noopener noreferrer"
            className="gate-btn-secondary"
          >
            <IconPlay /> See How It Works
          </a>
        </div>
        <button className="gate-btn-home" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  )
}

export default function ToolViewer() {
  const { toolId } = useParams()
  const location = useLocation()
  const tool = allTools.find(t => t.id === toolId)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'cx8-gate') setShowGate(true)
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
      {showGate && <GateModal onClose={() => setShowGate(false)} toolPath={location.pathname} />}
      <div className="tool-viewer-bar">
        <Link to="/tools" className="tool-back-btn">
          <IconBack /> Back to Tools
        </Link>
        <span className="tool-viewer-sep">/</span>
        <span className="tool-viewer-name">{tool.name}</span>
        {tool.badge === 'paid' && <span className="tool-pro-badge">PRO</span>}
      </div>
      <iframe
        className="tool-viewer-iframe"
        src={tool.file}
        title={tool.name}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  )
}
