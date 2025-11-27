'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useProducts } from '@/lib/hooks/useProducts'
import { useProductOperations } from '@/lib/hooks/useProductOperations'
import { Product, SortOption, ProductFormData } from '@/lib/types/product.types'
import { sortProducts } from '@/lib/utils/sort.utils'
import { ROUTES } from '@/lib/constants/routes'
import { LoadingSpinner } from '@/lib/components/LoadingSpinner'
import { ErrorDisplay } from '@/lib/components/ErrorDisplay'
import { ProductCard } from '@/lib/components/ProductCard'
import { ProductSortBar } from '@/lib/components/ProductSortBar'
import { ProductModal } from '@/lib/components/ProductModal'
import { DeleteConfirmModal } from '@/lib/components/DeleteConfirmModal'

export default function ProductsPage() {
  const { products, loading, error, refetch } = useProducts()
  const { updateProduct, deleteProduct, loading: operationLoading } = useProductOperations()
  
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<ProductFormData>({ 
    name: '', 
    description: '', 
    price: '' 
  })
  const [operationError, setOperationError] = useState<string | null>(null)

  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortBy)
  }, [products, sortBy])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setEditFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString()
    })
    setOperationError(null)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      await updateProduct(editingProduct.id, {
        name: editFormData.name,
        description: editFormData.description,
        price: parseFloat(editFormData.price),
      })
      await refetch()
      setEditingProduct(null)
      setEditFormData({ name: '', description: '', price: '' })
      setOperationError(null)
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id)
      await refetch()
      setDeleteConfirm(null)
      setOperationError(null)
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleFormChange = (field: keyof ProductFormData, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return <LoadingSpinner message="Yükleniyor..." />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ana Sayfa
              </Link>
              <h1 className="text-5xl font-extrabold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Ürünler
                </span>
              </h1>
              <p className="text-gray-300">Tüm ürünlerinizi görüntüleyin ve yönetin</p>
            </div>
            <Link
              href={ROUTES.PRODUCTS.ADD}
              className="group relative bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün Ekle
            </Link>
          </div>

          {/* Sort and Filter Bar */}
          {sortedProducts.length > 0 && (
            <ProductSortBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalProducts={sortedProducts.length}
            />
          )}

          {/* Products List */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-300 text-xl mb-6">Henüz ürün bulunmamaktadır.</p>
              <Link
                href={ROUTES.PRODUCTS.ADD}
                className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                İlk Ürünü Ekle
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={setDeleteConfirm}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <ProductModal
        product={editingProduct}
        formData={editFormData}
        loading={operationLoading}
        error={operationError}
        onClose={() => {
          setEditingProduct(null)
          setEditFormData({ name: '', description: '', price: '' })
          setOperationError(null)
        }}
        onSubmit={handleEditSubmit}
        onFormChange={handleFormChange}
        title="Ürünü Düzenle"
        submitLabel="Kaydet"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        productId={deleteConfirm}
        productName={sortedProducts.find(p => p.id === deleteConfirm)?.name}
        loading={operationLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}
