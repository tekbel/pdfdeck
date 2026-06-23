import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import toolsRouter from './routes/tools.js'
import { stripeRouter, isProUser } from './routes/stripe.js'
import { sitemapRouter } from './routes/sitemap.js'
import { getUserFromRequest, upsertUser, verifyToken } from './lib/auth.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))

// Webhook must receive raw body — register before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use(cookieParser())
app.use(express.json())
app.use('/api/tools', toolsRouter)
app.use('/api/stripe', stripeRouter)
app.use('/', sitemapRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'pdfdeck' }))

app.get('/api/pro/status', async (req, res) => {
  const user = await getUserFromRequest(req)
  if (user) return res.json({ pro: user.is_pro === true })
  res.json({ pro: isProUser(req) })
})

// Called from client immediately after Supabase sign-in/sign-up
app.post('/api/auth/sync', async (req, res) => {
  const supabaseUser = await verifyToken(req)
  if (!supabaseUser) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const row = await upsertUser(supabaseUser)
    res.json({ ok: true, is_pro: row.is_pro })
  } catch (err) {
    console.error('Auth sync error:', err.message)
    res.status(500).json({ error: 'Could not sync user' })
  }
})

export default app
