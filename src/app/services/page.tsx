import Link from 'next/link';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { readData } from '@/lib/db';

interface Service {
  id: number;
  icon: string;
  iconUrl?: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  popular: boolean;
}

interface ServicesData {
  title: string;
  subtitle: string;
  description: string;
  services: Service[];
  process: Array<{ step: string; title: string; description: string }>;
}

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  const data = readData<ServicesData>('services.json');

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-purple-950" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
              {data.subtitle}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
              {data.title}
            </h1>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className={`relative glass rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                    service.popular ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : ''
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    {service.iconUrl ? (
                      <img src={service.iconUrl} alt={service.title} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <span className="text-4xl">{service.icon}</span>
                    )}
                  </div>
                  <h3 className="text-[var(--text-primary)] font-bold text-xl mb-3">{service.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-green-400 text-xs">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <span className="text-blue-400 font-semibold text-sm">{service.price}</span>
                    <Link
                      href="/contact"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-[var(--surface)]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                How I <span className="gradient-text">Work</span>
              </h2>
              <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                A simple, transparent process from start to finish.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {data.process.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-400 font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-[var(--text-primary)] font-bold mb-2">{step.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass rounded-3xl p-12">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-[var(--text-muted)] mb-8">
                Don&apos;t see exactly what you need? Let&apos;s discuss your project and I&apos;ll create a custom package for you.
              </p>
              <Link
                href="/contact"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 inline-block"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </section>
      </div>
    </FrontendWrapper>
  );
}
