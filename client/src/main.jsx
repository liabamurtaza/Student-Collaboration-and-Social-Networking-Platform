import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const APPEARANCE_KEY = 'studentnet-settings-appearance'

const readPreferredTheme = () => {
  try {
    const saved = localStorage.getItem(APPEARANCE_KEY)
    if (!saved) return 'system'
    const parsed = JSON.parse(saved)
    return parsed?.theme || 'system'
  } catch {
    return 'system'
  }
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-studentnet-theme', theme)
}

const initTheme = () => {
  const theme = readPreferredTheme()
  applyTheme(theme)

  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
    }
  }

  window.addEventListener('storage', (event) => {
    if (event.key === APPEARANCE_KEY) {
      applyTheme(readPreferredTheme())
    }
  })
}

initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
