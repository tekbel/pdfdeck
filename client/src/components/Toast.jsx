import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'

const ToastCtx = createContext(null)
let uid = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback(id => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts(t => t.map(x => x.id === id ? { ...x, out: true } : x))
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 280)
  }, [])

  const add = useCallback((msg, type) => {
    const id = ++uid
    setToasts(t => [...t, { id, msg, type, out: false }])
    timers.current[id] = setTimeout(() => dismiss(id), type === 'success' ? 3000 : 5000)
  }, [dismiss])

  const toast = useMemo(() => ({
    error:   msg => add(msg, 'error'),
    success: msg => add(msg, 'success'),
  }), [add])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {createPortal(
        <div className="toast-stack" aria-live="polite" aria-atomic="false">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast--${t.type}${t.out ? ' toast--out' : ''}`} role="alert">
              <span className="toast-icon" aria-hidden="true">
                {t.type === 'error' ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="toast-msg">{t.msg}</span>
              <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
