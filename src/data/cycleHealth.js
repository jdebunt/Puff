// Cycle & Hormonal Health Data
// Breathing recommendations for menstrual cycle phases and menopause

// Menstrual Cycle Phases (average 28-day cycle)
export const CYCLE_PHASES = [
  {
    id: 'menstrual',
    name: 'Menstrual',
    emoji: '🌑',
    days: '1-5',
    description: 'Rest and renewal phase',
    commonSymptoms: ['cramps', 'fatigue', 'low energy', 'mood changes', 'back pain'],
    breathingFocus: 'Gentle, restorative breathing to support rest and pain relief',
    recommendedPrograms: ['sleep-prep', 'anxiety-release', 'cycle-rest'],
    puffColor: '#8b5cf6', // Deep purple
    energyLevel: 'low'
  },
  {
    id: 'follicular',
    name: 'Follicular',
    emoji: '🌒',
    days: '6-14',
    description: 'Rising energy and creativity',
    commonSymptoms: ['increased energy', 'positive mood', 'creativity boost'],
    breathingFocus: 'Energizing breaths to harness rising vitality',
    recommendedPrograms: ['morning-reset', 'energy-boost', 'cycle-flourish'],
    puffColor: '#10b981', // Fresh green
    energyLevel: 'rising'
  },
  {
    id: 'ovulatory',
    name: 'Ovulatory',
    emoji: '🌕',
    days: '15-17',
    description: 'Peak energy and confidence',
    commonSymptoms: ['high energy', 'confidence', 'social energy', 'appetite changes'],
    breathingFocus: 'Calming breaths to balance peak hormones',
    recommendedPrograms: ['deep-focus', 'coherent', 'cycle-balance'],
    puffColor: '#fbbf24', // Golden yellow
    energyLevel: 'high'
  },
  {
    id: 'luteal',
    name: 'Luteal',
    emoji: '🌖',
    days: '18-28',
    description: 'Winding down phase',
    commonSymptoms: ['PMS', 'mood swings', 'bloating', 'cravings', 'anxiety', 'irritability'],
    breathingFocus: 'Stabilizing breaths for mood and comfort',
    recommendedPrograms: ['anxiety-release', 'sleep-prep', 'cycle-calm'],
    puffColor: '#ef4444', // Warm red
    energyLevel: 'declining'
  }
]

// Menopause stages
export const MENOPAUSE_STAGES = [
  {
    id: 'perimenopause',
    name: 'Perimenopause',
    description: 'Transition phase (can last 4-8 years)',
    commonSymptoms: [
      'irregular periods',
      'hot flashes',
      'night sweats',
      'mood swings',
      'sleep disturbances',
      'brain fog'
    ],
    breathingFocus: 'Cooling, calming breaths for symptom management',
    recommendedPrograms: ['menopause-cool', 'menopause-calm', 'sleep-prep']
  },
  {
    id: 'menopause',
    name: 'Menopause',
    description: '12 months after last period',
    commonSymptoms: [
      'hot flashes',
      'night sweats',
      'vaginal dryness',
      'mood changes',
      'metabolism changes'
    ],
    breathingFocus: 'Daily regulation for nervous system support',
    recommendedPrograms: ['menopause-cool', 'menopause-ground', 'anxiety-release']
  },
  {
    id: 'postmenopause',
    name: 'Postmenopause',
    description: 'After menopause (rest of life)',
    commonSymptoms: [
      'bone density concerns',
      'heart health',
      'stable but changed baseline'
    ],
    breathingFocus: 'Maintenance and long-term wellness',
    recommendedPrograms: ['morning-reset', 'deep-focus', 'menopause-ground']
  }
]

// Symptom to breathing mapping
export const SYMPTOM_RECOMMENDATIONS = {
  // Physical symptoms
  'cramps': {
    program: 'cycle-rest',
    technique: 'Extended exhale (4-6 count) activates pain-relief response'
  },
  'back pain': {
    program: 'cycle-rest',
    technique: 'Diaphragmatic breathing reduces tension'
  },
  'headache': {
    program: 'anxiety-release',
    technique: 'Box breathing reduces tension headaches'
  },
  'bloating': {
    program: 'cycle-calm',
    technique: 'Belly breathing massages digestive organs'
  },
  'fatigue': {
    program: 'energy-boost',
    technique: 'Energizing breaths increase oxygenation'
  },
  'hot flashes': {
    program: 'menopause-cool',
    technique: 'Sheetali (cooling breath) reduces perceived temperature'
  },
  'night sweats': {
    program: 'sleep-prep',
    technique: 'Extended exhale cools body temperature'
  },
  'heart palpitations': {
    program: 'menopause-calm',
    technique: 'Coherent breathing (5-5) stabilizes heart rate'
  },
  
  // Emotional symptoms
  'anxiety': {
    program: 'anxiety-release',
    technique: 'Long exhale activates vagus nerve'
  },
  'irritability': {
    program: 'cycle-calm',
    technique: '4-7-8 breathing reduces reactivity'
  },
  'mood swings': {
    program: 'cycle-balance',
    technique: 'Alternate nostril balances nervous system'
  },
  'brain fog': {
    program: 'deep-focus',
    technique: 'Coherent breathing improves oxygen to brain'
  },
  'low mood': {
    program: 'cycle-flourish',
    technique: 'Energizing breaths boost serotonin'
  }
}

// Cycle tracking storage helpers
export const getCycleData = () => {
  const stored = localStorage.getItem('cycleData')
  if (stored) {
    return JSON.parse(stored)
  }
  return null
}

export const saveCycleData = (data) => {
  localStorage.setItem('cycleData', JSON.stringify(data))
}

export const getMenopauseData = () => {
  const stored = localStorage.getItem('menopauseData')
  if (stored) {
    return JSON.parse(stored)
  }
  return null
}

export const saveMenopauseData = (data) => {
  localStorage.setItem('menopauseData', JSON.stringify(data))
}

// Calculate current phase based on last period start
export const calculateCyclePhase = (lastPeriodStart, cycleLength = 28) => {
  if (!lastPeriodStart) return null
  
  const today = new Date()
  const start = new Date(lastPeriodStart)
  const daysSincePeriod = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  const dayInCycle = daysSincePeriod % cycleLength
  
  if (dayInCycle >= 1 && dayInCycle <= 5) return 'menstrual'
  if (dayInCycle >= 6 && dayInCycle <= 14) return 'follicular'
  if (dayInCycle >= 15 && dayInCycle <= 17) return 'ovulatory'
  return 'luteal'
}

export default {
  CYCLE_PHASES,
  MENOPAUSE_STAGES,
  SYMPTOM_RECOMMENDATIONS,
  getCycleData,
  saveCycleData,
  getMenopauseData,
  saveMenopauseData,
  calculateCyclePhase
}
