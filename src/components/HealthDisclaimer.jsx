import { useState, useEffect } from 'react'

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#1a2e25',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    border: '2px solid #8FBC8F'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  icon: {
    fontSize: '32px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    margin: 0
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  text: {
    fontSize: '14px',
    color: '#D1D5DB',
    lineHeight: 1.6,
    marginBottom: '12px'
  },
  warningBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px'
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
    lineHeight: 1.6,
    margin: 0
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
  checkbox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  checkboxInput: {
    width: '20px',
    height: '20px',
    marginTop: '2px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#D1D5DB',
    lineHeight: 1.5,
    cursor: 'pointer'
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#8FBC8F',
    color: '#1a2e25',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  buttonDisabled: {
    backgroundColor: '#4B5563',
    color: '#9CA3AF',
    cursor: 'not-allowed'
  },
  link: {
    color: '#8FBC8F',
    textDecoration: 'underline'
  }
}

function HealthDisclaimer({ onAccept }) {
  const [accepted, setAccepted] = useState(false)
  const [hasAcceptedBefore, setHasAcceptedBefore] = useState(false)

  useEffect(() => {
    const previouslyAccepted = localStorage.getItem('healthDisclaimerAccepted')
    if (previouslyAccepted === 'true') {
      setHasAcceptedBefore(true)
      onAccept?.()
    }
  }, [onAccept])

  const handleAccept = () => {
    localStorage.setItem('healthDisclaimerAccepted', 'true')
    onAccept?.()
  }

  if (hasAcceptedBefore) {
    return null
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <span style={styles.icon}>⚠️</span>
          <h1 style={styles.title}>Important Health Notice</h1>
        </div>

        <div style={styles.warningBox}>
          <div style={styles.warningTitle}>🩺 Not Medical Advice</div>
          <p style={styles.warningText}>
            Puff provides breathing exercises for wellness and relaxation purposes only. 
            This is <strong>NOT medical advice</strong> and should not replace professional 
            medical care, diagnosis, or treatment.
          </p>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>✅</span> What Puff Can Help With
          </div>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Stress reduction and relaxation
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              General wellness and mindfulness
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Breathing awareness and technique
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✓</span>
              Supporting healthy habits
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>🚨</span> When to Seek Medical Advice
          </div>
          <p style={styles.text}>
            Consult a healthcare professional before using Puff if you have:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Respiratory conditions (asthma, COPD, etc.)
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Heart conditions or cardiovascular issues
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Anxiety disorders or panic attacks
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Pregnancy or recent surgery
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Any concerning or persistent symptoms
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>⚠️</span> Stop If You Experience
          </div>
          <p style={styles.text}>
            Discontinue use and seek medical attention if you experience:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Dizziness or lightheadedness
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Shortness of breath or difficulty breathing
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Chest pain or palpitations
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Increased anxiety or panic symptoms
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>•</span>
              Any unusual or concerning symptoms
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>🌸</span> Cycle & Hormonal Health
          </div>
          <p style={styles.text}>
            If using cycle tracking features: This information is for personal wellness only 
            and is not intended for contraceptive purposes or medical diagnosis. Always consult 
            your healthcare provider for medical concerns related to menstrual health or menopause.
          </p>
        </div>

        <div style={styles.checkbox}>
          <input
            type="checkbox"
            id="disclaimer-accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            style={styles.checkboxInput}
          />
          <label htmlFor="disclaimer-accept" style={styles.checkboxLabel}>
            I understand that Puff is for wellness purposes only and is not medical advice. 
            I will consult a healthcare professional for any medical concerns.
          </label>
        </div>

        <button
          onClick={handleAccept}
          disabled={!accepted}
          style={{
            ...styles.button,
            ...(accepted ? {} : styles.buttonDisabled)
          }}
        >
          I Understand - Continue
        </button>

        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          By continuing, you acknowledge that you have read and understood this disclaimer.
        </p>
      </div>
    </div>
  )
}

export default HealthDisclaimer
