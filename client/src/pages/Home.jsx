import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DECKS, ALL_TOOLS, toolHref } from '../lib/tools.js'
import { ToolIcon } from '../lib/icons.jsx'

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3L5 7v8c0 5.5 4.5 9.5 9 10 4.5-.5 9-4.5 9-10V7L14 3z" stroke="#E55100" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M10 14l3 3 5-5" stroke="#E55100" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Private by design',
    desc: 'Files are processed in memory and deleted immediately. Nothing is ever stored on disk.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="10" height="13" rx="2" stroke="#E55100" strokeWidth="1.6"/>
        <rect x="15" y="6" width="10" height="13" rx="2" stroke="#E55100" strokeWidth="1.6"/>
        <path d="M8 22h12" stroke="#E55100" strokeWidth="1.6" strokeLinecap="round"/>
        <text x="6" y="16" fill="#E55100" fontSize="5" fontWeight="800" fontFamily="system-ui">PDF</text>
        <text x="17.5" y="16" fill="#E55100" fontSize="4.5" fontWeight="800" fontFamily="system-ui">DOCX</text>
      </svg>
    ),
    title: 'Every format',
    desc: 'PDF, Word, Excel, JPG, PNG, WebP, HEIC, AVIF. Convert between any of them.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4L7 8v6c0 4.5 3 7.5 7 8 4-0.5 7-3.5 7-8V8L14 4z" stroke="#0D7377" strokeWidth="1.6" strokeLinejoin="round" fill="#0D737710"/>
        <path d="M11 14.5l2 2 4-4.5" stroke="#0D7377" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="8" r="4" fill="#0D7377" opacity="0.15" stroke="#0D7377" strokeWidth="1.2"/>
        <path d="M19 7.5l1 1.5 2-2" stroke="#0D7377" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI powered',
    desc: 'Summarize, chat, extract data, and run OCR on any PDF using built-in AI tools.',
  },
]

function ToolCard({ tool, isPro }) {
  return (
    <Link to={toolHref(tool)} className="tool-card">
      <div className="tc-icon">
        <ToolIcon slug={tool.slug} />
      </div>
      <div className="tc-body">
        <div className="tc-title-row">
          <h3>{tool.name}</h3>
          {tool.pro && !isPro && (
            <svg className="pro-lock" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-label="Pro feature">
              <rect x="2.5" y="5.5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
          {tool.pro && isPro && (
            <svg className="pro-lock" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-label="Pro unlocked" style={{ color: 'var(--green)' }}>
              <rect x="2.5" y="5.5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 5.5V4a2 2 0 014 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="6 2"/>
            </svg>
          )}
        </div>
        <p>{tool.desc}</p>
      </div>
    </Link>
  )
}

export default function Home() {
  const mainRef = useRef()
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    fetch('/api/pro/status')
      .then(r => r.json())
      .then(d => setIsPro(d.pro === true))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    let ctx
    let lenis
    let tickerCb
    let gsapRef

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]).then(([{ default: gsap }, { default: ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return
      gsapRef = gsap
      gsap.registerPlugin(ScrollTrigger)
      lenis = new Lenis()
      lenis.on('scroll', ScrollTrigger.update)
      tickerCb = time => lenis.raf(time * 1000)
      gsap.ticker.add(tickerCb)
      gsap.ticker.lagSmoothing(0)

      ctx = gsap.context(() => {
        gsap.from('.hero-h1', { y: 22, opacity: 0, duration: 0.75, ease: 'power3.out', delay: 0.05 })
        gsap.from('.hero-sub', { y: 16, opacity: 0, duration: 0.65, ease: 'power3.out', delay: 0.22 })
        gsap.from('.trust-row', { y: 12, opacity: 0, duration: 0.55, ease: 'power3.out', delay: 0.36 })

        gsap.utils.toArray('.deck-header').forEach(el => {
          gsap.from(el, { y: 14, opacity: 0, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
        })

        gsap.utils.toArray('.tool-grid').forEach(grid => {
          gsap.from(grid.querySelectorAll('.tool-card'), {
            y: 18, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: grid, start: 'top 90%' },
          })
        })

        gsap.from('.feature-strip .feature-item', {
          y: 16, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.feature-strip', start: 'top 88%' },
        })
      }, mainRef)
    })

    return () => {
      cancelled = true
      ctx?.revert()
      if (tickerCb) gsapRef?.ticker.remove(tickerCb)
      lenis?.destroy()
    }
  }, [])

  return (
    <main ref={mainRef}>
      <Helmet>
        <title>PDFDeck | Every PDF and file tool, one place</title>
        <meta name="description" content="Convert, compress, merge, split, and understand your files in seconds. 16 free PDF and image tools. No account needed. Files deleted immediately after processing." />
        <link rel="canonical" href="https://pdfdeck.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PDFDeck | Every PDF and file tool, one place" />
        <meta property="og:description" content="Convert, compress, merge, split, and understand your files in seconds. 16 free PDF and image tools. No account needed. Files deleted immediately after processing." />
        <meta property="og:url" content="https://pdfdeck.app/" />
        <meta property="og:image" content="https://pdfdeck.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDFDeck | Every PDF and file tool, one place" />
        <meta name="twitter:description" content="Convert, compress, merge, split, and understand your files in seconds. 16 free PDF and image tools. No account needed." />
        <meta name="twitter:image" content="https://pdfdeck.app/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'PDFDeck',
          url: 'https://pdfdeck.app',
          description: 'Free PDF and file tools. Convert, compress, merge, split, and understand documents online. No account required.',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'PDFDeck',
          url: 'https://pdfdeck.app',
          logo: 'https://pdfdeck.app/og-image.png',
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />
        <div className="container hero-content">
          <h1 className="hero-h1">
            Convert, compress, merge. <em>All here.</em>
          </h1>
          <p className="hero-sub">
            Free PDF and image tools that work instantly in your browser. No account, no watermarks.
          </p>
          <div className="trust-row">
            <span>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3.5" y="7.5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5.5 7.5V5.5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Encrypted in transit
            </span>
            <span>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2L3 4.5V9c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Never stored
            </span>
            <span>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M9 2L5 9h4L7 14l7-8H10L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Fast processing
            </span>
            <span>{ALL_TOOLS.length} free tools</span>
          </div>
        </div>
      </section>

      {/* ── Tool decks ── */}
      {DECKS.map(deck => (
        <section key={deck.id} id={deck.id} className={`deck-section container deck-${deck.id}`}>
          <div className="deck-header">
            <h2>
              <span className="deck-label-chip">
                <span className="deck-chip-dot" aria-hidden="true" />
                {deck.name}
              </span>
            </h2>
            <span className="deck-count">{deck.tools.length} tools</span>
          </div>
          <div className="tool-grid">
            {deck.tools.map(tool => <ToolCard key={tool.slug} tool={tool} isPro={isPro} />)}
          </div>
        </section>
      ))}

      {/* ── Feature strip ── */}
      <section className="feature-strip container">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-item">
            <div className="feature-icon">{f.icon}</div>
            <div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
