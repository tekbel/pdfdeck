import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import AuthShell from '../components/AuthShell.jsx'
import { syncAndNavigate } from '../lib/authUtils.js'

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawNext = searchParams.get('next') || '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      })
      if (authError) { setError(authError.message); return }
      if (!data.user?.identities?.length) {
        setError('An account with this email already exists. Sign in instead.')
        return
      }
      if (data.session) {
        await syncAndNavigate(data.session.access_token, next, navigate)
      } else {
        setCheckEmail(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkEmail) {
    return (
      <AuthShell title="Check your email">
        <h1>Check your email</h1>
        <p className="auth-sub">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Back to sign in
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Create account">
      <h1>Create your account</h1>
      <p className="auth-sub">Free to get started. No credit card required.</p>
      <form onSubmit={handleSignUp} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required autoComplete="email" autoFocus />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to={`/login${next !== '/' ? `?next=${next}` : ''}`}>Sign in</Link>
      </p>
    </AuthShell>
  )
}
