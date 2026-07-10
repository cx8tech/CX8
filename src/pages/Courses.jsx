import { useState } from 'react'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconCap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
  </svg>
)

const courses = [
  {
    id: 1,
    title: 'Process Equipment Essentials for a Successful Career Start',
    platform: 'Udemy',
    category: 'General',
    level: 'Beginner',
    color: '#1a3060',
    url: 'https://www.udemy.com/course/process-equipment-essentials-for-a-successful-career-start/',
  },
  {
    id: 2,
    title: 'Flow of Fluids Through Pipe Fittings, Valves and Pumps',
    platform: 'Udemy',
    category: 'General',
    level: 'Intermediate',
    color: '#0a4a3a',
    url: 'https://www.udemy.com/course/flow-of-fluids-through-pipe-fittings-valves-and-pumps/',
  },
  {
    id: 3,
    title: 'Valves: Principles, Operation & Designs',
    platform: 'Udemy',
    category: 'Valves',
    level: 'Intermediate',
    color: '#1a2d4a',
    url: 'https://www.udemy.com/course/valves-principles-operation-designs/',
  },
  {
    id: 4,
    title: 'Valve & Control Valve Masterclass: Design, Selection & Sizing',
    platform: 'Udemy',
    category: 'Valves',
    level: 'Advanced',
    color: '#2d1a5e',
    url: 'https://www.udemy.com/course/valve-control-valve-masterclass-design-selection-sizing/',
  },
  {
    id: 5,
    title: 'Reciprocating Compressors: Principles, Operation & Design',
    platform: 'Udemy',
    category: 'Compressors',
    level: 'Intermediate',
    color: '#3d1a1a',
    url: 'https://www.udemy.com/course/reciprocating-compressors-principles-operation-design/',
  },
]

const ALL = 'All'
const categories = [ALL, 'Valves', 'Compressors', 'General']

const levelColors = {
  Beginner:     { bg: '#e8f5e9', text: '#2e7d32' },
  Intermediate: { bg: '#fff3e0', text: '#e65100' },
  Advanced:     { bg: '#fce4ec', text: '#c62828' },
}

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [query, setQuery] = useState('')

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === ALL || c.category === activeCategory
    const q = query.toLowerCase()
    const matchQuery = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  return (
    <div className="crs-page">
      <div className="crs-header">
        <div className="crs-header-inner">
          <div className="crs-eyebrow">Courses</div>
          <h1 className="crs-title">Engineering Courses</h1>
          <p className="crs-sub">Curated courses from top Udemy instructors to help you advance in process, mechanical, and instrumentation engineering.</p>
        </div>
        <div className="crs-stats-row">
          <div className="crs-stat"><span className="crs-stat-num">{courses.length}</span><span className="crs-stat-label">Courses</span></div>
          <div className="crs-stat-div" />
          <div className="crs-stat"><span className="crs-stat-num">1</span><span className="crs-stat-label">Platform</span></div>
          <div className="crs-stat-div" />
          <div className="crs-stat"><span className="crs-stat-num">On-demand</span><span className="crs-stat-label">Format</span></div>
        </div>
      </div>

      <div className="crs-body">
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search courses by title or topic..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="crs-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`crs-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        <div className="crs-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</div>

        <div className="crs-grid">
          {filtered.map(c => {
            const lvl = levelColors[c.level] || levelColors.Beginner
            return (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="crs-card crs-card-link">
                <div className="crs-thumb" style={{ background: c.color }}>
                  <IconCap />
                </div>
                <div className="crs-card-body">
                  <div className="crs-platform">{c.platform}</div>
                  <div className="crs-card-title">{c.title}</div>
                  <div className="crs-meta-row">
                    <span className="crs-level" style={{ background: lvl.bg, color: lvl.text }}>{c.level}</span>
                    <span className="crs-cat-chip-sm">{c.category}</span>
                  </div>
                  <div className="crs-footer">
                    <span className="crs-cta">View on Udemy <IconArrow /></span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="crs-empty">No courses match your search.</div>
        )}

        <div className="crs-disclaimer">
          * CX8 Technologies may earn a commission when you purchase through affiliate links. This does not affect our course recommendations.
        </div>
      </div>
    </div>
  )
}
