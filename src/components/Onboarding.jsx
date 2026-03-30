import { useState, useEffect } from 'react'
import PuffMascot from './PuffMascot'

const onboardingScreens = [
  {
    id: 1,
    title: "Hi, I'm Puff! 🌤️",
    subtitle: "Your mindful breathing companion",
    description: "I'm here to help you start each day with intention. Before you dive into notifications and messages, let's take a moment just for you.",
    puffPhase: 'inhale',
    puffType: 'focus',
    animation: 'wave'
  },
  {
    id: 2,
    title: "Your Lock Screen Companion",
    subtitle: "Mindful before mindless",
    description: "Keep me on your lock screen. When you wake up, breathe with me first—before the world rushes in. Just 3-5 minutes can change your entire day.",
    puffPhase: 'hold',
    puffType: 'relaxation',
    animation: 'float'
  },
  {
    id: 3,
    title: "Ready to Begin?",
    subtitle: "Let's find your breath together",
    description: "Start with a free breathing session. Premium members unlock advanced programs, detailed insights, and special Puff themes!",
    puffPhase: 'exhale',
    puffType: 'activation',
    animation: 'bounce'
  }
]

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#1a2e25',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at top, rgba(143, 188, 143, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative',
    zIndex: 1
  },
  puffContainer: {
    marginBottom: '40px',
    position: 'relative'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    textAlign: 'center',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: '24px'
  },
  description: {
    fontSize: '16px',
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: '320px',
    marginBottom: '40px'
  },
  indicators: {
    display: 'flex',
    gap: '8px',
    marginBottom: '40px'
  },
  indicator: (isActive) => ({
    width: isActive ? '24px' : '8px',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: isActive ? '#8FBC8F' : '#4B5563',
    transition: 'all 0.3s ease'
  }),
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '320px'
  },
  button: (isPrimary) => ({
    flex: 1,
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isPrimary ? '#8FBC8F' : 'transparent',
    color: isPrimary ? '#1a2e25' : '#8FBC8F',
    border: isPrimary ? 'none' : '2px solid #8FBC8F'
  }),
  skipButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#6B7280',
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    cursor: 'pointer'
  }
}

function Onboarding({ onComplete }) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const screen = onboardingScreens[currentScreen]

  // Auto-advance after 8 seconds on last screen
  useEffect(() => {
    if (currentScreen === onboardingScreens.length - 1) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [currentScreen, onComplete])

  const goToNext = () => {
    if (isAnimating) return
    if (currentScreen < onboardingScreens.length - 1) {
      setIsAnimating(true)
      setDirection(1)
      setTimeout(() => {
        setCurrentScreen(prev => prev + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      onComplete?.()
    }
  }

  const goToPrevious = () => {
    if (isAnimating || currentScreen === 0) return
    setIsAnimating(true)
    setDirection(-1)
    setTimeout(() => {
      setCurrentScreen(prev => prev - 1)
      setIsAnimating(false)
    }, 300)
  }

  const getAnimationStyle = () => {
    if (!isAnimating) return {}
    return {
      transform: direction > 0 ? 'translateX(-20px)' : 'translateX(20px)',
      opacity: 0.5
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.background} />
      
      <button 
        onClick={onComplete} 
        style={styles.skipButton}
      >
        Skip
      </button>

      <div style={styles.content}>
        {/* Puff Mascot with animation */}
        <div style={styles.puffContainer}>
          <PuffMascot 
            phase={screen.puffPhase} 
            size={160} 
            programType={screen.puffType}
          />
        </div>

        {/* Content with transition */}
        <div style={{
          transition: 'all 0.3s ease',
          ...getAnimationStyle()
        }}>
          <h1 style={styles.title}>{screen.title}</h1>
          <p style={styles.subtitle}>{screen.subtitle}</p>
          <p style={styles.description}>{screen.description}</p>
        </div>

        {/* Progress Indicators */}
        <div style={styles.indicators}>
          {onboardingScreens.map((_, index) => (
            <div 
              key={index}
              style={styles.indicator(index === currentScreen)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          {currentScreen > 0 && (
            <button
              onClick={goToPrevious}
              style={styles.button(false)}
            >
              Back
            </button>
          )}
          <button
            onClick={goToNext}
            style={styles.button(true)}
          >
            {currentScreen === onboardingScreens.length - 1 ? "Let's Begin" : "Next"}
          </button>
        </div>
      </div>

      {/* Decorative floating particles */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#8FBC8F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8FBC8F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="10%" cy="20%" r="3" fill="url(#particleGradient)">
          <animate attributeName="cy" values="20%;15%;20%" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="90%" cy="30%" r="4" fill="url(#particleGradient)">
          <animate attributeName="cy" values="30%;25%;30%" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="85%" cy="70%" r="3" fill="url(#particleGradient)">
          <animate attributeName="cy" values="70%;65%;70%" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="15%" cy="75%" r="4" fill="url(#particleGradient)">
          <animate attributeName="cy" values="75%;70%;75%" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="5.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

export default Onboarding
