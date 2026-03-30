// Achievements system - Track milestones and celebrate with Puff!

export const ACHIEVEMENTS = [
  // Streak achievements
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Complete 3 days in a row',
    icon: '🌱',
    category: 'streak',
    requirement: { type: 'streak', value: 3 },
    reward: { type: 'puffAnimation', value: 'dance' }
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Complete 7 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
    reward: { type: 'puffTheme', value: 'golden' }
  },
  {
    id: 'streak-14',
    title: 'Fortnight Friend',
    description: 'Complete 14 days in a row',
    icon: '⚡',
    category: 'streak',
    requirement: { type: 'streak', value: 14 },
    reward: { type: 'puffTheme', value: 'lightning' }
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Complete 30 days in a row',
    icon: '👑',
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
    reward: { type: 'puffTheme', value: 'crown' }
  },
  
  // Session count achievements
  {
    id: 'sessions-10',
    title: 'First Steps',
    description: 'Complete 10 breathing sessions',
    icon: '👣',
    category: 'sessions',
    requirement: { type: 'totalSessions', value: 10 },
    reward: { type: 'badge', value: 'bronze' }
  },
  {
    id: 'sessions-50',
    title: 'Breathing Buddy',
    description: 'Complete 50 breathing sessions',
    icon: '🤗',
    category: 'sessions',
    requirement: { type: 'totalSessions', value: 50 },
    reward: { type: 'badge', value: 'silver' }
  },
  {
    id: 'sessions-100',
    title: 'Zen Master',
    description: 'Complete 100 breathing sessions',
    icon: '🧘',
    category: 'sessions',
    requirement: { type: 'totalSessions', value: 100 },
    reward: { type: 'badge', value: 'gold' }
  },
  
  // Program-specific achievements
  {
    id: 'program-morning-10',
    title: 'Morning Person',
    description: 'Complete 10 Morning Reset sessions',
    icon: '🌅',
    category: 'program',
    requirement: { type: 'programSessions', programId: 'morning-reset', value: 10 },
    reward: { type: 'puffTheme', value: 'sunrise' }
  },
  {
    id: 'program-focus-10',
    title: 'Focused Mind',
    description: 'Complete 10 focus sessions',
    icon: '🎯',
    category: 'program',
    requirement: { type: 'programType', programType: 'Focus', value: 10 },
    reward: { type: 'puffTheme', value: 'blue' }
  },
  {
    id: 'program-relaxation-10',
    title: 'Inner Peace',
    description: 'Complete 10 relaxation sessions',
    icon: '🕊️',
    category: 'program',
    requirement: { type: 'programType', programType: 'Relaxation', value: 10 },
    reward: { type: 'puffTheme', value: 'purple' }
  },
  
  // Time-based achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a session before 7 AM',
    icon: '🐦',
    category: 'time',
    requirement: { type: 'sessionBefore', hour: 7 },
    reward: { type: 'puffAnimation', value: 'cheerful' }
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    category: 'time',
    requirement: { type: 'sessionAfter', hour: 22 },
    reward: { type: 'puffTheme', value: 'night' }
  },
  
  // Special achievements
  {
    id: 'first-premium',
    title: 'Premium Supporter',
    description: 'Unlock premium features',
    icon: '⭐',
    category: 'special',
    requirement: { type: 'premium', value: true },
    reward: { type: 'puffTheme', value: 'premium' }
  },
  {
    id: 'all-programs',
    title: 'Explorer',
    description: 'Try all breathing programs',
    icon: '🗺️',
    category: 'special',
    requirement: { type: 'allPrograms', value: true },
    reward: { type: 'puffAnimation', value: 'celebration' }
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete at least one session every day for 7 days (any program)',
    icon: '💎',
    category: 'special',
    requirement: { type: 'perfectWeek', value: true },
    reward: { type: 'puffTheme', value: 'diamond' }
  }
]

// Check if an achievement is unlocked
export const checkAchievement = (achievement, stats) => {
  const req = achievement.requirement
  
  switch (req.type) {
    case 'streak':
      return stats.currentStreak >= req.value
    case 'totalSessions':
      return stats.totalSessions >= req.value
    case 'programSessions':
      return (stats.programSessions?.[req.programId] || 0) >= req.value
    case 'programType':
      return (stats.programTypeSessions?.[req.programType] || 0) >= req.value
    case 'sessionBefore':
      return stats.earlySessions >= 1
    case 'sessionAfter':
      return stats.lateSessions >= 1
    case 'premium':
      return stats.isPremium === true
    case 'allPrograms':
      return stats.programsCompleted?.length >= 5
    case 'perfectWeek':
      return stats.perfectWeeks >= 1
    default:
      return false
  }
}

// Get achievements by category
export const getAchievementsByCategory = (category) => {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

// Get unlocked achievements
export const getUnlockedAchievements = (stats) => {
  return ACHIEVEMENTS.filter(a => checkAchievement(a, stats))
}

// Get locked achievements
export const getLockedAchievements = (stats) => {
  return ACHIEVEMENTS.filter(a => !checkAchievement(a, stats))
}

// Get progress towards an achievement
export const getAchievementProgress = (achievement, stats) => {
  const req = achievement.requirement
  
  switch (req.type) {
    case 'streak':
      return { current: stats.currentStreak || 0, required: req.value }
    case 'totalSessions':
      return { current: stats.totalSessions || 0, required: req.value }
    case 'programSessions':
      return { current: stats.programSessions?.[req.programId] || 0, required: req.value }
    case 'programType':
      return { current: stats.programTypeSessions?.[req.programType] || 0, required: req.value }
    default:
      return { current: 0, required: 1 }
  }
}

export default {
  ACHIEVEMENTS,
  checkAchievement,
  getAchievementsByCategory,
  getUnlockedAchievements,
  getLockedAchievements,
  getAchievementProgress
}
