import { useEffect, useState } from 'react'
import SettingsLayout from './SettingsLayout'

const STORAGE_KEY = 'studentnet-settings-appearance'

const defaultAppearance = {
  theme: 'system',
  compactConversations: false,
  reduceMotion: false
}

const readAppearance = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultAppearance, ...JSON.parse(saved) } : defaultAppearance
  } catch {
    return defaultAppearance
  }
}

const applyThemeHint = (theme) => {
  document.documentElement.setAttribute('data-studentnet-theme', theme)
}

const AppearanceSettings = () => {
  const [settings, setSettings] = useState(readAppearance)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applyThemeHint(settings.theme)
    setSaved(true)

    const timeout = window.setTimeout(() => setSaved(false), 1200)
    return () => window.clearTimeout(timeout)
  }, [settings])

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const s = {
    card: {
      background: '#f9faf4', borderRadius: 18, border: '2px solid #dce8c0',
      borderTop: '5px solid #43a047', padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16,
    },
    cardIcon: { fontSize: '1.6rem' },
    cardTitle: {
      fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900,
      fontSize: '1.05rem', color: '#1a4a1a', margin: 0,
    },
    rowFirst: { display: 'grid', gap: 4 },
    row: { display: 'grid', gap: 4, paddingTop: 10, borderTop: '1px solid #dce8c0' },
    rowKey:  { fontWeight: 700, fontSize: '0.85rem', color: '#1a4a1a' },
    rowVal:  { color: '#5a7a3a', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5 },
    linkRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 },
    link:    {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      color: '#1a4a1a', textDecoration: 'none',
      fontWeight: 800, fontSize: '0.85rem', fontFamily: "'Nunito', sans-serif",
    },
  }

  return (
    <SettingsLayout
      title="Appearance"
      description="Make the interface easier to scan and more comfortable to use during long study sessions."
    >
      <style>{`
        .as-toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding-top:12px; border-top:1px solid #dce8c0; }
        .as-toggle-row:first-of-type { border-top:0; padding-top:0; }
        .as-toggle-copy { display:grid; gap:4px; }
        .as-toggle-copy span { color:#5a7a3a; font-size:0.88rem; font-weight:600; line-height:1.5; }
        .as-switch { width:46px; height:28px; border-radius:999px; border:2px solid #b5cc7a; background:#dce8c0; position:relative; cursor:pointer; flex-shrink:0; }
        .as-switch::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.15s ease; }
        .as-switch.is-on { background:#43a047; border-color:#1a4a1a; }
        .as-switch.is-on::after { transform: translateX(18px); }
        .as-select { width:100%; box-sizing:border-box; border-radius:10px; border:2px solid #dce8c0; padding:0.65rem 0.8rem; font:inherit; color:#1a4a1a; background:#fff; font-weight:700; }
        .as-status { margin:0; color:#1a4a1a; font-weight:800; font-size:0.85rem; }
      `}</style>

      <div style={s.card}>
        <h3 style={s.cardTitle}>Appearance controls</h3>

        <div style={s.rowFirst}>
          <label htmlFor="theme-select" style={s.rowKey}>Theme preference</label>
          <select
            id="theme-select"
            value={settings.theme}
            onChange={(event) => setSettings((prev) => ({ ...prev, theme: event.target.value }))}
            className="as-select"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="as-toggle-row">
          <div className="as-toggle-copy">
            <strong style={s.rowKey}>Compact conversations</strong>
            <span>Reduce message spacing so long threads fit more information on screen.</span>
          </div>
          <button
            type="button"
            className={`as-switch ${settings.compactConversations ? 'is-on' : ''}`}
            aria-pressed={settings.compactConversations}
            onClick={() => toggleSetting('compactConversations')}
          />
        </div>

        <div className="as-toggle-row">
          <div className="as-toggle-copy">
            <strong style={s.rowKey}>Reduce motion</strong>
            <span>Keep the interface calm by limiting animated transitions.</span>
          </div>
          <button
            type="button"
            className={`as-switch ${settings.reduceMotion ? 'is-on' : ''}`}
            aria-pressed={settings.reduceMotion}
            onClick={() => toggleSetting('reduceMotion')}
          />
        </div>
      </div>
    </SettingsLayout>
  )
}

export default AppearanceSettings