import { useState, useCallback } from 'react'
import { Product, CreateProductDto, UpdateProductDto } from '@/lib/types/product.types'
import { ProductService } from '@/lib/services/product.service'

interface UseProductOperationsReturn {
  createProduct: (data: CreateProductDto) => Promise<Product>
  updateProduct: (id: number, data: UpdateProductDto) => Promise<Product>
  deleteProduct: (id: number) => Promise<void>
  loading: boolean
  error: string | null
}

/**
 * Custom hook for product operations (create, update, delete)
 */
export const useProductOperations = (): UseProductOperationsReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = useCallback(async (data: CreateProductDto): Promise<Product> => {
    try {
      setLoading(true)
      setError(null)
      return await ProductService.create(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürün oluşturulamadı'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProduct = useCallback(async (id: number, data: UpdateProductDto): Promise<Product> => {
    try {
      setLoading(true)
      setError(null)
      return await ProductService.update(id, data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürün güncellenemedi'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      await ProductService.delete(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürün silinemedi'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  }
}


