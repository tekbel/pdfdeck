import { useState, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { DECKS, toolHref } from '../lib/tools.js'
import { ToolIcon } from '../lib/icons.jsx'
import Logo from './Logo.jsx'

const QUICK_LINKS = [
  { label: 'Compress', slug: 'compress-pdf' },
  { label: 'Convert',  slug: 'pdf-to-word' },
  { label: 'Merge',    slug: 'merge-pdf' },
  { label: 'AI Tools', slug: 'summarize-pdf' },
]

function MegaMenu({ onNavigate, onEnter, onLeave }) {
  return (
    <div className="mega-menu" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="mega-menu-inner container">
        {DECKS.map((deck, i) => (
          <div key={deck.id} className={`mega-col${i < DECKS.length - 1 ? ' mega-col--divider' : ''}`}>
            <span className="mega-col-label" style={{ color: deck.color }}>
              <span className="mega-col-dot" style={{ background: deck.color }} />
              {deck.name}
            </span>
            <div className="mega-col-tools">
              {deck.tools.map(tool => (
                <Link
                  key={tool.slug}
                  to={toolHref(tool)}
                  className="mega-tool-item"
                  onClick={onNavigate}
                >
                  <div className="mega-tool-icon" style={{ background: deck.color }}>
                    <ToolIcon slug={tool.slug} />
                  </div>
                  <span className="mega-tool-name">{tool.name}</span>
                  {tool.pro && (
                    <span className="mega-pro-tag">Pro</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileMenu({ open, onClose }) {
  if (!open) return null
  return (
    <div className="mobile-menu">
      {DECKS.map(deck => (
        <div key={deck.id} className="mobile-deck">
          <span className="mobile-deck-label" style={{ color: deck.color }}>
            {deck.name}
          </span>
          <div className="mobile-deck-grid">
            {deck.tools.map(tool => (
              <Link key={tool.slug} to={toolHref(tool)} className="mobile-tool-item" onClick={onClose}>
                <div className="nav-di-icon" style={{ background: deck.color }}>
                  <ToolIcon slug={tool.slug} />
                </div>
                <span>{tool.name}</span>
                {tool.pro && (
                  <svg className="pro-lock" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-label="Pro feature">
                    <rect x="2.5" y="5.5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div className="mobile-footer">
        <Link to="/pricing" className="nav-plain-link" onClick={onClose}>Pricing</Link>
        <Link to="/pricing" className="nav-cta" onClick={onClose}>Get started</Link>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeTimer = useRef(null)

  const open  = () => { clearTimeout(closeTimer.current); setMegaOpen(true) }
  const close = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 180) }
  const handleNavigate = () => { setMegaOpen(false); setMenuOpen(false) }

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-brand" onClick={handleNavigate}>
            <Logo />
            PDF Deck
          </Link>

          <div className="nav-left">
            <div className="nav-dropdown-wrap" onMouseEnter={open} onMouseLeave={close}>
              <button className="nav-link-btn nav-all-tools" aria-expanded={megaOpen} aria-haspopup="true">
                All Tools
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                  style={{ transform: megaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="nav-quick-links">
              {QUICK_LINKS.map(({ label, slug }) => (
                <NavLink key={slug} to={`/${slug}`} className="nav-quick-link" onClick={handleNavigate}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="nav-right">
            <NavLink to="/pricing" className="nav-plain-link">Pricing</NavLink>
            <Link to="/pricing" className="nav-cta">Get started</Link>
          </div>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {megaOpen && (
        <MegaMenu onNavigate={handleNavigate} onEnter={open} onLeave={close} />
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
