import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DECKS } from '../lib/tools.js'
import { ToolIcon } from '../lib/icons.jsx'

const Logo = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="8" y="3" width="18" height="22" rx="3" fill="#FFD0BE" />
    <rect x="5" y="6" width="18" height="22" rx="3" fill="#FFB49A" />
    <rect x="2" y="9" width="18" height="22" rx="3" fill="#E55100" />
    <path d="M6 17h10M6 21h7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const DECK_COLORS = { pdf: '#C0392B', image: '#1A5FBF', ai: '#0D7377' }

function NavDropdown({ deck, onNavigate }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)
  const color = DECK_COLORS[deck.id]

  const handleEnter = () => { clearTimeout(closeTimer.current); setOpen(true) }
  const handleLeave = () => { closeTimer.current = setTimeout(() => setOpen(false), 120) }

  return (
    <div className="nav-dropdown-wrap" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="nav-link-btn" aria-expanded={open}>
        {deck.name.replace(' Deck', '')}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="nav-dropdown">
          <div className="nav-dropdown-inner">
            {deck.tools.map(tool => (
              <Link key={tool.slug} to={`/${tool.slug}`} className="nav-dropdown-item"
                onClick={() => { setOpen(false); onNavigate?.() }}>
                <div className="nav-di-icon" style={{ background: color }}>
                  <ToolIcon slug={tool.slug} />
                </div>
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ open, onClose }) {
  if (!open) return null
  return (
    <div className="mobile-menu">
      {DECKS.map(deck => (
        <div key={deck.id} className="mobile-deck">
          <span className="mobile-deck-label" style={{ color: DECK_COLORS[deck.id] }}>
            {deck.name.replace(' Deck', '')}
          </span>
          <div className="mobile-deck-grid">
            {deck.tools.map(tool => (
              <Link key={tool.slug} to={`/${tool.slug}`} className="mobile-tool-item" onClick={onClose}>
                <div className="nav-di-icon" style={{ background: DECK_COLORS[deck.id] }}>
                  <ToolIcon slug={tool.slug} />
                </div>
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div className="mobile-footer">
        <a href="/pricing" className="nav-plain-link" onClick={onClose}>Pricing</a>
        <button className="nav-cta" onClick={onClose}>Sign in</button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
            <Logo />
            PDF Deck
          </Link>
          <div className="nav-left">
            {DECKS.map(deck => <NavDropdown key={deck.id} deck={deck} />)}
          </div>
          <div className="nav-right">
            <a href="/pricing" className="nav-plain-link">Pricing</a>
            <button className="nav-cta">Sign in</button>
          </div>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
