import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ── SVG Icons ────────────────────────────────────────────
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)
const IconConnect = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)
const IconDiscussion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const IconCap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)

// Tool icon placeholders
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

// ── Data ─────────────────────────────────────────────────
const homeTools = [
  { id: 'valve-torque',             name: 'Valves',            desc: 'Size control, safety, check, ball and butterfly valves.',        icon: 'valve'      },
  { id: 'flow-rate',                name: 'Flow Rate',         desc: 'Calculate liquid, gas and steam flow rates with accuracy.',      icon: 'flow'       },
  { id: 'unit-conversion',          name: 'Unit Conversion',   desc: 'Convert between 150+ engineering units instantly.',              icon: 'unit'       },
  { id: 'actuator-sizing',          name: 'Actuator Sizing',   desc: 'Select and size the right actuator for your valve.',             icon: 'actuator'   },
  { id: 'compressor-sizing',        name: 'Compressor Sizing', desc: 'Size reciprocating and centrifugal compressors.',                icon: 'compressor' },
]

const threads = [
  { user: 'Ahmed K.',  title: 'How to select control valve for cavitation service?', time: '2h ago',  replies: 12, color: '#1a6b5f' },
  { user: 'Priya S.',  title: 'Actuator sizing for high differential pressure',       time: '5h ago',  replies: 8,  color: '#3d1a60' },
  { user: 'Mark D.',   title: 'Recommended materials for sour gas application',       time: '1d ago',  replies: 15, color: '#9e4e00' },
  { user: 'John L.',   title: 'Flow measurement: DP vs Vortex – when to use?',        time: '1d ago',  replies: 9,  color: '#0a3d5e' },
]

const suppliers = [
  { name: 'Flowserve Corporation', country: 'USA',    badge: 'featured', logoColor: '#e74c3c', logoText: 'FLOWSERVE' },
  { name: 'Emerson',               country: 'USA',    badge: 'featured', logoColor: '#1a5276', logoText: 'EMERSON'   },
  { name: 'Velan Inc.',            country: 'Canada', badge: 'premium',  logoColor: '#117a65', logoText: 'VELAN'     },
  { name: 'KITZ Corporation',      country: 'Japan',  badge: 'premium',  logoColor: '#922b21', logoText: 'KITZ'      },
]

const courses = [
  { title: 'Control Valve Engineering & Sizing', platform: 'Udemy', price: '€94.99', bestseller: true,  color: '#1a3060' },
  { title: 'Process Engineering Fundamentals',   platform: 'Udemy', price: '€84.99', bestseller: false, color: '#0a4a3a' },
  { title: 'Rotating Equipment: Pumps & Compressors', platform: 'Udemy', price: '€94.99', bestseller: false, color: '#2d1a5e' },
  { title: 'Fluid Mechanics for Engineers',      platform: 'Udemy', price: '€79.99', bestseller: false, color: '#3d2a1a' },
]

