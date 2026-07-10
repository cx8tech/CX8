import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allTools } from '../data/tools'
import { threads as communityThreads } from '../data/communityThreads'
import { suppliers as allSuppliers, regionColors, getInitials, ALL, REGIONS, CATEGORIES } from '../data/suppliers'

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
const homeToolIds = ['valve-torque', 'flow-rate', 'unit-conversion', 'actuator-sizing', 'compressor-sizing']
const homeTools = allTools.filter(t => homeToolIds.includes(t.id))

const threads = communityThreads.slice(0, 4)

const courses = [
  { title: 'Process Equipment Essentials for a Successful Career Start', platform: 'Udemy', color: '#1a3060', url: 'https://www.udemy.com/course/process-equipment-essentials-for-a-successful-career-start/' },
  { title: 'Flow of Fluids Through Pipe Fittings, Valves and Pumps',     platform: 'Udemy', color: '#0a4a3a', url: 'https://www.udemy.com/course/flow-of-fluids-through-pipe-fittings-valves-and-pumps/' },
  { title: 'Valves: Principles, Operation & Designs',                     platform: 'Udemy', color: '#1a2d4a', url: 'https://www.udemy.com/course/valves-principles-operation-designs/' },
  { title: 'Valve & Control Valve Masterclass: Design, Selection & Sizing', platform: 'Udemy', color: '#2d1a5e', url: 'https://www.udemy.com/course/valve-control-valve-masterclass-design-selection-sizing/' },
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
          <div className="tools-left">
            <div className="tools-grid">
              {homeTools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => navigate(`/tools/${tool.id}`)}>
                  {tool.logo && <img src={tool.logo} alt={tool.name} className="tool-card-logo" />}
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-desc">{tool.desc}</div>
                  <div className="tool-link">Open Tool <IconArrow /></div>
                </div>
              ))}
            </div>
            <div className="tools-view-all">
              <Link to="/tools">View All Tools <IconArrow /></Link>
            </div>
          </div>

          {/* Quotation callout */}
          <div className="quotation-card">
            <div className="quot-visual">
              <img src="/how-it-works.jpeg" alt="How it works" className="quot-img" />
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

const HM_PREVIEW = 6

function SupplierPreview() {
  const [catFilter, setCatFilter] = useState(ALL)
  const [regionFilter, setRegionFilter] = useState(ALL)
  const [query, setQuery] = useState('')

  const filtered = allSuppliers.filter(s => {
    const matchCat = catFilter === ALL || s.category === catFilter
    const matchRegion = regionFilter === ALL || s.region === regionFilter
    const q = query.toLowerCase()
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
    return matchCat && matchRegion && matchQ
  })

  const visible = filtered.slice(0, HM_PREVIEW)

  const viewAllUrl = (() => {
    const p = new URLSearchParams()
    if (catFilter !== ALL) p.set('category', catFilter)
    if (regionFilter !== ALL) p.set('region', regionFilter)
    if (query) p.set('q', query)
    const qs = p.toString()
    return qs ? `/suppliers?${qs}` : '/suppliers'
  })()

  return (
    <div className="supplier-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="section-eyebrow" style={{ margin: 0 }}>
          <span className="section-eyebrow-text">Supplier Directory</span>
        </div>
        <Link to={viewAllUrl} className="view-all-link" style={{ fontSize: 12 }}>View All <IconArrow /></Link>
      </div>

      <div className="supplier-filters">
        <select
          className="sup-select"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c === ALL ? 'All Categories' : c}</option>)}
        </select>
        <select
          className="sup-select"
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
        >
          {REGIONS.map(r => <option key={r} value={r}>{r === ALL ? 'All Regions' : r}</option>)}
        </select>
        <input
          className="sup-search"
          placeholder="Search supplier…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="supplier-grid">
        {visible.length > 0 ? visible.map(s => (
          <a key={s.name} href={s.website} target="_blank" rel="noopener noreferrer" className="supplier-item supplier-item-link">
            <div className="hm-sup-logo" style={{ background: regionColors[s.region] + '22' }}>
              <span style={{ color: regionColors[s.region], fontSize: 13, fontWeight: 800, letterSpacing: -.3 }}>{getInitials(s.name)}</span>
            </div>
            <div className="hm-sup-name">{s.name}</div>
            <div className="hm-sup-country">{s.country}</div>
            <span className="hm-sup-badge hm-sup-cat">{s.category}</span>
          </a>
        )) : (
          <div className="hm-sup-empty">No suppliers match your filters.</div>
        )}
      </div>

      {filtered.length > HM_PREVIEW && (
        <div className="supplier-note">
          Showing {HM_PREVIEW} of {filtered.length} — <Link to={viewAllUrl} className="view-all-link">view all</Link>
        </div>
      )}
      {filtered.length <= HM_PREVIEW && filtered.length > 0 && (
        <div className="supplier-note">Connect directly with verified suppliers worldwide.</div>
      )}
    </div>
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
                <Link key={t.id} to={`/community/${t.id}`} className="thread-item thread-item-link">
                  <div className="thread-avatar" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div className="thread-body">
                    <div className="thread-title">{t.title}</div>
                    <div className="thread-meta">{t.user} · {t.time}</div>
                  </div>
                  <div className="thread-replies">{t.replies.length}</div>
                </Link>
              ))}
            </div>
            <Link to="/community" className="view-all-link">View All Discussions <IconArrow /></Link>
          </div>

          {/* Supplier Directory */}
          <SupplierPreview />

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
                <a key={c.title} href={c.url} target="_blank" rel="noopener noreferrer" className="course-item course-item-link">
                  <div className="course-thumb" style={{ background: c.color }}>
                    <IconCap style={{ width: 18, height: 18, color: 'rgba(255,255,255,.7)' }} />
                  </div>
                  <div className="course-body">
                    <div className="course-title">{c.title}</div>
                    <div className="course-platform">{c.platform}</div>
                  </div>
                </a>
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
