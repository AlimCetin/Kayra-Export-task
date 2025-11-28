'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { productApi } from '@/lib/api/client';
import { addToCart } from '@/lib/features/cart/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/lib/components/Header';
import Cookies from 'js-cookie';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
  locale: string;
  initialFilters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
  };
}

export default function ProductsClient({
  initialProducts,
  categories,
  locale,
  initialFilters,
}: ProductsClientProps) {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Update URL when filters change
  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);

    const queryString = params.toString();
    router.push(`/${locale}/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // Fetch products when filters change (client-side for dynamic filtering)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const response = await productApi.get(`/products?${params.toString()}`);
        setProducts(response.data as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if filters differ from initial (to avoid double fetch on mount)
    const currentParams = searchParams.toString();
    const filterParams = new URLSearchParams();
    if (filters.category) filterParams.set('category', filters.category);
    if (filters.minPrice) filterParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) filterParams.set('maxPrice', filters.maxPrice);
    if (filters.sortBy) filterParams.set('sortBy', filters.sortBy);
    
    if (currentParams !== filterParams.toString()) {
      fetchProducts();
    }
  }, [filters, searchParams]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
    }));
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    try {
      await productApi.delete(`/products/${productId}`);
      
      // Remove product from local state
      setProducts(products.filter(p => p.id !== productId));
      
      alert(t('deleteSuccess'));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 401) {
        alert('Lütfen önce giriş yapın');
        router.push(`/${locale}/login`);
      } else {
        alert(t('deleteError'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Header />
      
      <div className="relative z-10 p-8 pt-24">
        <div className="max-w-7xl mx-auto">
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

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white mb-2">{t('filterByCategory')}</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">{t('minPrice')}</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-white mb-2">{t('maxPrice')}</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-white mb-2">{t('sortBy')}</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">{tCommon('sort')}</option>
                  <option value="price_asc">{t('sortByPriceAsc')}</option>
                  <option value="price_desc">{t('sortByPriceDesc')}</option>
                  <option value="name_asc">{t('sortByNameAsc')}</option>
                  <option value="name_desc">{t('sortByNameDesc')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center text-white text-xl">{tCommon('loading')}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-white text-xl">{t('noProducts')}</div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition"
                >
                  <Link href={`/${locale}/products/${product.id}`}>
                    {product.imageUrl ? (
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-purple-400 font-bold text-lg mb-4">
                      {product.price.toFixed(2)} ₺
                    </p>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition mb-2"
                  >
                    {tCommon('addToCart')}
                  </button>
                  
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <Link
                        href={`/${locale}/products/edit/${product.id}`}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition text-center"
                      >
                        {tCommon('edit')}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                      >
                        {tCommon('delete')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


