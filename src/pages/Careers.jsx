const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}>
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
)
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const values = [
  { Icon: IconZap,   title: 'Impact over process',  body: 'We move fast and build things that engineers actually use in the field every day.' },
  { Icon: IconGlobe, title: 'Remote-first',          body: "We're a distributed team. Work from wherever you do your best thinking." },
  { Icon: IconHeart, title: 'Engineer-led',          body: 'Everything we build is rooted in real engineering problems — not made-up features.' },
]

export default function Careers() {
  return (
    <div className="careers-page">
      <div className="careers-hero">
        <div className="careers-hero-inner">
          <div className="section-eyebrow"><span className="section-eyebrow-text">Careers</span></div>
          <h1 className="careers-hero-title">Join Our Team</h1>
          <p className="careers-hero-sub">We're a small, focused team building intelligent tools for engineers worldwide. If that excites you, we'd love to meet you.</p>
        </div>
      </div>

      <div className="careers-body">
        <div className="careers-inner">

          <div className="careers-values">
            <h2 className="careers-section-title">How we work</h2>
            <div className="careers-values-grid">
              {values.map(({ Icon, title, body }) => (
                <div key={title} className="careers-value-card">
                  <div className="careers-value-icon"><Icon /></div>
                  <h3 className="careers-value-title">{title}</h3>
                  <p className="careers-value-body">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="careers-openings">
            <h2 className="careers-section-title">Open Positions</h2>
            <div className="careers-no-roles">
              <div className="careers-no-roles-icon">🌱</div>
              <h3 className="careers-no-roles-title">No open roles right now</h3>
              <p className="careers-no-roles-sub">We're not actively hiring, but we're always interested in hearing from talented people. If you're passionate about engineering tools and want to build something meaningful, send us a note.</p>
              <a href="mailto:sales@cx8motion.com?subject=Speculative Application — CX8" className="careers-apply-btn">Send a Speculative Application</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
