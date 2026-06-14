import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const FEATURES_FREE = [
  '13 PDF and image tools',
  '3 conversions per day',
  'Files never stored',
  'Ad-supported',
]

const FEATURES_PRO = [
  'Unlimited conversions',
  'AI tools (summarize, chat, extract)',
  'Ad-free experience',
  'Priority processing',
  'Early access to new tools',
]

function CheckIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5"/>
      <path d="M5 8.5l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Pricing() {
  useEffect(() => { document.title = 'Pricing — PDF Deck' }, [])

  return (
    <main className="pricing-page container">
      <div className="pricing-hero">
        <h1>Plans & Pricing</h1>
        <p className="tool-sub">Start for free. Upgrade when you need more.</p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-card-header">
            <h2>Free</h2>
            <div className="pricing-amount"><span className="pricing-price">$0</span><span className="pricing-period">/month</span></div>
            <p className="pricing-desc">Everything you need for everyday file tasks.</p>
          </div>
          <ul className="pricing-features">
            {FEATURES_FREE.map(f => (
              <li key={f}><CheckIcon color="var(--green)" />{f}</li>
            ))}
          </ul>
          <Link to="/" className="btn-outline" style={{ textDecoration: 'none' }}>Get started free</Link>
        </div>

        <div className="pricing-card pricing-card-pro">
          <div className="pricing-card-header">
            <div className="pricing-pro-badge">Pro</div>
            <h2>Pro</h2>
            <div className="pricing-amount"><span className="pricing-price">$8</span><span className="pricing-period">/month</span></div>
            <p className="pricing-desc">Unlimited access for power users and teams.</p>
          </div>
          <ul className="pricing-features">
            <li className="pricing-includes">Everything in Free, plus:</li>
            {FEATURES_PRO.map(f => (
              <li key={f}><CheckIcon color="var(--brand)" />{f}</li>
            ))}
          </ul>
          <button className="btn-primary" disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}>
            Coming soon
          </button>
        </div>
      </div>
    </main>
  )
}
