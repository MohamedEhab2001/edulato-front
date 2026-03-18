'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {useState} from 'react';

function ParticlesMini() {
  const particles = React.useMemo(() => [...Array(30)].map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * -15,
    opacity: Math.random() * 0.3 + 0.1,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%,100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  
  return (
    <div
      ref={ref}
      className="transition-all duration-500 ease-out"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <AnimatedSection>
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-8">
                <img src="/logo.png" alt="Edulato" className="h-12 w-auto mx-auto" />
              </Link>
              <h1 className="text-2xl font-bold text-secondary mb-2">{t('title')}</h1>
              <p className="text-secondary/60">{t('subtitle')}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <form className="space-y-6">
              <div>
                <label className="block text-secondary font-medium mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-secondary font-medium mb-2">{t('password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pe-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary/60 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 011-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-secondary/70 text-sm">{t('remember')}</span>
                </label>
                <a href="#" className="text-primary text-sm hover:text-primary/80 transition-colors">{t('forgot')}</a>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                {t('submit')}
              </button>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-secondary/60">{t('orContinue')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-secondary font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.8 9.39c.93-1.62 2.6-2.65 4.4-2.68 1.3-.03 2.54.88 3.34.88.79 0 2.28-1.09 3.85-.93.66.03 2.5.27 3.68 2 .09.12-.73 5.26-3.66 5.26-2.94 0-3.41-1.28-4.56-1.28-.83 0-1.49.6-1.49 1.43 0 1.17 1.17 1.77 2.83 1.77 2.19 0 3.89-1.29 4.53-2.74.88 1.99 1.82 3.93 3.14 5.5z" />
                </svg>
                <span className="text-secondary font-medium">Apple</span>
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <p className="text-center mt-8 text-secondary/60">
              {t('noAccount')}{' '}
              <Link href="/signup" className="text-primary font-medium hover:text-primary/80 transition-colors">
                {t('signup')}
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary to-secondary items-center justify-center p-8 relative overflow-hidden">
        <ParticlesMini />
        <div className="relative max-w-md text-center text-white">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك التعليمية</h2>
          <p className="text-white/80 text-lg">انضم إلى آلاف المنشئين والمعلمين الذين يحققون أحلامهم مع إدولاتو</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-white/70 text-sm">منشئ محتوى</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-white/70 text-sm">طالب</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-white/70 text-sm">دولة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}