'use client';

import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cart/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/lib/components/Header';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export default function ProductDetailsClient({ product, locale }: { product: Product; locale: string }) {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Header />
      
      <div className="relative z-10 p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center text-white/70 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {tCommon('home')}
            </Link>
            <span className="text-white/50">•</span>
            <Link
              href={`/${locale}/products`}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {tCommon('products')}
            </Link>
          </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {product.imageUrl ? (
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
              <p className="text-purple-400 font-bold text-3xl mb-4">
                {product.price.toFixed(2)} ₺
              </p>
              <p className="text-gray-300 mb-4">
                <span className="font-semibold">{tCommon('category')}:</span> {product.category}
              </p>
              <p className="text-gray-300 mb-6">{product.description}</p>
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                {tCommon('addToCart')}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

