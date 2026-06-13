import { Link } from 'react-router-dom'
import { DECKS, ALL_TOOLS } from '../lib/tools.js'
import { ToolIcon } from '../lib/icons.jsx'

function ToolCard({ tool }) {
  return (
    <Link to={`/${tool.slug}`} className="tool-card">
      {tool.ai && <span className="ai-badge">AI</span>}
      <div className="tc-icon">
        <ToolIcon slug={tool.slug} />
      </div>
      <div className="tc-body">
        <h3>{tool.name}</h3>
        <p>{tool.desc}</p>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <h1>Every PDF and file tool in one place.</h1>
        <p className="sub">
          PDF, image, and AI document tools. Free to use, no signup required.
        </p>
        <div className="trust-row">
          <span>🔒 Encrypted in transit</span>
          <span>🛡️ Never stored on our servers</span>
          <span>⚡ Seconds, not minutes</span>
          <span>{ALL_TOOLS.length} tools, free to start</span>
        </div>
      </section>

      {DECKS.map(deck => (
        <section key={deck.id} id={deck.id} className={`deck-section container deck-${deck.id}`}>
          <div className="deck-header">
            <h2>
              <span className="deck-dot" aria-hidden="true" />
              {deck.name}
            </h2>
            <span className="deck-count">{deck.tools.length} tools</span>
          </div>
          <div className="tool-grid">
            {deck.tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      ))}
    </main>
  )
}
