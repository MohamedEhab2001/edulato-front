'use client';

import React from 'react';
import {useState} from 'react';
import {useTranslations} from 'next-intl';

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

export default function ContactPage() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);

  const methods = [
    { icon: '📧', title: 'الدعم الفني', desc: 'للاستفسارات التقنية والمساعدة', action: 'support@edulato.com', type: 'email' },
    { icon: '💼', title: 'المبيعات', desc: 'للاستفسارات عن الخطط والأسعار', action: 'sales@edulato.com', type: 'email' },
    { icon: '🤝', title: 'الشراكات', desc: 'لفرص الشراكة والتعاون', action: 'partners@edulato.com', type: 'email' },
  ];

  const faqs = [
    { q: 'كيف يمكنني البدء؟', a: 'أنشئ حسابك مجاناً في دقائق وابدأ فوراً. لا حاجة لبطاقة ائتمان.' },
    { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم، يمكنك الإلغاء في أي وقت بدون رسوم.' },
    { q: 'ما طرق الدفع المتاحة؟', a: 'ندعم Stripe و PayPal وجميع البطاقات الائتمانية الرئيسية.' },
    { q: 'هل هناك دعم فني؟', a: 'نعم، نوفر دعماً مجانياً عبر البريد والدردشة الحية.' },
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
                <span className="text-sm text-primary font-medium">نحن هنا لمساعدتك</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-6">
                تواصل <span className="gradient-text">معنا</span>
              </h1>
              <p className="text-lg text-secondary/70 leading-relaxed">
                نحن هنا لمساعدتك. اختر الطريقة المناسبة للتواصل معنا وسنرد عليك في أقرب وقت.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              {methods.map((method, i) => (
                <div key={i} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover-lift text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{method.title}</h3>
                  <p className="text-secondary/60 mb-4">{method.desc}</p>
                  <a href={`mailto:${method.action}`} className="text-primary font-medium hover:underline">
                    {method.action}
                  </a>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
                أرسل رسالة
              </h2>
              <p className="text-secondary/60">
                املأ النموذج أدناه وسنرد عليك خلال 24 ساعة
              </p>
            </div>
          </AnimatedSection>

          {submitted ? (
            <AnimatedSection>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">تم إرسال رسالتك بنجاح!</h3>
                <p className="text-secondary/60">سنتواصل معك قريباً.</p>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection delay={100}>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-secondary font-medium mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary font-medium mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-secondary font-medium mb-2">الموضوع</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="موضوع الرسالة"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-secondary font-medium mb-2">الرسالة</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  إرسال الرسالة
                </button>
              </form>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
                أسئلة <span className="gradient-text">شائعة</span>
              </h2>
              <p className="text-secondary/60">
                إجابات سريعة على الأسئلة الأكثر شيوعاً
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 50}>
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

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center relative">
          <AnimatedSection>
            <div className="text-5xl mb-6">💬</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              هل تحتاج مساعدة فورية؟
            </h2>
            <p className="text-white/80 mb-10 text-xl">
              فريق الدعم متاح على مدار الساعة لمساعدتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:support@edulato.com" className="group px-10 py-4 bg-white text-secondary font-semibold hover:bg-white/90 transition-all rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl">
                راسلنا الآن
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}