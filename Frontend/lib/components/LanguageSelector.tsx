'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface Language {
  code: 'tr' | 'en';
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function LanguageSelector() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLocale = (params?.locale as string) || 'tr';
  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLocale) || LANGUAGES[0];

  // Get path without locale prefix
  const getPathWithoutLocale = () => {
    if (!pathname) return '/';
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && (segments[0] === 'tr' || segments[0] === 'en')) {
      segments.shift();
    }
    return segments.length > 0 ? `/${segments.join('/')}` : '/';
  };

  const handleLanguageChange = (langCode: string) => {
    if (langCode === currentLocale) {
      setIsOpen(false);
      return;
    }

    const pathWithoutLocale = getPathWithoutLocale();
    const newPath = `/${langCode}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
        aria-label="Dil seç"
        aria-expanded={isOpen}
      >
      
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-white/10 z-50 overflow-hidden py-2"
            role="menu"
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLocale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isActive}
                  className={`w-full flex items-center gap-5 px-6 py-4 text-left transition-colors ${
                    isActive
                      ? 'bg-white/10 cursor-default'
                      : 'hover:bg-white/5 cursor-pointer'
                  }`}
                  role="menuitem"
                >
             
                  <span className="text-base font-medium text-white flex-grow">{lang.name}</span>
                  {isActive && (
                    <svg
                      className="w-5 h-5 text-white ml-auto flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
