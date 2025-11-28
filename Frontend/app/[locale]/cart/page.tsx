'use client';

import { useTranslations } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/features/cart/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/lib/components/Header';

export default function CartPage() {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <Header />
        
        <div className="relative z-10 p-8 pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {tCommon('home')}
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
              <p className="text-white text-xl mb-4">{t('empty')}</p>
              <Link
                href={`/${locale}/products`}
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                {tCommon('products')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Header />
      
      <div className="relative z-10 p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {tCommon('home')}
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex gap-6">
                {item.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0"></div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-gray-300 mb-2">{item.category}</p>
                  <p className="text-purple-400 font-bold text-lg">
                    {item.price.toFixed(2)} ₺
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                      className="w-8 h-8 bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-400 hover:text-red-300"
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-xl font-semibold">{t('total')}:</span>
            <span className="text-purple-400 font-bold text-2xl">
              {total.toFixed(2)} ₺
            </span>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full bg-red-500/20 border border-red-500 text-red-200 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition mb-2"
          >
            {tCommon('delete')} {t('title')}
          </button>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition">
            {t('checkout')}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

