// Breathing pattern definitions for different techniques
const breathingPatterns = {
  // Box Breathing (4-4-4-4) - Navy SEAL technique
  box: [
    { type: 'inhale', duration: 4000, label: 'Inhale' },
    { type: 'hold', duration: 4000, label: 'Hold' },
    { type: 'exhale', duration: 4000, label: 'Exhale' },
    { type: 'hold', duration: 4000, label: 'Hold' }
  ],

  // 4-7-8 Technique - Dr. Andrew Weil's relaxation method
  fourSevenEight: [
    { type: 'inhale', duration: 4000, label: 'Inhale through nose' },
    { type: 'hold', duration: 7000, label: 'Hold breath' },
    { type: 'exhale', duration: 8000, label: 'Exhale through mouth' }
  ],

  // Coherent Breathing - 5-5 (equal inhale/exhale)
  coherent: [
    { type: 'inhale', duration: 5000, label: 'Inhale gently' },
    { type: 'exhale', duration: 5000, label: 'Exhale gently' }
  ],

  // Wim Hof - Deep inhales with short exhales
  wimHof: [
    { type: 'inhale', duration: 6000, label: 'Deep inhale' },
    { type: 'exhale', duration: 2000, label: 'Short exhale' }
  ],

  // Alternate Nostril - Nadi Shodhana (simplified)
  alternateNostril: [
    { type: 'inhale', duration: 4000, label: 'Right nostril inhale' },
    { type: 'hold', duration: 2000, label: 'Hold' },
    { type: 'exhale', duration: 4000, label: 'Left nostril exhale' }
  ],

  // Relaxing Breath - Long slow cycles
  relaxing: [
    { type: 'inhale', duration: 6000, label: 'Slow inhale' },
    { type: 'exhale', duration: 8000, label: 'Long exhale' }
  ],

  // Energy Breath - Fast shallow cycles (for alertness)
  energy: [
    { type: 'inhale', duration: 3000, label: 'Quick inhale' },
    { type: 'exhale', duration: 2000, label: 'Quick exhale' }
  ]
}

// Get pattern by name or return default (box breathing)
export const getPattern = (name) => {
  if (!name || !breathingPatterns[name]) {
    return breathingPatterns.box
  }
  return breathingPatterns[name]
}

// Get all available patterns
export const getAllPatterns = () => Object.keys(breathingPatterns).map(key => ({
  id: key,
  name: key.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, l => l.toUpperCase()),
  pattern: breathingPatterns[key]
}))

// Get program with its assigned patterns
export const getProgramPattern = (programId) => {
  return getAllPatterns().find(p => p.id === programId)?.pattern || breathingPatterns.box
}

export default breathingPatterns
