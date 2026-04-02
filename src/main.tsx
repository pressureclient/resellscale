import { StrictMode, Component, ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PreferencesProvider } from './contexts/PreferencesContext'

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    // Auto-reload on Vite chunk loading errors following a redeployment
    if (/Importing a module script failed|Failed to fetch dynamically imported module/i.test(error?.message)) {
      window.location.reload()
    }
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Crashed!</h1>
          <p style={{ marginTop: '10px', fontSize: '18px' }}>{this.state.error?.toString()}</p>
          <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: '#fecaca', padding: '10px', overflowX: 'auto' }}>
            {this.state.error?.stack}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#ef4444', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

import { PreferencesProvider } from './contexts/PreferencesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </ErrorBoundary>
  </StrictMode>,
)
