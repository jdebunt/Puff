import { useState, useEffect } from 'react'
import PuffMascot from './PuffMascot'
import { 
  CYCLE_PHASES, 
  MENOPAUSE_STAGES, 
  SYMPTOM_RECOMMENDATIONS,
  calculateCyclePhase,
  getCycleData,
  saveCycleData,
  getMenopauseData,
  saveMenopauseData
} from '../data/cycleHealth'
import breathingPrograms from '../data/breathingPrograms'

const MODES = ['none', 'cycle', 'menopause']

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#1a2e25'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  backButton: {
    backgroundColor: 'transparent',
    border: '2px solid #3A7D5B',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#8FBC8F',
    fontSize: '14px',
    cursor: 'pointer'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    margin: 0
  },
  modeSelector: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    backgroundColor: '#2D5A3F',
    borderRadius: '12px',
    padding: '4px'
  },
  modeButton: (isActive) => ({
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: isActive ? '#8FBC8F' : 'transparent',
    color: isActive ? '#1a2e25' : '#9CA3AF',
    transition: 'all 0.2s ease'
  }),
  card: {
    backgroundColor: '#2D5A3F',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px'
  },
  phaseCard: (color) => ({
    backgroundColor: '#2D5A3F',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    border: `2px solid ${color}`,
    boxShadow: `0 0 20px ${color}20`
  }),
  phaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  phaseEmoji: {
    fontSize: '48px'
  },
  phaseName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#8FBC8F'
  },
  phaseDays: {
    fontSize: '14px',
    color: '#9CA3AF',
    marginTop: '4px'
  },
  phaseDescription: {
    fontSize: '14px',
    color: '#D1D5DB',
    marginBottom: '16px',
    lineHeight: 1.5
  },
  symptomsTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '12px',
    marginTop: '16px'
  },
  symptomsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  symptomChip: (isSelected) => ({
    padding: '8px 12px',
    backgroundColor: isSelected ? '#8FBC8F' : '#3A7D5B',
    color: isSelected ? '#1a2e25' : '#D1D5DB',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease'
  }),
  recommendationCard: {
    backgroundColor: 'rgba(143, 188, 143, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
    border: '1px solid rgba(143, 188, 143, 0.3)'
  },
  recommendationTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '8px'
  },
  recommendationText: {
    fontSize: '13px',
    color: '#D1D5DB',
    lineHeight: 1.5
  },
  programButton: (color) => ({
    width: '100%',
    padding: '14px',
    backgroundColor: color || '#8FBC8F',
    color: '#1a2e25',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  input: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3A7D5B',
    border: '2px solid transparent',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    marginBottom: '16px',
    outline: 'none'
  },
  inputFocused: {
    borderColor: '#8FBC8F'
  },
  label: {
    fontSize: '14px',
    color: '#9CA3AF',
    marginBottom: '8px',
    display: 'block'
  },
  infoText: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '12px',
    fontStyle: 'italic'
  },
  disclaimer: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '24px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    lineHeight: 1.6
  }
}

