import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function fetchWithAuth(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const authHeader = session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {}
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: { ...authHeader, ...options.headers },
  })
}

export async function getProStatus() {
  const res = await fetchWithAuth('/api/pro/status')
  const data = await res.json()
  return !!data.pro
}
