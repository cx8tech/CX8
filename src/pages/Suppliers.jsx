import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { suppliers, regionColors, getInitials, ALL, REGIONS, CATEGORIES } from '../data/suppliers'

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
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconExternalLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export default function Suppliers() {
  const [searchParams] = useSearchParams()
  const [regionFilter, setRegionFilter] = useState(() => {
    const r = searchParams.get('region')
    return REGIONS.includes(r) ? r : ALL
  })
  const [categoryFilter, setCategoryFilter] = useState(() => {
    const c = searchParams.get('category')
    return CATEGORIES.includes(c) ? c : ALL
  })
  const [query, setQuery] = useState(() => searchParams.get('q') || '')

  const filtered = suppliers.filter(s => {
    const matchRegion = regionFilter === ALL || s.region === regionFilter
    const matchCategory = categoryFilter === ALL || s.category === categoryFilter
    const q = query.toLowerCase()
    const matchQuery = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.region.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    return matchRegion && matchCategory && matchQuery
  })

  return (
    <div className="sup-page">
      <div className="sup-header">
        <div className="sup-header-inner">
          <div className="sup-eyebrow">Supplier Directory</div>
          <h1 className="sup-title">Connect with Verified Suppliers</h1>
          <p className="sup-sub">CX8 Technologies partners with trusted, vendor-neutral suppliers worldwide. All listed suppliers are verified by our engineering team.</p>
          <a href="/forms/supplier-listing.html" className="sup-cta">
            <IconMail /> Get Your Company Listed
          </a>
        </div>
      </div>

      <div className="sup-body">
        <div className="page-search-bar">
          <IconSearch />
          <input
            className="page-search-input"
            placeholder="Search suppliers by name, country, region, or category..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="sup-dropdowns-bar">
          <div className="sup-dropdown-group">
            <label className="sup-dropdown-label" htmlFor="sup-region">Region</label>
            <select
              id="sup-region"
              className="sup-dropdown"
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
            >
              {REGIONS.map(r => <option key={r} value={r}>{r === ALL ? 'All Regions' : r}</option>)}
            </select>
          </div>
          <div className="sup-dropdown-group">
            <label className="sup-dropdown-label" htmlFor="sup-category">Category</label>
            <select
              id="sup-category"
              className="sup-dropdown"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c === ALL ? 'All Categories' : c}</option>)}
            </select>
          </div>
          {(regionFilter !== ALL || categoryFilter !== ALL) && (
            <button className="sup-clear-btn" onClick={() => { setRegionFilter(ALL); setCategoryFilter(ALL) }}>
              Clear filters
            </button>
          )}
        </div>

        <div className="sup-count">{filtered.length} supplier{filtered.length !== 1 ? 's' : ''} found</div>

        <div className="sup-grid">
          {filtered.map(s => {
            const color = regionColors[s.region] || '#1a3060'
            const initials = getInitials(s.name)
            return (
              <a
                key={s.name + s.country}
                href={s.website}
                target="_blank"
                rel="noopener noreferrer"
                className="sup-card sup-card-link"
              >
                <div className="sup-card-top">
                  <div className="sup-logo" style={{ background: color }}>{initials}</div>
                  <div className="sup-card-meta">
                    <span
                      className="sup-badge"
                      style={{ background: color + '22', color: color, border: `1px solid ${color}44` }}
                    >{s.region}</span>
                    <div className="sup-country">
                      <IconLocation /> {s.country}
                    </div>
                  </div>
                </div>
                <div className="sup-card-name">{s.name}</div>
                <div className="sup-card-categories">
                  <span className="sup-cat-chip">{s.category}</span>
                </div>
                <div className="sup-card-website">
                  <span>{s.website.replace(/^https?:\/\//, '')}</span>
                  <IconExternalLink />
                </div>
              </a>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="sup-empty">
            <p>No suppliers match the selected filters.</p>
            <button className="sup-pill active" onClick={() => { setRegionFilter(ALL); setCategoryFilter(ALL); setQuery('') }}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
