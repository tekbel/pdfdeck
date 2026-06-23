import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import AuthShell from '../components/AuthShell.jsx'
import { syncAndNavigate } from '../lib/authUtils.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawNext = searchParams.get('next') || '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [screen, setScreen] = useState('signin') // 'signin' | 'forgot' | 'sent'

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : authError.message)
        return
      }
      await syncAndNavigate(data.session.access_token, next, navigate)
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetErr) { setError(resetErr.message); return }
      setScreen('sent')
    } finally {
      setLoading(false)
    }
  }

  if (screen === 'sent') {
    return (
      <AuthShell title="Check your email">
        <h1>Check your email</h1>
        <p className="auth-sub">We sent a reset link to <strong>{email}</strong>.</p>
        <button className="auth-link" onClick={() => setScreen('signin')}>Back to sign in</button>
      </AuthShell>
    )
  }

  if (screen === 'forgot') {
    return (
      <AuthShell title="Reset password">
        <h1>Reset your password</h1>
        <p className="auth-sub">Enter your email and we'll send a reset link.</p>
        <form onSubmit={handleForgot} className="auth-form">
          <div className="auth-field">
            <label htmlFor="forgot-email">Email</label>
            <input id="forgot-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required autoFocus />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <button className="auth-link" onClick={() => setScreen('signin')}>Back to sign in</button>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Sign in">
      <h1>Welcome back</h1>
      <p className="auth-sub">Sign in to your PDFDeck account.</p>
      <form onSubmit={handleSignIn} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required autoComplete="email" autoFocus />
        </div>
        <div className="auth-field">
          <div className="auth-field-header">
            <label htmlFor="password">Password</label>
            <button type="button" className="auth-link-sm" onClick={() => setScreen('forgot')}>
              Forgot password?
            </button>
          </div>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Your password" required autoComplete="current-password" />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="auth-footer">
        No account? <Link to={`/signup${next !== '/' ? `?next=${next}` : ''}`}>Sign up free</Link>
      </p>
    </AuthShell>
  )
}
