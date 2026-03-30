// Privacy-First Analytics Helper
// Collects usage metrics WITHOUT accessing sensitive health data
// All health data (cycle, symptoms, periods) stays 100% local

const ANALYTICS_ENABLED_KEY = 'analyticsEnabled'

// Events we track (all anonymized, no health data)
export const ANALYTICS_EVENTS = {
  // App usage
  APP_OPEN: 'app_open',
  APP_CLOSE: 'app_close',
  SESSION_START: 'session_start',
  SESSION_COMPLETE: 'session_complete',
  
  // Feature usage
  ONBOARDING_COMPLETE: 'onboarding_complete',
  MOOD_CHECKIN: 'mood_checkin',
  SETTINGS_OPENED: 'settings_opened',
  PREMIUM_VIEWED: 'premium_viewed',
  PREMIUM_PURCHASED: 'premium_purchased',
  
  // Cycle mode (NO health data!)
  CYCLE_MODE_ENABLED: 'cycle_mode_enabled',
  CYCLE_MODE_OPENED: 'cycle_mode_opened',
  CYCLE_PROGRAM_STARTED: 'cycle_program_started',
  
  // Errors
  ERROR: 'error'
}

// Check if analytics is enabled
export const isAnalyticsEnabled = () => {
  const stored = localStorage.getItem(ANALYTICS_ENABLED_KEY)
  // Default to true if not set (user can opt-out anytime)
  return stored !== 'false'
}

// Set analytics preference
export const setAnalyticsEnabled = (enabled) => {
  localStorage.setItem(ANALYTICS_ENABLED_KEY, enabled.toString())
}

// Track an event (sends to your analytics service)
export const trackEvent = (eventName, metadata = {}) => {
  // Never track if disabled
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics Disabled] Event not tracked:', eventName)
    return
  }

  // SAFETY CHECK: Never send sensitive data
  const safeMetadata = filterSensitiveData(metadata)

  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    metadata: safeMetadata,
    // Anonymous session ID (not tied to user identity)
    sessionId: getAnonymousSessionId()
  }

  // In production, send to your analytics service
  // Examples: Plausible, Fathom, PostHog (self-hosted), or custom endpoint
  console.log('[Analytics]', payload)
  
  // Example fetch (uncomment and configure in production):
  // fetch('https://your-analytics-endpoint.com/track', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
}

// Filter out sensitive data - CRITICAL for privacy
const filterSensitiveData = (metadata) => {
  const sensitive = [
    'lastPeriod',
    'periodDate',
    'cycleData',
    'menopauseData',
    'symptoms',
    'healthData',
    'medicalHistory',
    'email',
    'name',
    'userId',
    'deviceId'
  ]

  const filtered = { ...metadata }
  
  sensitive.forEach(key => {
    if (key in filtered) {
      delete filtered[key]
      console.warn('[Privacy] Removed sensitive data from analytics:', key)
    }
  })

  return filtered
}

// Generate anonymous session ID (resets on app close)
const getAnonymousSessionId = () => {
  if (!window._puffSessionId) {
    window._puffSessionId = `session_${Math.random().toString(36).substr(2, 9)}`
  }
  return window._puffSessionId
}

// Track app open (call on mount)
export const trackAppOpen = () => {
  trackEvent(ANALYTICS_EVENTS.APP_OPEN, {
    platform: navigator.platform,
    language: navigator.language
  })
}

// Track session start
export const trackSessionStart = (programId, programName, duration) => {
  trackEvent(ANALYTICS_EVENTS.SESSION_START, {
    programId,        // Safe: just an ID like "morning-reset"
    programName,      // Safe: public program name
    duration,         // Safe: number in minutes
    // NEVER send: user mood, cycle phase, symptoms, etc.
  })
}

// Track session complete
export const trackSessionComplete = (programId, duration) => {
  trackEvent(ANALYTICS_EVENTS.SESSION_COMPLETE, {
    programId,
    duration,
    completed: true
  })
}

// Track feature usage
export const trackFeatureUsage = (featureName) => {
  trackEvent(featureName, {})
}

// Track error (sanitized)
export const trackError = (errorName, context = {}) => {
  trackEvent(ANALYTICS_EVENTS.ERROR, {
    error: errorName,
    // Never send full error message (might contain sensitive data)
    context: filterSensitiveData(context)
  })
}

export default {
  ANALYTICS_EVENTS,
  isAnalyticsEnabled,
  setAnalyticsEnabled,
  trackEvent,
  trackAppOpen,
  trackSessionStart,
  trackSessionComplete,
  trackFeatureUsage,
  trackError
}
