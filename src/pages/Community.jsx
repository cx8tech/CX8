import { useState } from 'react'

const IconMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const categories = ['All', 'Valves', 'Actuators', 'Compressors', 'Instrumentation', 'General']

const threads = [
  { id: 1, user: 'Ahmed K.',    initials: 'AK', color: '#1a6b5f', category: 'Valves',          title: 'How to select control valve for cavitation service?',              time: '2h ago',  replies: 12, views: 84  },
  { id: 2, user: 'Priya S.',    initials: 'PS', color: '#3d1a60', category: 'Actuators',        title: 'Actuator sizing for high differential pressure applications',       time: '5h ago',  replies: 8,  views: 61  },
  { id: 3, user: 'Mark D.',     initials: 'MD', color: '#9e4e00', category: 'General',          title: 'Recommended materials for sour gas application',                   time: '1d ago',  replies: 15, views: 132 },
  { id: 4, user: 'John L.',     initials: 'JL', color: '#0a3d5e', category: 'Instrumentation',  title: 'Flow measurement: DP transmitter vs Vortex — when to use which?',  time: '1d ago',  replies: 9,  views: 77  },
  { id: 5, user: 'Sara M.',     initials: 'SM', color: '#1a3060', category: 'Compressors',      title: 'Centrifugal vs reciprocating compressor — selection criteria',       time: '2d ago',  replies: 6,  views: 55  },
  { id: 6, user: 'Ravi T.',     initials: 'RT', color: '#0a4a3a', category: 'Valves',           title: 'Ball valve vs butterfly valve for slurry service',                  time: '2d ago',  replies: 11, views: 98  },
  { id: 7, user: 'Elena B.',    initials: 'EB', color: '#2d1a5e', category: 'Actuators',        title: 'Pneumatic vs electric actuator — cost vs reliability tradeoffs',    time: '3d ago',  replies: 14, views: 110 },
  { id: 8, user: 'Carlos F.',   initials: 'CF', color: '#1a3d2a', category: 'Instrumentation',  title: 'Best practice for pressure transmitter installation in steam lines',  time: '4d ago',  replies: 7,  views: 63  },
  { id: 9, user: 'Wei C.',      initials: 'WC', color: '#3d2a1a', category: 'General',          title: 'How do you handle vendor-locked specifications in projects?',         time: '5d ago',  replies: 19, views: 158 },
  { id: 10, user: 'James O.',   initials: 'JO', color: '#1a2d4a', category: 'Compressors',      title: 'Minimum flow protection strategies for centrifugal compressors',     time: '6d ago',  replies: 5,  views: 44  },
]

const categoryColors = {
  Valves:          { bg: 'var(--teal-bg)',   text: 'var(--teal)'   },
  Actuators:       { bg: 'var(--navy-bg)',   text: 'var(--navy2)'  },
  Compressors:     { bg: 'var(--amber-bg)',  text: 'var(--amber)'  },
  Instrumentation: { bg: '#f0e6f6',          text: '#6b21a8'       },
  General:         { bg: 'var(--bg2)',       text: 'var(--text2)'  },
}

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = threads.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const q = query.toLowerCase()
    const matchQuery = !q || t.title.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    return matchCat && matchQuery
  })

  return (
    <div className="comm-page">
      {/* Header */}
      <div className="comm-header">
        <div className="comm-header-inner">
          <div className="comm-eyebrow">Community</div>
          <h1 className="comm-title">Engineering Discussions</h1>
          <p className="comm-sub">Ask questions, share knowledge, and connect with engineers worldwide. All discussions are vendor-neutral.</p>
          <button className="comm-cta" onClick={() => setShowComingSoon(true)}>
            <IconPlus /> Start a Discussion
          </button>
        </div>
        <div className="comm-stats-row">
          <div className="comm-stat"><span className="comm-stat-num">{threads.length}</span><span className="comm-stat-label">Discussions</span></div>
          <div className="comm-stat-div" />
          <div className="comm-stat"><span className="comm-stat-num">{threads.reduce((a, t) => a + t.replies, 0)}</span><span className="comm-stat-label">Replies</span></div>
          <div className="comm-stat-div" />
          <div className="comm-stat"><span className="comm-stat-num">{threads.reduce((a, t) => a + t.views, 0)}</span><span className="comm-stat-label">Views</span></div>
        </div>
      </div>

      <div className="comm-body">
        {/* Search */}
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search discussions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="comm-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`comm-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Thread list */}
        <div className="comm-thread-list">
          {filtered.map(thread => {
            const catStyle = categoryColors[thread.category] || categoryColors.General
            return (
              <div key={thread.id} className="comm-thread">
                <div className="comm-thread-avatar" style={{ background: thread.color }}>
                  {thread.initials}
                </div>
                <div className="comm-thread-body">
                  <div className="comm-thread-top">
                    <span className="comm-thread-cat" style={{ background: catStyle.bg, color: catStyle.text }}>
                      {thread.category}
                    </span>
                  </div>
                  <div className="comm-thread-title">{thread.title}</div>
                  <div className="comm-thread-meta">
                    <span className="comm-thread-user">{thread.user}</span>
                    <span className="comm-thread-dot">·</span>
                    <span className="comm-thread-time">{thread.time}</span>
                  </div>
                </div>
                <div className="comm-thread-stats">
                  <div className="comm-thread-stat">
                    <IconMessage />
                    <span>{thread.replies}</span>
                  </div>
                  <div className="comm-thread-stat">
                    <IconEye />
                    <span>{thread.views}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming soon notice */}
        {showComingSoon && (
          <div className="comm-overlay" onClick={() => setShowComingSoon(false)}>
            <div className="comm-modal" onClick={e => e.stopPropagation()}>
              <div className="comm-modal-icon"><IconMessage /></div>
              <h2 className="comm-modal-title">Coming Soon</h2>
              <p className="comm-modal-sub">Full community discussions with posting, replies, and profiles are coming in the next update.</p>
              <button className="comm-modal-btn" onClick={() => setShowComingSoon(false)}>Got it</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
