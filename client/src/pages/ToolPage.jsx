import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { findTool } from '../lib/tools.js'

const Breadcrumb = () => (
  <Link to="/" className="breadcrumb">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    All tools
  </Link>
)

const fmtSize = b => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
}

function renderMarkdown(text) {
  const lines = text.split('\n')
  const out = []
  let listItems = []

  const flushList = () => {
    if (listItems.length) {
      out.push(<ul key={`ul-${out.length}`}>{listItems}</ul>)
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      flushList()
      out.push(<h3 key={i}>{line.replace(/^#{2,3} /, '')}</h3>)
    } else if (/^[-–]\s/.test(line)) {
      listItems.push(<li key={i}><span>{parseBold(line.replace(/^[-–]\s/, ''))}</span></li>)
    } else if (!line.trim()) {
      flushList()
    } else if (/^\*\*.*\*\*$/.test(line.trim())) {
      // Entire line is bold — treat as subheading
      flushList()
      out.push(<h4 key={i}>{line.replace(/\*\*/g, '')}</h4>)
    } else {
      flushList()
      out.push(<p key={i}>{parseBold(line)}</p>)
    }
  })
  flushList()
  return out
}

const IMAGE_FORMATS = ['webp', 'jpg', 'png', 'avif', 'gif']

function wordCount(text) {
  return text.trim().split(/\s+/).length
}

function TextResult({ text, downloadName, downloadMime = 'text/plain', resetLabel = 'Start over', onReset }) {
  const [copied, setCopied] = useState(false)
  const rendered = useMemo(() => renderMarkdown(text), [text])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: downloadMime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadName
    a.click()
    URL.revokeObjectURL(url)
  }, [text, downloadName, downloadMime])

  const ext = downloadName?.split('.').pop().toUpperCase() || 'TXT'

  return (
    <div className="summary-box">
      <div className="summary-meta">
        <span>{wordCount(text)} words</span>
        <div className="summary-actions">
          <button className="summary-btn" onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Copy
              </>
            )}
          </button>
          <button className="summary-btn" onClick={handleDownload}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Download .{ext.toLowerCase()}
          </button>
        </div>
      </div>
      {rendered}
      <button className="btn-primary" style={{ marginTop: 24 }} onClick={onReset}>
        {resetLabel}
      </button>
    </div>
  )
}

