import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { threads as seedThreads } from '../data/communityThreads'

const CATS = ['All', 'Valves', 'Actuators', 'Compressors', 'Instrumentation', 'Materials', 'General']

const categoryColors = {
  Valves:          { bg: 'var(--teal-bg)',   text: 'var(--teal)'   },
  Actuators:       { bg: 'var(--navy-bg)',   text: 'var(--navy2)'  },
  Compressors:     { bg: 'var(--amber-bg)',  text: 'var(--amber)'  },
  Instrumentation: { bg: '#f0e6f6',          text: '#6b21a8'       },
  Materials:       { bg: '#fef3c7',          text: '#92400e'       },
  General:         { bg: 'var(--bg2)',       text: 'var(--text2)'  },
}

const COLORS = ['#1a4a8a','#1a6b5f','#3d1a60','#6b1a1a','#0a3d5e','#1a5a2a','#9e4e00']
function avatarColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff
  return COLORS[h % COLORS.length]
}
function relTime(ts) {
  const d = (Date.now() - new Date(ts)) / 1000
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  if (d < 604800) return `${Math.floor(d / 86400)}d ago`
  return new Date(ts).toLocaleDateString()
}

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
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function Community() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [dbThreads, setDbThreads] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Valves', body: '', author_name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) setForm(f => ({ ...f, author_name: u.email.split('@')[0] }))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) setForm(f => ({ ...f, author_name: u.email.split('@')[0] }))
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    supabase
      .from('community_threads')
      .select('id, author_name, title, category, views, upvotes, created_at, community_replies(count)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setDbThreads(data) })
  }, [])

  const dbNorm = dbThreads.map(t => ({
    id: t.id, isDB: true,
    user: t.author_name, role: '',
    initials: t.author_name.slice(0, 2).toUpperCase(),
    color: avatarColor(t.id),
    category: t.category, title: t.title,
    time: relTime(t.created_at),
    views: t.views || 0,
    replyCount: t.community_replies?.[0]?.count || 0,
  }))

  const seedNorm = seedThreads.map(t => ({
    ...t, isDB: false, replyCount: t.replies.length,
  }))

  const all = [...dbNorm, ...seedNorm]
  const filtered = all.filter(t => {
    const mc = activeCategory === 'All' || t.category === activeCategory
    const q = query.toLowerCase()
    const mq = !q || t.title.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    return mc && mq
  })

  const totalReplies = dbNorm.reduce((a, t) => a + t.replyCount, 0) + seedThreads.reduce((a, t) => a + t.replies.length, 0)
  const totalViews = all.reduce((a, t) => a + (t.views || 0), 0)

  const openModal = () => {
    if (!user) { navigate('/login?redirect=/community'); return }
    setShowModal(true)
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim() || !form.author_name.trim()) return
    setSubmitting(true)
    setFormError('')
    const { data, error } = await supabase
      .from('community_threads')
      .insert({
        user_id: user.id,
        author_name: form.author_name.trim(),
        title: form.title.trim(),
        body: form.body.trim(),
        category: form.category,
      })
      .select()
      .single()
    setSubmitting(false)
    if (error) { setFormError('Failed to post. Please try again.'); return }
    setShowModal(false)
    setDbThreads(p => [data, ...p])
    navigate(`/community/${data.id}`)
  }

  return (
    <div className="comm-page">
      <div className="comm-header">
        <div className="comm-header-inner">
          <div className="comm-eyebrow">Community</div>
          <h1 className="comm-title">Engineering Discussions</h1>
          <p className="comm-sub">Ask questions, share knowledge, and connect with engineers worldwide. All discussions are vendor-neutral.</p>
          <button className="comm-cta" onClick={openModal}>
            <IconPlus /> Start a Discussion
          </button>
        </div>
        <div className="comm-stats-row">
          <div className="comm-stat"><span className="comm-stat-num">{all.length}</span><span className="comm-stat-label">Discussions</span></div>
          <div className="comm-stat-div" />
          <div className="comm-stat"><span className="comm-stat-num">{totalReplies}</span><span className="comm-stat-label">Replies</span></div>
          <div className="comm-stat-div" />
          <div className="comm-stat"><span className="comm-stat-num">{totalViews}</span><span className="comm-stat-label">Views</span></div>
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
          {CATS.map(cat => (
            <button
              key={cat}
              className={`comm-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        <div className="comm-thread-list">
          {filtered.map(thread => {
            const cs = categoryColors[thread.category] || categoryColors.General
            return (
              <Link key={thread.id} to={`/community/${thread.id}`} className="comm-thread comm-thread-link">
                <div className="comm-thread-avatar" style={{ background: thread.color }}>{thread.initials}</div>
                <div className="comm-thread-body">
                  <div className="comm-thread-top">
                    <span className="comm-thread-cat" style={{ background: cs.bg, color: cs.text }}>{thread.category}</span>
                  </div>
                  <div className="comm-thread-title">{thread.title}</div>
                  <div className="comm-thread-meta">
                    <span className="comm-thread-user">{thread.user}</span>
                    {thread.role && <><span className="comm-thread-dot">·</span><span className="comm-thread-role">{thread.role}</span></>}
                    <span className="comm-thread-dot">·</span>
                    <span className="comm-thread-time">{thread.time}</span>
                  </div>
                </div>
                <div className="comm-thread-stats">
                  <div className="comm-thread-stat"><IconMessage /><span>{thread.replyCount}</span></div>
                  <div className="comm-thread-stat"><IconEye /><span>{thread.views}</span></div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="comm-overlay" onClick={() => setShowModal(false)}>
          <div className="comm-modal comm-modal-form" onClick={e => e.stopPropagation()}>
            <div className="comm-modal-header">
              <h2 className="comm-modal-title">Start a Discussion</h2>
              <button className="comm-modal-close" onClick={() => setShowModal(false)}><IconX /></button>
            </div>
            <form onSubmit={submit}>
              <div className="comm-form-row">
                <label className="comm-form-label">Your name</label>
                <input
                  className="comm-form-input"
                  value={form.author_name}
                  onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                  placeholder="Display name"
                  required
                  maxLength={50}
                />
              </div>
              <div className="comm-form-row">
                <label className="comm-form-label">Category</label>
                <select
                  className="comm-form-select"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATS.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="comm-form-row">
                <label className="comm-form-label">Title</label>
                <input
                  className="comm-form-input"
                  placeholder="Describe your question in one line..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  maxLength={200}
                />
              </div>
              <div className="comm-form-row">
                <label className="comm-form-label">Details</label>
                <textarea
                  className="comm-form-textarea"
                  rows={5}
                  placeholder="Provide context, specs, what you've already tried..."
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  required
                  maxLength={5000}
                />
              </div>
              {formError && <div className="comm-form-error">{formError}</div>}
              <div className="comm-form-actions">
                <button type="button" className="comm-form-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="comm-form-submit" disabled={submitting}>
                  {submitting ? 'Posting…' : 'Post Discussion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
