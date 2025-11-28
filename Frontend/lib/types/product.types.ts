export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
}

export interface UpdateProductDto extends CreateProductDto {}

export type SortOption = 
  | 'name-asc' 
  | 'name-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'date-asc' 
  | 'date-desc'

export interface ProductFormData {
  name: string
  description: string
  price: string
  category: string
  imageUrl: string
}


