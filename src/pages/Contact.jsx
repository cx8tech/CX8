import { useState } from 'react'

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    const body = `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
    window.location.href = `mailto:cx8tech@gmail.com?subject=${encodeURIComponent(form.subject || 'CX8 Enquiry')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-inner">
          <div className="section-eyebrow"><span className="section-eyebrow-text">Contact</span></div>
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-sub">Have a question, feedback, or just want to say hello? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="contact-body">
        <div className="contact-inner">
          <div className="contact-grid">

            <div className="contact-info">
              <h2 className="contact-info-title">Contact Information</h2>
              <p className="contact-info-sub">Reach out directly or fill in the form and we'll get back to you as soon as possible.</p>

              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconMail /></div>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <a href="mailto:cx8tech@gmail.com" className="contact-info-value">cx8tech@gmail.com</a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconClock /></div>
                  <div>
                    <div className="contact-info-label">Response Time</div>
                    <div className="contact-info-value">Within 1–2 business days</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconLocation /></div>
                  <div>
                    <div className="contact-info-label">Based in</div>
                    <div className="contact-info-value">Germany</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap">
              {sent ? (
                <div className="contact-sent">
                  <div className="auth-check">✓</div>
                  <h3 className="contact-sent-title">Your email client should have opened.</h3>
                  <p className="contact-sent-sub">If it didn't, email us directly at <a href="mailto:cx8tech@gmail.com">cx8tech@gmail.com</a></p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={submit}>
                  <div className="contact-form-row contact-form-two">
                    <div className="comm-form-row" style={{flex:1}}>
                      <label className="comm-form-label">Your Name</label>
                      <input className="comm-form-input" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
                    </div>
                    <div className="comm-form-row" style={{flex:1}}>
                      <label className="comm-form-label">Email Address</label>
                      <input className="comm-form-input" type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} required />
                    </div>
                  </div>
                  <div className="comm-form-row">
                    <label className="comm-form-label">Subject</label>
                    <input className="comm-form-input" placeholder="What's this about?" value={form.subject} onChange={set('subject')} required />
                  </div>
                  <div className="comm-form-row">
                    <label className="comm-form-label">Message</label>
                    <textarea className="comm-form-textarea" placeholder="Tell us more…" rows={6} value={form.message} onChange={set('message')} required />
                  </div>
                  <button className="contact-submit" type="submit">Send Message</button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
