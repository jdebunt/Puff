import { Component } from 'react'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#1a2e25',
    color: '#D1D5DB',
    textAlign: 'center'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '16px'
  },
  message: {
    fontSize: '16px',
    color: '#9CA3AF',
    marginBottom: '32px',
    lineHeight: 1.6,
    maxWidth: '400px'
  },
  button: {
    padding: '14px 32px',
    backgroundColor: '#8FBC8F',
    color: '#1a2e25',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '12px'
  },
  secondaryButton: {
    padding: '14px 32px',
    backgroundColor: 'transparent',
    color: '#8FBC8F',
    border: '2px solid #8FBC8F',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  details: {
    marginTop: '32px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    maxWidth: '500px',
    textAlign: 'left'
  },
  detailsTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#8FBC8F',
    marginBottom: '12px'
  },
  errorText: {
    fontSize: '12px',
    color: '#6B7280',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    margin: 0
  },
  contact: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#6B7280'
  },
  link: {
    color: '#8FBC8F',
    textDecoration: 'none'
  }
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // In production, you might want to report this to an error tracking service
    // trackError(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <span style={styles.icon}>😅</span>
          <h1 style={styles.title}>Oops! Something went wrong</h1>
          <p style={styles.message}>
            Don't worry, Puff is still here for you. Sometimes things don't work as expected.
            Let's try to get you back to breathing.
          </p>

          <div>
            <button onClick={handleReload} style={styles.button}>
              🔄 Reload App
            </button>
            <button onClick={handleGoHome} style={styles.secondaryButton}>
              🏠 Go Home
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={styles.details}>
              <div style={styles.detailsTitle}>Error Details (Development)</div>
              <pre style={styles.errorText}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}

          <div style={styles.contact}>
            <p>
              If this keeps happening, please contact us:{' '}
              <a href="mailto:support@puff.app" style={styles.link}>
                support@puff.app
              </a>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
