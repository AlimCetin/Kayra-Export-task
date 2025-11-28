import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

const PRODUCT_API_URL = process.env.PRODUCT_API_URL || 'http://localhost:5000/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}

async function getProducts(searchParams: SearchParams): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
    if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);

    const response = await fetch(`${PRODUCT_API_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${PRODUCT_API_URL}/products`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      return [];
    }
    
    const products: Product[] = await response.json();
    return [...new Set(products.map((p) => p.category))];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isEnglish = params.locale === 'en';
  
  return {
    title: isEnglish ? 'Products | E-Commerce' : 'Ürünler | E-Ticaret',
    description: isEnglish 
      ? 'Browse our wide selection of products. Filter by category, price range, and sort to find what you need.'
      : 'Geniş ürün yelpazemize göz atın. Kategori, fiyat aralığı ve sıralama ile aradığınızı bulun.',
    openGraph: {
      title: isEnglish ? 'Products | E-Commerce' : 'Ürünler | E-Ticaret',
      description: isEnglish 
        ? 'Browse our wide selection of products'
        : 'Geniş ürün yelpazemize göz atın',
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      categories={categories}
      locale={params.locale}
      initialFilters={{
        category: searchParams.category || '',
        minPrice: searchParams.minPrice || '',
        maxPrice: searchParams.maxPrice || '',
        sortBy: searchParams.sortBy || '',
      }}
    />
  );
}
