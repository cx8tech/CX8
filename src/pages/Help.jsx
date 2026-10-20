import { useState } from 'react'

// Text from pages/CX8_FAQ.docx (client-supplied, October 2026)
const faqs = [
  {
    category: 'Tools',
    items: [
      { q: 'Are the tools free to use?', a: 'Most of our tools are free and can be used without an account. Some advanced tools are part of CX8 Pro. Details are in the Pricing section.' },
      { q: 'Do I need an account to use the tools?', a: 'No account is needed for the free tools. A free account lets you download PDF reports. Pro tools need an account and a Pro purchase or subscription.' },
      { q: 'Can I use the tools on my phone or tablet?', a: 'Yes. All tools work on mobile, tablet and desktop.' },
      { q: 'How accurate are the calculations?', a: 'Our tools use industry-standard formulas and reference data. Always check critical results against the official manufacturer documentation before using them in safety-critical applications.' },
    ],
  },
  {
    category: 'Subscription & Billing',
    items: [
      { q: 'What is the difference between the free tools and Pro?', a: 'Free tools are open to everyone. Pro tools add advanced functionality and are available as pay-per-use or as a subscription. See the Pricing section for current options and prices.' },
      { q: 'Where can I find current prices?', a: 'All current prices and plans are listed in the Pricing section. Prices include VAT.' },
      { q: 'How do I cancel my subscription?', a: 'You can cancel at any time. Log in and click "Manage Subscription" at the top of the page, or email sales@cx8motion.com. Your access stays active until the end of your billing period.' },
      { q: 'Do you offer refunds?', a: 'If you are not satisfied within 7 days of subscribing, contact us and we will give you a full refund, no questions asked.' },
      { q: 'Which payment methods do you accept?', a: 'We accept all major credit and debit cards through LemonSqueezy, our payment provider.' },
    ],
  },
  {
    category: 'Community',
    items: [
      { q: 'Do I need an account to read community posts?', a: 'No. Anyone can read the discussions. You need a free account to post or reply.' },
      { q: 'How do I report inappropriate content?', a: 'Email sales@cx8motion.com with a link to the post, and we will review it promptly.' },
      { q: 'How do I delete my account?', a: 'Email sales@cx8motion.com with your request. We will permanently delete your account and all associated data within 30 days, in line with GDPR.' },
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
            <a href="mailto:sales@cx8motion.com" className="help-cta-btn">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
