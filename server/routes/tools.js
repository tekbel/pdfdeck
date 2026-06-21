import { Router } from 'express'
import multer from 'multer'
import { isProUser } from './stripe.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
})

// ---- Rate limiting (per-IP, in-memory; swap for Supabase in production) ----
const usage = new Map()
const FREE_DAILY_LIMIT = 10

function rateLimit(req, res, next) {
  const key = req.ip + ':' + new Date().toISOString().slice(0, 10)
  const count = (usage.get(key) || 0) + 1
  usage.set(key, count)
  if (count > FREE_DAILY_LIMIT)
    return res.status(429).json({ error: `Free limit is ${FREE_DAILY_LIMIT} jobs per day. Sign in for more.` })
  next()
}

// ---- CloudConvert helpers ----
function ccHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
}

async function uploadToTask(task, file) {
  const form = new FormData()
  Object.entries(task.result.form.parameters).forEach(([k, v]) => form.append(k, v))
  form.append('file', new Blob([file.buffer]), file.originalname)
  await fetch(task.result.form.url, { method: 'POST', body: form })
}

async function createJob(tasks, apiKey) {
  const res = await fetch('https://api.cloudconvert.com/v2/jobs', {
    method: 'POST',
    headers: ccHeaders(apiKey),
    body: JSON.stringify({ tasks }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error('[cloudconvert] create job failed', res.status, body)
    throw new Error('Conversion service unavailable')
  }
  return res.json()
}

async function pollJob(jobId, apiKey) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const res = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    const state = await res.json()
    if (state.data.status === 'finished') {
      const exportTask = state.data.tasks.find(t => t.name === 'export-file')
      return { downloadUrl: exportTask.result.files[0].url }
    }
    if (state.data.status === 'error') throw new Error('Conversion failed')
  }
  throw new Error('Conversion timed out')
}

// ---- Tool implementations ----

const CC_CONVERT = {
  'pdf-to-word':  { to: 'docx' },
  'word-to-pdf':  { to: 'pdf' },
  'pdf-to-jpg':   { to: 'jpg' },
  'pdf-to-excel': { to: 'xlsx' },
}

async function convertFile(slug, files) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')
  const { to } = CC_CONVERT[slug]
  const { data } = await createJob({
    'import-file':  { operation: 'import/upload' },
    'convert-file': { operation: 'convert', input: 'import-file', output_format: to },
    'export-file':  { operation: 'export/url', input: 'convert-file' },
  }, apiKey)
  await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
  return pollJob(data.id, apiKey)
}

async function compressPdf(files) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')
  const { data } = await createJob({
    'import-file':   { operation: 'import/upload' },
    'optimize-file': { operation: 'optimize', input: 'import-file', input_format: 'pdf', output_format: 'pdf' },
    'export-file':   { operation: 'export/url', input: 'optimize-file' },
  }, apiKey)
  await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
  return pollJob(data.id, apiKey)
}

async function mergePdf(files) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')
  const importNames = files.map((_, i) => `import-${i}`)
  const tasks = {}
  importNames.forEach(name => { tasks[name] = { operation: 'import/upload' } })
  tasks['merge-task'] = { operation: 'merge', input: importNames, output_format: 'pdf' }
  tasks['export-file'] = { operation: 'export/url', input: 'merge-task' }
  const { data } = await createJob(tasks, apiKey)
  await Promise.all(files.map((file, i) =>
    uploadToTask(data.tasks.find(t => t.name === `import-${i}`), file)
  ))
  return pollJob(data.id, apiKey)
}

function imageExt(file) {
  const raw = file.originalname.split('.').pop().toLowerCase()
  return raw === 'jpeg' ? 'jpg' : raw || 'jpg'
}

async function compressImage(files) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')
  const ext = imageExt(files[0])
  const { data } = await createJob({
    'import-file':   { operation: 'import/upload' },
    'optimize-file': { operation: 'optimize', input: 'import-file', input_format: ext, output_format: ext },
    'export-file':   { operation: 'export/url', input: 'optimize-file' },
  }, apiKey)
  await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
  return pollJob(data.id, apiKey)
}

async function resizeImage(files, width, height) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')
  const ext = imageExt(files[0])
  const convertTask = {
    operation: 'convert',
    input: 'import-file',
    input_format: ext,
    output_format: ext,
    fit: 'max',
  }
  if (width)  convertTask.width  = parseInt(width)
  if (height) convertTask.height = parseInt(height)
  const { data } = await createJob({
    'import-file':  { operation: 'import/upload' },
    'convert-file': convertTask,
    'export-file':  { operation: 'export/url', input: 'convert-file' },
  }, apiKey)
  await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
  return pollJob(data.id, apiKey)
}

async function convertImage(files, targetFormat) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')
  const to = targetFormat || 'webp'
  const { data } = await createJob({
    'import-file':  { operation: 'import/upload' },
    'convert-file': { operation: 'convert', input: 'import-file', output_format: to },
    'export-file':  { operation: 'export/url', input: 'convert-file' },
  }, apiKey)
  await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
  return pollJob(data.id, apiKey)
}

async function splitPdf(files, pageRange) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')

  const convertTask = {
    operation: 'convert',
    input: 'import-file',
    input_format: 'pdf',
    output_format: 'pdf',
  }
  if (pageRange) convertTask.pages = pageRange

  const { data } = await createJob({
    'import-file':  { operation: 'import/upload' },
    'convert-file': convertTask,
    'export-file':  { operation: 'export/url', input: 'convert-file' },
  }, apiKey)
  await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
  return pollJob(data.id, apiKey)
}

