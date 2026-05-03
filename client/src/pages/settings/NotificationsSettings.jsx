import { useEffect, useState } from 'react'
import SettingsLayout from './SettingsLayout'

const STORAGE_KEY = 'studentnet-settings-notifications'

const defaultNotifications = {
  directMessages: true,
  mentions: true,
  weeklyDigest: false,
  browserAlerts: true
}

const readNotifications = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultNotifications, ...JSON.parse(saved) } : defaultNotifications
  } catch {
    return defaultNotifications
  }
}

const NotificationsSettings = () => {
  const [settings, setSettings] = useState(readNotifications)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
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
      title="Notifications"
      description="Control how noisy the app should be when people message, mention, or interact with you."
    >
      <style>{`
        .ns-toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding-top:12px; border-top:1px solid #dce8c0; }
        .ns-toggle-row:first-of-type { border-top:0; padding-top:0; }
        .ns-toggle-copy { display:grid; gap:4px; }
        .ns-toggle-copy span { color:#5a7a3a; font-size:0.88rem; font-weight:600; line-height:1.5; }
        .ns-switch { width:46px; height:28px; border-radius:999px; border:2px solid #b5cc7a; background:#dce8c0; position:relative; cursor:pointer; flex-shrink:0; }
        .ns-switch::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.15s ease; }
        .ns-switch.is-on { background:#43a047; border-color:#1a4a1a; }
        .ns-switch.is-on::after { transform: translateX(18px); }
        .ns-status { margin:0; color:#1a4a1a; font-weight:800; font-size:0.85rem; }
      `}</style>

      <div style={s.card}>
        <h3 style={s.cardTitle}>Notification controls</h3>

        <div className="ns-toggle-row">
          <div className="ns-toggle-copy">
            <strong style={s.rowKey}>Direct messages</strong>
            <span>Show alerts when someone starts or updates a conversation with you.</span>
          </div>
          <button
            type="button"
            className={`ns-switch ${settings.directMessages ? 'is-on' : ''}`}
            aria-pressed={settings.directMessages}
            onClick={() => toggleSetting('directMessages')}
          />
        </div>

        <div className="ns-toggle-row">
          <div className="ns-toggle-copy">
            <strong style={s.rowKey}>Mentions</strong>
            <span>Get notified when classmates mention your name in posts or comments.</span>
          </div>
          <button
            type="button"
            className={`ns-switch ${settings.mentions ? 'is-on' : ''}`}
            aria-pressed={settings.mentions}
            onClick={() => toggleSetting('mentions')}
          />
        </div>

        <div className="ns-toggle-row">
          <div className="ns-toggle-copy">
            <strong style={s.rowKey}>Weekly digest</strong>
            <span>Receive a summary of activity instead of every single event.</span>
          </div>
          <button
            type="button"
            className={`ns-switch ${settings.weeklyDigest ? 'is-on' : ''}`}
            aria-pressed={settings.weeklyDigest}
            onClick={() => toggleSetting('weeklyDigest')}
          />
        </div>

        <div className="ns-toggle-row">
          <div className="ns-toggle-copy">
            <strong style={s.rowKey}>Browser alerts</strong>
            <span>Keep desktop/browser notifications enabled for live collaboration.</span>
          </div>
          <button
            type="button"
            className={`ns-switch ${settings.browserAlerts ? 'is-on' : ''}`}
            aria-pressed={settings.browserAlerts}
            onClick={() => toggleSetting('browserAlerts')}
          />
        </div>
      </div>
    </SettingsLayout>
  )
}

export default NotificationsSettings