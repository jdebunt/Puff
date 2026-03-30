import { useState, useEffect } from 'react'

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  backButton: {
    backgroundColor: 'transparent',
    border: '2px solid #3A7D5B',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#8FBC8F',
    fontSize: '14px',
    cursor: 'pointer'
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    margin: 0
  },
  premiumStatusCard: {
    backgroundColor: '#2D5A3F',
    borderRadius: '12px',
    padding: '20px',
    border: '2px solid #FCD34D'
  },
  premiumStatusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  premiumStatusTitle: {
    color: '#FCD34D',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  premiumStatusSubtitle: {
    color: '#9CA3AF',
    fontSize: '14px',
    marginTop: '4px'
  },
  upgradeButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#FCD34D',
    color: '#1a2e25',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  settingItem: {
    backgroundColor: '#2D5A3F',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    color: '#f0f4f1',
    fontSize: '16px'
  },
  toggle: {
    width: '50px',
    height: '28px',
    backgroundColor: '#3A7D5B',
    borderRadius: '14px',
    position: 'relative',
    cursor: 'pointer'
  }
}

function Settings({ onBack, isPremium = false, onOpenPremium, onOpenCycle, onOpenPrivacy }) {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: true,
    cycleModeEnabled: false,
    theme: 'forest' // forest, ocean, sunset, midnight, cream
  })

  useEffect(() => {
    // Load settings from local storage
    const stored = localStorage.getItem('appSettings')
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] }
      localStorage.setItem('appSettings', JSON.stringify(newSettings))
      return newSettings
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>← Back</button>
        <h1 style={styles.title}>Settings</h1>
        <div style={{ width: 60 }} />
      </div>

      {/* Premium Status Card */}
      <div style={styles.premiumStatusCard}>
        <div style={styles.premiumStatusHeader}>
          <span style={{ fontSize: '24px' }}>{isPremium ? '⭐' : '🔒'}</span>
          <div>
            <div style={styles.premiumStatusTitle}>
              {isPremium ? 'Premium Member' : 'Free Plan'}
            </div>
            <div style={styles.premiumStatusSubtitle}>
              {isPremium ? 'Thank you for supporting Puff!' : 'Unlock all features'}
            </div>
          </div>
        </div>
        {!isPremium && (
          <button onClick={onOpenPremium} style={styles.upgradeButton}>
            Unlock Premium - $9.99
          </button>
        )}
      </div>

      <div style={styles.settingItem}>
        <span style={styles.label}>Notifications</span>
        <div
          onClick={() => toggleSetting('notificationsEnabled')}
          style={{
            ...styles.toggle,
            backgroundColor: settings.notificationsEnabled ? '#3A7D5B' : '#4A5568'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              left: settings.notificationsEnabled ? '22px' : '2px',
              transition: 'left 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Cycle Mode Toggle */}
      <div style={styles.settingItem}>
        <div>
          <span style={styles.label}>🌸 Cycle & Hormonal Health</span>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
            Phase-specific breathing recommendations
          </div>
        </div>
        <button
          onClick={onOpenCycle}
          style={{
            padding: '8px 16px',
            backgroundColor: '#8FBC8F',
            color: '#1a2e25',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {settings.cycleModeEnabled ? 'Manage' : 'Enable'}
        </button>
      </div>

      <div style={styles.settingItem}>
        <span style={styles.label}>Sound</span>
        <div
          onClick={() => toggleSetting('soundEnabled')}
          style={{
            ...styles.toggle,
            backgroundColor: settings.soundEnabled ? '#3A7D5B' : '#4A5568'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              left: settings.soundEnabled ? '22px' : '2px',
              transition: 'left 0.3s ease'
            }}
          />
        </div>
      </div>

      <div style={styles.settingItem}>
        <span style={styles.label}>Vibration</span>
        <div
          onClick={() => toggleSetting('vibrationEnabled')}
          style={{
            ...styles.toggle,
            backgroundColor: settings.vibrationEnabled ? '#3A7D5B' : '#4A5568'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              left: settings.vibrationEnabled ? '22px' : '2px',
              transition: 'left 0.3s ease'
            }}
          />
        </div>
      </div>

      <div style={styles.settingItem}>
        <span style={styles.label}>Dark Mode</span>
        <div
          onClick={() => toggleSetting('darkMode')}
          style={{
            ...styles.toggle,
            backgroundColor: settings.darkMode ? '#3A7D5B' : '#4A5568'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              left: settings.darkMode ? '22px' : '2px',
              transition: 'left 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Theme Selector */}
      <div style={{ ...styles.settingItem, flexDirection: 'column', alignItems: 'stretch' }}>
        <span style={{ ...styles.label, marginBottom: '12px' }}>🎨 Background Theme</span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'forest', name: 'Forest', color: '#1a2e25' },
            { id: 'ocean', name: 'Ocean', color: '#1a2d3a' },
            { id: 'sunset', name: 'Sunset', color: '#2d1a1a' },
            { id: 'midnight', name: 'Midnight', color: '#0f0f1a' },
            { id: 'cream', name: 'Cream', color: '#f5f0e8' }
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                setSettings(prev => ({ ...prev, theme: theme.id }))
                localStorage.setItem('appSettings', JSON.stringify({ ...settings, theme: theme.id }))
              }}
              style={{
                flex: 1,
                minWidth: '70px',
                padding: '12px 8px',
                backgroundColor: theme.color,
                border: settings.theme === theme.id ? '2px solid #8FBC8F' : '2px solid transparent',
                borderRadius: '8px',
                color: theme.id === 'cream' ? '#1a2e25' : '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Settings Link */}
      <div style={{ ...styles.settingItem, cursor: 'pointer' }} onClick={onOpenPrivacy}>
        <div style={{ flex: 1 }}>
          <span style={styles.label}>🔒 Privacy & Data</span>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
            Control your data & analytics
          </div>
        </div>
        <span style={{ color: '#8FBC8F', fontSize: '18px' }}>→</span>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('appSettings')
          window.location.reload()
        }}
        style={{
          alignSelf: 'center',
          padding: '12px 24px',
          backgroundColor: '#8FBC8F',
          border: 'none',
          borderRadius: '8px',
          color: '#1a2e25',
          fontWeight: 'bold'
        }}
      >
        Reset Settings
      </button>
    </div>
  )
}

export default Settings
