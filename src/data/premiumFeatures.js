// Premium features configuration
// Free users get basic features, Premium unlocks everything with one-time $9.99 purchase

export const PREMIUM_PRICE = '$9.99'
export const PREMIUM_TYPE = 'one-time'

// Feature flags
export const FEATURES = {
  // Free features
  breathingPrograms: {
    free: ['morning-reset', 'anxiety-release', 'energy-boost'],
    premium: ['deep-focus', 'sleep-prep']
  },
  stats: {
    free: ['sessions', 'streak', 'lastSession'],
    premium: ['moodTrends', 'timeOfDay', 'weeklyProgress', 'monthlyReport', 'patternHistory']
  },
  customization: {
    free: ['basicPatterns'],
    premium: ['customDurations', 'createRoutine', 'advancedPatterns']
  },
  puffThemes: {
    free: ['default'],
    premium: ['seasonal', 'moods', 'materials', 'gradient']
  },
  widgets: {
    free: ['basic'],
    premium: ['allSizes', 'customStyles', 'stats']
  },
  notifications: {
    free: ['basic'],
    premium: ['smart', 'moodBased', 'adaptive']
  }
}

// Check if a program is premium
export const isProgramPremium = (programId) => {
  return FEATURES.breathingPrograms.premium.includes(programId)
}

// Check if a stat feature is premium
export const isStatPremium = (statName) => {
  return FEATURES.stats.premium.includes(statName)
}

// Premium feature descriptions for upgrade prompts
export const PREMIUM_FEATURES = [
  {
    id: 'programs',
    title: 'Advanced Programs',
    description: 'Unlock Deep Focus Builder & Sleep Prep',
    icon: '🎯'
  },
  {
    id: 'stats',
    title: 'Detailed Insights',
    description: 'Track mood trends, weekly progress & more',
    icon: '📊'
  },
  {
    id: 'customization',
    title: 'Full Customization',
    description: 'Create custom routines & adjust durations',
    icon: '✨'
  },
  {
    id: 'themes',
    title: 'Puff Themes',
    description: 'Seasonal, mood-based & material designs',
    icon: '🎨'
  }
]

// Upgrade prompt messages
export const UPGRADE_MESSAGES = {
  programLocked: (programName) => `
    ${programName} is a premium program! 
    Upgrade to unlock this and all other advanced features.
  `,
  statLocked: (statName) => `
    ${statName} is a premium feature!
    Upgrade for detailed insights into your breathing practice.
  `,
  general: `
    Love Puff? Upgrade to unlock the full experience!
    One-time payment, forever yours.
  `
}

export default {
  PREMIUM_PRICE,
  PREMIUM_TYPE,
  FEATURES,
  isProgramPremium,
  isStatPremium,
  PREMIUM_FEATURES,
  UPGRADE_MESSAGES
}
