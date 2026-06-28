import { Link } from 'react-router-dom'
import { DECKS, toolHref } from '../lib/tools.js'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <Logo size={22} />
            PDF Deck
          </div>
          <p className="footer-tagline">Fast PDF and image tools, right in your browser. No account, no limits.</p>
        </div>

        {DECKS.map(deck => (
          <div key={deck.id} className="footer-tool-col">
            <h4 className="footer-col-label" style={{ color: deck.color }}>{deck.name}</h4>
            <ul className="footer-tool-list">
              {deck.tools.map(tool => (
                <li key={tool.slug}>
                  <Link to={toolHref(tool)}>{tool.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-tool-col">
          <h4 className="footer-col-label">Company</h4>
          <ul className="footer-tool-list">
            <li><Link to="/pricing">Pricing</Link></li>
            <li><a href="mailto:hello@pdfdeck.app">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="container footer-copy">
        <span>© 2026 PDF Deck. Files processed in memory and never stored on our servers.</span>
        <span>Built by <a href="https://addisstack.com" target="_blank" rel="noopener noreferrer" className="footer-addisstack">AddisStack</a></span>
      </div>
    </footer>
  )
}
