import { Link } from 'react-router-dom'

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--navy)"/>
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-mark">
                <img src="/logo.png" alt="CX8" onError={e => { e.target.style.display = 'none' }} />
              </div>
              <div className="footer-logo-text">
                <div className="footer-brand-name">CX8 Technologies</div>
                <div className="footer-brand-sub">Engineering Intelligence Platform</div>
              </div>
            </div>
            <p className="footer-tagline">Empowering engineers with intelligent tools and global connections.</p>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><Link to="/legal/impressum">Impressum</Link></li>
              <li><Link to="/legal/datenschutz">Data Protection (Datenschutz)</Link></li>
              <li><Link to="/legal/cookies">Cookies Settings</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/legal/terms">Terms of Use</Link></li>
              <li><Link to="/legal/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-social-title">Connect with us</div>
            <div className="footer-socials">
              <button className="social-btn" aria-label="LinkedIn"><IconLinkedIn /></button>
              <button className="social-btn" aria-label="YouTube"><IconYouTube /></button>
              <button className="social-btn" aria-label="Email"><IconMail /></button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© 2024 CX8 Technologies. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
