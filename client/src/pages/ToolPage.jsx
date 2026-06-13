import { useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { findTool } from '../lib/tools.js'

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
      listItems.push(<li key={i}>{parseBold(line.replace(/^[-–]\s/, ''))}</li>)
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

  if (!tool) {
    return (
      <main className="tool-page container">
        <h1>Tool not found</h1>
        <p className="tool-sub">That tool isn't in the deck yet. <Link to="/" style={{ color: 'var(--brand)' }}>Browse all tools</Link></p>
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
              <span className="f-size">{fmtSize(f.size)}</span>
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
          {error} — check the file and try again.
        </p>
      )}

      {status === 'done' && result?.downloadUrl && (
        <div style={{ textAlign: 'center', margin: '28px 0' }}>
          <a className="btn-primary" href={result.downloadUrl} download>
            Download result
          </a>
        </div>
      )}

      {status === 'done' && result?.summary && (
        <div className="summary-box">
          {renderMarkdown(result.summary)}
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => { setStatus('idle'); setResult(null); setFiles([]) }}>
            Summarize another
          </button>
        </div>
      )}

      {status !== 'done' && (
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" onClick={run} disabled={!files.length || status === 'working'}>
            {status === 'working' ? 'Working…' : tool.name}
          </button>
        </div>
      )}
    </main>
  )
}
