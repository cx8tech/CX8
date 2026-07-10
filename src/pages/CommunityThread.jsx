import { useParams, Link } from 'react-router-dom'
import { threads } from '../data/communityThreads'

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

export default function CommunityThread() {
  const { threadId } = useParams()
  const thread = threads.find(t => String(t.id) === threadId)

  if (!thread) {
    return (
      <div className="ct-notfound">
        <p>Thread not found.</p>
        <Link to="/community" className="ct-back-link"><IconBack /> Back to Community</Link>
      </div>
    )
  }

  const catStyle = categoryColors[thread.category] || categoryColors.General

  return (
    <div className="ct-page">
      <div className="ct-header">
        <div className="ct-header-inner">
          <Link to="/community" className="ct-back-link">
            <IconBack /> Community
          </Link>
          <span className="ct-header-cat" style={{ background: catStyle.bg, color: catStyle.text }}>
            {thread.category}
          </span>
        </div>
        <h1 className="ct-title">{thread.title}</h1>
        <div className="ct-header-meta">
          <div className="ct-views"><IconEye /> {thread.views} views</div>
          <div className="ct-dot">·</div>
          <div className="ct-reply-count">{thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}</div>
        </div>
      </div>

      <div className="ct-body">
        {/* Original post */}
        <div className="ct-post ct-post-op">
          <div className="ct-post-sidebar">
            <div className="ct-avatar" style={{ background: thread.color }}>{thread.initials}</div>
            <div className="ct-upvotes">
              <IconArrowUp />
              <span>{thread.upvotes}</span>
            </div>
          </div>
          <div className="ct-post-content">
            <div className="ct-post-meta">
              <span className="ct-post-user">{thread.user}</span>
              <span className="ct-post-role">{thread.role}</span>
              <span className="ct-post-region">{thread.region}</span>
              <span className="ct-post-time">{thread.time}</span>
            </div>
            <div className="ct-post-body">{thread.body}</div>
          </div>
        </div>

        {/* Replies */}
        <div className="ct-replies-heading">{thread.replies.length} {thread.replies.length === 1 ? 'Reply' : 'Replies'}</div>
        <div className="ct-replies">
          {thread.replies.map(reply => (
            <div key={reply.id} className={`ct-post ct-post-reply ${reply.accepted ? 'ct-post-accepted' : ''}`}>
              <div className="ct-post-sidebar">
                <div className="ct-avatar" style={{ background: reply.color }}>{reply.initials}</div>
                <div className="ct-upvotes">
                  <IconArrowUp />
                  <span>{reply.upvotes}</span>
                </div>
              </div>
              <div className="ct-post-content">
                <div className="ct-post-meta">
                  <span className="ct-post-user">{reply.user}</span>
                  <span className="ct-post-role">{reply.role}</span>
                  <span className="ct-post-region">{reply.region}</span>
                  <span className="ct-post-time">{reply.time}</span>
                  {reply.accepted && (
                    <span className="ct-accepted-badge"><IconCheck /> Accepted Answer</span>
                  )}
                </div>
                <div className="ct-post-body">{reply.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon reply box */}
        <div className="ct-reply-cta">
          <div className="ct-reply-cta-inner">
            <div className="ct-reply-cta-title">Want to contribute to this discussion?</div>
            <div className="ct-reply-cta-sub">Full community posting is coming soon. Create an account to be notified when it launches.</div>
            <Link to="/register" className="ct-reply-cta-btn">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
