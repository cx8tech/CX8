import { Link } from 'react-router-dom'
import { allTools } from '../data/tools'

const ToolIcons = {
  valve: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="6" rx="1"/>
      <line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  flow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20M16 6l6 6-6 6"/>
      <path d="M6 6C4 8 4 10 6 12s2 4 0 6"/>
    </svg>
  ),
  unit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <path d="M10 8l4 4M8 10l3-3M14 14l3-3"/>
    </svg>
  ),
  actuator: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  compressor: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="8" rx="2"/>
      <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
      <path d="M8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
}

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

const freeTools = allTools.filter(t => t.badge === 'free')
const paidTools = allTools.filter(t => t.badge === 'paid')

export default function Tools() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      <div className="tools-page">
        <h1 className="tools-page-title">Engineering Tools</h1>
        <p className="tools-page-sub">Vendor-neutral tools for sizing, selection, and specification. Free tools available instantly — no signup required.</p>

        <div className="tools-category">
          <div className="tools-category-label">Free Tools — {freeTools.length} available</div>
          <div className="tools-grid-page">
            {freeTools.map(tool => {
              const ToolIcon = ToolIcons[tool.icon]
              return (
                <div key={tool.id} className="tool-card-page">
                  <div className="tool-icon"><ToolIcon /></div>
                  <div className="tool-name" style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 600 }}>{tool.name}</div>
                  <div className="tool-desc" style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.55, flex: 1 }}>{tool.desc}</div>
                  <span className="tool-badge free">FREE</span>
                  <Link to={`/tools/${tool.id}`} className="open-tool-btn">Open Tool <IconArrow /></Link>
                </div>
              )
            })}
          </div>
        </div>

        <div className="tools-category">
          <div className="tools-category-label">Pro Tools — requires account</div>
          <div className="tools-grid-page">
            {paidTools.map(tool => {
              const ToolIcon = ToolIcons[tool.icon]
              return (
                <div key={tool.id} className="tool-card-page">
                  <div className="tool-icon" style={{ background: 'var(--amber-bg)' }}>
                    <ToolIcon />
                  </div>
                  <div className="tool-name" style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 600 }}>{tool.name}</div>
                  <div className="tool-desc" style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.55, flex: 1 }}>{tool.desc}</div>
                  <span className="tool-badge paid">PRO</span>
                  <Link to={`/tools/${tool.id}`} className="open-tool-btn" style={{ background: 'var(--amber)', gap: 6 }}>
                    <IconLock /> Unlock Access
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
