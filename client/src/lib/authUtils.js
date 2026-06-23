export async function syncAndNavigate(token, next, navigate) {
  await fetch('/api/auth/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  navigate(`/${next.replace(/^\//, '')}`)
}
