import { useState } from 'react'

const faqs = [
  {
    category: 'Tools',
    items: [
      { q: 'Are the tools free to use?', a: 'Most tools are completely free — Tools 1 through 4 and Tool 6 require no account. Tool 5 (Actuator Cross Reference) is a Pro feature that requires a paid subscription.' },
      { q: 'Do I need an account to use the tools?', a: 'No account is needed for free tools. Tool 5 requires you to log in and have an active Pro subscription.' },
      { q: 'Can I use the tools on my phone or tablet?', a: 'Yes. All tools are designed to work on mobile, tablet, and desktop.' },
      { q: 'How accurate are the calculations?', a: 'Our tools use industry-standard formulas and reference data. Always verify critical results against official manufacturer documentation before use in safety-critical applications.' },
    ],
  },
  {
    category: 'Subscription & Billing',
    items: [
      { q: 'What does a Pro subscription include?', a: 'Pro gives you access to Tool 5 — the Actuator Cross Reference database — which lets you cross-reference actuator models across manufacturers and find compatible replacements.' },
      { q: 'How do I cancel my subscription?', a: 'You can cancel anytime by emailing us at cx8tech@gmail.com. Your access remains active until the end of your billing period.' },
      { q: 'Do you offer refunds?', a: 'If you are unsatisfied within 7 days of subscribing, contact us and we will issue a full refund, no questions asked.' },
      { q: 'Which payment methods do you accept?', a: 'We accept all major credit and debit cards via LemonSqueezy, our payment provider.' },
    ],
  },
  {
    category: 'Community',
    items: [
      { q: 'Do I need an account to read community posts?', a: 'No — anyone can read discussions. You need a free account to post or reply.' },
      { q: 'How do I report inappropriate content?', a: 'Email us at cx8tech@gmail.com with a link to the post and we will review it promptly.' },
    ],
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I change my password?', a: 'Currently, contact us at cx8tech@gmail.com and we will help you reset it.' },
      { q: 'How do I delete my account?', a: 'Email cx8tech@gmail.com with your request and we will permanently delete your account and all associated data within 30 days, in line with GDPR.' },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`help-faq-item ${open ? 'open' : ''}`}>
      <button className="help-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <svg className="help-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="help-faq-a">{a}</div>}
    </div>
  )
}

export default function Help() {
  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="help-hero-inner">
          <div className="section-eyebrow"><span className="section-eyebrow-text">Help Center</span></div>
          <h1 className="help-hero-title">How can we help?</h1>
          <p className="help-hero-sub">Answers to the most common questions about CX8 tools, subscriptions, and your account.</p>
        </div>
      </div>

      <div className="help-body">
        <div className="help-inner">
          {faqs.map(({ category, items }) => (
            <div key={category} className="help-section">
              <h2 className="help-section-title">{category}</h2>
              <div className="help-faq-list">
                {items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))}

          <div className="help-cta">
            <h3 className="help-cta-title">Didn't find your answer?</h3>
            <p className="help-cta-sub">We're happy to help. Reach out and we'll get back to you within 1–2 business days.</p>
            <a href="mailto:cx8tech@gmail.com" className="help-cta-btn">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
