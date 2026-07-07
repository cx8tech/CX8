import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)
const IconTable = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
)
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const IconArticle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v4H4zM4 12h10M4 16h7"/>
  </svg>
)
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

const IconMap = { file: IconFile, table: IconTable, book: IconBook, check: IconCheck, play: IconPlay, article: IconArticle }

const typeColors = {
  PDF:         { bg: '#fee2e2', text: '#b91c1c' },
  Excel:       { bg: '#dcfce7', text: '#15803d' },
  Video:       { bg: '#ede9fe', text: '#6d28d9' },
  Article:     { bg: '#e0f2fe', text: '#0369a1' },
}

const categoryMeta = {
  'All':              { desc: 'Browse all available engineering resources in one place.' },
  'Videos':           { desc: 'Video tutorials and walkthroughs for engineering tools and calculations.' },
  'Articles':         { desc: 'In-depth technical articles written by practising engineers.' },
  'Guides':           { desc: 'Step-by-step guides for engineering calculations and best practices.' },
  'Reference Tables': { desc: 'Quick-reference tables for unit conversions, ratings, and specifications.' },
  'Checklists':       { desc: 'Structured checklists to guide engineering design and specification work.' },
  'Standards':        { desc: 'Plain-language summaries of key industry standards (API, ASME, ISA).' },
}

const resources = [
  // Guides
  {
    id: 5,
    title: 'Compressor Selection Guide',
    description: "Practical guide to selecting between reciprocating, centrifugal, and screw compressors based on flow, pressure, and application.",
    category: 'Guides', type: 'PDF', size: '0.9 MB', icon: 'book', color: '#0a3d5e', comingSoon: false,
  },
  // Reference Tables
  {
    id: 2,
    title: 'Actuator Torque Reference Table',
    description: 'Quick-reference table of typical torque requirements for ball, butterfly, and gate valves across common size and pressure ratings.',
    category: 'Reference Tables', type: 'PDF', size: '0.5 MB', icon: 'table', color: '#1a3060', comingSoon: false,
  },
  {
    id: 4,
    title: 'Engineering Units Conversion Table',
    description: 'Comprehensive printable reference for pressure, flow, temperature, length, mass, and torque unit conversions. ISO and Imperial.',
    category: 'Reference Tables', type: 'PDF', size: '0.4 MB', icon: 'table', color: '#3d2a1a', comingSoon: false,
  },
  {
    id: 6,
    title: 'Valve Data Sheet Template',
    description: 'Standardised data sheet template for control and isolation valves. Compatible with most EPC contractor formats.',
    category: 'Reference Tables', type: 'Excel', size: '0.2 MB', icon: 'table', color: '#1a4a2a', comingSoon: false,
  },
  // Checklists
  {
    id: 1,
    title: 'Control Valve Sizing Checklist',
    description: 'Step-by-step checklist for sizing control valves. Covers data sheet completion, Cv calculation, cavitation check, and specification review.',
    category: 'Checklists', type: 'PDF', size: '0.3 MB', icon: 'check', color: '#0a4a3a', comingSoon: false,
  },
  {
    id: 9,
    title: 'Actuator Sizing Checklist',
    description: 'Structured checklist for pneumatic and electric actuator sizing. Covers torque margin, fail-safe requirements, and mounting compatibility.',
    category: 'Checklists', type: 'PDF', size: '0.3 MB', icon: 'check', color: '#2a3d1a', comingSoon: false,
  },
  // Standards
  {
    id: 3,
    title: 'API 6D Valve Standard — Summary Guide',
    description: 'Plain-language summary of API 6D requirements for pipeline valves. Includes key clauses, testing requirements, and design criteria.',
    category: 'Standards', type: 'PDF', size: '1.2 MB', icon: 'file', color: '#2d1a5e', comingSoon: false,
  },
  {
    id: 7,
    title: 'ASME B16.34 Pressure-Temperature Ratings',
    description: 'Reference tables for pressure-temperature ratings per ASME B16.34 for common valve materials. Class 150 through Class 4500.',
    category: 'Standards', type: 'PDF', size: '0.7 MB', icon: 'file', color: '#4a1a2a', comingSoon: false,
  },
  // Videos — coming soon
  {
    id: 10,
    title: 'Control Valve Sizing — Step by Step',
    description: 'A practical walkthrough of sizing a control valve from scratch using the CX8 Kv / Flow Rate Calculator.',
    category: 'Videos', type: 'Video', size: null, icon: 'play', color: '#3d1a5e', comingSoon: true,
  },
  {
    id: 11,
    title: 'Actuator Torque Calculation Explained',
    description: 'Video guide to understanding actuator torque requirements and how to use the CX8 Actuator / Valve Match tool.',
    category: 'Videos', type: 'Video', size: null, icon: 'play', color: '#1a2d5e', comingSoon: true,
  },
  {
    id: 12,
    title: 'How to Read a Valve Data Sheet',
    description: 'Covers every field on a typical valve data sheet — materials, ratings, end connections, and testing requirements.',
    category: 'Videos', type: 'Video', size: null, icon: 'play', color: '#0a3d2a', comingSoon: true,
  },
  // Articles — coming soon
  {
    id: 13,
    title: 'Cavitation in Control Valves: Causes and Prevention',
    description: 'An in-depth technical article on what causes cavitation, how to detect it, and how to specify valves that avoid it.',
    category: 'Articles', type: 'Article', size: null, icon: 'article', color: '#2a1a3d', comingSoon: true,
  },
  {
    id: 14,
    title: 'Pneumatic vs Electric Actuators: A Decision Framework',
    description: 'Compares the two most common actuator types across cost, reliability, response time, and suitability by application.',
    category: 'Articles', type: 'Article', size: null, icon: 'article', color: '#1a3d2a', comingSoon: true,
  },
  {
    id: 8,
    title: 'Instrumentation Hook-Up Diagram Guide',
    description: 'Guide to reading and creating instrument hook-up diagrams for pressure, temperature, flow, and level instruments.',
    category: 'Guides', type: 'PDF', size: '1.5 MB', icon: 'book', color: '#1a2d4a', comingSoon: false,
  },
]

