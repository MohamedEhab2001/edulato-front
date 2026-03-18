'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Navbar() {
  const t = useTranslations('nav');

  const navLinks = [
    {href: '#features', label: t('features')},
    {href: '#pricing', label: t('pricing')},
    {href: '/about', label: t('about'), isRoute: true},
    {href: '/contact', label: t('contact'), isRoute: true},
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Edulato"
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-secondary/70 hover:text-secondary font-medium transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-secondary/70 hover:text-secondary font-medium transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-secondary/70 hover:text-secondary font-medium transition-colors cursor-pointer"
            >
              {t('login')}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 cursor-pointer"
            >
              {t('cta')}
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}