import express from 'express'
import helmet from 'helmet'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import toolsRouter from './routes/tools.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })
const app = express()
const PORT = process.env.PORT || 3001

app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json())

// API
app.use('/api/tools', toolsRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'filedeck' }))

// Serve built client in production (Railway runs this single service)
const clientDist = path.join(__dirname, '../client/dist')
app.use(express.static(clientDist))
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))

app.listen(PORT, () => console.log(`FileDeck server on :${PORT}`))
