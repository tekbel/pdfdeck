import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import AuthShell from '../components/AuthShell.jsx'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const navTimer = useRef(null)
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    return () => clearTimeout(navTimer.current)
  }, [])

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when user arrives via reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleReset(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password })
      if (updateErr) { setError(updateErr.message); return }
      setDone(true)
      navTimer.current = setTimeout(() => navigate('/'), 2500)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthShell title="Password updated" centered>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px' }}>
          <circle cx="24" cy="24" r="23" stroke="var(--green)" strokeWidth="2"/>
          <path d="M14 24.5l7 7 13-14" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1>Password updated</h1>
        <p className="auth-sub">You're signed in. Redirecting you now…</p>
      </AuthShell>
    )
  }

  if (!ready) {
    return (
      <AuthShell title="Reset password" centered>
        <p className="auth-sub">Verifying your reset link…</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Set new password">
      <h1>Set a new password</h1>
      <p className="auth-sub">Choose a strong password for your account.</p>
      <form onSubmit={handleReset} className="auth-form">
        <div className="auth-field">
          <label htmlFor="password">New password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters" required minLength={8} autoFocus autoComplete="new-password" />
        </div>
        <div className="auth-field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat your password" required autoComplete="new-password" />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  )
}
