'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/lib/features/auth/authSlice';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const t = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);
  const user = useSelector((state: any) => state.auth?.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}`);
  };

  return (
    <header className="relative z-10 w-full">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
            >
              {t('home')}
            </Link>

            <div className="flex items-center gap-4">
              <LanguageSelector />

              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm hidden md:inline">
                    {user.firstName} {user.lastName}
                  </span>
                  <Link
                    href={`/${locale}/products`}
                    className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-white text-sm"
                  >
                    {t('products')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/20 backdrop-blur-lg rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 text-white text-sm"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href={`/${locale}/login`}
                    className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-white text-sm"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white text-sm font-semibold"
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

