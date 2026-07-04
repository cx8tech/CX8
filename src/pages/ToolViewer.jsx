import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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

export default function ToolViewer() {
  const { toolId } = useParams()
  const tool = allTools.find(t => t.id === toolId)
  const [access, setAccess] = useState('checking') // 'checking' | 'allowed' | 'upgrade' | 'login'

  useEffect(() => {
    if (!tool) return
    if (tool.badge !== 'paid') { setAccess('allowed'); return }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setAccess('login'); return }
      const { data } = await supabase
        .from('profiles')
        .select('is_paid')
        .eq('id', session.user.id)
        .single()
      setAccess(data?.is_paid ? 'allowed' : 'upgrade')
    })
  }, [tool])

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

  if (access === 'checking') {
    return (
      <div className="tool-viewer">
        <div className="tool-viewer-bar">
          <Link to="/tools" className="tool-back-btn"><IconBack /> Back to Tools</Link>
          <span className="tool-viewer-sep">/</span>
          <span className="tool-viewer-name">{tool.name}</span>
        </div>
        <div className="tool-access-gate">
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Checking access…</p>
        </div>
      </div>
    )
  }

  if (access === 'login') {
    return (
      <div className="tool-viewer">
        <div className="tool-viewer-bar">
          <Link to="/tools" className="tool-back-btn"><IconBack /> Back to Tools</Link>
          <span className="tool-viewer-sep">/</span>
          <span className="tool-viewer-name">{tool.name}</span>
          <span className="tool-pro-badge">PRO</span>
        </div>
        <div className="tool-access-gate">
          <div className="tag-icon"><IconLock /></div>
          <h2 className="tag-title">Login required</h2>
          <p className="tag-sub">You need an account with an active Pro subscription to access this tool.</p>
          <div className="tag-actions">
            <Link to="/login" className="tag-btn-primary">Log In</Link>
            <Link to="/register" className="tag-btn-secondary">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  if (access === 'upgrade') {
    return (
      <div className="tool-viewer">
        <div className="tool-viewer-bar">
          <Link to="/tools" className="tool-back-btn"><IconBack /> Back to Tools</Link>
          <span className="tool-viewer-sep">/</span>
          <span className="tool-viewer-name">{tool.name}</span>
          <span className="tool-pro-badge">PRO</span>
        </div>
        <div className="tool-access-gate">
          <div className="tag-icon"><IconLock /></div>
          <h2 className="tag-title">Pro access required</h2>
          <p className="tag-sub">This tool is part of the CX8 Pro plan. Upgrade to unlock the Actuator Cross Reference and all future Pro tools.</p>
          <div className="tag-actions">
            <a href="#" className="tag-btn-primary">Upgrade to Pro</a>
          </div>
          <Link to="/tools" className="tag-back">← Browse free tools</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="tool-viewer">
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
