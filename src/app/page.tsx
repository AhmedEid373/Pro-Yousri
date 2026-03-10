import Link from 'next/link';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import { readData } from '@/lib/db';

interface HomeData {
  hero: {
    greeting: string;
    name: string;
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaPrimaryLink: string;
    ctaSecondary: string;
    ctaSecondaryLink: string;
  };
  stats: Array<{ number: string; label: string }>;
  skills: Array<{ name: string; level: number }>;
}

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

const defaultHome: HomeData = {
  hero: { greeting: "Hello, I'm", name: 'Yousri', title: 'WordPress Developer & Web Specialist', subtitle: 'Expert in WordPress, Domains, VPS & Hosting Solutions', description: '', ctaPrimary: 'View My Work', ctaPrimaryLink: '/services', ctaSecondary: 'Contact Me', ctaSecondaryLink: '/contact' },
  stats: [],
  skills: [],
};

export default function HomePage() {
  const data = readData<HomeData>('home.json', defaultHome);
  const { hero, stats, skills } = data;

  const allPortfolio = readData<PortfolioItem[]>('portfolio.json', []);
  const featuredProjects = allPortfolio.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : allPortfolio.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-blue-950" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <p className="text-blue-400 font-medium mb-3 text-sm tracking-widest uppercase">
                {hero.greeting}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-4">
                {hero.name}
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold gradient-text mb-4">
                {hero.title}
              </h2>
              <p className="text-blue-300 text-lg mb-6">{hero.subtitle}</p>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10 max-w-2xl">
                {hero.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={hero.ctaPrimaryLink}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  {hero.ctaPrimary}
                </Link>
                <Link
                  href={hero.ctaSecondaryLink}
                  className="px-8 py-4 border border-[var(--border)] hover:border-blue-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                >
                  {hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[var(--surface)]/50 border-y border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-2">{stat.number}</p>
                  <p className="text-[var(--text-muted)] text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Technical <span className="gradient-text">Skills</span>
              </h2>
              <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                Years of hands-on experience have shaped my expertise across these key areas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[var(--text-secondary)] font-medium">{skill.name}</span>
                    <span className="text-blue-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-[var(--surface)]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                Some of my recent work that showcases my expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {displayProjects.map((project) => {
                const hasLink = project.link && project.link !== '#';
                const Card = (
                  <div className="glass rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-44 bg-gradient-to-br from-blue-900/40 to-purple-900/40 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl opacity-40">🚀</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-[var(--text-primary)] font-bold text-lg mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-[var(--text-muted)] text-sm mb-4 leading-relaxed flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg border border-blue-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {hasLink && (
                        <div className="mt-4 text-blue-400 text-xs font-medium group-hover:text-blue-300 transition-colors flex items-center gap-1">
                          View Project
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M4.5 11.5A.5.5 0 0 1 5 11h5.793L5.146 5.354a.5.5 0 1 1 .708-.708l5.647 5.646V5a.5.5 0 0 1 1 0v6.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );

                return hasLink ? (
                  <a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col"
                  >
                    {Card}
                  </a>
                ) : (
                  <div key={project.id} className="flex flex-col">
                    {Card}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/portfolio"
                className="px-8 py-4 border border-[var(--border)] hover:border-blue-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold rounded-xl transition-all duration-200 inline-block"
              >
                View All Projects →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass rounded-3xl p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-8">
                Let&apos;s build something amazing together. I&apos;m available for freelance projects and consulting.
              </p>
              <Link
                href="/contact"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 inline-block"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
