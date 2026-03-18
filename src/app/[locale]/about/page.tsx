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

function AnimatedSection({ children, className = '', delay =0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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
    let current =0;
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

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: '🎯', title: 'التمكين', desc: 'نزيل الحواجز التقنية لتمكين كل شخص من مشاركة معرفته' },
    { icon: '⭐', title: 'التميز', desc: 'نسعى دائماً لتقديم أفضل تجربة ممكنة لعملائنا' },
    { icon: '💡', title: 'الابتكار', desc: 'نتطور باستمرار ونبتكر حلولاً جديدة لتحديات عملائنا' },
    { icon: '🤝', title: 'الشفافية', desc: 'نؤمن بالوضوح والصدق في كل تعاملاتنا' },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'منشئ محتوى' },
    { value: 50, suffix: '+', label: 'دولة' },
    { value: 500000, suffix: '+', label: 'طالب' },
    { value: 50, suffix: 'M$', label: 'إيرادات حققها العملاء' },
  ];

  const team = [
    { name: 'أحمد محمد', role: 'المؤسس والرئيس التنفيذي', initial: 'أ' },
    { name: 'سارة العلي', role: 'مديرة المنتج', initial: 'س' },
    { name: 'خالد الأحمد', role: 'مدير التقنية', initial: 'خ' },
    { name: 'نورة السالم', role: 'مديرة التسويق', initial: 'ن' },
  ];

  return (
    <div className="bg-white pt-24 overflow-x-hidden">
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
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary font-medium">منذ2018</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-6">
                نحن <span className="gradient-text">إدولاتو</span>
              </h1>
              <p className="text-lg text-secondary/70 leading-relaxed">
                نمكّن المنشئين والمعلمين من بناء أعمال تعليمية ناجحة. مهمتنا هي تمكين كل شخص لديه خبرة من مشاركتها وتحويلها إلى عمل ناجح.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <span className="text-sm text-primary font-medium">مهمتنا</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">
                  نمكّن المعرفة
                </h2>
                <p className="text-secondary/70 text-lg leading-relaxed mb-6">
                  نؤمن بأن المعرفة هي أقوى أداة للتحول. مهمتنا هي تمكين كل شخص لديه خبرة من مشاركتها وتحويلها إلى عمل ناجح.
                </p>
                <p className="text-secondary/70 leading-relaxed">
                  بدأت إدولاتو من إحباط شخصي - رأينا كم من الخبراء والمعلمين يعانون لتحويل معرفتهم إلى أعمال مستدامة. بنينا منصة تجعل من السهل على أي شخص إنشاء دورات تعليمية احترافية، وبيعها، وإدارة علاقاته مع الطلاب.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/10 rounded-3xl blur-2xl opacity-50" />
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                  <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 float-animation">
                        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 2424">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div className="text-secondary/60 text-lg font-medium">تمكين المعرفة</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
                قيمنا <span className="gradient-text">الأساسية</span>
              </h2>
              <p className="text-secondary/70 max-w-2xl mx-auto text-lg">
                المبادئ التي نؤمن بها والتي توجه كل قرار نتخذه
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover-lift text-center">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-secondary mb-3">{value.title}</h3>
                  <p className="text-secondary/60">{value.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
                قصتنا
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                { year: '2018', title: 'البداية', desc: 'بدأت إدولاتو من إحباط شخصي - رأينا كم من الخبراء والمعلمين يعانون لتحويل معرفتهم إلى أعمال مستدامة.' },
                { year: '2019', title: 'النمو', desc: 'أطلقنا المنصة رسمياً وبدأنا بـ 100 منشئ محتوى. ردود الفعل كانت إيجابية جداً.' },
                { year: '2021', title: 'التوسع', desc: 'توسعنا إلى 50 دولة وحققنا أكثر من 10,000 منشئ محتوى على المنصة.' },
                { year: '2024', title: 'اليوم', desc: 'نساعد أكثر من 10,000 منشئ محتوى في جميع أنحاء العالم على تحقيق أحلامهم.' },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i *100}>
                  <div className="group flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {item.year}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-secondary mb-2">{item.title}</h3>
                      <p className="text-secondary/60">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
                فريقنا
              </h2>
              <p className="text-secondary/70 max-w-2xl mx-auto text-lg">
                فريق متنوع من المهنيين المتحمسين لتمكين المعرفة
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                    {member.initial}
                  </div>
                  <h3 className="font-semibold text-secondary text-lg">{member.name}</h3>
                  <p className="text-secondary/60">{member.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center relative">
          <AnimatedSection>
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              انضم إلينا في رحلة تمكين المعرفة
            </h2>
            <p className="text-white/80 mb-10 text-xl">
              كن جزءاً من مجتمعنا المتنامي من المنشئين والمعلمين
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