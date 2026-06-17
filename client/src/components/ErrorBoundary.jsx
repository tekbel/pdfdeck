import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Something went wrong.</p>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Try refreshing the page. If the problem persists, come back shortly.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )
    }
    return this.props.children
  }
}
