import { useState, useEffect, useRef } from 'react'
import { getPattern } from '../utils/breathingPatterns'
import sessionStorage from '../utils/sessionStorage'
import { trackSessionStart, trackSessionComplete } from '../utils/analytics'
import PuffMascot from './PuffMascot'

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a2e25',
    padding: '60px 20px 40px'
  },
  header: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#8FBC8F',
    fontSize: '16px'
  },
  exitButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(45, 90, 63, 0.8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer'
  },
  circleContainer: {
    position: 'relative',
    width: '240px',
    height: '240px'
  },
  breathingCircle: {
    borderRadius: '50%',
    backgroundColor: '#8FBC8F',
    transformOrigin: 'center center',
    transition: 'transform 0.5s ease-in-out'
  },
  instructions: {
    marginTop: '60px',
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: '280px'
  },
  puffContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

function BreathingTimer({ session, onComplete, onExit }) {
  const [phase, setPhase] = useState('inhale')
  const [timeLeft, setTimeLeft] = useState(session.duration * 60)
  const [isRunning, setIsRunning] = useState(true)
  const patternRef = useRef(null)
  const audioContextRef = useRef(null)
  const lastPhaseRef = useRef(null)

  // Initialize audio context
  useEffect(() => {
    const settings = localStorage.getItem('appSettings')
    const soundEnabled = settings ? JSON.parse(settings).soundEnabled : true
    
    if (soundEnabled && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        audioContextRef.current = new AudioContext()
      }
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play sound when phase changes
  useEffect(() => {
    const settings = localStorage.getItem('appSettings')
    const soundEnabled = settings ? JSON.parse(settings).soundEnabled : true
    
    if (!soundEnabled || !audioContextRef.current || phase === lastPhaseRef.current) return
    
    lastPhaseRef.current = phase
    
    const playTone = (frequency, duration, type = 'sine') => {
      try {
        const ctx = audioContextRef.current
        if (!ctx) return
        
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = type
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + duration)
      } catch (e) {
        console.error('Failed to play sound:', e)
      }
    }

    // Different tones for different phases
    if (phase === 'inhale') {
      playTone(440, 0.3) // A4 - higher pitch for inhale
    } else if (phase === 'exhale') {
      playTone(330, 0.3) // E4 - lower pitch for exhale
    } else if (phase === 'hold') {
      playTone(523, 0.15) // C5 - brief high tone for hold
    }
  }, [phase])

  useEffect(() => {
    // Track session start (anonymous)
    trackSessionStart(session.id, session.name, session.duration)

    // Run the breathing pattern loop
    const runPattern = async () => {
      const pattern = getPattern(session.pattern)
      patternRef.current = pattern

      while (isRunning && timeLeft > 0) {
        for (const step of pattern) {
          if (!isRunning) break

          setPhase(step.type)

          // Wait for the duration of this step
          await new Promise((resolve) => setTimeout(resolve, step.duration))
        }
      }

      // Pattern complete - save session and notify parent
      if (timeLeft <= 0) {
        setIsRunning(false)
        const timestamp = Date.now()
        try {
          await sessionStorage.saveSession({
            programId: session.id,
            programName: session.name,
            duration: session.duration,
            timestamp
          })
          // Track completion
          trackSessionComplete(session.id, session.duration)
          onComplete()
        } catch (e) {
          console.error('Failed to save session:', e)
          onComplete()
        }
      }
    }

    runPattern()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Get current phase instruction
  const getPhaseInstruction = () => {
    const pattern = patternRef.current || getPattern(session.pattern)
    const currentStep = pattern.find(s => s.type === phase)
    return currentStep?.label || `Phase: ${phase}`
  }

  // Get short phase text for circle
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
      default: return 'Breathe'
    }
  }

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    if (phase === 'inhale') return 1.15
    if (phase === 'exhale') return 0.85
    return 1
  }

  // Get circle color based on phase
  const getCircleColor = () => {
    if (phase === 'inhale') return '#8FBC8F'
    if (phase === 'hold') return '#6B9B7A'
    if (phase === 'exhale') return '#5A8B6A'
    return '#8FBC8F'
  }

  return (
    <div style={styles.container}>
      <button onClick={onExit} style={styles.exitButton}>Exit</button>
      <h2 style={styles.header}>{session.name}</h2>

      <div style={styles.circleContainer}>
        <div
          style={{
            ...styles.breathingCircle,
            width: '100%',
            height: '100%',
            backgroundColor: getCircleColor(),
            transform: `scale(${getCircleScale()})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{
            color: '#1a2e25',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(255,255,255,0.3)'
          }}>
            {getPhaseText()}
          </span>
        </div>
      </div>

      <div style={styles.puffContainer}>
        <PuffMascot phase={phase} size={140} programType={session.type?.toLowerCase() || 'focus'} />
      </div>

      <p style={styles.instructions}>
        {session.instructionText || getPhaseInstruction()}
      </p>

      <p style={{ marginTop: '20px', color: '#6B7280' }}>
        Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </p>
    </div>
  )
}

export default BreathingTimer
