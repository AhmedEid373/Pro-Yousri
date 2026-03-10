import Link from 'next/link';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { readData } from '@/lib/db';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  featured: boolean;
}

export const dynamic = 'force-dynamic';

export default function PortfolioPage() {
  const items = readData<PortfolioItem[]>('portfolio.json');

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">

        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-purple-950" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
              My Work
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Portfolio
            </h1>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
              A collection of projects I&apos;ve built — from WordPress sites to VPS setups and everything in between.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="text-5xl mb-4">🚀</p>
                <p className="text-lg font-medium">Projects coming soon</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="glass rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-blue-500/50 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl opacity-40">🚀</span>
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow">
                            ★ Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-[var(--text-primary)] font-bold text-lg mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3 flex-1">
                        {item.description}
                      </p>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Link */}
                      {item.link && item.link !== '#' && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors self-start"
                        >
                          View Project
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Zm6.5-1a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V6.06l-5.22 5.22a.75.75 0 0 1-1.06-1.06L14.44 5H10.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Back link */}
            <div className="text-center mt-16">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Hire Me for Your Project →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </FrontendWrapper>
  );
}
