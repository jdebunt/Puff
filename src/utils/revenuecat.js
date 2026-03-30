// RevenueCat Web Stub - Replace with actual implementation for React Native
// This is a demo implementation for web testing. For production, use React Native
// with the @revenuecat/react-native package and wrap with BubbleWrap.

// Subscription product definitions
export const SUBSCRIPTION_PRODUCTS = {
  daily: {
    id: 'daily_subscription',
    price: '$2.99',
    period: 'day',
    name: 'Daily',
    description: 'Daily access to all breathing exercises'
  },
  weekly: {
    id: 'weekly_subscription',
    price: '$7.99',
    period: 'week',
    name: 'Weekly',
    description: 'Weekly access - save compared to daily!'
  },
  monthly: {
    id: 'monthly_subscription',
    price: '$14.99',
    period: 'month',
    name: 'Monthly',
    description: 'Monthly access - our most popular plan'
  },
  yearly: {
    id: 'yearly_subscription',
    price: '$39.99',
    period: 'year',
    name: 'Yearly',
    description: 'Yearly access - save 50% compared to monthly!'
  }
}

// Web storage key for subscription status
const SUBSCRIPTION_KEY = 'premium_subscription'

// Initialize RevenueCat (stub for web)
export const initializeRevenueCat = async (apiKey, appId) => {
  console.log('RevenueCat: Web mode - using local storage for demo')
  return true
}

// Check if user is currently subscribed (uses localStorage for web demo)
export const checkSubscriptionStatus = async () => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        isSubscribed: data.isActive,
        originalPurchaseDate: data.purchaseDate,
        expirationDate: data.expirationDate
      }
    }
    return { isSubscribed: false }
  } catch (error) {
    console.error('Failed to check subscription status:', error)
    return { isSubscribed: false }
  }
}

// Purchase a product (stub for web demo)
export const purchaseProduct = async (productId) => {
  try {
    // Demo: simulate successful purchase after a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const purchaseData = {
      isActive: true,
      productId,
      purchaseDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }
    
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(purchaseData))
    
    return {
      success: true,
      productId,
      expirationDate: purchaseData.expirationDate
    }
  } catch (error) {
    console.error('Purchase failed:', error)
    return { success: false, reason: error.message || 'Unknown error' }
  }
}

// Restore previous purchases (stub for web)
export const restorePurchases = async () => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        success: true,
        restoredSubscriptions: data.isActive ? 1 : 0
      }
    }
    return { success: false, reason: 'No purchases to restore' }
  } catch (error) {
    console.error('Restore purchases failed:', error)
    return { success: false, reason: error.message || 'Unknown error' }
  }
}

// Get current user's subscription status
export const getCurrentSubscription = async () => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        isActive: data.isActive,
        expirationDate: data.expirationDate,
        originalPurchaseDate: data.purchaseDate
      }
    }
    return null
  } catch (error) {
    console.error('Failed to get current subscription:', error)
    return null
  }
}

export default {
  initializeRevenueCat,
  checkSubscriptionStatus,
  purchaseProduct,
  restorePurchases,
  getCurrentSubscription,
  SUBSCRIPTION_PRODUCTS
}
