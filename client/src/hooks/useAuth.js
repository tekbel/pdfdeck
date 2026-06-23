import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const getAuthHeader = useCallback(() => {
    if (!session) return {}
    return { Authorization: `Bearer ${session.access_token}` }
  }, [session])

  return {
    session,
    user,
    loading: session === undefined,
    isAuthenticated: !!session,
    logout,
    getAuthHeader,
  }
}
