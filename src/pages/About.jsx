import { Link } from 'react-router-dom'

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconDatabase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
)
const IconWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)

const pillars = [
  {
    icon: <IconShield />,
    title: 'Free core tools.',
    body: 'Every engineer should have access to accurate sizing and conversion tools, without a paywall.',
  },
  {
    icon: <IconDatabase />,
    title: 'Data you can trust.',
    body: 'Every number in our cross-reference database is sourced, checked, and kept current.',
  },
  {
    icon: <IconWrench />,
    title: 'Built for the field, not just the office.',
    body: 'Our tools are designed to be fast and usable — whether you\'re at a desk or standing next to the equipment.',
  },
]

export default function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-eyebrow">About CX8 Technologies</div>
          <h1 className="page-hero-title">
            Vendor-Neutral Engineering Tools
          </h1>
          <p className="about-tagline">
            <em>Size Right</em>, <span className="em-amber">Specify Smart</span>, <em>Source Better.</em>
          </p>
          <p className="about-lead">
            CX8 Technologies provides free, vendor-neutral engineering tools that help you size the right specifications and connect with trusted suppliers worldwide. Industrial components — compressors, pumps, actuators, valves, and cylinders — are the building blocks of motion in every plant and process line. Getting them right shouldn't mean digging through a dozen manufacturer catalogues or guessing at a spec sheet. We power your intelligence to set you fast into motion.
          </p>
        </div>
      </section>

      <div className="about-body">


        {/* Why we started */}
        <section className="about-section about-section-alt">
          <div className="about-section-inner">
            <div className="about-section-eyebrow">Our Story</div>
            <h2 className="about-section-title">Why we started CX8</h2>
            <p>Engineers specifying industrial components have always faced the same bottleneck: sizing and cross-referencing across manufacturers is slow, fragmented, and full of guesswork. Every brand has its own units, its own performance curves, its own way of describing the same physics.</p>
            <p>CX8 was built to close that gap — one calculation, one dataset, one trusted source at a time.</p>
          </div>
        </section>

        {/* What we do */}
        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-section-eyebrow">Our Platform</div>
            <h2 className="about-section-title">What we do</h2>
            <p>CX8 is a vendor-neutral engineering platform covering the full sizing and specification workflow for compressors, pumps, actuators, valves, and cylinders.</p>
            <p>Behind every tool is a harmonized dataset spanning leading manufacturers worldwide — built and checked against recognized industry standards, so you get consistent, trustworthy answers no matter which brand you're evaluating.</p>
            <Link to="/tools" className="about-cta">
              Explore the Tools <IconArrow />
            </Link>
          </div>
        </section>

        {/* Why vendor-neutral */}
        <section className="about-section about-section-alt">
          <div className="about-section-inner">
            <div className="about-section-eyebrow">Our Principles</div>
            <h2 className="about-section-title">Why vendor-neutral matters</h2>
            <p>Most sizing tools come from a single manufacturer — and naturally, they point you toward that manufacturer's products. CX8 doesn't sell compressors, pumps, actuators, or valves. That means our tools carry no bias. We're focused on one thing: helping you make the right technical decision, faster.</p>
            <p>Manufacturers and suppliers who want visibility to this audience can do so transparently, through our supplier directory and featured listings — never through skewed calculations.</p>
          </div>
        </section>

        {/* Our approach */}
        <section className="about-section">
          <div className="about-section-inner">
            <div className="about-section-eyebrow">Our Approach</div>
            <h2 className="about-section-title">How we work</h2>
            <div className="about-pillars">
              {pillars.map(p => (
                <div key={p.title} className="about-pillar">
                  <div className="about-pillar-icon">{p.icon}</div>
                  <div>
                    <div className="about-pillar-title">{p.title}</div>
                    <div className="about-pillar-body">{p.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The team */}
        <section className="about-section about-section-alt">
          <div className="about-section-inner">
            <div className="about-section-eyebrow">The Team</div>
            <h2 className="about-section-title">Who builds CX8</h2>
            <p>CX8 is built by a team of software and AI professionals working alongside consultants with deep, hands-on experience in industrial automation and process engineering. That combination — modern product development and decades in the field — is what lets us build tools that are both technically rigorous and genuinely fast to use.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta-section">
          <div className="about-cta-inner">
            <div className="about-cta-icon"><IconMail /></div>
            <h2 className="about-cta-title">Get in touch</h2>
            <p className="about-cta-body">Have a tool suggestion, a data correction, or a partnership idea? We'd love to hear from you.</p>
            <a href="mailto:info@cx8technologies.com" className="about-cta-btn">
              info@cx8technologies.com <IconArrow />
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
