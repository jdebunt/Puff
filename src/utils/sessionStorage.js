import localforage from 'localforage'

// Initialize session data structure if it doesn't exist
const initSessionData = () => {
  return new Promise((resolve) => {
    localforage.getItem('sessions').then((data) => {
      if (!data) {
        const initialSessions = []
        localforage.setItem('sessions', initialSessions)
      }
      resolve(data || [])
    })
  })
}

// Save a completed session
const saveSession = (sessionData, timestamp) => {
  return new Promise((resolve, reject) => {
    localforage.getItem('sessions').then((sessions) => {
      if (!sessions) {
        sessions = []
      }
      const newSession = {
        programId: sessionData.programId || sessionData.id,
        programName: sessionData.programName || sessionData.name,
        duration: sessionData.duration,
        completed: true,
        timestamp: timestamp || Date.now()
      }
      sessions.push(newSession)
      localforage.setItem('sessions', sessions).then(() => resolve(sessions))
    }).catch(reject)
  })
}

// Get all sessions
const getAllSessions = () => {
  return new Promise((resolve, reject) => {
    localforage.getItem('sessions').then((sessions) => {
      resolve(sessions || [])
    }).catch(reject)
  })
}

// Get session history for a specific program
const getSessionHistory = (programId) => {
  return new Promise((resolve, reject) => {
    localforage.getItem('sessions').then((sessions) => {
      if (!sessions) {
        resolve([])
      } else {
        const filtered = sessions.filter(
          (s) => s.programId === programId && s.completed
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        resolve(filtered.slice(0, 10)) // Last 10 sessions
      }
    }).catch(reject)
  })
}

// Get streak count for a program
const getStreak = (programId) => {
  return new Promise((resolve, reject) => {
    localforage.getItem('sessions').then(async (sessions) => {
      if (!sessions || sessions.length === 0) {
        resolve(0)
      } else {
        const programSessions = sessions.filter((s) => s.programId === programId && s.completed)
        if (programSessions.length === 0) {
          resolve(0)
        } else {
          // Sort by date and check consecutive days
          const sorted = programSessions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          let streak = 1
          for (let i = 1; i < sorted.length; i++) {
            const prevDate = new Date(sorted[i - 1].timestamp)
            const currDate = new Date(sorted[i].timestamp)
            const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24))
            if (diffDays === 1) {
              streak++
            } else if (diffDays > 1) {
              break
            }
          }
          resolve(streak)
        }
      }
    }).catch(reject)
  })
}

export default {
  initSessionData,
  saveSession,
  getAllSessions,
  getSessionHistory,
  getStreak
}
