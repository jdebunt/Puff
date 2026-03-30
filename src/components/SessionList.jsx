import { useState, useEffect } from 'react'
import BreathingPrograms from '../data/breathingPrograms'
import sessionStorage from '../utils/sessionStorage'

const SessionCard = ({ program, onStart, isPremium }) => {
  const isLocked = program.isPremium && !isPremium
  
  return (
    <div style={{
      ...styles.card,
      opacity: isLocked ? 0.7 : 1,
      border: program.isPremium ? '2px solid #FCD34D' : 'none'
    }}>
      <div style={styles.cardHeader}>
        <h3>{program.name}</h3>
        {program.isPremium && (
          <span style={styles.premiumBadge}>⭐ Premium</span>
        )}
      </div>
      <p>{program.description}</p>
      <div style={styles.meta}>
        <span>{program.duration} min</span>
        <span>{program.type}</span>
        {isLocked && <span style={styles.lockIcon}>🔒</span>}
      </div>
      <button 
        onClick={() => onStart(program)} 
        style={{
          ...styles.button,
          backgroundColor: isLocked ? '#4B5563' : program.color || '#8FBC8F',
          color: isLocked ? '#9CA3AF' : '#1a2e25'
        }}
      >
        {isLocked ? 'Unlock to Start' : 'Start Session'}
      </button>
    </div>
  )
}

function SessionList({ onStart, onOpenSettings, onOpenPremium, isPremium = false, selectedMood = null }) {
  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState(BreathingPrograms)
  const [sessionHistory, setSessionHistory] = useState({})
  const [history, setHistory] = useState({})

  // Get mood-based recommendation
  const getRecommendedProgram = () => {
    if (!selectedMood) return null
    
    const recommendations = {
      'stressed': 'anxiety-release',
      'tired': 'energy-boost',
      'neutral': 'morning-reset',
      'calm': 'deep-focus',
      'energized': 'morning-reset'
    }
    return recommendations[selectedMood]
  }

  // Load programs from local storage or use defaults
  useEffect(() => {
    const stored = localStorage.getItem('breathingPrograms')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPrograms(parsed)
      } catch (e) {
        console.error('Failed to parse stored programs:', e)
        setPrograms(BreathingPrograms)
      }
    }
    setLoading(false)
  }, [])

  // Get streak for a program
  const getStreak = async (programId) => {
    try {
      return await sessionStorage.getStreak(programId)
    } catch (e) {
      return 0
    }
  }

  // Load session history from storage
  useEffect(() => {
    sessionStorage.getAllSessions().then(sessions => {
      const historyMap = {}
      for (const s of sessions) {
        historyMap[s.programId] = historyMap[s.programId] || []
        historyMap[s.programId].push(s)
      }
      setSessionHistory(historyMap)
    }).catch(console.error)
  }, [])

  // Get history for each program
  useEffect(() => {
    Promise.all(programs.map(async (p) => ({
      id: p.id,
      count: await sessionStorage.getSessionHistory(p.id).then(h => h.length),
      streak: await getStreak(p.id)
    }))).then(results => setHistory(Object.fromEntries(results)))
  }, [programs])

  // Get recent sessions as a flat array (max 5)
  const getRecentSessions = () => {
    const allSessions = Object.values(sessionHistory).flat()
    return allSessions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
  }

  // Sort programs - recommended first
  const sortedPrograms = [...programs].sort((a, b) => {
    const recommended = getRecommendedProgram()
    if (a.id === recommended) return -1
    if (b.id === recommended) return 1
    return 0
  })

  if (loading) return <div>Loading...</div>

  const recommendedId = getRecommendedProgram()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Good Morning! ☀️</h1>
        <button onClick={onOpenSettings} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>
      
      {/* Mood-based recommendation */}
      {selectedMood && (
        <div style={styles.moodBanner}>
          <span style={styles.moodBannerText}>
            {selectedMood === 'stressed' && 'Feeling stressed? '}
            {selectedMood === 'tired' && 'Low energy? '}
            {selectedMood === 'neutral' && 'Ready for the day? '}
            {selectedMood === 'calm' && 'In the zone? '}
            {selectedMood === 'energized' && 'Feeling great! '}
            <span style={{ color: '#8FBC8F' }}>
              {programs.find(p => p.id === recommendedId)?.name} is perfect for you.
            </span>
          </span>
        </div>
      )}

      <p style={styles.subtitle}>Choose a breathing session</p>

      {/* Free Programs */}
      <div style={styles.sectionTitle}>Free Sessions</div>
      {sortedPrograms.filter(p => !p.isPremium).map((program, index) => (
        <SessionCard 
          key={index} 
          program={program} 
          onStart={onStart}
          isPremium={isPremium}
        />
      ))}

      {/* Premium Programs */}
      {!isPremium && (
        <>
          <div style={styles.sectionTitle}>
            Premium Sessions
            <button onClick={onOpenPremium} style={styles.upgradeLink}>
              Unlock All →
            </button>
          </div>
          {sortedPrograms.filter(p => p.isPremium).map((program, index) => (
            <SessionCard 
              key={index} 
              program={program} 
              onStart={onStart}
              isPremium={isPremium}
            />
          ))}
        </>
      )}

      {/* Session History Section */}
      {Object.values(history).some(h => h && h.count > 0) && (
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #3A7D5B' }}>
          <h2 style={{ color: '#8FBC8F', fontSize: '18px', textAlign: 'center' }}>Your Progress</h2>

          {Object.entries(history).map(([programId, data]) => {
            if (!data) return null
            return (
              <div key={programId} style={{ backgroundColor: '#2D5A3F', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f0f4f1' }}>
                  <span>{programs.find(p => p.id === programId)?.name}</span>
                  <span>Sessions: {data.count} | Streak: {data.streak} days</span>
                </div>
              </div>
            )
          })}

          {/* Recent Sessions */}
          {getRecentSessions().length > 0 && (
            <>
              <h3 style={{ color: '#8FBC8F', fontSize: '16px', marginTop: '16px' }}>Recent Sessions</h3>
              {getRecentSessions().map((session, index) => (
                <div key={index} style={{ backgroundColor: '#2D5A3F', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f0f4f1' }}>
                    <span>{session.programName}</span>
                    <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

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
    marginBottom: '8px'
  },
  title: {
    textAlign: 'left',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    margin: 0
  },
  settingsButton: {
    backgroundColor: 'transparent',
    border: '2px solid #3A7D5B',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#8FBC8F',
    fontSize: '16px',
    cursor: 'pointer'
  },
  subtitle: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginBottom: '8px'
  },
  moodBanner: {
    backgroundColor: 'rgba(143, 188, 143, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '8px',
    border: '1px solid rgba(143, 188, 143, 0.3)'
  },
  moodBannerText: {
    color: '#D1D5DB',
    fontSize: '14px',
    textAlign: 'center',
    display: 'block'
  },
  sectionTitle: {
    color: '#8FBC8F',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  upgradeLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FCD34D',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#2D5A3F',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  premiumBadge: {
    backgroundColor: '#FCD34D',
    color: '#1a2e25',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    color: '#9CA3AF'
  },
  lockIcon: {
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}

export default SessionList