export default function ToolPage() {
  const { slug } = useParams()
  const tool = findTool(slug)
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [imageFormat, setImageFormat] = useState('webp')
  const [pageRange, setPageRange] = useState('')
  const [resizeWidth, setResizeWidth] = useState('')
  const [resizeHeight, setResizeHeight] = useState('')
  const [question, setQuestion] = useState('')

  const pageTitle = tool ? `${tool.name} — PDF Deck` : 'PDF Deck'
  const pageDesc = tool ? tool.desc : 'Free PDF and file tools.'
  const pageUrl = tool ? `https://pdfdeck.app/${tool.slug}` : 'https://pdfdeck.app'

  if (!tool) {
    return (
      <main className="tool-page container">
        <Breadcrumb />
        <h1>Page not found</h1>
        <p className="tool-sub">That page doesn't exist. <Link to="/" style={{ color: 'var(--brand)' }}>Browse all tools</Link></p>
      </main>
    )
  }

  if (tool.pro) {
    return (
      <main className="tool-page container">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={pageUrl} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDesc} />
          <meta property="og:url" content={pageUrl} />
        </Helmet>
        <Breadcrumb />
        <div className="pro-gate">
          <div className="pro-gate-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="6" y="12" width="16" height="13" rx="2.5" stroke="var(--brand)" strokeWidth="1.8"/>
              <path d="M9 12V9a5 5 0 0110 0v3" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="pro-gate-label">Pro feature</span>
          <h1>{tool.name}</h1>
          <p className="tool-sub">{tool.desc}</p>
          {tool.comingSoon && <p className="coming-soon-note">This tool is also still in development.</p>}
          <Link to="/pricing" className="btn-primary" style={{ textDecoration: 'none' }}>
            Upgrade to Pro
          </Link>
          <Link to="/" className="btn-ghost">Browse free tools</Link>
        </div>
      </main>
    )
  }

  const addFiles = list => {
    const incoming = Array.from(list)
    setFiles(tool.multi ? [...files, ...incoming] : incoming.slice(0, 1))
    setStatus('idle')
    setResult(null)
    setError('')
  }

  const run = async () => {
    if (!files.length) return
    setStatus('working')
    setProgress(0)
    setError('')

    const tick = setInterval(() => setProgress(p => Math.min(p + Math.random() * 18, 90)), 350)

    try {
      const body = new FormData()
      files.forEach(f => body.append('files', f))
      if (slug === 'image-converter') body.append('targetFormat', imageFormat)
      if (slug === 'split-pdf' && pageRange.trim()) body.append('pageRange', pageRange.trim())
      if (slug === 'chat-with-pdf') body.append('question', question.trim())
      if (slug === 'resize-image') {
        if (resizeWidth)  body.append('width', resizeWidth)
        if (resizeHeight) body.append('height', resizeHeight)
      }

      const res = await fetch(`/api/tools/${slug}`, { method: 'POST', body })
      clearInterval(tick)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Processing failed (${res.status})`)
      }

      const data = await res.json()
      setProgress(100)
      setResult(data)
      setStatus('done')
    } catch (err) {
      clearInterval(tick)
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <main className="tool-page container">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>
      <Breadcrumb />
      <h1>{tool.name}</h1>
      <p className="tool-sub">{tool.desc}</p>

      <div
        className={`dropzone ${drag ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
        role="button"
        tabIndex={0}
        aria-label={`Add file for ${tool.name}`}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        <div className="dz-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#E55100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#E55100" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3>{tool.multi ? 'Add files' : 'Choose a file'}</h3>
        <p>Drag and drop, or click to browse</p>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={tool.accept}
          multiple={!!tool.multi}
          onChange={e => addFiles(e.target.files)}
        />
      </div>

      {slug === 'chat-with-pdf' && (
        <div className="page-range-wrap">
          <label htmlFor="pdf-question">Your question</label>
          <textarea
            id="pdf-question"
            className="page-range-input"
            rows={3}
            placeholder="What is the main conclusion of this report?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            style={{ resize: 'vertical', minHeight: 72 }}
          />
        </div>
      )}

      {slug === 'split-pdf' && (
        <div className="page-range-wrap">
          <label htmlFor="page-range">Pages to extract</label>
          <input
            id="page-range"
            className="page-range-input"
            type="text"
            placeholder="e.g. 1-3, 5, 8-10"
            value={pageRange}
            onChange={e => setPageRange(e.target.value)}
          />
          <span className="page-range-hint">Required. e.g. 1-3 extracts pages 1 to 3. Use commas for non-consecutive pages: 1, 4, 7-9</span>
        </div>
      )}

      {slug === 'resize-image' && (
        <div className="page-range-wrap">
          <label>Dimensions (px)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input className="page-range-input" type="number" placeholder="Width" min="1"
              value={resizeWidth} onChange={e => setResizeWidth(e.target.value)} style={{ width: 100 }} />
            <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}>×</span>
            <input className="page-range-input" type="number" placeholder="Height" min="1"
              value={resizeHeight} onChange={e => setResizeHeight(e.target.value)} style={{ width: 100 }} />
          </div>
          <span className="page-range-hint">Leave one blank to scale proportionally</span>
        </div>
      )}

      {slug === 'image-converter' && (
        <div className="format-selector">
          <span>Convert to</span>
          {IMAGE_FORMATS.map(fmt => (
            <button
              key={fmt}
              className={`fmt-btn ${imageFormat === fmt ? 'active' : ''}`}
              onClick={() => setImageFormat(fmt)}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          {files.map((f, i) => (
            <div className="file-row" key={i}>
              <span>{f.name}</span>
              <div className="f-row-right">
                <span className="f-size">{fmtSize(f.size)}</span>
                <button
                  className="f-remove"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => {
                    setFiles(files.filter((_, j) => j !== i))
                    setStatus('idle')
                    setResult(null)
                    setError('')
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'working' && (
        <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {status === 'error' && (
        <p style={{ color: 'var(--red)', margin: '20px 0', fontSize: 14 }}>
          {error}
        </p>
      )}

      {status === 'done' && result?.downloadUrl && (
        <div className="result-card">
          <div className="result-success">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="10" stroke="var(--green)" strokeWidth="1.5"/>
              <path d="M7 11.5l2.5 2.5 5.5-5.5" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Your file is ready
          </div>
          <a className="btn-primary" href={result.downloadUrl} download>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8M5 7l3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12.5v.5a1 1 0 001 1h10a1 1 0 001-1v-.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Download result
          </a>
          <button className="btn-ghost" onClick={() => { setStatus('idle'); setResult(null); setFiles([]) }}>
            Convert another file
          </button>
        </div>
      )}

      {status === 'done' && result?.summary && (
        <TextResult
          text={result.summary}
          downloadName={files[0] ? `summary-${files[0].name.replace(/\.pdf$/i, '')}.txt` : 'summary.txt'}
          resetLabel="Summarize another"
          onReset={() => { setStatus('idle'); setResult(null); setFiles([]) }}
        />
      )}

      {status === 'done' && result?.answer && (
        <TextResult
          text={result.answer}
          downloadName="answer.txt"
          resetLabel="Ask another question"
          onReset={() => { setStatus('idle'); setResult(null); setQuestion('') }}
        />
      )}

      {status === 'done' && result?.csv && (
        <TextResult
          text={result.csv}
          downloadName={files[0] ? `${files[0].name.replace(/\.pdf$/i, '')}-data.csv` : 'extracted-data.csv'}
          downloadMime="text/csv"
          resetLabel="Extract from another"
          onReset={() => { setStatus('idle'); setResult(null); setFiles([]) }}
        />
      )}

      {status === 'done' && result?.text && (
        <TextResult
          text={result.text}
          downloadName={files[0] ? `${files[0].name.replace(/\.[^.]+$/, '')}-text.txt` : 'ocr-output.txt'}
          resetLabel="Extract from another"
          onReset={() => { setStatus('idle'); setResult(null); setFiles([]) }}
        />
      )}

      {status !== 'done' && (
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" onClick={run} disabled={!files.length || status === 'working' || (slug === 'chat-with-pdf' && !question.trim())}>
            {status === 'working' ? 'Working…' : tool.name}
          </button>
        </div>
      )}
    </main>
  )
}
