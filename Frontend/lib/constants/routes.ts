/**
 * Application Routes
 * Centralized route management for better maintainability
 */

export const ROUTES = {
  HOME: '/',
  PRODUCTS: {
    LIST: '/products',
    ADD: '/products/add',
    EDIT: (id: number) => `/products/${id}/edit`,
  },
} as const

export type RouteKey = keyof typeof ROUTES


