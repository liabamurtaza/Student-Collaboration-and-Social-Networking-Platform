import { useEffect, useMemo, useState } from 'react'
import SettingsLayout from './SettingsLayout'
import api from '../../api'

const STORAGE_KEY = 'studentnet-settings-privacy'

const defaultPrivacy = {
  profileVisible: true,
  allowMessages: true,
  showOnlineStatus: true,
  searchableByEmail: false
}

const readPrivacy = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultPrivacy, ...JSON.parse(saved) } : defaultPrivacy
  } catch {
    return defaultPrivacy
  }
}

const PrivacySettings = () => {
  const [settings, setSettings] = useState(readPrivacy)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [serverReady, setServerReady] = useState(false)

  const currentUserId = useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1])).userId || null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

    if (!currentUserId) {
      setSaved(true)
      const timeout = window.setTimeout(() => setSaved(false), 1200)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [settings, currentUserId])

  useEffect(() => {
    if (!currentUserId) {
      setServerReady(true)
      return undefined
    }

    let active = true

    const loadPrivacy = async () => {
      try {
        const res = await api.get(`/users/${currentUserId}`)
        if (!active) return
        setSettings((prev) => ({
          ...prev,
          profileVisible: res.data.profileVisible ?? true,
          searchableByEmail: res.data.searchableByEmail ?? false
        }))
      } catch {
        if (active) {
          setSaveError('Unable to load privacy settings.')
        }
      } finally {
        if (active) {
          setServerReady(true)
        }
      }
    }

    loadPrivacy()

    return () => {
      active = false
    }
  }, [currentUserId])

  useEffect(() => {
    if (!currentUserId || !serverReady) return undefined

    let active = true
    let timeoutId

    const savePrivacy = async () => {
      try {
        setSaveError('')
        await api.put(`/users/${currentUserId}`, {
          profileVisible: settings.profileVisible,
          searchableByEmail: settings.searchableByEmail
        })

        if (!active) return
        setSaved(true)
        timeoutId = window.setTimeout(() => {
          if (active) setSaved(false)
        }, 1200)
      } catch {
        if (active) {
          setSaveError('Unable to save privacy settings.')
        }
      }
    }

    savePrivacy()

    return () => {
      active = false
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [currentUserId, serverReady, settings.profileVisible, settings.searchableByEmail])

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
      title="Privacy"
      description="Set the boundaries that make sense for a campus-facing social network."
    >
      <style>{`
        .ps-toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding-top:12px; border-top:1px solid #dce8c0; }
        .ps-toggle-row:first-of-type { border-top:0; padding-top:0; }
        .ps-toggle-copy { display:grid; gap:4px; }
        .ps-toggle-copy span { color:#5a7a3a; font-size:0.88rem; font-weight:600; line-height:1.5; }
        .ps-switch { width:46px; height:28px; border-radius:999px; border:2px solid #b5cc7a; background:#dce8c0; position:relative; cursor:pointer; flex-shrink:0; }
        .ps-switch::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.15s ease; }
        .ps-switch.is-on { background:#43a047; border-color:#1a4a1a; }
        .ps-switch.is-on::after { transform: translateX(18px); }
        .ps-status { margin:0; color:#1a4a1a; font-weight:800; font-size:0.85rem; }
        .ps-error { margin:0; color:#b42318; font-weight:800; font-size:0.85rem; }
      `}</style>

      <div style={s.card}>
        <h3 style={s.cardTitle}>Privacy controls</h3>
        {saved && <p className="ps-status">Saved</p>}
        {saveError && <p className="ps-error">{saveError}</p>}

        <div className="ps-toggle-row">
          <div className="ps-toggle-copy">
            <strong style={s.rowKey}>Public profile</strong>
            <span>Allow other users to open and view your profile page.</span>
          </div>
          <button
            type="button"
            className={`ps-switch ${settings.profileVisible ? 'is-on' : ''}`}
            aria-pressed={settings.profileVisible}
            onClick={() => toggleSetting('profileVisible')}
          />
        </div>

        <div className="ps-toggle-row">
          <div className="ps-toggle-copy">
            <strong style={s.rowKey}>Direct messages</strong>
            <span>Let classmates start private conversations with you.</span>
          </div>
          <button
            type="button"
            className={`ps-switch ${settings.allowMessages ? 'is-on' : ''}`}
            aria-pressed={settings.allowMessages}
            onClick={() => toggleSetting('allowMessages')}
          />
        </div>

        <div className="ps-toggle-row">
          <div className="ps-toggle-copy">
            <strong style={s.rowKey}>Online status</strong>
            <span>Show when you are active in the app.</span>
          </div>
          <button
            type="button"
            className={`ps-switch ${settings.showOnlineStatus ? 'is-on' : ''}`}
            aria-pressed={settings.showOnlineStatus}
            onClick={() => toggleSetting('showOnlineStatus')}
          />
        </div>

        <div className="ps-toggle-row">
          <div className="ps-toggle-copy">
            <strong style={s.rowKey}>Searchable by email</strong>
            <span>Let people discover you using the email address on your account.</span>
          </div>
          <button
            type="button"
            className={`ps-switch ${settings.searchableByEmail ? 'is-on' : ''}`}
            aria-pressed={settings.searchableByEmail}
            onClick={() => toggleSetting('searchableByEmail')}
          />
        </div>
      </div>
    </SettingsLayout>
  )
}

export default PrivacySettings