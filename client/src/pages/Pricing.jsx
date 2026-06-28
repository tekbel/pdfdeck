import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase, getProStatus } from '../lib/supabase.js'

const FEATURES_FREE = [
  '12 PDF and image tools',
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

function ManageButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleManage = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authHeader = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <button className="btn-primary" onClick={handleManage} disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Redirecting…' : 'Manage subscription'}
      </button>
      {error && <p className="waitlist-error">{error}</p>}
    </div>
  )
}

function UpgradeButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || ''

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: window.location.origin, next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <button className="btn-primary" onClick={handleUpgrade} disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Redirecting…' : 'Upgrade to Pro'}
      </button>
      {error && <p className="waitlist-error">{error}</p>}
    </div>
  )
}

export default function Pricing() {
  const [isPro, setIsPro] = useState(null)

  useEffect(() => {
    getProStatus().then(setIsPro).catch(() => setIsPro(false))
  }, [])

  return (
    <main className="pricing-page container">
      <Helmet>
        <title>Pricing | PDF Deck</title>
        <meta name="description" content="PDF Deck is free to start. 10 conversions per day, no account required. Upgrade to Pro for unlimited access and AI tools." />
        <link rel="canonical" href="https://pdfdeck.app/pricing" />
        <meta property="og:title" content="Pricing | PDF Deck" />
        <meta property="og:url" content="https://pdfdeck.app/pricing" />
      </Helmet>
      <div className="pricing-hero">
        <h1>Plans & Pricing</h1>
        <p className="tool-sub">Start for free. Upgrade when you need more.</p>
      </div>

      <div className="pricing-grid">
        <div className={`pricing-card${isPro === false ? ' pricing-card--current' : ''}`}>
          <div className="pricing-card-header">
            {isPro === false && <span className="current-plan-badge">Current plan</span>}
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
          {isPro !== false && (
            <Link to="/" className="btn-outline" style={{ textDecoration: 'none' }}>Get started free</Link>
          )}
        </div>

        <div className={`pricing-card pricing-card-pro${isPro ? ' pricing-card--current' : ''}`}>
          <div className="pricing-card-header">
            {isPro && <span className="current-plan-badge current-plan-badge--pro">Current plan</span>}
            <h2>Pro</h2>
            <div className="pricing-amount">
              <span className="pricing-price">$6</span>
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
          {isPro ? <ManageButton /> : <UpgradeButton />}
        </div>
      </div>
    </main>
  )
}
