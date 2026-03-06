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
  featuredProjects: Array<{
    id: number;
    title: string;
    description: string;
    tags: string[];
    link: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const data = readData<HomeData>('home.json');
  const { hero, stats, skills, featuredProjects } = data;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <p className="text-blue-400 font-medium mb-3 text-sm tracking-widest uppercase">
                {hero.greeting}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4">
                {hero.name}
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold gradient-text mb-4">
                {hero.title}
              </h2>
              <p className="text-blue-300 text-lg mb-6">{hero.subtitle}</p>
              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-2xl">
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
                  className="px-8 py-4 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                >
                  {hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-slate-800/50 border-y border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-2">{stat.number}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Technical <span className="gradient-text">Skills</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Years of hands-on experience have shaped my expertise across these key areas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-blue-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
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
        <section className="py-20 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Some of my recent work that showcases my expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="glass rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
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
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/services"
                className="px-8 py-4 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 inline-block"
              >
                View All Services →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass rounded-3xl p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-slate-400 text-lg mb-8">
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
