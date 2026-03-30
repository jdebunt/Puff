import { useState, useEffect } from 'react'
import BreathingTimer from './components/BreathingTimer'
import SessionList from './components/SessionList'
import Settings from './components/Settings'
import Onboarding from './components/Onboarding'
import MoodCheckIn from './components/MoodCheckIn'
import HealthDisclaimer from './components/HealthDisclaimer'
import CycleMode from './components/CycleMode'
import PrivacySettings from './components/PrivacySettings'
import { trackAppOpen } from './utils/analytics'
import revenuecat from './utils/revenuecat'
import sessionStorage from './utils/sessionStorage'
import breathingPrograms from './data/breathingPrograms'
import { isProgramPremium, PREMIUM_PRICE } from './data/premiumFeatures'

const VIEWS = {
  ONBOARDING: 'onboarding',
  MOOD: 'mood',
  HOME: 'home',
  TIMER: 'timer',
  SETTINGS: 'settings',
  PRIVACY: 'privacy',
  PREMIUM: 'premium',
  CYCLE: 'cycle'
}

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.ONBOARDING)
  const [activeSession, setActiveSession] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [appTheme, setAppTheme] = useState('forest')
  const [showHealthDisclaimer, setShowHealthDisclaimer] = useState(false)

  // Load theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('appSettings')
    if (stored) {
      try {
        const settings = JSON.parse(stored)
        if (settings.theme) setAppTheme(settings.theme)
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Check if health disclaimer needs to be shown
  useEffect(() => {
    const accepted = localStorage.getItem('healthDisclaimerAccepted')
    if (accepted !== 'true') {
      setShowHealthDisclaimer(true)
    }
  }, [])

  // Check onboarding status and premium status on mount
  useEffect(() => {
    const initApp = async () => {
      // Track app open (anonymous)
      trackAppOpen()

      // Check if user completed onboarding
      const onboardingComplete = localStorage.getItem('onboardingComplete')
      if (onboardingComplete === 'true') {
        setHasCompletedOnboarding(true)
        setCurrentView(VIEWS.MOOD)
      }

      // Check premium status
      try {
        const status = await revenuecat.getCurrentSubscription()
        setIsPremium(status?.isActive || false)
      } catch (err) {
        console.error('Failed to check premium status:', err)
        setIsPremium(false)
      } finally {
        setIsLoading(false)
      }
    }

    initApp()
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true')
    setHasCompletedOnboarding(true)
    setCurrentView(VIEWS.MOOD)
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setCurrentView(VIEWS.HOME)
  }

  const startSession = (session) => {
    // Check if program is premium and user doesn't have premium
    if (session.isPremium && !isPremium) {
      setCurrentView(VIEWS.PREMIUM)
      return
    }
    setActiveSession(session)
    setCurrentView(VIEWS.TIMER)
  }

  const completeSession = async () => {
    // Session completed - save and show success
    if (activeSession?.id) {
      try {
        await sessionStorage.saveSession({
          programId: activeSession.id,
          programName: activeSession.name,
          duration: activeSession.duration,
          timestamp: Date.now()
        })
      } catch (e) {
        console.error('Failed to save session:', e)
      }
    }

    setActiveSession(null)
    setCurrentView(VIEWS.MOOD)
  }

  const handlePremiumPurchase = async () => {
    try {
      // Simulate purchase (in production, this would call revenuecat.purchaseProduct)
      await revenuecat.purchaseProduct('premium_unlock')
      setIsPremium(true)
      setCurrentView(VIEWS.HOME)
    } catch (err) {
      console.error('Purchase failed:', err)
    }
  }

  // Get background color based on theme
  const getThemeColor = () => {
    const themes = {
      forest: '#1a2e25',
      ocean: '#1a2d3a',
      sunset: '#2d1a1a',
      midnight: '#0f0f1a',
      cream: '#f5f0e8'
    }
    return themes[appTheme] || '#1a2e25'
  }

  const themeColor = getThemeColor()

  // Render onboarding for first-time users
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColor,
        color: appTheme === 'cream' ? '#1a2e25' : '#8FBC8F'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: themeColor }}>
      {/* Health Disclaimer Modal */}
      {showHealthDisclaimer && (
        <HealthDisclaimer onAccept={() => setShowHealthDisclaimer(false)} />
      )}

      {/* Mood check-in - shown before home screen */}
      {currentView === VIEWS.MOOD && (
        <MoodCheckIn 
          onSelect={handleMoodSelect}
          preSelectedMood={selectedMood}
        />
      )}

      {/* Home screen with session list */}
      {currentView === VIEWS.HOME && (
        <SessionList
          programs={breathingPrograms}
          isPremium={isPremium}
          onStart={startSession}
          onOpenSettings={() => setCurrentView(VIEWS.SETTINGS)}
          onOpenPremium={() => setCurrentView(VIEWS.PREMIUM)}
          selectedMood={selectedMood}
        />
      )}

      {/* Breathing timer */}
      {currentView === VIEWS.TIMER && activeSession && (
        <BreathingTimer
          session={activeSession}
          onComplete={completeSession}
          onExit={() => setCurrentView(VIEWS.HOME)}
        />
      )}

      {/* Settings */}
      {currentView === VIEWS.SETTINGS && (
        <Settings
          onBack={() => setCurrentView(VIEWS.HOME)}
          isPremium={isPremium}
          onOpenPremium={() => setCurrentView(VIEWS.PREMIUM)}
          onOpenCycle={() => setCurrentView(VIEWS.CYCLE)}
          onOpenPrivacy={() => setCurrentView(VIEWS.PRIVACY)}
          onThemeChange={setAppTheme}
        />
      )}

      {/* Privacy Settings */}
      {currentView === VIEWS.PRIVACY && (
        <PrivacySettings
          onBack={() => setCurrentView(VIEWS.SETTINGS)}
        />
      )}

      {/* Cycle Mode */}
      {currentView === VIEWS.CYCLE && (
        <CycleMode
          onBack={() => setCurrentView(VIEWS.SETTINGS)}
          onSelectProgram={(program) => {
            startSession(program)
          }}
        />
      )}

      {/* Premium upgrade screen */}
      {currentView === VIEWS.PREMIUM && (
        <PremiumScreen
          onBack={() => setCurrentView(VIEWS.HOME)}
          onPurchase={handlePremiumPurchase}
          isPremium={isPremium}
        />
      )}
    </div>
  )
}

