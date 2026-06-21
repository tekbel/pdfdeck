import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DECKS, ALL_TOOLS, toolHref } from '../lib/tools.js'
import { ToolIcon } from '../lib/icons.jsx'

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-mockup">
        {/* Browser shell */}
        <rect width="420" height="340" rx="14" fill="white" stroke="#E8E6E1" strokeWidth="1.5"/>
        {/* Title bar */}
        <rect width="420" height="40" rx="14" fill="#F5F4F2"/>
        <rect y="26" width="420" height="14" fill="#F5F4F2"/>
        {/* Traffic lights */}
        <circle cx="22" cy="20" r="5.5" fill="#FFBDAD"/>
        <circle cx="40" cy="20" r="5.5" fill="#FFD6C8"/>
        <circle cx="58" cy="20" r="5.5" fill="#E0DED9"/>
        {/* URL bar */}
        <rect x="82" y="11" width="256" height="18" rx="9" fill="white" stroke="#E0DED9" strokeWidth="1"/>
        <text x="210" y="24" textAnchor="middle" fill="#AAA" fontSize="9" fontFamily="system-ui, sans-serif">pdfdeck.app/compress-pdf</text>

        {/* Page title */}
        <text x="210" y="72" textAnchor="middle" fill="#111" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">Compress PDF</text>
        <text x="210" y="90" textAnchor="middle" fill="#888" fontSize="11" fontFamily="system-ui, sans-serif">Shrink file size without visible quality loss</text>

        {/* Upload zone */}
        <rect x="28" y="104" width="364" height="126" rx="10" fill="#FEF9F7" stroke="#E55100" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.55"/>

        {/* PDF document */}
        <rect x="170" y="116" width="52" height="66" rx="5" fill="#FFD0BE"/>
        <path d="M170 128 L182 116" stroke="none"/>
        <path d="M182 116 L182 128 L170 128" fill="#FFB49A"/>
        <rect x="170" y="116" width="52" height="66" rx="5" fill="none" stroke="#E55100" strokeWidth="1.5"/>
        <text x="196" y="157" textAnchor="middle" fill="#E55100" fontSize="10" fontWeight="800" fontFamily="system-ui, sans-serif">PDF</text>

        {/* Upload hint */}
        <text x="210" y="198" textAnchor="middle" fill="#BBB" fontSize="10.5" fontFamily="system-ui, sans-serif">Drop file or click to upload</text>

        {/* Result row */}
        <rect x="28" y="246" width="364" height="54" rx="8" fill="white" stroke="#E8E6E1" strokeWidth="1"/>
        {/* File info */}
        <rect x="44" y="259" width="30" height="28" rx="4" fill="#FFD0BE"/>
        <text x="59" y="278" textAnchor="middle" fill="#E55100" fontSize="7" fontWeight="800" fontFamily="system-ui, sans-serif">PDF</text>
        <text x="84" y="267" fill="#333" fontSize="10.5" fontWeight="600" fontFamily="system-ui, sans-serif">invoice.pdf</text>
        <text x="84" y="283" fill="#22C55E" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">2.4 MB  340 KB  saved 86%</text>
        {/* Download button */}
        <rect x="296" y="257" width="80" height="28" rx="6" fill="#E55100"/>
        <text x="336" y="275" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">Download</text>

        {/* Shadow/depth */}
        <rect x="12" y="332" width="396" height="6" rx="3" fill="#E55100" opacity="0.08"/>
      </svg>
    </div>
  )
}

