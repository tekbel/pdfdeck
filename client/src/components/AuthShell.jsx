import { Helmet } from 'react-helmet-async'
import Logo from './Logo.jsx'

export default function AuthShell({ title, children, centered = false }) {
  return (
    <main className="auth-page">
      <Helmet><title>{title} | PDFDeck</title></Helmet>
      <div className="auth-card" style={centered ? { textAlign: 'center' } : undefined}>
        <div className="auth-logo" style={centered ? { justifyContent: 'center' } : undefined}>
          <Logo />
        </div>
        {children}
      </div>
    </main>
  )
}
