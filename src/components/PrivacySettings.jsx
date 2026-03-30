import { useState, useEffect } from 'react'
import { isAnalyticsEnabled, setAnalyticsEnabled } from '../utils/analytics'

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#1a2e25'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
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
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    margin: 0
  },
  section: {
    backgroundColor: '#2D5A3F',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '12px'
  },
  sectionText: {
    fontSize: '14px',
    color: '#9CA3AF',
    lineHeight: 1.6,
    marginBottom: '16px'
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '1px solid #3A7D5B'
  },
  toggleLabel: {
    fontSize: '16px',
    color: '#D1D5DB',
    flex: 1
  },
  toggleSublabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '4px'
  },
  toggle: (isActive) => ({
    width: '56px',
    height: '32px',
    backgroundColor: isActive ? '#8FBC8F' : '#4B5563',
    borderRadius: '16px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  }),
  toggleKnob: (isActive) => ({
    width: '28px',
    height: '28px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isActive ? '26px' : '2px',
    transition: 'left 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  }),
  dataCard: {
    backgroundColor: 'rgba(143, 188, 143, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px'
  },
  dataCardTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '8px'
  },
  dataCardText: {
    fontSize: '13px',
    color: '#D1D5DB',
    lineHeight: 1.6
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '12px 0'
  },
  listItem: {
    fontSize: '13px',
    color: '#9CA3AF',
    padding: '4px 0',
    paddingLeft: '20px',
    position: 'relative'
  },
  checkIcon: {
    color: '#8FBC8F',
    position: 'absolute',
    left: 0
  },
  warningBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '20px'
  },
  warningTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#FCD34D',
    marginBottom: '8px'
  },
  warningText: {
    fontSize: '13px',
    color: '#D1D5DB',
    lineHeight: 1.6
  },
  deleteButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#EF4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '16px'
  }
}

function PrivacySettings({ onBack }) {
  const [analyticsEnabled, setAnalyticsState] = useState(true)
  const [hasLocalData, setHasLocalData] = useState(false)

  useEffect(() => {
    setAnalyticsState(isAnalyticsEnabled())
    
    // Check if user has local data
    const hasCycle = localStorage.getItem('cycleData') !== null
    const hasMenopause = localStorage.getItem('menopauseData') !== null
    const hasSessions = localStorage.getItem('sessions') !== null
    setHasLocalData(hasCycle || hasMenopause || hasSessions)
  }, [])

  const handleAnalyticsToggle = () => {
    const newValue = !analyticsEnabled
    setAnalyticsState(newValue)
    setAnalyticsEnabled(newValue)
  }

  const handleDeleteAllData = () => {
    const confirmed = window.confirm(
      '⚠️ This will delete ALL your local data:\n\n' +
      '- Cycle tracking data\n' +
      '- Menopause data\n' +
      '- Session history\n' +
      '- Settings\n\n' +
      'This cannot be undone. Continue?'
    )
    
    if (confirmed) {
      localStorage.removeItem('cycleData')
      localStorage.removeItem('menopauseData')
      localStorage.removeItem('sessions')
      localStorage.removeItem('appSettings')
      localStorage.removeItem('onboardingComplete')
      window.location.reload()
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>← Back</button>
        <h1 style={styles.title}>Privacy & Data</h1>
        <div style={{ width: 60 }} />
      </div>

      {/* Privacy Promise */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🔒 Our Privacy Promise</h2>
        <p style={styles.sectionText}>
          Your health data is deeply personal. Here's exactly what we do and don't collect:
        </p>

        <div style={styles.dataCard}>
          <div style={styles.dataCardTitle}>✅ What STAYS on Your Device (100% Local)</div>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Cycle tracking data (period dates, cycle length)
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Menopause stage and symptoms
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Mood check-in responses
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Breathing session history
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Settings and preferences
            </li>
          </ul>
        </div>

        <div style={{ ...styles.dataCard, backgroundColor: 'rgba(75, 85, 99, 0.2)' }}>
          <div style={styles.dataCardTitle}>📊 What We MAY Collect (Anonymous, Optional)</div>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              App usage (opens, session starts/completions)
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Feature usage (which screens you visit)
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Program choices (which breathing sessions)
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Technical info (browser type, language)
            </li>
          </ul>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px' }}>
            <strong>Never:</strong> Your name, email, cycle data, symptoms, or any health information.
          </p>
        </div>
      </div>

      {/* Analytics Toggle */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Analytics & Tracking</h2>
        
        <div style={styles.toggleRow}>
          <div>
            <div style={styles.toggleLabel}>Help Improve Puff</div>
            <div style={styles.toggleSublabel}>
              Share anonymous usage data to help us improve
            </div>
          </div>
          <div
            onClick={handleAnalyticsToggle}
            style={styles.toggle(analyticsEnabled)}
          >
            <div style={styles.toggleKnob(analyticsEnabled)} />
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '16px' }}>
          {analyticsEnabled 
            ? '✅ Analytics enabled. You can disable this anytime.' 
            : '❌ Analytics disabled. No usage data is sent.'}
        </p>
      </div>

      {/* Local Data Status */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💾 Your Local Data</h2>
        
        {hasLocalData ? (
          <p style={styles.sectionText}>
            You have breathing history and settings stored on this device.
          </p>
        ) : (
          <p style={styles.sectionText}>
            No local data found yet.
          </p>
        )}

        <button
          onClick={handleDeleteAllData}
          style={styles.deleteButton}
        >
          🗑️ Delete All My Data
        </button>

        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px' }}>
          This clears everything stored locally. The app will reset to first-run state.
        </p>
      </div>

      {/* Important Notice */}
      <div style={styles.warningBox}>
        <div style={styles.warningTitle}>⚠️ Important Notes</div>
        <div style={styles.warningText}>
          <p style={{ marginBottom: '8px' }}>
            <strong>No Account System:</strong> Puff doesn't require an account. This means:
          </p>
          <ul style={{ ...styles.list, marginBottom: '12px' }}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Your data cannot be synced across devices
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              If you clear browser data, your history is lost
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              We cannot recover your data if you lose your device
            </li>
          </ul>
          <p>
            <strong>No Third Parties:</strong> We don't sell data, share with advertisers, 
            or use third-party tracking SDKs.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div style={{ ...styles.section, marginTop: '20px' }}>
        <h2 style={styles.sectionTitle}>📧 Privacy Questions?</h2>
        <p style={styles.sectionText}>
          If you have questions about privacy or data handling, contact us at:{' '}
          <a href="mailto:privacy@puff.app" style={{ color: '#8FBC8F' }}>
            privacy@puff.app
          </a>
        </p>
      </div>
    </div>
  )
}

export default PrivacySettings
