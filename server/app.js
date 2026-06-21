import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import toolsRouter from './routes/tools.js'
import { stripeRouter, isProUser } from './routes/stripe.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))

// Webhook must receive raw body — register before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use(cookieParser())
app.use(express.json())
app.use('/api/tools', toolsRouter)
app.use('/api/stripe', stripeRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'pdfdeck' }))
app.get('/api/pro/status', (req, res) => res.json({ pro: isProUser(req) }))

export default app
