import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { T } from '@/components/frontend/T';
import { readData } from '@/lib/db';

interface AboutData {
  title: string;
  subtitle: string;
  profileIcon?: string;
  showProfileIcon?: boolean;
  profileGradientFrom?: string;
  profileGradientTo?: string;
  bios: string[];
  details: Array<{ label: string; value: string }>;
  expertise: Array<{ icon: string; title: string; description: string }>;
  timeline: Array<{ year: string; title: string; description: string }>;
}

export const dynamic = 'force-dynamic';

const defaultAbout: AboutData = {
  title: 'About Me', subtitle: 'Who I Am', bios: [],
  details: [], expertise: [], timeline: [],
};

export default async function AboutPage() {
  const data = await readData<AboutData>('about.json', defaultAbout);

  const expertiseIcons: Record<string, string> = {
    wordpress: '🌐',
    server: '🖥️',
    domain: '🔒',
    hosting: '☁️',
  };

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-blue-100 dark:to-blue-950" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
                <T k="about.subtitle">{data.subtitle}</T>
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
                <T k="about.title">{data.title}</T>
              </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Bio */}
              <div>
                {data.showProfileIcon !== false && (
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-8"
                    style={{
                      background: `linear-gradient(to bottom right, ${data.profileGradientFrom || '#3b82f6'}, ${data.profileGradientTo || '#9333ea'})`,
                    }}
                  >
                    {data.profileIcon || ''}
                  </div>
                )}
                {(data.bios ?? []).map((bio, i) => (
                  <p key={i} className={`leading-relaxed mb-6 ${i === 0 ? 'text-[var(--text-secondary)] text-lg' : 'text-[var(--text-muted)]'}`}>
                    <T k={`about.bio.${i}`}>{bio}</T>
                  </p>
                ))}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  {data.details.map((detail, i) => (
                    <div key={i} className="glass rounded-xl p-4">
                      <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                        <T k={`about.detail.${i}.label`}>{detail.label}</T>
                      </p>
                      <p className="text-[var(--text-primary)] font-medium text-sm"><T k={`about.detail.${i}.value`}>{detail.value}</T></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8"><T k="ui.myJourney">My Journey</T></h3>
                <div className="space-y-6">
                  {data.timeline.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                            {item.year.slice(-2)}
                          </span>
                        </div>
                        {i < data.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-[var(--border)] mt-2" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-blue-600 dark:text-blue-400 text-sm mb-1">{item.year}</p>
                        <h4 className="text-[var(--text-primary)] font-semibold mb-1"><T k={`about.timeline.${i}.title`}>{item.title}</T></h4>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                          <T k={`about.timeline.${i}.desc`}>{item.description}</T>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="py-20 bg-[var(--surface)]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                <T k="ui.areasOfExpertise">Areas of Expertise</T>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.expertise.map((item, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-4">
                    {expertiseIcons[item.icon] || item.icon || '⚡'}
                  </div>
                  <h3 className="text-[var(--text-primary)] font-bold mb-3"><T k={`about.expertise.${i}.title`}>{item.title}</T></h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                    <T k={`about.expertise.${i}.desc`}>{item.description}</T>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </FrontendWrapper>
  );
}
