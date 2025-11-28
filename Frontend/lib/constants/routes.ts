/**
 * Application Routes
 * Centralized route management for better maintainability
 */

export const ROUTES = {
  HOME: '/',
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: number) => `/products/${id}`,
    ADD: '/products/add',
    EDIT: (id: number) => `/products/${id}/edit`,
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  CART: '/cart',
} as const

export type RouteKey = keyof typeof ROUTES


