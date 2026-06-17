import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../app.js'

// Prevent real external calls
vi.stubGlobal('fetch', vi.fn())

const pdfBuffer = Buffer.from('%PDF-1.4 test')

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})

describe('Input validation', () => {
  it('returns 400 when no file is uploaded', async () => {
    const res = await request(app).post('/api/tools/compress-pdf')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/no file/i)
  })

  it('returns 400 for merge-pdf with only one file', async () => {
    const res = await request(app)
      .post('/api/tools/merge-pdf')
      .attach('files', pdfBuffer, 'a.pdf')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/at least 2/i)
  })

  it('returns 400 for split-pdf with no page range', async () => {
    const res = await request(app)
      .post('/api/tools/split-pdf')
      .attach('files', pdfBuffer, 'doc.pdf')
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/page range/i)
  })

  it('returns 501 for an unknown tool slug', async () => {
    const res = await request(app)
      .post('/api/tools/unknown-tool')
      .attach('files', pdfBuffer, 'doc.pdf')
    expect(res.status).toBe(501)
    expect(res.body.error).toMatch(/coming soon/i)
  })
})

describe('Rate limiting', () => {
  it('returns 429 after exceeding the daily limit', async () => {
    const ip = '1.2.3.4'
    let lastRes

    // Make FREE_DAILY_LIMIT + 1 requests
    for (let i = 0; i <= 10; i++) {
      lastRes = await request(app)
        .post('/api/tools/unknown-tool')
        .set('X-Forwarded-For', ip)
        .attach('files', pdfBuffer, 'doc.pdf')
    }

    expect(lastRes.status).toBe(429)
    expect(lastRes.body.error).toMatch(/limit/i)
  })
})
