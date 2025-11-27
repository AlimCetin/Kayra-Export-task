import { Product, SortOption } from '@/lib/types/product.types'

/**
 * Sort utilities for products
 */
export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sorted = [...products]

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'))
    
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    
    case 'date-asc':
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    
    case 'date-desc':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    
    default:
      return sorted
  }
}


