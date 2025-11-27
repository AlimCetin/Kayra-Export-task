export interface Product {
  id: number
  name: string
  description: string
  price: number
  createdAt: string
  updatedAt?: string
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
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
}