// ── Sub-components ────────────────────────────────────────

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-eyebrow">Engineering Intelligence Platform</div>
        <h1 className="hero-title">
          Vendor-Neutral Engineering Tools<br/>
          <em>Size Right</em>, <span className="em-amber">Specify Smart</span>, <em>Source Better</em>.
        </h1>
        <p className="hero-sub">
          CX8 Technologies provides free, vendor-neutral engineering tools that help you size the right specifications and connect with trusted suppliers worldwide.
        </p>
        <div className="hero-cta-row">
          <Link to="/tools" className="cta-primary">Start Sizing Now <IconArrow /></Link>
          <Link to="/tools" className="cta-secondary">Explore All Tools</Link>
        </div>
        <div className="hero-stats">
          {[
            { icon: <IconShield />, label: '100% Vendor Neutral' },
            { icon: <IconClock />,  label: 'Save Engineering Time' },
            { icon: <IconDoc />,    label: 'Quotation Ready Outputs' },
            { icon: <IconConnect />,label: 'Connect with Verified Suppliers' },
          ].map(({ icon, label }) => (
            <div key={label} className="hstat">
              <div className="hstat-ic">{icon}</div>
              <div className="hstat-text"><span className="hstat-label">{label}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolsSection() {
  const navigate = useNavigate()
  return (
    <section className="section tools-section">
      <div className="section-inner">
        <div className="section-eyebrow">
          <div className="section-eyebrow-bar" />
          <span className="section-eyebrow-text">Engineering Tools</span>
        </div>
        <div className="tools-layout">
          <div>
            <div className="tools-grid">
              {homeTools.map(tool => {
                const ToolIcon = ToolIcons[tool.icon]
                return (
                  <div key={tool.id} className="tool-card" onClick={() => navigate(`/tools/${tool.id}`)}>
                    <div className="tool-icon"><ToolIcon /></div>
                    <div className="tool-name">{tool.name}</div>
                    <div className="tool-desc">{tool.desc}</div>
                    <div className="tool-link">Open Tool <IconArrow /></div>
                  </div>
                )
              })}
            </div>
            <div className="tools-view-all">
              <Link to="/tools">View All Tools <IconArrow /></Link>
            </div>
          </div>

          {/* Quotation callout */}
          <div className="quotation-card">
            <div className="quot-visual">
              <div className="quot-icons">
                <div className="quot-doc pdf">PDF</div>
                <div className="quot-doc xls">XLS</div>
              </div>
            </div>
            <div className="quot-title">Generate Quotation-Ready Specifications</div>
            <ul className="quot-list">
              {['PDF / Excel Export', 'Technical Data Sheets', 'Compare Options', 'Share with Suppliers'].map(f => (
                <li key={f} className="quot-item">
                  <div className="quot-check"><IconCheck /></div>
                  {f}
                </li>
              ))}
            </ul>
            <button className="quot-cta">See How It Works <IconArrow /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

function BottomSection() {
  return (
    <section className="section bottom-section">
      <div className="section-inner">
        <div className="bottom-grid">
          {/* Community */}
          <div className="community-card">
            <div className="section-eyebrow" style={{ marginBottom: 14 }}>
              <IconDiscussion style={{ width: 14, height: 14, color: 'var(--text2)' }} />
              <span className="section-eyebrow-text">Community Discussions</span>
            </div>
            <div className="thread-list">
              {threads.map(t => (
                <div key={t.title} className="thread-item">
                  <div className="thread-avatar" style={{ background: t.color }}>
                    {t.user.split(' ')[0][0]}{t.user.split(' ')[1]?.[0] ?? ''}
                  </div>
                  <div className="thread-body">
                    <div className="thread-title">{t.title}</div>
                    <div className="thread-meta">{t.user} · {t.time}</div>
                  </div>
                  <div className="thread-replies">{t.replies}</div>
                </div>
              ))}
            </div>
            <Link to="/community" className="view-all-link">View All Discussions <IconArrow /></Link>
          </div>

          {/* Supplier Directory */}
          <div className="supplier-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-eyebrow" style={{ margin: 0 }}>
                <span className="section-eyebrow-text">Supplier Directory</span>
              </div>
              <Link to="/suppliers" className="view-all-link" style={{ fontSize: 12 }}>View All Suppliers <IconArrow /></Link>
            </div>
            <div className="supplier-filters">
              <select className="sup-select"><option>Valves</option><option>Actuators</option><option>Compressors</option></select>
              <select className="sup-select"><option>All Countries</option><option>USA</option><option>Germany</option><option>Japan</option></select>
              <input className="sup-search" placeholder="Search Supplier" />
            </div>
            <div className="supplier-grid">
              {suppliers.map(s => (
                <div key={s.name} className="supplier-item">
                  <div className="sup-logo">
                    <span className="sup-logo-text" style={{ color: s.logoColor, fontSize: 13, fontWeight: 800, letterSpacing: -.3 }}>{s.logoText}</span>
                  </div>
                  <div className="sup-name">{s.name}</div>
                  <div className="sup-country">{s.country}</div>
                  <span className={`sup-badge ${s.badge}`}>{s.badge === 'featured' ? 'Featured Supplier' : 'Premium Supplier'}</span>
                </div>
              ))}
            </div>
            <div className="supplier-note">Connect directly with verified suppliers worldwide.</div>
          </div>

          {/* Courses */}
          <div className="courses-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-eyebrow" style={{ margin: 0 }}>
                <IconCap style={{ width: 14, height: 14, color: 'var(--text2)' }} />
                <span className="section-eyebrow-text">Recommended Courses</span>
              </div>
              <Link to="/courses" className="view-all-link" style={{ fontSize: 12 }}>View All Courses <IconArrow /></Link>
            </div>
            <div className="course-list">
              {courses.map(c => (
                <div key={c.title} className="course-item">
                  <div className="course-thumb" style={{ background: c.color }}>
                    <IconCap style={{ width: 18, height: 18, color: 'rgba(255,255,255,.7)' }} />
                  </div>
                  <div className="course-body">
                    <div className="course-title">{c.title}</div>
                    <div className="course-platform">{c.platform}</div>
                  </div>
                  <div className="course-right">
                    <span className="course-price">{c.price}</span>
                    {c.bestseller && <span className="course-badge">BESTSELLER</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="courses-note">We may earn a commission from Udemy (affiliate).</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Main export ───────────────────────────────────────────
export default function Home() {
  return (
    <>
      <HeroSection />
      <ToolsSection />
      <BottomSection />
    </>
  )
}
