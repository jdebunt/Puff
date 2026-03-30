// Breathing program definitions
export default [
  {
    id: 'morning-reset',
    name: 'Morning Reset',
    description: 'Wake up energized without caffeine crash. Perfect for starting your day.',
    duration: 5,
    type: 'Focus',
    pattern: 'box',
    instructionText: 'Breathe deeply to wake up your mind',
    isPremium: false,
    color: '#60a5fa',
    category: 'general'
  },
  {
    id: 'anxiety-release',
    name: 'Anxiety Release',
    description: 'Calms your nervous system before stressful situations.',
    duration: 8,
    type: 'Relaxation',
    pattern: 'relaxing',
    instructionText: 'Feel tension leave with each exhale',
    isPremium: false,
    color: '#a78bfa',
    category: 'general'
  },
  {
    id: 'energy-boost',
    name: 'Energy Boost',
    description: 'Quick energy spike for afternoon slump.',
    duration: 3,
    type: 'Activation',
    pattern: 'energy',
    instructionText: 'Take a deep breath and feel the energy',
    isPremium: false,
    color: '#fbbf24',
    category: 'general'
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus Builder',
    description: 'Improve concentration for work and study sessions. Premium program.',
    duration: 10,
    type: 'Focus',
    pattern: 'coherent',
    instructionText: 'Stay present with each breath',
    isPremium: true,
    color: '#3b82f6',
    category: 'general'
  },
  {
    id: 'sleep-prep',
    name: 'Sleep Prep',
    description: 'Fall asleep faster and improve sleep quality. Premium program.',
    duration: 12,
    type: 'Relaxation',
    pattern: 'relaxing',
    instructionText: 'Let go of the day with each exhale',
    isPremium: true,
    color: '#8b5cf6',
    category: 'general'
  },
  
  // Cycle-specific programs
  {
    id: 'cycle-rest',
    name: 'Cycle Rest',
    description: 'Gentle breathing for period comfort and pain relief. Extended exhale activates natural pain relief.',
    duration: 6,
    type: 'Relaxation',
    pattern: 'relaxing',
    instructionText: 'Breathe softly, let your belly soften',
    isPremium: false,
    color: '#a78bfa',
    category: 'cycle'
  },
  {
    id: 'cycle-flourish',
    name: 'Cycle Flourish',
    description: 'Energizing breaths for your follicular phase. Harness your rising energy.',
    duration: 5,
    type: 'Activation',
    pattern: 'energy',
    instructionText: 'Feel your energy rising with each inhale',
    isPremium: false,
    color: '#10b981',
    category: 'cycle'
  },
  {
    id: 'cycle-balance',
    name: 'Cycle Balance',
    description: 'Balancing breath for ovulatory phase. Steady your peak energy.',
    duration: 7,
    type: 'Focus',
    pattern: 'coherent',
    instructionText: 'Find your center, breathe evenly',
    isPremium: true,
    color: '#fbbf24',
    category: 'cycle'
  },
  {
    id: 'cycle-calm',
    name: 'Cycle Calm',
    description: 'Stabilizing breaths for PMS and luteal phase. Smooth out mood waves.',
    duration: 8,
    type: 'Relaxation',
    pattern: 'fourSevenEight',
    instructionText: 'Long exhale releases tension',
    isPremium: true,
    color: '#ef4444',
    category: 'cycle'
  },
  
  // Menopause-specific programs
  {
    id: 'menopause-cool',
    name: 'Cooling Relief',
    description: 'Relief for hot flashes and night sweats. Cooling breath technique.',
    duration: 4,
    type: 'Relaxation',
    pattern: 'relaxing',
    instructionText: 'Imagine cool air flowing through you',
    isPremium: false,
    color: '#60a5fa',
    category: 'menopause'
  },
  {
    id: 'menopause-calm',
    name: 'Menopause Calm',
    description: 'Steady breathing for mood swings and palpitations. Find your anchor.',
    duration: 6,
    type: 'Focus',
    pattern: 'coherent',
    instructionText: 'Breathe steadily, you are grounded',
    isPremium: true,
    color: '#8b5cf6',
    category: 'menopause'
  },
  {
    id: 'menopause-ground',
    name: 'Deep Grounding',
    description: 'Long-term wellness breathing for postmenopause. Build resilience.',
    duration: 10,
    type: 'Focus',
    pattern: 'box',
    instructionText: 'Each breath roots you deeper',
    isPremium: true,
    color: '#78716c',
    category: 'menopause'
  }
]
