import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productApi } from '@/lib/api/client';
import ProductDetailsClient from './ProductDetailsClient';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

async function getProduct(id: number): Promise<Product | null> {
  try {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string; locale: string } }): Promise<Metadata> {
  const product = await getProduct(Number(params.id));
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string; locale: string } }) {
  const product = await getProduct(Number(params.id));

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} locale={params.locale} />;
}

