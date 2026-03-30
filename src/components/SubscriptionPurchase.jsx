import { useState, useEffect } from 'react'
import revenuecat, { SUBSCRIPTION_PRODUCTS } from '../utils/revenuecat'

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#2D5A3F',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  header: {
    color: '#fff',
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: '16px',
    marginBottom: '30px',
    textAlign: 'center',
    maxWidth: '400px'
  },
  plansContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '380px',
    maxHeight: '60vh'
  },
  planCard: (isActive) => ({
    backgroundColor: isActive ? '#4A7C59' : '#2D5A3F',
    border: isActive ? '2px solid #8FBC8F' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    cursor: isActive ? 'default' : 'pointer',
    opacity: isActive ? 0.7 : 1,
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }),
  planName: {
    color: '#8FBC8F',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  price: (period) => ({
    color: '#fff',
    fontSize: '36px',
    fontWeight: 'bold'
  }),
  period: {
    color: '#8FBC8F',
    fontSize: '14px'
  },
  description: {
    color: '#9CA3AF',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  badge: {
    backgroundColor: '#FFD700',
    color: '#2D5A3F',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  restoreButton: {
    marginTop: 'auto',
    backgroundColor: '#3D6B4F',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px'
  }
}

function SubscriptionPurchase({ onRestore, onError }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Check subscription status on mount
  const checkSubscription = async () => {
    try {
      const status = await revenuecat.checkSubscriptionStatus()
      if (status?.isActive) {
        setIsSubscribed(true)
      } else {
        setError('You are not currently subscribed. Please choose a plan below.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    checkSubscription()
  }, [])

  const handlePurchase = async (product) => {
    // Already subscribed - show restore option instead of purchasing again
    if (isSubscribed) return

    try {
      setLoading(true)
      setError(null)

      // If already subscribed, show restore option instead of purchasing
      if (isSubscribed) {
        onRestore?.()
        return
      }

      const result = await revenuecat.purchaseProduct(product.id)

      if (result.success) {
        setIsSubscribed(true)
        setError(null)
      } else {
        setError(result.reason || 'Purchase failed. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred during purchase')
      onError?.(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>🎉 You're Premium!</h1>
        <p style={styles.subtitle}>
          Thank you for subscribing to Morning Breathwork. Enjoy unlimited access to all breathing exercises!
        </p>

        {error && (
          <div style={styles.errorText}>{error}</div>
        )}

        <button
          onClick={onRestore?.}
          style={styles.restoreButton}
        >
          Restore Purchase
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🔓 Unlock Premium</h1>
      <p style={styles.subtitle}>
        Get unlimited access to all breathing exercises, session history, and more. Cancel anytime!
      </p>

      <div style={styles.plansContainer}>
        {SUBSCRIPTION_PRODUCTS.map((product) => (
          <button
            key={product.id}
            onClick={() => handlePurchase(product)}
            disabled={loading || isSubscribed}
            style={styles.planCard(isSubscribed)}
          >
            {product.price && (
              <span style={styles.badge}>{product.price}</span>
            )}
            <div style={styles.planName}>
              {product.period.charAt(0).toUpperCase() + product.period.slice(1)} Access
            </div>
            <div style={styles.price}>{product.price || '$9.99'}</div>
            <div style={styles.period}>{product.period} • Auto-renews</div>
            <div style={styles.description}>
              {product.description || 'Unlimited access to all breathing exercises'}
            </div>
          </button>
        ))}

        {!isSubscribed && (
          <>
            <p style={{ color: '#9CA3AF', fontSize: '14px', textAlign: 'center' }}>
              Choose a plan below to unlock premium features.
            </p>
            {error && (
              <div style={styles.errorText}>{error}</div>
            )}
          </>
        )}
      </div>

      {!isSubscribed && (
        <button
          onClick={onRestore?.}
          style={{ ...styles.restoreButton, marginTop: '20px' }}
          disabled={loading}
        >
          Restore Purchase
        </button>
      )}
    </div>
  )
}

export default SubscriptionPurchase