import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { DECKS, ALL_TOOLS, toolHref } from '../lib/tools.js'
import { ToolIcon } from '../lib/icons.jsx'

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
    desc: 'Drag and drop or click to upload. PDF, image, Word — any format accepted.',
  },
  {
    n: '02',
    title: 'Processed instantly',
    desc: 'Your file is processed instantly. Done in seconds, not minutes.',
  },
  {
    n: '03',
    title: 'Download the result',
    desc: 'One click to save. Files are gone from our servers the moment you close the tab.',
  },
]

export default function Home() {
  const heroRef = useRef()
  const mainRef = useRef()


  useEffect(() => {
    const ctx = gsap.context(() => {
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

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef}>
      <Helmet>
        <title>PDF Deck — Every PDF and file tool, one place</title>
        <link rel="canonical" href="https://pdfdeck.app/" />
      </Helmet>

      {/* ---- Hero ---- */}
      <section className="hero" ref={heroRef}>
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />
        <div className="container hero-content">
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

      {/* ---- How it works ---- */}
      <section className="how-section container">
        <p className="how-eyebrow">How it works</p>
        <h2 className="how-title">Three steps, every time.</h2>
        <div className="how-grid">
          {HOW_STEPS.map(step => (
            <div key={step.n} className="how-step">
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
