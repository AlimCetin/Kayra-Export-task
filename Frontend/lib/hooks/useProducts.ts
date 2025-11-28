import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/lib/types/product.types'
import { ProductService } from '@/lib/services/product.service'

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for managing products
 */
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ProductService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  }
}


