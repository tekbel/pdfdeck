import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import ToolPage from './pages/ToolPage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function ToolPageKeyed() {
  const { slug } = useParams()
  return <ToolPage key={slug} />
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<ToolPageKeyed />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
