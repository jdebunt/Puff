import { useState } from 'react'
import PuffMascot from './PuffMascot'

const MOODS = [
  { 
    id: 'stressed', 
    label: 'Stressed', 
    emoji: '😰', 
    color: '#ef4444',
    recommendation: 'Try Anxiety Release or Sleep Prep'
  },
  { 
    id: 'tired', 
    label: 'Tired', 
    emoji: '😴', 
    color: '#f59e0b',
    recommendation: 'Energy Boost will help!'
  },
  { 
    id: 'neutral', 
    label: 'Okay', 
    emoji: '😐', 
    color: '#6b7280',
    recommendation: 'Morning Reset is perfect'
  },
  { 
    id: 'calm', 
    label: 'Calm', 
    emoji: '😌', 
    color: '#10b981',
    recommendation: 'Great day for Deep Focus'
  },
  { 
    id: 'energized', 
    label: 'Great!', 
    emoji: '🤩', 
    color: '#8b5cf6',
    recommendation: 'You\'re glowing! Keep it up!'
  }
]

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#9CA3AF',
    marginBottom: '24px',
    textAlign: 'center'
  },
  puffContainer: {
    marginBottom: '24px'
  },
  moodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '340px',
    marginBottom: '20px'
  },
  moodButton: (isSelected, color) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 8px',
    backgroundColor: isSelected ? `${color}20` : '#2D5A3F',
    border: isSelected ? `2px solid ${color}` : '2px solid transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: isSelected ? 'scale(1.05)' : 'scale(1)'
  }),
  moodEmoji: (isSelected) => ({
    fontSize: '28px',
    filter: isSelected ? 'none' : 'grayscale(0.3)',
    transition: 'all 0.2s ease'
  }),
  moodLabel: {
    fontSize: '11px',
    color: '#9CA3AF',
    textAlign: 'center'
  },
  recommendation: {
    backgroundColor: '#2D5A3F',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    maxWidth: '340px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease'
  },
  recommendationText: {
    color: '#8FBC8F',
    fontSize: '14px',
    marginBottom: '12px'
  },
  confirmButton: {
    backgroundColor: '#8FBC8F',
    color: '#1a2e25',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '340px'
  }
}

function MoodCheckIn({ onSelect, preSelectedMood = null }) {
  const [selectedMood, setSelectedMood] = useState(preSelectedMood)
  const [showRecommendation, setShowRecommendation] = useState(false)

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId)
    setShowRecommendation(true)
  }

  const handleConfirm = () => {
    if (selectedMood) {
      onSelect?.(selectedMood)
    }
  }

  const selectedMoodData = MOODS.find(m => m.id === selectedMood)

  return (
    <div style={styles.container}>
      <div style={styles.puffContainer}>
        <PuffMascot 
          phase={selectedMood ? 'inhale' : 'idle'} 
          size={100} 
          programType={selectedMoodData?.id === 'calm' || selectedMoodData?.id === 'energized' ? 'focus' : 'relaxation'}
        />
      </div>

      <h2 style={styles.title}>How are you feeling?</h2>
      <p style={styles.subtitle}>Puff is here for you</p>

      <div style={styles.moodGrid}>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            style={styles.moodButton(selectedMood === mood.id, mood.color)}
          >
            <span style={styles.moodEmoji(selectedMood === mood.id)}>{mood.emoji}</span>
            <span style={styles.moodLabel}>{mood.label}</span>
          </button>
        ))}
      </div>

      {showRecommendation && selectedMoodData && (
        <div style={styles.recommendation}>
          <p style={styles.recommendationText}>
            {selectedMoodData.recommendation}
          </p>
          <button
            onClick={handleConfirm}
            style={styles.confirmButton}
          >
            Continue
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

export default MoodCheckIn
