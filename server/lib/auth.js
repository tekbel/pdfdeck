import { getSupabaseAdmin } from './supabase.js'

export async function verifyToken(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token)
  return (error || !user) ? null : user
}

export async function getUserFromRequest(req) {
  const user = await verifyToken(req)
  if (!user) return null

  const { data } = await getSupabaseAdmin()
    .from('pdf_users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data ?? null
}

export async function upsertUser(supabaseUser) {
  const { data, error } = await getSupabaseAdmin()
    .from('pdf_users')
    .upsert(
      { id: supabaseUser.id, email: supabaseUser.email },
      { onConflict: 'id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) throw error
  return data
}