// Premium upgrade screen component
function PremiumScreen({ onBack, onPurchase, isPremium }) {
  const styles = {
    container: {
      padding: '24px',
      minHeight: '100vh',
      backgroundColor: '#1a2e25',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '32px'
    },
    backButton: {
      backgroundColor: 'transparent',
      border: '2px solid #3A7D5B',
      borderRadius: '8px',
      padding: '8px 12px',
      color: '#8FBC8F',
      fontSize: '14px',
      cursor: 'pointer',
      marginRight: '16px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#8FBC8F'
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    priceCard: {
      backgroundColor: '#2D5A3F',
      borderRadius: '16px',
      padding: '32px',
      width: '100%',
      maxWidth: '340px',
      textAlign: 'center',
      marginBottom: '32px'
    },
    price: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#8FBC8F',
      marginBottom: '8px'
    },
    priceSubtitle: {
      fontSize: '14px',
      color: '#9CA3AF',
      marginBottom: '24px'
    },
    featureList: {
      textAlign: 'left',
      width: '100%'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      color: '#D1D5DB',
      borderBottom: '1px solid #3A7D5B'
    },
    checkIcon: {
      color: '#8FBC8F',
      fontSize: '18px'
    },
    purchaseButton: {
      backgroundColor: '#8FBC8F',
      color: '#1a2e25',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 48px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      maxWidth: '340px',
      marginBottom: '16px'
    },
    restoreButton: {
      backgroundColor: 'transparent',
      color: '#6B7280',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  }

  if (isPremium) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>Premium</h1>
        </div>
        <div style={styles.content}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⭐</div>
          <h2 style={{ color: '#8FBC8F', fontSize: '24px', marginBottom: '8px' }}>
            You're Premium!
          </h2>
          <p style={{ color: '#9CA3AF', textAlign: 'center' }}>
            Thank you for supporting Puff. Enjoy unlimited access to all features!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>← Back</button>
        <h1 style={styles.title}>Unlock Premium</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.priceCard}>
          <div style={styles.price}>{PREMIUM_PRICE}</div>
          <div style={styles.priceSubtitle}>One-time payment • Forever yours</div>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>All breathing programs (5+ sessions)</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Detailed stats & mood trends</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Custom breathing patterns</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Exclusive Puff themes</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Priority support</span>
            </div>
          </div>
        </div>

        <button onClick={onPurchase} style={styles.purchaseButton}>
          Unlock Premium
        </button>
        <button style={styles.restoreButton}>Restore Purchase</button>
      </div>
    </div>
  )
}

export default App
