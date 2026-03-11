import Link from 'next/link';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { T } from '@/components/frontend/T';
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

const defaultServices: ServicesData = {
  title: 'My Services', subtitle: 'What I Offer', description: '',
  services: [], process: [],
};

export default function ServicesPage() {
  const data = readData<ServicesData>('services.json', defaultServices);

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-purple-100 dark:to-purple-950" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
              <T k="services.subtitle">{data.subtitle}</T>
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
              <T k="services.title">{data.title}</T>
            </h1>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
              <T k="services.description">{data.description}</T>
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
                        <T k="ui.mostPopular">Most Popular</T>
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
                  <h3 className="text-[var(--text-primary)] font-bold text-xl mb-3"><T k={`services.item.${data.services.indexOf(service)}.title`}>{service.title}</T></h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 flex-1">
                    <T k={`services.item.${data.services.indexOf(service)}.desc`}>{service.description}</T>
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-green-400 text-xs">✓</span>
                        <T k={`services.item.${data.services.indexOf(service)}.feature.${fi}`}>{feature}</T>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <span className="text-blue-400 font-semibold text-sm"><T k={`services.item.${data.services.indexOf(service)}.price`}>{service.price}</T></span>
                    <Link
                      href="/contact"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      <T k="ui.getStarted">Get Started</T>
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
                <T k="ui.howIWork">How I Work</T>
              </h2>
              <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                <T k="ui.processSubtitle">A simple, transparent process from start to finish.</T>
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {data.process.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-400 font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-[var(--text-primary)] font-bold mb-2"><T k={`services.process.${i}.title`}>{step.title}</T></h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed"><T k={`services.process.${i}.desc`}>{step.description}</T></p>
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
                <T k="ui.needCustomSolution">Need a Custom Solution?</T>
              </h2>
              <p className="text-[var(--text-muted)] mb-8">
                <T k="ui.customSolutionDesc">{"Don't see exactly what you need? Let's discuss your project and I'll create a custom package for you."}</T>
              </p>
              <Link
                href="/contact"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 inline-block"
              >
                <T k="ui.contactMe">Contact Me</T>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </FrontendWrapper>
  );
}
