import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => { document.title = 'Page not found — PDF Deck' }, [])

  return (
    <main className="tool-page container" style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 72, fontWeight: 800, color: 'var(--border)', lineHeight: 1, marginBottom: 16 }}>404</p>
      <h1 style={{ marginBottom: 12 }}>Page not found</h1>
      <p className="tool-sub">That page doesn't exist.</p>
      <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Back to all tools</Link>
    </main>
  )
}
