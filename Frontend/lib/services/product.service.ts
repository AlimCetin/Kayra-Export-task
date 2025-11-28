import { Product, CreateProductDto, UpdateProductDto } from '@/lib/types/product.types'
import { getApiUrl } from '@/lib/constants/api'
import { API_CONFIG } from '@/lib/constants/api'
import Cookies from 'js-cookie'

/**
 * Product Service
 * Handles all product-related API calls
 */
export class ProductService {
  /**
   * Get authorization headers with JWT token
   */
  private static getAuthHeaders(): HeadersInit {
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }
  /**
   * Get all products
   */
  static async getAll(): Promise<Product[]> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Ürünler yüklenemedi')
    }

    return response.json()
  }

  /**
   * Get product by ID
   */
  static async getById(id: number): Promise<Product> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id)), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Id=${id} olan ürün bulunamadı`)
      }
      throw new Error('Ürün getirilemedi')
    }

    return response.json()
  }

  /**
   * Create a new product (requires JWT authentication)
   */
  static async create(data: CreateProductDto): Promise<Product> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Yetkisiz erişim. Lütfen giriş yapın.')
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.message || 'Ürün oluşturulamadı')
    }

    return response.json()
  }

  /**
   * Update an existing product (requires JWT authentication)
   */
  static async update(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id)), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Yetkisiz erişim. Lütfen giriş yapın.')
      }
      if (response.status === 404) {
        throw new Error(`Id=${id} olan ürün bulunamadı`)
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.message || 'Ürün güncellenemedi')
    }

    return response.json()
  }

  /**
   * Delete a product (requires JWT authentication)
   */
  static async delete(id: number): Promise<void> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id)), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Yetkisiz erişim. Lütfen giriş yapın.')
      }
      if (response.status === 404) {
        throw new Error(`Id=${id} olan ürün bulunamadı`)
      }
      throw new Error('Ürün silinemedi')
    }
  }
}


