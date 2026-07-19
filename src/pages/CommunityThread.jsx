import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { threads as seedThreads } from '../data/communityThreads'

const categoryColors = {
  Valves:          { bg: 'var(--teal-bg)',   text: 'var(--teal)'   },
  Actuators:       { bg: 'var(--navy-bg)',   text: 'var(--navy2)'  },
  Compressors:     { bg: 'var(--amber-bg)',  text: 'var(--amber)'  },
  Instrumentation: { bg: '#f0e6f6',          text: '#6b21a8'       },
  Materials:       { bg: '#fef3c7',          text: '#92400e'       },
  General:         { bg: 'var(--bg2)',       text: 'var(--text2)'  },
}

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconArrowUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
)

const isUUID = id => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)

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

export default function CommunityThread() {
  const { threadId } = useParams()
  const isDb = isUUID(threadId)
  const seedThread = !isDb ? seedThreads.find(t => String(t.id) === threadId) : null

  const [user, setUser] = useState(null)
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(isDb)
  const [replyForm, setReplyForm] = useState({ author_name: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const [replyError, setReplyError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) setReplyForm(f => ({ ...f, author_name: u.email.split('@')[0] }))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) setReplyForm(f => ({ ...f, author_name: u.email.split('@')[0] }))
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isDb) return
    Promise.all([
      supabase.from('community_threads').select('*').eq('id', threadId).single(),
      supabase.from('community_replies').select('*').eq('thread_id', threadId).order('created_at', { ascending: true }),
    ]).then(([{ data: t }, { data: r }]) => {
      if (t) setThread(t)
      if (r) setReplies(r)
      setLoading(false)
    })
  }, [threadId, isDb])

  const submitReply = async e => {
    e.preventDefault()
    if (!replyForm.body.trim() || !replyForm.author_name.trim()) return
    setSubmitting(true)
    setReplyError('')
    const { data, error } = await supabase
      .from('community_replies')
      .insert({
        thread_id: threadId,
        user_id: user.id,
        author_name: replyForm.author_name.trim(),
        body: replyForm.body.trim(),
      })
      .select()
      .single()
    setSubmitting(false)
    if (error) { setReplyError('Failed to post reply. Please try again.'); return }
    setReplies(p => [...p, data])
    setReplyForm(f => ({ ...f, body: '' }))
  }

  // ── Seed thread ──────────────────────────────────────────────────────────────
  if (!isDb) {
    if (!seedThread) {
      return (
        <div className="ct-notfound">
          <p>Thread not found.</p>
          <Link to="/community" className="ct-back-link"><IconBack /> Back to Community</Link>
        </div>
      )
    }
    const catStyle = categoryColors[seedThread.category] || categoryColors.General
    return (
      <div className="ct-page">
        <div className="ct-header">
          <div className="ct-header-inner">
            <Link to="/community" className="ct-back-link"><IconBack /> Community</Link>
            <span className="ct-header-cat" style={{ background: catStyle.bg, color: catStyle.text }}>{seedThread.category}</span>
          </div>
          <h1 className="ct-title">{seedThread.title}</h1>
          <div className="ct-header-meta">
            <div className="ct-views"><IconEye /> {seedThread.views} views</div>
            <div className="ct-dot">·</div>
            <div className="ct-reply-count">{seedThread.replies.length} {seedThread.replies.length === 1 ? 'reply' : 'replies'}</div>
          </div>
        </div>
        <div className="ct-body">
          <div className="ct-post ct-post-op">
            <div className="ct-post-sidebar">
              <div className="ct-avatar" style={{ background: seedThread.color }}>{seedThread.initials}</div>
              <div className="ct-upvotes"><IconArrowUp /><span>{seedThread.upvotes}</span></div>
            </div>
            <div className="ct-post-content">
              <div className="ct-post-meta">
                <span className="ct-post-user">{seedThread.user}</span>
                <span className="ct-post-role">{seedThread.role}</span>
                <span className="ct-post-region">{seedThread.region}</span>
                <span className="ct-post-time">{seedThread.time}</span>
              </div>
              <div className="ct-post-body">{seedThread.body}</div>
            </div>
          </div>
          <div className="ct-replies-heading">{seedThread.replies.length} {seedThread.replies.length === 1 ? 'Reply' : 'Replies'}</div>
          <div className="ct-replies">
            {seedThread.replies.map(reply => (
              <div key={reply.id} className={`ct-post ct-post-reply ${reply.accepted ? 'ct-post-accepted' : ''}`}>
                <div className="ct-post-sidebar">
                  <div className="ct-avatar" style={{ background: reply.color }}>{reply.initials}</div>
                  <div className="ct-upvotes"><IconArrowUp /><span>{reply.upvotes}</span></div>
                </div>
                <div className="ct-post-content">
                  <div className="ct-post-meta">
                    <span className="ct-post-user">{reply.user}</span>
                    <span className="ct-post-role">{reply.role}</span>
                    <span className="ct-post-region">{reply.region}</span>
                    <span className="ct-post-time">{reply.time}</span>
                    {reply.accepted && <span className="ct-accepted-badge"><IconCheck /> Accepted Answer</span>}
                  </div>
                  <div className="ct-post-body">{reply.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="ct-reply-cta">
            <div className="ct-reply-cta-inner">
              <div className="ct-reply-cta-title">Want to start your own discussion?</div>
              <div className="ct-reply-cta-sub">Log in or create a free account to post questions and connect with engineers worldwide.</div>
              <div className="ct-reply-cta-btns">
                <Link to="/login?redirect=/community" className="ct-reply-cta-btn">Log In</Link>
                <Link to="/register" className="ct-reply-cta-btn ct-reply-cta-btn-sec">Register Free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── DB thread: loading / not found ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="ct-page">
        <div className="ct-loading">Loading discussion…</div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="ct-notfound">
        <p>Thread not found.</p>
        <Link to="/community" className="ct-back-link"><IconBack /> Back to Community</Link>
      </div>
    )
  }

  // ── DB thread: full render ───────────────────────────────────────────────────
  const catStyle = categoryColors[thread.category] || categoryColors.General

  return (
    <div className="ct-page">
      <div className="ct-header">
        <div className="ct-header-inner">
          <Link to="/community" className="ct-back-link"><IconBack /> Community</Link>
          <span className="ct-header-cat" style={{ background: catStyle.bg, color: catStyle.text }}>{thread.category}</span>
        </div>
        <h1 className="ct-title">{thread.title}</h1>
        <div className="ct-header-meta">
          <div className="ct-views"><IconEye /> {thread.views || 0} views</div>
          <div className="ct-dot">·</div>
          <div className="ct-reply-count">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</div>
        </div>
      </div>

      <div className="ct-body">
        <div className="ct-post ct-post-op">
          <div className="ct-post-sidebar">
            <div className="ct-avatar" style={{ background: avatarColor(thread.id) }}>
              {thread.author_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="ct-upvotes"><IconArrowUp /><span>{thread.upvotes || 0}</span></div>
          </div>
          <div className="ct-post-content">
            <div className="ct-post-meta">
              <span className="ct-post-user">{thread.author_name}</span>
              <span className="ct-post-time">{relTime(thread.created_at)}</span>
            </div>
            <div className="ct-post-body">{thread.body}</div>
          </div>
        </div>

        {replies.length > 0 && (
          <>
            <div className="ct-replies-heading">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</div>
            <div className="ct-replies">
              {replies.map(reply => (
                <div key={reply.id} className={`ct-post ct-post-reply ${reply.accepted ? 'ct-post-accepted' : ''}`}>
                  <div className="ct-post-sidebar">
                    <div className="ct-avatar" style={{ background: avatarColor(reply.id) }}>
                      {reply.author_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="ct-upvotes"><IconArrowUp /><span>{reply.upvotes || 0}</span></div>
                  </div>
                  <div className="ct-post-content">
                    <div className="ct-post-meta">
                      <span className="ct-post-user">{reply.author_name}</span>
                      {reply.accepted && <span className="ct-accepted-badge"><IconCheck /> Accepted Answer</span>}
                      <span className="ct-post-time">{relTime(reply.created_at)}</span>
                    </div>
                    <div className="ct-post-body">{reply.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {user ? (
          <form className="ct-reply-form" onSubmit={submitReply}>
            <div className="ct-reply-form-heading">Post a Reply</div>
            <div className="ct-reply-form-header">
              <div className="ct-avatar" style={{ background: avatarColor(user.id) }}>
                {(replyForm.author_name || '?').slice(0, 2).toUpperCase()}
              </div>
              <input
                className="ct-reply-name"
                value={replyForm.author_name}
                onChange={e => setReplyForm(f => ({ ...f, author_name: e.target.value }))}
                placeholder="Your name"
                maxLength={50}
                required
              />
            </div>
            <textarea
              className="ct-reply-textarea"
              rows={4}
              placeholder="Write your reply..."
              value={replyForm.body}
              onChange={e => setReplyForm(f => ({ ...f, body: e.target.value }))}
              required
              maxLength={5000}
            />
            {replyError && <div className="ct-reply-error">{replyError}</div>}
            <div className="ct-reply-form-footer">
              <button type="submit" className="ct-reply-submit" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post Reply'}
              </button>
            </div>
          </form>
        ) : (
          <div className="ct-reply-cta">
            <div className="ct-reply-cta-inner">
              <div className="ct-reply-cta-title">Want to contribute to this discussion?</div>
              <div className="ct-reply-cta-sub">Log in or create a free account to post a reply.</div>
              <div className="ct-reply-cta-btns">
                <Link to={`/login?redirect=/community/${threadId}`} className="ct-reply-cta-btn">Log In</Link>
                <Link to="/register" className="ct-reply-cta-btn ct-reply-cta-btn-sec">Register Free</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
