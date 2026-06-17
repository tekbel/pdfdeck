import express from 'express'
import helmet from 'helmet'
import toolsRouter from './routes/tools.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json())
app.use('/api/tools', toolsRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'pdfdeck' }))

export default app
