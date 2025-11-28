/**
 * API Configuration
 * Centralized API URL and endpoint management
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  },
} as const

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}