function CycleMode({ onBack, onSelectProgram }) {
  const [mode, setMode] = useState('none')
  const [cycleData, setCycleData] = useState(null)
  const [menopauseData, setMenopauseData] = useState(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [showPhaseDetails, setShowPhaseDetails] = useState(false)

  // Load saved data
  useEffect(() => {
    const savedCycle = getCycleData()
    const savedMenopause = getMenopauseData()
    
    if (savedCycle) {
      setCycleData(savedCycle)
      setLastPeriodDate(savedCycle.lastPeriodStart || '')
      setCycleLength(savedCycle.cycleLength || 28)
      setMode('cycle')
    } else if (savedMenopause) {
      setMenopauseData(savedMenopause)
      setMode('menopause')
    }
  }, [])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (newMode === 'none') {
      setCycleData(null)
      setMenopauseData(null)
      localStorage.removeItem('cycleData')
      localStorage.removeItem('menopauseData')
    }
  }

  const saveCycleSetup = () => {
    const data = {
      lastPeriodStart: lastPeriodDate,
      cycleLength: parseInt(cycleLength)
    }
    setCycleData(data)
    saveCycleData(data)
  }

  const saveMenopauseSetup = (stage) => {
    const data = { stage }
    setMenopauseData(data)
    saveMenopauseData(data)
  }

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const getRecommendedProgramForSymptom = (symptom) => {
    const rec = SYMPTOM_RECOMMENDATIONS[symptom]
    if (!rec) return null
    
    const program = breathingPrograms.find(p => p.id === rec.program)
    return program
  }

  const getCurrentPhase = () => {
    if (!cycleData?.lastPeriodStart) return null
    const phaseId = calculateCyclePhase(cycleData.lastPeriodStart, cycleData.cycleLength)
    return CYCLE_PHASES.find(p => p.id === phaseId)
  }

  const currentPhase = getCurrentPhase()

  // Render mode selection
  if (mode === 'none') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>Cycle & Hormonal Health</h1>
          <div style={{ width: 60 }} />
        </div>

        <div style={styles.card}>
          <h2 style={{ color: '#8FBC8F', marginBottom: '12px' }}>
            🌸 Welcome to Cycle Mode
          </h2>
          <p style={{ color: '#9CA3AF', lineHeight: 1.6 }}>
            Puff can adapt breathing recommendations to your hormonal cycle or 
            menopausal stage. This is completely optional—use it if it's helpful!
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={{ color: '#8FBC8F', marginBottom: '16px' }}>Choose Your Mode</h3>
          
          <button
            onClick={() => setMode('cycle')}
            style={styles.programButton('#a78bfa')}
          >
            <span>🌙 Menstrual Cycle</span>
            <span>→</span>
          </button>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>
            Track your cycle and get phase-specific breathing recommendations
          </p>

          <button
            onClick={() => setMode('menopause')}
            style={{ ...styles.programButton, backgroundColor: '#8b5cf6', marginTop: '16px' }}
          >
            <span>🍂 Menopause Support</span>
            <span>→</span>
          </button>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>
            Breathing techniques for perimenopause, menopause, and beyond
          </p>
        </div>

        <div style={styles.disclaimer}>
          <strong>Not medical advice:</strong> These breathing exercises are meant to 
          support wellness, not treat medical conditions. Always consult your healthcare 
          provider for medical concerns.
        </div>
      </div>
    )
  }

  // Render cycle tracking
  if (mode === 'cycle') {
    if (!cycleData?.lastPeriodStart) {
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <button onClick={onBack} style={styles.backButton}>← Back</button>
            <h1 style={styles.title}>Your Cycle</h1>
            <div style={{ width: 60 }} />
          </div>

          <div style={styles.card}>
            <label style={styles.label}>First day of your last period</label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Average cycle length (days)</label>
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              style={styles.input}
              min="21"
              max="35"
            />

            <button
              onClick={saveCycleSetup}
              disabled={!lastPeriodDate}
              style={{
                ...styles.programButton('#8FBC8F'),
                opacity: !lastPeriodDate ? 0.5 : 1
              }}
            >
              Save & Continue
            </button>

            <p style={styles.infoText}>
              This info stays private on your device. We use it to calculate your 
              current phase and recommend appropriate breathing sessions.
            </p>
          </div>
        </div>
      )
    }

    // Show phase info and recommendations
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>Your Cycle</h1>
          <div style={{ width: 60 }} />
        </div>

        {/* Current Phase Card */}
        {currentPhase && (
          <div style={styles.phaseCard(currentPhase.puffColor)}>
            <div style={styles.phaseHeader}>
              <span style={styles.phaseEmoji}>{currentPhase.emoji}</span>
              <div>
                <div style={styles.phaseName}>{currentPhase.name} Phase</div>
                <div style={styles.phaseDays}>Days {currentPhase.days}</div>
              </div>
            </div>
            <p style={styles.phaseDescription}>
              {currentPhase.description}. {currentPhase.breathingFocus}
            </p>

            <div style={styles.recommendationCard}>
              <div style={styles.recommendationTitle}>✨ Recommended for You</div>
              <div style={styles.recommendationText}>
                Based on your {currentPhase.name} phase, try these programs:
              </div>
              {currentPhase.recommendedPrograms.slice(0, 2).map(programId => {
                const program = breathingPrograms.find(p => p.id === programId)
                if (!program) return null
                return (
                  <button
                    key={programId}
                    onClick={() => onSelectProgram?.(program)}
                    style={styles.programButton(program.color)}
                  >
                    <span>{program.name}</span>
                    <span>{program.duration} min</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Symptom Checker */}
        <div style={styles.card}>
          <h3 style={{ color: '#8FBC8F', marginBottom: '12px' }}>How are you feeling today?</h3>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
            Select any symptoms you're experiencing for personalized recommendations:
          </p>

          <div style={styles.symptomsGrid}>
            {Object.keys(SYMPTOM_RECOMMENDATIONS).map(symptom => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                style={styles.symptomChip(selectedSymptoms.includes(symptom))}
              >
                {symptom.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          {/* Show recommendations for selected symptoms */}
          {selectedSymptoms.length > 0 && (
            <div style={styles.recommendationCard}>
              <div style={styles.recommendationTitle}>
                💡 Based on your symptoms:
              </div>
              {selectedSymptoms.map(symptom => {
                const program = getRecommendedProgramForSymptom(symptom)
                if (!program) return null
                return (
                  <div key={symptom} style={{ marginTop: '12px' }}>
                    <div style={styles.recommendationText}>
                      <strong>{symptom.replace(/-/g, ' ')}:</strong> Try {program.name}
                    </div>
                    <button
                      onClick={() => onSelectProgram?.(program)}
                      style={styles.programButton(program.color)}
                    >
                      Start {program.name} ({program.duration} min)
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Phase Reference */}
        <div style={styles.card}>
          <h3 style={{ color: '#8FBC8F', marginBottom: '16px' }}>
            Your Cycle Phases
          </h3>
          {CYCLE_PHASES.map(phase => (
            <div 
              key={phase.id}
              style={{
                padding: '12px',
                borderBottom: '1px solid #3A7D5B',
                opacity: currentPhase?.id === phase.id ? 1 : 0.6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{phase.emoji}</span>
                <div>
                  <div style={{ color: '#8FBC8F', fontWeight: 'bold' }}>{phase.name}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Days {phase.days}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.disclaimer}>
          <strong>Note:</strong> Cycle tracking is approximate. For medical concerns or 
          irregular cycles, consult your healthcare provider.
        </div>
      </div>
    )
  }

  // Render menopause support
  if (mode === 'menopause') {
    if (!menopauseData?.stage) {
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <button onClick={onBack} style={styles.backButton}>← Back</button>
            <h1 style={styles.title}>Menopause Support</h1>
            <div style={{ width: 60 }} />
          </div>

          <div style={styles.card}>
            <h3 style={{ color: '#8FBC8F', marginBottom: '16px' }}>Where are you in your journey?</h3>
            
            {MENOPAUSE_STAGES.map(stage => (
              <button
                key={stage.id}
                onClick={() => saveMenopauseSetup(stage.id)}
                style={styles.programButton('#8b5cf6')}
              >
                <div style={{ textAlign: 'left' }}>
                  <div>{stage.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.8 }}>
                    {stage.description}
                  </div>
                </div>
                <span>→</span>
              </button>
            ))}

            <p style={styles.infoText}>
              You can change this anytime. Recommendations will adapt to your stage.
            </p>
          </div>
        </div>
      )
    }

    const currentStage = MENOPAUSE_STAGES.find(s => s.id === menopauseData.stage)

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>Menopause Support</h1>
          <div style={{ width: 60 }} />
        </div>

        {/* Current Stage Card */}
        <div style={styles.phaseCard('#8b5cf6')}>
          <div style={styles.phaseHeader}>
            <span style={styles.phaseEmoji}>🍂</span>
            <div>
              <div style={styles.phaseName}>{currentStage?.name}</div>
              <div style={styles.phaseDays}>{currentStage?.description}</div>
            </div>
          </div>
          <p style={styles.phaseDescription}>
            {currentStage?.breathingFocus}
          </p>

          <div style={styles.recommendationCard}>
            <div style={styles.recommendationTitle}>✨ Recommended Programs</div>
            {currentStage?.recommendedPrograms.slice(0, 2).map(programId => {
              const program = breathingPrograms.find(p => p.id === programId)
              if (!program) return null
              return (
                <button
                  key={programId}
                  onClick={() => onSelectProgram?.(program)}
                  style={styles.programButton(program.color)}
                >
                  <span>{program.name}</span>
                  <span>{program.duration} min</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Symptom Checker */}
        <div style={styles.card}>
          <h3 style={{ color: '#8FBC8F', marginBottom: '12px' }}>Current Symptoms</h3>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
            Select what you're experiencing:
          </p>

          <div style={styles.symptomsGrid}>
            {currentStage?.commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                style={styles.symptomChip(selectedSymptoms.includes(symptom))}
              >
                {symptom}
              </button>
            ))}
          </div>

          {selectedSymptoms.length > 0 && (
            <div style={styles.recommendationCard}>
              <div style={styles.recommendationTitle}>💡 Recommendations:</div>
              {selectedSymptoms.map(symptom => {
                const program = getRecommendedProgramForSymptom(symptom)
                if (!program) return null
                return (
                  <button
                    key={symptom}
                    onClick={() => onSelectProgram?.(program)}
                    style={{ ...styles.programButton, backgroundColor: program.color, marginTop: '8px' }}
                  >
                    {program.name} for {symptom}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div style={styles.disclaimer}>
          <strong>Not medical advice:</strong> Breathing exercises support wellness but 
          don't replace medical treatment. Discuss symptoms with your healthcare provider.
        </div>
      </div>
    )
  }

  return null
}

export default CycleMode
