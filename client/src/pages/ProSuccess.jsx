import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function ProSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { setStatus('error'); return }

    fetch('/api/stripe/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => setStatus(data.ok ? 'ok' : 'error'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
      <Helmet><title>Welcome to Pro | PDF Deck</title></Helmet>

      {status === 'verifying' && (
        <p style={{ color: 'var(--muted)' }}>Activating your Pro access…</p>
      )}

      {status === 'ok' && (
        <>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{ marginBottom: 24 }}>
            <circle cx="28" cy="28" r="27" stroke="var(--green)" strokeWidth="2"/>
            <path d="M17 28.5l8 8 14-16" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 12 }}>You're now Pro.</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
            All AI tools and unlimited conversions are unlocked. Start using them now.
          </p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            Go to tools
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Something went wrong.</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
            Your payment was processed but we could not activate Pro. Email us at support@pdfdeck.app and we'll sort it out.
          </p>
          <Link to="/pricing" className="btn-outline" style={{ textDecoration: 'none' }}>
            Back to pricing
          </Link>
        </>
      )}
    </main>
  )
}
