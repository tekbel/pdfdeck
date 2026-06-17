import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const FEATURES_FREE = [
  '13 PDF and image tools',
  '10 conversions per day',
  'Files never stored',
  'No account required',
]

const FEATURES_PRO = [
  'Unlimited conversions',
  'AI tools (summarize, chat, extract, OCR)',
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

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://formspree.io/f/xdavvpdo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="waitlist-success">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="8" stroke="var(--green)" strokeWidth="1.5"/>
          <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        You're on the list. We'll email you when Pro launches.
      </div>
    )
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <input
        className="waitlist-input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => { setEmail(e.target.value); setError('') }}
        autoComplete="email"
        disabled={loading}
      />
      <button type="submit" className="btn-primary waitlist-btn" disabled={loading}>
        {loading ? 'Joining…' : 'Join waitlist'}
      </button>
      {error && <p className="waitlist-error">{error}</p>}
    </form>
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
            <div className="pricing-amount">
              <span className="pricing-price">$0</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-desc">Everything you need for everyday file tasks.</p>
          </div>
          <ul className="pricing-features">
            {FEATURES_FREE.map(f => (
              <li key={f}><CheckIcon color="var(--green)" />{f}</li>
            ))}
          </ul>
          <Link to="/" className="btn-outline" style={{ textDecoration: 'none' }}>
            Get started free
          </Link>
        </div>

        <div className="pricing-card pricing-card-pro">
          <div className="pricing-card-header">
            <div className="pricing-pro-badge">Pro</div>
            <h2>Pro</h2>
            <div className="pricing-amount">
              <span className="pricing-price">$8</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-desc">Unlimited access plus AI tools for power users.</p>
          </div>
          <ul className="pricing-features">
            <li className="pricing-includes">Everything in Free, plus:</li>
            {FEATURES_PRO.map(f => (
              <li key={f}><CheckIcon color="var(--brand)" />{f}</li>
            ))}
          </ul>
          <p className="waitlist-label">Pro is launching soon. Join the waitlist to be first in line.</p>
          <WaitlistForm />
        </div>
      </div>
    </main>
  )
}