async function multiImageToPdf(files) {
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) throw new Error('CLOUDCONVERT_API_KEY not configured')

  if (files.length === 1) {
    const { data } = await createJob({
      'import-file':  { operation: 'import/upload' },
      'convert-file': { operation: 'convert', input: 'import-file', output_format: 'pdf' },
      'export-file':  { operation: 'export/url', input: 'convert-file' },
    }, apiKey)
    await uploadToTask(data.tasks.find(t => t.name === 'import-file'), files[0])
    return pollJob(data.id, apiKey)
  }

  // Multiple images: convert each to PDF, then merge into one
  const tasks = {}
  files.forEach((_, i) => {
    tasks[`import-${i}`]  = { operation: 'import/upload' }
    tasks[`convert-${i}`] = { operation: 'convert', input: `import-${i}`, output_format: 'pdf' }
  })
  tasks['merge-task']  = { operation: 'merge', input: files.map((_, i) => `convert-${i}`), output_format: 'pdf' }
  tasks['export-file'] = { operation: 'export/url', input: 'merge-task' }

  const { data } = await createJob(tasks, apiKey)
  await Promise.all(files.map((file, i) =>
    uploadToTask(data.tasks.find(t => t.name === `import-${i}`), file)
  ))
  return pollJob(data.id, apiKey)
}

async function claudeChat(files, question) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')
  if (!question?.trim()) throw new Error('Please enter a question')
  const pdfBase64 = files[0].buffer.toString('base64')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
          { type: 'text', text: `Answer the following question based on the document above. Cite the relevant section or page if possible.\n\nQuestion: ${question.trim()}` },
        ],
      }],
    }),
  })
  if (!res.ok) throw new Error('AI service unavailable')
  const data = await res.json()
  return { answer: data.content.filter(b => b.type === 'text').map(b => b.text).join('\n') }
}

async function claudeExtract(files) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')
  const pdfBase64 = files[0].buffer.toString('base64')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
          { type: 'text', text: 'Extract all tables and structured data from this document and format them as CSV. Use comma separation and quote fields that contain commas. Include headers. If there are multiple tables, separate them with a blank line and a comment row like "# Table: [name]". Return only the CSV data, no explanation.' },
        ],
      }],
    }),
  })
  if (!res.ok) throw new Error('AI service unavailable')
  const data = await res.json()
  return { csv: data.content.filter(b => b.type === 'text').map(b => b.text).join('\n') }
}

async function claudeOcr(files) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')
  const pdfBase64 = files[0].buffer.toString('base64')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
          { type: 'text', text: 'Extract all text from this document exactly as it appears. Preserve the structure, headings, and paragraphs as best you can. Return only the extracted text, no commentary.' },
        ],
      }],
    }),
  })
  if (!res.ok) throw new Error('AI service unavailable')
  const data = await res.json()
  return { text: data.content.filter(b => b.type === 'text').map(b => b.text).join('\n') }
}

async function claudeSummarize(files) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')
  const pdfBase64 = files[0].buffer.toString('base64')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
          { type: 'text', text: 'Summarize this document. Lead with a 2-sentence overview, then list the key points. Be concrete and faithful to the document.' },
        ],
      }],
    }),
  })
  if (!res.ok) throw new Error('AI service unavailable')
  const data = await res.json()
  return { summary: data.content.filter(b => b.type === 'text').map(b => b.text).join('\n') }
}

// ---- Main dispatch ----
router.post('/:slug', rateLimit, upload.array('files', 20), async (req, res) => {
  const { slug } = req.params
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No file uploaded' })

    const PRO_SLUGS = ['summarize-pdf', 'chat-with-pdf', 'extract-data', 'ocr-pdf']
    if (PRO_SLUGS.includes(slug) && !isProUser(req))
      return res.status(403).json({ error: 'Pro subscription required.', pro: false })
    if (slug === 'summarize-pdf') return res.json(await claudeSummarize(req.files))
    if (slug === 'chat-with-pdf') return res.json(await claudeChat(req.files, req.body.question))
    if (slug === 'extract-data')  return res.json(await claudeExtract(req.files))
    if (slug === 'ocr-pdf')       return res.json(await claudeOcr(req.files))
    if (slug === 'compress-pdf')  return res.json(await compressPdf(req.files))
    if (slug === 'merge-pdf') {
      if (req.files.length < 2) return res.status(400).json({ error: 'Upload at least 2 PDFs to merge' })
      return res.json(await mergePdf(req.files))
    }
    if (slug === 'split-pdf') {
      if (!req.body.pageRange?.trim()) return res.status(400).json({ error: 'Enter a page range, e.g. 1-3 or 5, 8-10' })
      return res.json(await splitPdf(req.files, req.body.pageRange))
    }
    if (slug === 'jpg-to-pdf' || slug === 'image-to-pdf') return res.json(await multiImageToPdf(req.files))
    if (slug === 'compress-image')  return res.json(await compressImage(req.files))
    if (slug === 'resize-image')    return res.json(await resizeImage(req.files, req.body.width, req.body.height))
    if (slug === 'image-converter') return res.json(await convertImage(req.files, req.body.targetFormat))
    if (CC_CONVERT[slug]) return res.json(await convertFile(slug, req.files))

    return res.status(501).json({ error: `${slug} is coming soon` })
  } catch (err) {
    console.error(`[${slug}]`, err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
