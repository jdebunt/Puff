import React from 'react'

// Puff Mascot - An expressive SVG cloud character
// Changes color, expression, and animation based on breathing phase and program type
const PuffMascot = ({ 
  phase = 'idle', 
  size = 120,
  programType = 'focus' // focus, relaxation, activation
}) => {
  // Color schemes based on phase and program type
  const getColors = () => {
    const base = {
      focus: { primary: '#60a5fa', secondary: '#3b82f6' },
      relaxation: { primary: '#a78bfa', secondary: '#8b5cf6' },
      activation: { primary: '#fbbf24', secondary: '#f59e0b' }
    }[programType]

    const phaseColors = {
      inhale: {
        primary: programType === 'activation' ? '#fcd34d' : 
                 programType === 'relaxation' ? '#c4b5fd' : '#93c5fd',
        secondary: programType === 'activation' ? '#fbbf24' : 
                   programType === 'relaxation' ? '#a78bfa' : '#60a5fa',
        glow: programType === 'activation' ? 'rgba(251, 191, 36, 0.4)' : 
              programType === 'relaxation' ? 'rgba(167, 139, 250, 0.4)' : 
              'rgba(96, 165, 250, 0.4)'
      },
      exhale: {
        primary: programType === 'activation' ? '#fde68a' : 
                 programType === 'relaxation' ? '#ddd6fe' : '#bfdbfe',
        secondary: programType === 'activation' ? '#fcd34d' : 
                   programType === 'relaxation' ? '#c4b5fd' : '#93c5fd',
        glow: programType === 'activation' ? 'rgba(253, 230, 138, 0.3)' : 
              programType === 'relaxation' ? 'rgba(221, 214, 254, 0.3)' : 
              'rgba(191, 219, 254, 0.3)'
      },
      hold: {
        primary: programType === 'activation' ? '#fbbf24' : 
                 programType === 'relaxation' ? '#a78bfa' : '#60a5fa',
        secondary: programType === 'activation' ? '#f59e0b' : 
                   programType === 'relaxation' ? '#8b5cf6' : '#3b82f6',
        glow: programType === 'activation' ? 'rgba(251, 191, 36, 0.5)' : 
              programType === 'relaxation' ? 'rgba(167, 139, 250, 0.5)' : 
              'rgba(96, 165, 250, 0.5)'
      },
      idle: {
        primary: programType === 'activation' ? '#fde68a' : 
                 programType === 'relaxation' ? '#e9d5ff' : '#dbeafe',
        secondary: programType === 'activation' ? '#fbbf24' : 
                   programType === 'relaxation' ? '#a78bfa' : '#60a5fa',
        glow: programType === 'activation' ? 'rgba(253, 230, 138, 0.3)' : 
              programType === 'relaxation' ? 'rgba(233, 213, 255, 0.3)' : 
              'rgba(219, 234, 254, 0.3)'
      }
    }

    return phaseColors[phase] || phaseColors.idle
  }

  const colors = getColors()

  // Eye expressions based on phase
  const getEyeConfig = () => {
    switch (phase) {
      case 'inhale':
        return { 
          left: { open: 0.7, y: 0 }, 
          right: { open: 0.7, y: 0 },
          sparkle: true 
        }
      case 'exhale':
        return { 
          left: { open: 0.4, y: 2 }, 
          right: { open: 0.4, y: 2 },
          sparkle: false 
        }
      case 'hold':
        return { 
          left: { open: 1, y: -1 }, 
          right: { open: 1, y: -1 },
          sparkle: true 
        }
      default:
        return { 
          left: { open: 0.5, y: 0 }, 
          right: { open: 0.5, y: 0 },
          sparkle: false 
        }
    }
  }

  const eyeConfig = getEyeConfig()

  // Get animation duration based on phase
  const getAnimationDuration = () => {
    switch (phase) {
      case 'inhale': return '3s'
      case 'exhale': return '4s'
      case 'hold': return '2s'
      default: return '6s'
    }
  }

  // Get scale based on phase
  const getScale = () => {
    switch (phase) {
      case 'inhale': return 1.1
      case 'exhale': return 0.95
      case 'hold': return 1.05
      default: return 1
    }
  }

  const animationDuration = getAnimationDuration()
  const scale = getScale()

  return (
    <div 
      style={{ 
        width: size, 
        height: size * 0.85,
        position: 'relative',
        filter: `drop-shadow(0 0 20px ${colors.glow})`
      }}
    >
      <svg 
        viewBox="0 0 200 170" 
        style={{ 
          width: '100%', 
          height: '100%',
          transform: `scale(${scale})`,
          transition: `transform ${animationDuration} ease-in-out`
        }}
      >
        <defs>
          {/* Gradient for body */}
          <linearGradient id="puffGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          
          {/* Gradient for cheeks */}
          <radialGradient id="cheekGradient">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fca5a5" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sparkle animation */}
          <style>
            {`
              @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
              }
              .sparkle {
                animation: sparkle 2s ease-in-out infinite;
              }
              .float {
                animation: float 3s ease-in-out infinite;
              }
              .pulse {
                animation: pulse 2s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* Main cloud body - composed of multiple circles for fluffy look */}
        <g className="float" style={{ transformOrigin: 'center' }}>
          {/* Back puffs */}
          <ellipse cx="60" cy="90" rx="35" ry="30" fill={colors.secondary} opacity="0.9" />
          <ellipse cx="140" cy="90" rx="35" ry="30" fill={colors.secondary} opacity="0.9" />
          <ellipse cx="100" cy="70" rx="40" ry="35" fill={colors.secondary} opacity="0.8" />
          
          {/* Main body */}
          <ellipse cx="50" cy="85" rx="40" ry="35" fill="url(#puffGradient)" filter="url(#glow)" />
          <ellipse cx="150" cy="85" rx="40" ry="35" fill="url(#puffGradient)" filter="url(#glow)" />
          <ellipse cx="100" cy="60" rx="50" ry="45" fill="url(#puffGradient)" filter="url(#glow)" />
          <ellipse cx="100" cy="95" rx="45" ry="35" fill="url(#puffGradient)" filter="url(#glow)" />

          {/* Cheeks */}
          <ellipse cx="65" cy="95" rx="12" ry="8" fill="url(#cheekGradient)" />
          <ellipse cx="135" cy="95" rx="12" ry="8" fill="url(#cheekGradient)" />

          {/* Eyes */}
          <g>
            {/* Left eye white */}
            <ellipse cx="75" cy={80 + eyeConfig.left.y} rx={12 * eyeConfig.left.open} ry={14 * eyeConfig.left.open} fill="white" />
            {/* Right eye white */}
            <ellipse cx="125" cy={80 + eyeConfig.right.y} rx={12 * eyeConfig.right.open} ry={14 * eyeConfig.right.open} fill="white" />
            
            {/* Left pupil */}
            <circle cx={75 + (phase === 'inhale' ? -2 : 0)} cy={80 + eyeConfig.left.y} r={6 * eyeConfig.left.open} fill="#1e293b" />
            {/* Right pupil */}
            <circle cx={125 + (phase === 'inhale' ? 2 : 0)} cy={80 + eyeConfig.right.y} r={6 * eyeConfig.right.open} fill="#1e293b" />
            
            {/* Eye sparkles */}
            {eyeConfig.sparkle && (
              <>
                <circle cx={78 + (phase === 'inhale' ? -2 : 0)} cy={76 + eyeConfig.left.y} r={3} fill="white" className="sparkle" style={{ animationDelay: '0s' }} />
                <circle cx={128 + (phase === 'inhale' ? 2 : 0)} cy={76 + eyeConfig.right.y} r={3} fill="white" className="sparkle" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </g>

          {/* Mouth - changes based on phase */}
          {phase === 'inhale' && (
            <ellipse cx="100" cy="105" rx="8" ry="6" fill="#fca5a5" opacity="0.8" />
          )}
          {phase === 'exhale' && (
            <path d="M 92 105 Q 100 110 108 105" stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {phase === 'hold' && (
            <path d="M 94 107 Q 100 105 106 107" stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {phase === 'idle' && (
            <path d="M 95 108 Q 100 112 105 108" stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          {/* Little arms that move with breathing */}
          <g style={{ 
            transform: phase === 'inhale' ? 'scale(1.1)' : phase === 'exhale' ? 'scale(0.9)' : 'scale(1)',
            transformOrigin: 'center',
            transition: `transform ${animationDuration} ease-in-out`
          }}>
            <path d="M 45 95 Q 30 100 25 90" stroke={colors.secondary} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 155 95 Q 170 100 175 90" stroke={colors.secondary} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Floating sparkles around Puff */}
          {phase !== 'idle' && (
            <g>
              <circle cx="30" cy="50" r="4" fill={colors.primary} className="sparkle" style={{ animationDelay: '0s' }} opacity="0.6" />
              <circle cx="170" cy="60" r="3" fill={colors.primary} className="sparkle" style={{ animationDelay: '0.3s' }} opacity="0.6" />
              <circle cx="100" cy="25" r="5" fill={colors.primary} className="sparkle" style={{ animationDelay: '0.6s' }} opacity="0.6" />
              <circle cx="20" cy="100" r="3" fill={colors.secondary} className="sparkle" style={{ animationDelay: '0.9s' }} opacity="0.5" />
              <circle cx="180" cy="110" r="4" fill={colors.secondary} className="sparkle" style={{ animationDelay: '1.2s' }} opacity="0.5" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}

export default PuffMascot