function UploadIllustration() {
  return (
    <svg width="72" height="60" viewBox="0 0 72 60" fill="none" aria-hidden="true">
      <rect x="8" y="10" width="40" height="50" rx="5" fill="#FFD0BE"/>
      <path d="M8 22 L20 10" stroke="none"/>
      <path d="M20 10 L20 22 L8 22" fill="#FFB49A"/>
      <rect x="8" y="10" width="40" height="50" rx="5" fill="none" stroke="#E55100" strokeWidth="1.5"/>
      <path d="M18 38h20M18 45h13" stroke="#E55100" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M56 28 L56 10 M50 16 L56 10 L62 16" stroke="#E55100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ProcessIllustration() {
  return (
    <svg width="72" height="60" viewBox="0 0 72 60" fill="none" aria-hidden="true">
      <circle cx="36" cy="30" r="22" stroke="#FFD0BE" strokeWidth="10"/>
      <circle cx="36" cy="30" r="22" stroke="#E55100" strokeWidth="10" strokeDasharray="30 110" strokeLinecap="round"/>
      <path d="M32 22 L32 38 L46 30 Z" fill="#E55100"/>
    </svg>
  )
}

function DownloadIllustration() {
  return (
    <svg width="72" height="60" viewBox="0 0 72 60" fill="none" aria-hidden="true">
      <rect x="8" y="10" width="40" height="50" rx="5" fill="#FFD0BE"/>
      <path d="M8 22 L20 10" stroke="none"/>
      <path d="M20 10 L20 22 L8 22" fill="#FFB49A"/>
      <rect x="8" y="10" width="40" height="50" rx="5" fill="none" stroke="#E55100" strokeWidth="1.5"/>
      <path d="M18 38h20M18 45h13" stroke="#E55100" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <circle cx="54" cy="42" r="14" fill="#22C55E" opacity="0.15"/>
      <circle cx="54" cy="42" r="14" stroke="#22C55E" strokeWidth="1.5"/>
      <path d="M49 42 L54 47 L60 38" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

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

function ToolCard({ tool }) {
  return (
    <Link to={toolHref(tool)} className="tool-card">
      <div className="tc-icon">
        <ToolIcon slug={tool.slug} />
      </div>
      <div className="tc-body">
        <div className="tc-title-row">
          <h3>{tool.name}</h3>
          {tool.pro && (
            <svg className="pro-lock" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-label="Pro feature">
              <rect x="2.5" y="5.5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <p>{tool.desc}</p>
      </div>
    </Link>
  )
}

const STATS = [
  { num: ALL_TOOLS.length, suffix: '', label: 'free tools' },
  { num: 100, suffix: '%', label: 'files kept private' },
  { num: 3, suffix: '', label: 'file categories' },
]

const HOW_STEPS = [
  {
    n: '01',
    title: 'Drop your file',
    desc: 'Drag and drop or click to upload. PDF, image, Word. Any format accepted.',
    illustration: <UploadIllustration />,
  },
  {
    n: '02',
    title: 'Processed instantly',
    desc: 'Your file is processed instantly. Done in seconds, not minutes.',
    illustration: <ProcessIllustration />,
  },
  {
    n: '03',
    title: 'Download the result',
    desc: 'One click to save. Files are deleted the moment you close the tab.',
    illustration: <DownloadIllustration />,
  },
]

export default function Home() {
  const heroRef = useRef()
  const mainRef = useRef()

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
      // Hero: headline, sub, trust — sequential fade-up
      gsap.from('.hero-h1', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay: 0.05,
      })
      gsap.from('.hero-sub', {
        y: 18,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        delay: 0.28,
      })
      gsap.from('.trust-row', {
        y: 14,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay: 0.46,
      })

      // Stats counter
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target
        const suffix = el.dataset.suffix || ''
        const obj = { n: 0 }
        gsap.to(obj, {
          n: target,
          duration: 1.5,
          ease: 'power2.out',
          roundProps: 'n',
          onUpdate: () => { el.textContent = obj.n + suffix },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Deck headers
      gsap.utils.toArray('.deck-header').forEach(el => {
        gsap.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })

      // Tool cards — staggered per grid
      gsap.utils.toArray('.tool-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.tool-card'), {
          y: 24,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 86%' },
        })
      })

      // How-it-works steps
      gsap.from('.how-step', {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.how-grid', start: 'top 85%' },
      })

      gsap.from(['.how-eyebrow', '.how-title'], {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.how-section', start: 'top 85%' },
      })

      // CTA banner
      gsap.from('.cta-banner-inner', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-banner', start: 'top 88%' },
      })

      // Stat labels
      gsap.from('.stat-item', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.stats-section', start: 'top 88%' },
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
        <title>PDF Deck | Every PDF and file tool, one place</title>
        <link rel="canonical" href="https://pdfdeck.app/" />
      </Helmet>

      {/* ---- Hero ---- */}
      <section className="hero" ref={heroRef}>
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-left">
            <h1 className="hero-h1">
              Every file tool, <em>one place.</em>
            </h1>
            <p className="hero-sub">
              Convert, compress, merge and summarize your files in seconds. Free, no account needed.
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
          <HeroVisual />
        </div>
      </section>

      {/* ---- Stats ---- */}
      <section className="stats-section container">
        {STATS.map(s => (
          <div key={s.label} className="stat-item">
            <span
              className="stat-num"
              data-target={s.num}
              data-suffix={s.suffix}
            >
              {s.num}{s.suffix}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ---- Tool decks ---- */}
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
            {deck.tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      ))}

      {/* ---- Feature strip ---- */}
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

      {/* ---- How it works ---- */}
      <section className="how-section container">
        <p className="how-eyebrow">How it works</p>
        <h2 className="how-title">Three steps, every time.</h2>
        <div className="how-grid">
          {HOW_STEPS.map(step => (
            <div key={step.n} className="how-step">
              <div className="how-step-illustration">{step.illustration}</div>
              <span className="how-step-num">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA banner ---- */}
      <section className="cta-banner container">
        <div className="cta-banner-inner">
          <div className="cta-text">
            <h2>Start converting for free.</h2>
            <p>No account. No watermarks. No limits on basic tools.</p>
          </div>
          <a href="#pdf" className="btn-primary cta-banner-btn">Browse tools</a>
        </div>
      </section>

    </main>
  )
}
