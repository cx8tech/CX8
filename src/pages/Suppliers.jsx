import { useState } from 'react'
import { Link } from 'react-router-dom'

const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/>
  </svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const suppliers = [
  {
    name: 'Flowserve Corporation',
    country: 'USA',
    badge: 'featured',
    categories: ['Control Valves', 'Pumps', 'Actuators'],
    description: 'Global manufacturer of flow control products and services for the oil & gas, power, chemical, and water industries.',
    logoColor: '#c0392b',
    logoText: 'FLOWSERVE',
  },
  {
    name: 'Emerson',
    country: 'USA',
    badge: 'featured',
    categories: ['Instrumentation', 'Valves', 'Automation'],
    description: 'Technology and engineering solutions for industrial, commercial, and residential markets worldwide.',
    logoColor: '#1a5276',
    logoText: 'EMERSON',
  },
  {
    name: 'Velan Inc.',
    country: 'Canada',
    badge: 'premium',
    categories: ['Industrial Valves', 'Gate Valves', 'Ball Valves'],
    description: 'Leading manufacturer of industrial valves serving the power, oil & gas, chemical, and cryogenic industries.',
    logoColor: '#117a65',
    logoText: 'VELAN',
  },
  {
    name: 'KITZ Corporation',
    country: 'Japan',
    badge: 'premium',
    categories: ['Ball Valves', 'Gate Valves', 'Butterfly Valves'],
    description: 'One of the world\'s largest valve manufacturers, producing high-quality valves for global industrial markets.',
    logoColor: '#922b21',
    logoText: 'KITZ',
  },
]

const ALL = 'All'
const countries = [ALL, ...Array.from(new Set(suppliers.map(s => s.country)))]
const categories = [ALL, ...Array.from(new Set(suppliers.flatMap(s => s.categories)))]

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function Suppliers() {
  const [countryFilter, setCountryFilter] = useState(ALL)
  const [categoryFilter, setCategoryFilter] = useState(ALL)
  const [query, setQuery] = useState('')

  const filtered = suppliers.filter(s => {
    const matchCountry = countryFilter === ALL || s.country === countryFilter
    const matchCategory = categoryFilter === ALL || s.categories.includes(categoryFilter)
    const q = query.toLowerCase()
    const matchQuery = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.categories.some(c => c.toLowerCase().includes(q))
    return matchCountry && matchCategory && matchQuery
  })

  return (
    <div className="sup-page">
      {/* Page header */}
      <div className="sup-header">
        <div className="sup-header-inner">
          <div className="sup-eyebrow">Supplier Directory</div>
          <h1 className="sup-title">Connect with Verified Suppliers</h1>
          <p className="sup-sub">CX8 Technologies partners with trusted, vendor-neutral suppliers worldwide. All listed suppliers are verified by our engineering team.</p>
          <a href="mailto:contact@cx8technologies.com" className="sup-cta">
            <IconMail /> Get Your Company Listed
          </a>
        </div>
      </div>

      <div className="sup-body">
        {/* Search */}
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search suppliers by name, country, or category..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="sup-filters-bar">
          <div className="sup-filter-group">
            <IconFilter />
            <span className="sup-filter-label">Country</span>
            <div className="sup-filter-pills">
              {countries.map(c => (
                <button
                  key={c}
                  className={`sup-pill ${countryFilter === c ? 'active' : ''}`}
                  onClick={() => setCountryFilter(c)}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="sup-filter-group">
            <span className="sup-filter-label">Category</span>
            <div className="sup-filter-pills">
              {categories.map(c => (
                <button
                  key={c}
                  className={`sup-pill ${categoryFilter === c ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(c)}
                >{c}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="sup-count">{filtered.length} supplier{filtered.length !== 1 ? 's' : ''} found</div>

        {/* Supplier grid */}
        <div className="sup-grid">
          {filtered.map(s => (
            <div key={s.name} className="sup-card">
              <div className="sup-card-top">
                <div className="sup-logo" style={{ background: s.logoColor }}>
                  {s.logoText}
                </div>
                <div className="sup-card-meta">
                  <span className={`sup-badge sup-badge-${s.badge}`}>
                    {s.badge === 'featured' ? 'Featured' : 'Premium'}
                  </span>
                  <div className="sup-country">
                    <IconLocation /> {s.country}
                  </div>
                </div>
              </div>
              <div className="sup-card-name">{s.name}</div>
              <p className="sup-card-desc">{s.description}</p>
              <div className="sup-card-categories">
                {s.categories.map(cat => (
                  <span key={cat} className="sup-cat-chip">{cat}</span>
                ))}
              </div>
              <button className="sup-card-cta">Contact Supplier <IconArrow /></button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="sup-empty">
            <p>No suppliers match the selected filters.</p>
            <button className="sup-pill active" onClick={() => { setCountryFilter(ALL); setCategoryFilter(ALL) }}>Clear Filters</button>
          </div>
        )}

        {/* Get listed CTA */}
        <div className="sup-get-listed">
          <div className="sup-get-listed-inner">
            <div>
              <div className="sup-get-listed-title">Are you a supplier?</div>
              <div className="sup-get-listed-sub">Join the CX8 verified supplier network and connect with engineers worldwide.</div>
            </div>
            <a href="mailto:contact@cx8technologies.com" className="sup-cta sup-cta-outline">
              <IconMail /> Get Listed
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
