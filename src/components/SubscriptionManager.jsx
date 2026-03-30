import { useState, useEffect } from 'react'
import revenuecat, { SUBSCRIPTION_PRODUCTS } from '../utils/revenuecat'

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D5A3F'
  },
  header: {
    color: '#fff',
    fontSize: '24px',
    marginBottom: '20px'
  },
  statusCard: {
    width: '90%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px'
  },
  statusTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: '14px',
    textAlign: 'center'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '90%',
    maxWidth: '400px'
  },
  purchaseButton: {
    backgroundColor: '#8FBC8F',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  restoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center'
  }
}

function SubscriptionManager() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [purchaseResult, setPurchaseResult] = useState(null)

  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const status = await revenuecat.getCurrentSubscription()

      if (status?.isActive) {
        setIsSubscribed(true)
      } else {
        setIsSubscribed(false)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to check subscription status')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchase = async (productKey) => {
    try {
      setIsLoading(true)
      setError(null)

      const product = SUBSCRIPTION_PRODUCTS[productKey]
      if (!product) return

      console.log(`Purchasing: ${product.id}`)

      // For web, we'll show a demo purchase flow
      // In production, this would call revenuecat.purchaseProduct(product.id)

      setPurchaseResult({
        success: true,
        product: product,
        message: `Demo: You've subscribed to ${product.name}!`
      })
    } catch (err) {
      console.error(err)
      setError('Purchase failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async () => {
    try {
      setIsLoading(true)

      await revenuecat.restorePurchases()

      // Refresh subscription status
      await checkSubscriptionStatus()
    } catch (err) {
      console.error(err)
      setError('Failed to restore purchases')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !purchaseResult) {
    return (
      <div style={styles.container}>
        <p>Loading subscription status...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Premium Access</h1>

      {purchaseResult && (
        <div style={{ ...styles.statusCard, backgroundColor: purchaseResult.success ? '#2D5A3F' : '#ef4444' }}>
          <p style={styles.statusText}>{purchaseResult.message}</p>
          {!purchaseResult.success && <p style={styles.errorText}>{purchaseResult.reason}</p>}
        </div>
      )}

      {isSubscribed ? (
        <div style={styles.statusCard}>
          <p style={{ ...styles.statusText, color: '#8FBC8F' }}>✓ Premium Active</p>
          <p style={styles.statusText}>You have unlimited access!</p>
          <p style={styles.statusText}>Expires on {new Date().toLocaleDateString()}</p>

          <button
            onClick={handleRestore}
            style={styles.restoreButton}
            disabled={isLoading}
          >
            Restore Purchases
          </button>
        </div>
      ) : (
        <div style={styles.statusCard}>
          <p style={{ ...styles.statusText, color: '#ef4444' }}>No Active Subscription</p>
          <p style={styles.statusText}>Choose a plan to unlock all features:</p>

          <div style={styles.buttonContainer}>
            {Object.entries(SUBSCRIPTION_PRODUCTS).map(([key, product]) => (
              <button
                key={key}
                onClick={() => handlePurchase(key)}
                style={{
                  ...styles.purchaseButton,
                  backgroundColor: isLoading ? '#6B7280' : '#8FBC8F',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                <div>{product.name}</div>
                <div style={{ fontSize: '14px', fontWeight: 'normal' }}>{product.price} / {product.period}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{product.description}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleRestore}
            style={styles.restoreButton}
            disabled={isLoading}
          >
            Restore Purchases
          </button>
        </div>
      )}

      {error && (
        <p style={styles.errorText}>{error}</p>
      )}
    </div>
  )
}

export default SubscriptionManager