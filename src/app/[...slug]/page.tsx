import Link from 'next/link';
import { notFound } from 'next/navigation';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { readData } from '@/lib/db';

// ── Types ──────────────────────────────────────────────────────
interface CardItem  { icon: string; title: string; description: string; bullets: string[]; }
interface StepItem  { step: string; title: string; description: string; }
interface TextSection  { type: 'text';  title: string; body: string; }
interface CardsSection { type: 'cards'; title: string; items: CardItem[]; }
interface StepsSection { type: 'steps'; title: string; items: StepItem[]; }
interface CtaSection   { type: 'cta';   heading: string; body: string; buttonLabel: string; buttonHref: string; }
type Section = TextSection | CardsSection | StepsSection | CtaSection;

interface Page {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  sections?: Section[];
  content?: string; // legacy plain-text field
}

export const dynamic = 'force-dynamic';

export default async function CustomPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const pages = readData<Page[]>('pages.json', []);
  const slug = slugParts.join('/');
  const page = pages.find((p) => p.slug === slug);

  if (!page) notFound();

  const sections: Section[] = page.sections ?? [];

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">

        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-blue-950" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {page.subtitle && (
              <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
                {page.subtitle}
              </p>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
                {page.description}
              </p>
            )}
          </div>
        </section>

        {/* Legacy plain-text content (backwards compat) */}
        {page.content && sections.length === 0 && (
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass rounded-2xl p-8">
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
                  {page.content}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Structured sections */}
        {sections.map((section, i) => {
          /* ── Text ── */
          if (section.type === 'text') {
            return (
              <section key={i} className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">
                      {section.title}
                    </h2>
                  )}
                  <div className="glass rounded-2xl p-8">
                    <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
                      {section.body}
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          /* ── Cards ── */
          if (section.type === 'cards') {
            return (
              <section key={i} className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <div className="text-center mb-12">
                      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.items.map((card, j) => (
                      <div key={j} className="glass rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                        <div className="mb-4">
                          <span className="text-4xl">{card.icon}</span>
                        </div>
                        <h3 className="text-[var(--text-primary)] font-bold text-xl mb-3">{card.title}</h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4 flex-1">
                          {card.description}
                        </p>
                        {card.bullets.length > 0 && (
                          <ul className="space-y-2">
                            {card.bullets.map((b, k) => (
                              <li key={k} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <span className="text-green-400 text-xs">✓</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* ── Steps ── */
          if (section.type === 'steps') {
            return (
              <section key={i} className="py-16 bg-[var(--surface)]/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <div className="text-center mb-12">
                      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  <div className={`grid gap-8 ${
                    section.items.length <= 2 ? 'md:grid-cols-2' :
                    section.items.length === 3 ? 'md:grid-cols-3' :
                    'md:grid-cols-2 lg:grid-cols-4'
                  }`}>
                    {section.items.map((step, j) => (
                      <div key={j} className="text-center">
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
            );
          }

          /* ── CTA ── */
          if (section.type === 'cta') {
            return (
              <section key={i} className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="glass rounded-3xl p-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
                      {section.heading}
                    </h2>
                    {section.body && (
                      <p className="text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
                        {section.body}
                      </p>
                    )}
                    {section.buttonLabel && section.buttonHref && (
                      <Link
                        href={section.buttonHref}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 inline-block"
                      >
                        {section.buttonLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}

      </div>
    </FrontendWrapper>
  );
}
