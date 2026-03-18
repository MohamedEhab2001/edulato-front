'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

function useInView(options = {}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  
  return { ref, isInView };
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const { ref, isInView } = useInView();
  
  React.useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);
  
  return <span ref={ref}>{count}{suffix}</span>;
}

function Particles() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const particles = React.useMemo(() => [...Array(80)].map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    color: i % 5 === 0 ? '#5867FE' : i % 5 === 1 ? '#CFDCFE' : i % 5 === 2 ? '#17042F' : i % 5 === 3 ? '#5867FE' : '#CFDCFE',
    opacity: Math.random() * 0.4 + 0.1,
    depth: Math.random() * 0.5 + 0.5,
    type: i % 8,
  })), []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(88,103,254,0.12) 0%, transparent 70%)',
          left: `${5 + mousePos.x * 15}%`,
          top: `${-5 + mousePos.y * 20 - scrollY * 0.05}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(207,220,254,0.15) 0%, transparent 70%)',
          right: `${-10 - mousePos.x * 10}%`,
          top: `${20 + mousePos.y * 25 - scrollY * 0.03}%`,
        }}
      />
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color,
            opacity: p.opacity,
            boxShadow: p.type === 0 ? `0 0 ${p.size * 3}px ${p.color}` : 'none',
            transform: `translate(${-mousePos.x * 30 * p.depth}px, ${-mousePos.y * 30 * p.depth - scrollY * 0.08 * p.depth}px)`,
            transition: 'transform 0.2s ease-out',
            animation: `particle-float-${p.type} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes particle-float-0 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-40px) translateX(20px) scale(1.1); }
          50% { transform: translateY(-20px) translateX(-15px) scale(0.9); }
          75% { transform: translateY(-60px) translateX(25px) scale(1.05); }
        }
        @keyframes particle-float-1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(-35px); }
          66% { transform: translateY(-50px) translateX(15px); }
        }
        @keyframes particle-float-2 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          20% { transform: translateY(-35px) translateX(25px) scale(1.2); }
          40% { transform: translateY(-15px) translateX(-20px) scale(0.8); }
          60% { transform: translateY(-55px) translateX(10px) scale(1.1); }
          80% { transform: translateY(-25px) translateX(-30px) scale(0.9); }
        }
        @keyframes particle-float-3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-70px) translateX(-40px); }
        }
        @keyframes particle-float-4 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(40px) rotate(90deg); }
          50% { transform: translateY(-45px) translateX(-25px) rotate(180deg); }
          75% { transform: translateY(-15px) translateX(45px) rotate(270deg); }
        }
        @keyframes particle-float-5 {
          0%, 100% { transform: translateY(0) translateX(0); }
          30% { transform: translateY(-25px) translateX(15px); }
          60% { transform: translateY(-50px) translateX(-30px); }
        }
        @keyframes particle-float-6 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-80px) translateX(20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes particle-float-7 {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(-20px); }
          66% { transform: translateY(-40px) translateX(30px); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const t = useTranslations('hero');
  const heroStats = React.useMemo(() => [
    { value: 10000, suffix: '+', label: 'منشئ نشط' },
    { value: 500, suffix: 'K+', label: 'طالب مسجل' },
    { value: 50, suffix: 'M$', label: 'إيرادات محققة' },
  ], []);

  return (
    <div className="bg-white overflow-x-hidden">
      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(135deg, #5867FE 0%, #17042F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-animation { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Hero Section */}
      <section className="min-h-screen py-20 lg:py-32 bg-white relative overflow-hidden">
        <Particles />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary font-medium">منصة التعليم الرقمي الأولى</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-secondary leading-tight mb-6">
                منصتك التعليمية
                <br />
                <span className="gradient-text">الجماعية</span>
              </h1>              
              <p className="text-lg lg:text-xl text-secondary/70 mb-8 max-w-xl leading-relaxed">
                منصة متكاملة لمساعدتك على إنشاء وتسويق وبيع المنتجات التعليمية في مكان واحد. دورات تفاعلية، مجتمعات رقمية، ومنتجات جاهزة للبيع.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup" className="group px-8 py-4 bg-primary text-white font-semibold hover:bg-primary/90 transition-all relative overflow-hidden rounded-lg">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    ابدأ مجاناً
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <a href="#demo" className="px-8 py-4 border-2 border-secondary/20 text-secondary font-semibold hover:border-primary hover:text-primary transition-all rounded-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  شاهد العرض
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-gray-100">
                {[
                  { icon: '✓', text: 'لا حاجة لبطاقة' },
                  { icon: '✓', text: 'إعداد في دقائق' },
                  { icon: '✓', text: 'دعم مجاني 24/7' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-secondary/60">
                    <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/10 rounded-3xl blur-2xl opacity-50" />
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-secondary/40 text-sm">لقطات شاشة المنتج</div>
                      <div className="text-secondary/60 text-lg font-medium mt-2">واجهة سهلة وبديهية</div>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary/60">آخر تحديث</span>
                      <span className="text-primary">قبل دقيقتين</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Hero Stats */}
          <AnimatedSection delay={400}>
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-100">
              {heroStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold gradient-text">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-secondary/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <p className="text-center text-secondary/50 text-sm mb-8 uppercase tracking-wider">موثوق من أفضل الفرق حول العالم</p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              {[
                { name: 'TechCorp', logo: 'TC' },
                { name: 'EduMax', logo: 'EM' },
                { name: 'LearnHub', logo: 'LH' },
                { name: 'CoursePro', logo: 'CP' },
                { name: 'SkillBase', logo: 'SB' },
                { name: 'Academe', logo: 'AC' },
              ].map((company, i) => (
                <div key={i} className="group flex items-center gap-3 text-secondary/40 hover:text-primary transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-primary/10 transition-colors">
                    {company.logo}
                  </div>
                  <span className="text-lg font-medium hidden sm:block">{company.name}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50/50 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-600 text-sm font-medium">تحديات حقيقية</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4">
                <span className="text-red-500">لماذا يفشل</span> معظم المنشئين؟
              </h2>
              <p className="text-secondary/70 max-w-2xl mx-auto text-lg">
                تحديات حقيقية يواجهها الآلاف من المنشئين كل يوم
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: '78%', title: 'يستسلمون بعد 3 أشهر', desc: 'التعقيدات التقنية تسحق أحلامهم', icon: '😔' },
              { stat: '$2.8K', title: 'خسارة شهرية', desc: 'أدوات متفرقة تأكل الميزانية', icon: '💸' },
              { stat: '6+', title: 'أدوات منفصلة', desc: 'لإدارة عمل واحد فقط', icon: '🔧' },
              { stat: '92%', title: 'صعوبات تقنية', desc: 'لا خبرة تقنية مسبقة', icon: '😰' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group bg-white border-2 border-gray-100 hover:border-red-200 rounded-2xl p-6 hover-lift transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-4xl font-bold text-red-500 mb-2">{item.stat}</div>
                    <div className="font-semibold text-secondary mb-1 text-lg">{item.title}</div>
                    <div className="text-secondary/60 text-sm">{item.desc}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={500}>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full">
                <span className="text-secondary/70">هل تواجه هذه التحديات؟</span>
                <Link href="/signup" className="text-primary font-semibold hover:underline">ابدأ الحل الآن →</Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Product Demo */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-primary font-medium">حل شامل</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-6">
                  منصة مصممة <span className="gradient-text">للنجاح</span>
                </h2>
                <p className="text-secondary/70 mb-8 text-lg leading-relaxed">
                  واجهة سهلة الاستخدام مع أدوات قوية لإنشاء وبيع الدورات. كل ما تحتاجه في مكان واحد.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: '📝', title: 'منشئ الدورات', desc: 'سحب وإفلات لإنشاء دورات احترافية بدون خبرة تقنية', color: 'bg-blue-50' },
                    { icon: '📊', title: 'لوحة التحليلات', desc: 'تتبع المبيعات والإيرادات والتقدم في الوقت الحقيقي', color: 'bg-green-50' },
                    { icon: '👥', title: 'إدارة الطلاب', desc: 'تواصل وإدارة تفاعلية مع الطلاب والطلاب المحتملين', color: 'bg-purple-50' },
                    { icon: '💳', title: 'المدفوعات', desc: 'قبض بطرق متعددة مع تتبع تلقائي للإيرادات', color: 'bg-orange-50' },
                  ].map((feature, i) => (
                    <div key={i} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-secondary mb-1 text-lg">{feature.title}</div>
                        <div className="text-secondary/60">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-primary text-white font-semibold hover:bg-primary/90 transition-all rounded-lg">
                  جرب مجاناً
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-secondary/10 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-gray-100 to-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 float-animation">
                        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-secondary/40 text-sm">لقطة شاشة المنتج</div>
                    </div>
                  </div>
                  <div className="p-6 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-sm text-secondary/60">جميع الأنظمة تعمل</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">75%</div>
                        <div className="text-xs text-secondary/60">إكمال الإعداد</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-primary/5 to-white" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4">
                لماذا تختار <span className="gradient-text">إدولاتو؟</span>
              </h2>
              <p className="text-secondary/70 max-w-2xl mx-auto text-lg">
                مميزات مصممة خصيصاً لنجاحك
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { stat: '10x', title: 'أسرع في الإطلاق', desc: 'دقائق بدلاً من أسابيع', icon: '🚀', color: 'from-blue-500 to-blue-600' },
              { stat: '31%', title: 'زيادة في المبيعات', desc: 'أدوات مدمجة للنمو', icon: '📈', color: 'from-green-500 to-green-600' },
              { stat: '24/7', title: 'دعم متواصل', desc: 'فريق متخصص لمساعدتك', icon: '💡', color: 'from-purple-500 to-purple-600' },
              { stat: '0%', title: 'رسوم خفية', desc: 'خطة مجانية للبدء', icon: '💎', color: 'from-orange-500 to-orange-600' },
            ].map((benefit, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} rounded-t-2xl`} />
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <div className="text-4xl font-bold gradient-text mb-2">{benefit.stat}</div>
                  <div className="font-semibold text-secondary mb-2 text-xl">{benefit.title}</div>
                  <div className="text-secondary/60">{benefit.desc}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={500}>
            <div className="mt-16 grid lg:grid-cols-2 gap-8">
              <div className="group relative bg-gradient-to-br from-secondary to-secondary/90 rounded-2xl p-10 text-white overflow-hidden hover-lift">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-3">ابدأ مجاناً اليوم</h3>
                  <p className="text-white/80 mb-6 text-lg">لا حاجة لبطاقة ائتمان. جرّب جميع المميزات مجاناً بدون أي التزام.</p>
                  <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary font-semibold hover:bg-white/90 transition-colors rounded-lg">
                    إنشاء حساب مجاني
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-10 text-white overflow-hidden hover-lift">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold mb-3">دعم مخصص لك</h3>
                  <p className="text-white/80 mb-6 text-lg">فريق خبراء جاهز لمساعدتك في كل خطوة. ردود سريعة وحلول فورية.</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors rounded-lg">
                    تواصل معنا
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
                كل ما تحتاجه <span className="gradient-text">في مكان واحد</span>
              </h2>
              <p className="text-secondary/70 mt-4 text-lg max-w-2xl mx-auto">
                أدوات متكاملة لإنشاء وتسويق وبيع منتجاتك التعليمية
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '📝', title: 'صفحات هبوط احترافية', desc: 'أنشئ صفحات بيع جذابة بدون خبرة تقنية. قوالب جاهزة ومخصصة.', color: 'bg-blue-500' },
              { icon: '🎓', title: 'منشئ دورات ذكي', desc: 'صمم دورات تفاعلية بالسحب والإفلات. فيديوهات واختبارات ومهام.', color: 'bg-purple-500' },
              { icon: '💰', title: 'بيع المنتجات الرقمية', desc: 'بع الكتب والقوالب بسهولة. تحميل تلقائي وتتبع المبيعات.', color: 'bg-green-500' },
              { icon: '📊', title: 'تحليلات متقدمة', desc: 'تتبع المبيعات والإيرادات وسلوك المستخدمين في لوحة واحدة.', color: 'bg-orange-500' },
              { icon: '💬', title: 'دعم فني متميز', desc: 'فريق متخصص على مدار الساعة. ردود سريعة وحلول فورية.', color: 'bg-red-500' },
              { icon: '🎨', title: 'تخصيص كامل', desc: 'خصص بألوانك وشعارك وهويتك التجارية المميزة.', color: 'bg-pink-500' },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover-lift relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-16 h-16 ${feature.color} rounded-br-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-secondary mb-3 text-xl">{feature.title}</h3>
                  <p className="text-secondary/60 leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
                4 خطوات بسيطة <span className="gradient-text">للبدء</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'أنشئ محتواك', desc: 'حول معرفتك إلى دورات تفاعلية باستخدام منشئ السحب والإفلات', icon: '✍️' },
                { step: '02', title: 'خصص صفحتك', desc: 'صمم بعلامتك التجارية وأضف هويتك المميزة', icon: '🎨' },
                { step: '03', title: 'أطلق وبيع', desc: 'انشر وابدأ الاستقبال بسهولة وبدون تعقيد', icon: '🚀' },
                { step: '04', title: 'نمّ أعمالك', desc: 'استخدم أدوات التسويق المدمجة للوصول لعملاء أكثر', icon: '📈' },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i *150}>
                  <div className="relative group">
                    <div className="text-center lg:text-left">
                      <div className="relative inline-flex">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                          {item.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <h3 className="font-semibold text-secondary mb-3 text-xl">{item.title}</h3>
                      <p className="text-secondary/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection delay={600}>
            <div className="mt-16 text-center">
              <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white font-semibold hover:bg-primary/90 transition-all rounded-xl shadow-lg hover:shadow-xl">
                ابدأ الآن مجاناً
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center relative">
          <AnimatedSection>
            <div className="text-5xl mb-6">🎯</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-white/90 mb-10 text-xl max-w-2xl mx-auto">
              ابدأ مجاناً اليوم وانضم إلى آلاف المنشئين الناجحين حول العالم
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="group px-10 py-4 bg-white text-primary font-semibold hover:bg-white/90 transition-all rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl">
                ابدأ مجاناً
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a href="#pricing" className="px-10 py-4 border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors rounded-xl">
                شاهد الأسعار
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
                يتكامل مع <span className="gradient-text">أدواتك المفضلة</span>
              </h2>
              <p className="text-secondary/70 mt-4 text-lg">
                ربط سلس مع أكثر من 50 أداة تستخدمها يومياً
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Stripe', color: 'bg-indigo-100 text-indigo-600' },
              { name: 'PayPal', color: 'bg-blue-100 text-blue-600' },
              { name: 'Zoom', color: 'bg-blue-100 text-blue-600' },
              { name: 'Mailchimp', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Zapier', color: 'bg-orange-100 text-orange-600' },
              { name: 'Slack', color: 'bg-purple-100 text-purple-600' },
              { name: 'WhatsApp', color: 'bg-green-100 text-green-600' },
              { name: 'Google', color: 'bg-red-100 text-red-600' },
              { name: 'Notion', color: 'bg-gray-100 text-gray-600' },
              { name: 'Teams', color: 'bg-blue-100 text-blue-600' },
              { name: 'Calendly', color: 'bg-blue-100 text-blue-600' },
              { name: 'Shopify', color: 'bg-green-100 text-green-600' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className="group bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover-lift">
                  <div className={`w-12 h-12 ${item.color} rounded-xl mx-auto mb-3 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="text-sm font-medium text-secondary">{item.name}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={700}>
            <div className="mt-12 bg-gradient-to-r from-secondary to-secondary/90 rounded-2xl p-10 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="grid lg:grid-cols-2 gap-8 items-center relative">
                <div>
                  <h3 className="text-2xl font-bold mb-3">هل تحتاج لتكامل خاص؟</h3>
                  <p className="text-white/80 text-lg">فريقنا التقني جاهز لمساعدتك في ربط أي أداة تحتاجها. API مخصص للتكاملات المتقدمة.</p>
                </div>
                <div className="lg:text-end">
                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-semibold hover:bg-white/20 transition-colors rounded-xl">
                    تواصل معنا
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
                ماذا يقول <span className="gradient-text">عملاؤنا</span>
              </h2>
              <p className="text-secondary/70 mt-4 text-lg">قصص نجاح حقيقية من منشئين حقيقيين</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'منصة رائعة ساعدتني على إطلاق دورتي في أقل من أسبوع. الدعم الفني ممتاز والواجهة سهلة جداً.', author: 'أحمد محمد', role: 'مدرب برمجة', stat: '1500+ طالب' },
              { quote: 'الدعم الفني ممتاز والمنصة سهلة الاستخدام جداً. زدت مبيعاتي بنسبة 200% في أول شهرين.', author: 'سارة العلي', role: 'مصممة جرافيك', stat: '+200% مبيعات' },
              { quote: 'زدت مبيعاتي بنسبة 150% في أول شهر. التحليلات ساعدتني على فهم جمهوري بشكل أفضل.', author: 'خالد الأحمد', role: 'مستشار أعمال', stat: '+150% إيرادات' },
            ].map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden hover-lift">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                  <div className="relative">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-secondary/80 mb-6 leading-relaxed text-lg">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-secondary">{testimonial.author}</div>
                        <div className="text-secondary/60 text-sm">{testimonial.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-bold">{testimonial.stat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-primary/5 to-white" />
        <div className="mx-auto max-w-6xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">خطط لكل مرحلة من نموك</h2>
              <p className="text-secondary/70 mt-4 text-lg">ابدأ مجاناً، ترقّ عند الحاجة</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'المبتدئ', price: 'مجاني', period: 'للأبد', popular: false, features: ['دورة واحدة', 'طلاب غير محدودين', 'صفحة هبوط واحدة', 'دعم عبر البريد'] },
              { name: 'الاحترافي', price: '$99', period: '/شهر', popular: true, features: ['دورات غير محدودة', 'صفحات هبوط غير محدودة', 'تحليلات متقدمة', 'أدوات البيع', 'دعم أولوية', 'إلغاء الإعلانات'] },
              { name: 'المؤسسات', price: '$299', period: '/شهر', popular: false, features: ['كل مميزات الاحترافي', 'API مخصص', 'مدير حساب مخصص', 'تقارير مخصصة', 'تكاملات متقدمة', 'تدريب مخصص'] },
            ].map((plan, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className={`relative bg-white rounded-2xl p-8 border-2 ${plan.popular ? 'border-primary shadow-xl' : 'border-gray-100'} hover:shadow-xl transition-all duration-300 hover-lift`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                      الأكثر شعبية
                    </div>
                  )}
                  <div className="text-secondary/60 mb-2 font-medium">{plan.name}</div>
                  <div className="text-4xl font-bold text-secondary mb-1">
                    {plan.price}<span className="text-lg font-normal text-secondary/60">{plan.period}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-6" />
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 font-semibold rounded-xl transition-all ${plan.popular ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl' : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}>
                    ابدأ الآن
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
                أسئلة <span className="gradient-text">شائعة</span>
              </h2>
              <p className="text-secondary/70 mt-4 text-lg">إجابات على أكثر الأسئلة شيوعاً</p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {[
              { q: 'كيف يمكنني البدء؟', a: 'أنشئ حسابك مجاناً في دقائق وابدأ فوراً. لا حاجة لبطاقة ائتمان أو خبرة تقنية.' },
              { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم، يمكنك الإلغاء في أي وقت بدون رسوم. نحتفظ ببياناتك لمدة 30 يوم إذا أردت العودة.' },
              { q: 'ما طرق الدفع المتاحة؟', a: 'ندعم Stripe و PayPal وجميع البطاقات الائتمانية الرئيسية. الدفع آمن ومشفّر بالكامل.' },
              { q: 'هل هناك دعم فني؟', a: 'نعم، نوفر دعماً مجانياً عبر البريد والدردشة الحية. للخطط المدفوعة، دعم أولوية على مدار الساعة.' },
            ].map((faq, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <details className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/20 transition-all duration-300">
                  <summary className="px-6 py-5 cursor-pointer font-semibold text-secondary flex items-center justify-between hover:bg-gray-50 rounded-2xl">
                    <span className="text-lg">{faq.q}</span>
                    <svg className="w-6 h-6 text-primary group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-secondary/70 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-secondary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center relative">
          <AnimatedSection>
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              ابدأ رحلتك التعليمية اليوم
            </h2>
            <p className="text-white/80 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
              انضم إلى آلاف المنشئين والمعلمين الناجحين. ابدأ مجاناً، بدون بطاقة ائتمان.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="group px-10 py-4 bg-white text-secondary font-semibold hover:bg-white/90 transition-all rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl">
                ابدأ مجاناً
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/contact" className="px-10 py-4 border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors rounded-xl">
                تواصل معنا
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}