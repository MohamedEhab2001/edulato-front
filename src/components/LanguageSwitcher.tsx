'use client';

import {useRouter, usePathname} from '@/i18n/routing';

interface LanguageSwitcherProps {
  locale: string;
}

export default function LanguageSwitcher({locale}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'ar' | 'en') => {
    router.push(pathname, {locale: newLocale});
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => switchLocale('ar')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          locale === 'ar'
            ? 'bg-primary text-white shadow-sm'
            : 'text-secondary/70 hover:text-secondary'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          locale === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-secondary/70 hover:text-secondary'
        }`}
      >
        English
      </button>
    </div>
  );
}