const ALL = 'All'
const categories = [ALL, 'Videos', 'Articles', 'Guides', 'Reference Tables', 'Checklists', 'Standards']

export default function Resources() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && categories.includes(cat)) setActiveCategory(cat)
    else setActiveCategory(ALL)
  }, [searchParams])

  const filtered = resources.filter(r => {
    const matchCat = activeCategory === ALL || r.category === activeCategory
    const q = query.toLowerCase()
    const matchQuery = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  const meta = categoryMeta[activeCategory] || categoryMeta[ALL]

  return (
    <div className="res-page">
      {/* Header */}
      <div className="res-header">
        <div className="res-header-inner">
          <div className="res-eyebrow">Resources</div>
          <h1 className="res-title">Engineering Resources</h1>
          <p className="res-sub">Free checklists, reference tables, standards summaries, guides, articles, and videos for process and mechanical engineers.</p>
        </div>
        <div className="res-stats-row">
          <div className="res-stat"><span className="res-stat-num">{resources.length}</span><span className="res-stat-label">Resources</span></div>
          <div className="res-stat-div" />
          <div className="res-stat"><span className="res-stat-num">{resources.filter(r => !r.comingSoon).length}</span><span className="res-stat-label">Available Now</span></div>
          <div className="res-stat-div" />
          <div className="res-stat"><span className="res-stat-num">{categories.length - 1}</span><span className="res-stat-label">Categories</span></div>
        </div>
      </div>

      <div className="res-body">
        {/* Search */}
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search resources by title, type, or category..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="res-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`res-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Section heading */}
        <div className="res-section-head">
          <div>
            <div className="res-section-title">{activeCategory === ALL ? 'All Resources' : activeCategory}</div>
            <div className="res-section-desc">{meta.desc}</div>
          </div>
          <div className="res-section-count">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</div>
        </div>

        {/* Grid */}
        <div className="res-grid">
          {filtered.map(r => {
            const Icon = IconMap[r.icon] || IconFile
            const tc = typeColors[r.type] || typeColors.PDF
            return (
              <div key={r.id} className={`res-card ${r.comingSoon ? 'res-card-soon' : ''}`}>
                <div className="res-card-thumb" style={{ background: r.color }}>
                  <Icon />
                  {r.comingSoon && <span className="res-soon-badge">Coming Soon</span>}
                </div>
                <div className="res-card-body">
                  <div className="res-card-top">
                    <span className="res-cat-tag">{r.category}</span>
                    <span className="res-type-tag" style={{ background: tc.bg, color: tc.text }}>{r.type}</span>
                  </div>
                  <div className="res-card-title">{r.title}</div>
                  <p className="res-card-desc">{r.description}</p>
                  <div className="res-card-footer">
                    {r.comingSoon ? (
                      <>
                        <span className="res-size res-soon-text">Notify me when available</span>
                        <a href="mailto:contact@cx8technologies.com?subject=Notify me: resources" className="res-notify-btn">
                          <IconBell /> Notify Me
                        </a>
                      </>
                    ) : (
                      <>
                        <span className="res-size">{r.size}</span>
                        <button className="res-download-btn"><IconDownload /> Download</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="res-empty">No resources match your search.</div>
        )}

        <div className="res-coming-soon-note">
          More resources are added regularly. <a href="mailto:contact@cx8technologies.com">Suggest a resource →</a>
        </div>
      </div>
    </div>
  )
}
