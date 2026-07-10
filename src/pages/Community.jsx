import { useState } from 'react'
import { Link } from 'react-router-dom'
import { threads } from '../data/communityThreads'

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
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const categories = ['All', 'Valves', 'Actuators', 'Compressors', 'Instrumentation', 'Materials']


const categoryColors = {
  Valves:          { bg: 'var(--teal-bg)',   text: 'var(--teal)'   },
  Actuators:       { bg: 'var(--navy-bg)',   text: 'var(--navy2)'  },
  Compressors:     { bg: 'var(--amber-bg)',  text: 'var(--amber)'  },
  Instrumentation: { bg: '#f0e6f6',          text: '#6b21a8'       },
  Materials:       { bg: '#fef3c7',          text: '#92400e'       },
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
          <div className="comm-stat"><span className="comm-stat-num">{threads.reduce((a, t) => a + t.replies.length, 0)}</span><span className="comm-stat-label">Replies</span></div>
          <div className="comm-stat-div" />
          <div className="comm-stat"><span className="comm-stat-num">{threads.reduce((a, t) => a + t.views, 0)}</span><span className="comm-stat-label">Views</span></div>
        </div>
      </div>

      <div className="comm-body">
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search discussions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="comm-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`comm-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        <div className="comm-thread-list">
          {filtered.map(thread => {
            const catStyle = categoryColors[thread.category] || categoryColors.General
            return (
              <Link key={thread.id} to={`/community/${thread.id}`} className="comm-thread comm-thread-link">
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
                    <span className="comm-thread-role">{thread.role}</span>
                    <span className="comm-thread-dot">·</span>
                    <span className="comm-thread-time">{thread.time}</span>
                  </div>
                </div>
                <div className="comm-thread-stats">
                  <div className="comm-thread-stat">
                    <IconMessage />
                    <span>{thread.replies.length}</span>
                  </div>
                  <div className="comm-thread-stat">
                    <IconEye />
                    <span>{thread.views}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

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
