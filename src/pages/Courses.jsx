import { useState } from 'react'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
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
    title: 'Control Valve Engineering & Sizing',
    platform: 'Udemy',
    instructor: 'James R. Morrison, P.Eng',
    price: '€94.99',
    rating: 4.7,
    reviews: 1840,
    duration: '12.5 hrs',
    level: 'Intermediate',
    category: 'Valves',
    badge: 'bestseller',
    color: '#1a3060',
    url: 'https://www.udemy.com',
  },
  {
    id: 2,
    title: 'Process Engineering Fundamentals',
    platform: 'Udemy',
    instructor: 'Dr. Sarah Chen',
    price: '€84.99',
    rating: 4.5,
    reviews: 1230,
    duration: '10.0 hrs',
    level: 'Beginner',
    category: 'General',
    badge: null,
    color: '#0a4a3a',
    url: 'https://www.udemy.com',
  },
  {
    id: 3,
    title: 'Rotating Equipment: Pumps & Compressors',
    platform: 'Udemy',
    instructor: 'Carlos M. Reyes, P.Eng',
    price: '€94.99',
    rating: 4.6,
    reviews: 980,
    duration: '14.0 hrs',
    level: 'Intermediate',
    category: 'Compressors',
    badge: null,
    color: '#2d1a5e',
    url: 'https://www.udemy.com',
  },
  {
    id: 4,
    title: 'Fluid Mechanics for Engineers',
    platform: 'Udemy',
    instructor: 'Prof. Ahmed Al-Rashid',
    price: '€79.99',
    rating: 4.4,
    reviews: 2100,
    duration: '9.5 hrs',
    level: 'Beginner',
    category: 'General',
    badge: null,
    color: '#3d2a1a',
    url: 'https://www.udemy.com',
  },
  {
    id: 5,
    title: 'Pneumatic & Electric Actuator Selection',
    platform: 'Udemy',
    instructor: 'Mark D. Sullivan',
    price: '€89.99',
    rating: 4.8,
    reviews: 640,
    duration: '8.0 hrs',
    level: 'Intermediate',
    category: 'Actuators',
    badge: 'new',
    color: '#0a3d5e',
    url: 'https://www.udemy.com',
  },
  {
    id: 6,
    title: 'Instrumentation & Control Fundamentals',
    platform: 'Udemy',
    instructor: 'Priya S. Nair',
    price: '€89.99',
    rating: 4.6,
    reviews: 1560,
    duration: '11.5 hrs',
    level: 'Intermediate',
    category: 'Instrumentation',
    badge: 'bestseller',
    color: '#1a4a2a',
    url: 'https://www.udemy.com',
  },
  {
    id: 7,
    title: 'Piping & Pipeline Engineering',
    platform: 'Udemy',
    instructor: 'Elena B. Kowalski, P.Eng',
    price: '€74.99',
    rating: 4.3,
    reviews: 870,
    duration: '13.0 hrs',
    level: 'Advanced',
    category: 'General',
    badge: null,
    color: '#3d1a1a',
    url: 'https://www.udemy.com',
  },
  {
    id: 8,
    title: 'Industrial Valve Types & Applications',
    platform: 'Udemy',
    instructor: 'John L. Patterson',
    price: '€69.99',
    rating: 4.5,
    reviews: 1120,
    duration: '7.5 hrs',
    level: 'Beginner',
    category: 'Valves',
    badge: null,
    color: '#1a2d4a',
    url: 'https://www.udemy.com',
  },
]

const ALL = 'All'
const categories = [ALL, 'Valves', 'Actuators', 'Compressors', 'Instrumentation', 'General']
const levelColors = {
  Beginner:     { bg: '#e8f5e9', text: '#2e7d32' },
  Intermediate: { bg: '#fff3e0', text: '#e65100' },
  Advanced:     { bg: '#fce4ec', text: '#c62828' },
}

function StarRating({ rating }) {
  const full = Math.floor(rating)
  return (
    <div className="crs-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < full ? '#f59e0b' : '#d1d5db', width: 12, height: 12, display: 'inline-block' }}>
          <IconStar />
        </span>
      ))}
      <span className="crs-rating-num">{rating.toFixed(1)}</span>
      <span className="crs-reviews">({rating >= 1000 ? (rating / 1000).toFixed(1) + 'k' : rating})</span>
    </div>
  )
}

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [query, setQuery] = useState('')

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === ALL || c.category === activeCategory
    const q = query.toLowerCase()
    const matchQuery = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  return (
    <div className="crs-page">
      {/* Header */}
      <div className="crs-header">
        <div className="crs-header-inner">
          <div className="crs-eyebrow">Courses</div>
          <h1 className="crs-title">Engineering Courses</h1>
          <p className="crs-sub">Curated courses from top instructors to help you advance in process, mechanical, and instrumentation engineering. All courses are independently reviewed.</p>
        </div>
        <div className="crs-stats-row">
          <div className="crs-stat"><span className="crs-stat-num">{courses.length}</span><span className="crs-stat-label">Courses</span></div>
          <div className="crs-stat-div" />
          <div className="crs-stat"><span className="crs-stat-num">{[...new Set(courses.map(c => c.platform))].length}</span><span className="crs-stat-label">Platforms</span></div>
          <div className="crs-stat-div" />
          <div className="crs-stat"><span className="crs-stat-num">{courses.filter(c => c.badge === 'bestseller').length}</span><span className="crs-stat-label">Bestsellers</span></div>
        </div>
      </div>

      <div className="crs-body">
        {/* Search */}
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search courses by title, instructor, or topic..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="crs-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`crs-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Count */}
        <div className="crs-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</div>

        {/* Grid */}
        <div className="crs-grid">
          {filtered.map(c => {
            const lvl = levelColors[c.level] || levelColors.Beginner
            return (
              <div key={c.id} className="crs-card">
                <div className="crs-thumb" style={{ background: c.color }}>
                  <IconCap />
                  {c.badge && (
                    <span className={`crs-badge ${c.badge}`}>
                      {c.badge === 'bestseller' ? 'Bestseller' : 'New'}
                    </span>
                  )}
                </div>
                <div className="crs-card-body">
                  <div className="crs-platform">{c.platform}</div>
                  <div className="crs-card-title">{c.title}</div>
                  <div className="crs-instructor">{c.instructor}</div>
                  <StarRating rating={c.rating} />
                  <div className="crs-meta-row">
                    <span className="crs-duration"><IconClock /> {c.duration}</span>
                    <span className="crs-level" style={{ background: lvl.bg, color: lvl.text }}>{c.level}</span>
                  </div>
                  <div className="crs-footer">
                    <span className="crs-price">{c.price}</span>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="crs-cta">
                      View Course <IconArrow />
                    </a>
                  </div>
                </div>
              </div>
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
