import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)
const IconTools = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
)
const IconSuppliers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
  </svg>
)
const IconCommunity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconCourses = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
  </svg>
)
const IconResources = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconChevron = () => (
  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const navItems = [
  { path: '/',           label: 'Home',      Icon: IconHome },
  { path: '/tools',      label: 'Tools',     Icon: IconTools },
  { path: '/suppliers',  label: 'Suppliers', Icon: IconSuppliers },
  { path: '/community',  label: 'Community', Icon: IconCommunity },
  { path: '/courses',    label: 'Courses',   Icon: IconCourses },
  { path: '/resources',  label: 'Resources', Icon: IconResources, chevron: true },
]

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const close = () => setMenuOpen(false)

  return (
    <header className="hdr-wrap">
      <nav className="hdr">
        <div className="hdr-left">
          <Link to="/" className="cx8-mark" onClick={close}>
            <img src="/logo.png" alt="CX8" onError={e => { e.target.style.display = 'none' }} />
          </Link>
          <div className="hdr-brand">
            <span className="hdr-name">CX8 Technologies</span>
            <span className="hdr-sub">Engineering Intelligence Platform</span>
          </div>
        </div>

        <div className="hdr-nav">
          {navItems.map(({ path, label, Icon, chevron }) => (
            <Link
              key={path}
              to={path}
              className={`hdr-link ${pathname === path ? 'active' : ''}`}
            >
              <Icon />
              {label}
              {chevron && <IconChevron />}
            </Link>
          ))}
        </div>

        <div className="hdr-right">
          {user ? (
            <>
              <span className="hdr-user-email">{user.email}</span>
              <button className="btn-login" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>

        <button className="hdr-menu-btn" aria-label="Toggle menu" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <IconX /> : <IconMenu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-nav">
          {navItems.map(({ path, label, Icon }) => (
            <Link
              key={path}
              to={path}
              className={`hdr-link mobile-nav-link ${pathname === path ? 'active' : ''}`}
              onClick={close}
            >
              <Icon />
              {label}
            </Link>
          ))}
          <div className="mobile-nav-auth">
            {user ? (
              <button className="btn-login" style={{ flex: 1, textAlign: 'center' }} onClick={() => { logout(); close() }}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn-login" onClick={close}>Login</Link>
                <Link to="/register" className="btn-register mobile-register" onClick={close}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
