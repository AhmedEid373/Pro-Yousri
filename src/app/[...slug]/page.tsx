import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { readData } from '@/lib/db';

// ── Types ──────────────────────────────────────────────────────
interface SectionStyle {
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  backgroundColor?: string;
  textColor?: string;
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
}

interface SectionLink { linkUrl?: string; linkTarget?: '_blank' | '_self'; linkText?: string; }
interface CardItem  { icon: string; title: string; description: string; bullets: string[]; linkUrl?: string; linkTarget?: '_blank' | '_self'; linkText?: string; }
interface StepItem  { step: string; title: string; description: string; }
interface TextSection  { type: 'text';  title: string; body: string; style?: SectionStyle; imageUrl?: string; imageAlt?: string; imagePosition?: 'above' | 'below' | 'left' | 'right'; link?: SectionLink; }
interface CardsSection { type: 'cards'; title: string; items: CardItem[]; style?: SectionStyle; }
interface StepsSection { type: 'steps'; title: string; items: StepItem[]; style?: SectionStyle; link?: SectionLink; }
interface CtaSection   { type: 'cta';   heading: string; body: string; buttonLabel: string; buttonHref: string; style?: SectionStyle; }
interface ImageSection { type: 'image'; title: string; imageUrl: string; imageAlt: string; caption?: string; imageSize?: 'small' | 'medium' | 'large' | 'full'; style?: SectionStyle; link?: SectionLink; }
interface SpacerSection { type: 'spacer'; height: 'sm' | 'md' | 'lg' | 'xl'; }
type Section = TextSection | CardsSection | StepsSection | CtaSection | ImageSection | SpacerSection;

interface Page {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  sections?: Section[];
  content?: string; // legacy plain-text field
  heroStyle?: {
    textAlign?: 'left' | 'center' | 'right';
    titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    backgroundImage?: string;
    overlayColor?: string;
  };
}

// ── Style helpers ──────────────────────────────────────────────
const PADDING_MAP: Record<string, string> = {
  sm: 'py-8', md: 'py-16', lg: 'py-24', xl: 'py-32',
};

const FONT_SIZE_MAP: Record<string, string> = {
  sm: 'text-xs', base: 'text-sm', lg: 'text-base', xl: 'text-lg', '2xl': 'text-xl',
};

const TITLE_SIZE_MAP: Record<string, string> = {
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
  '2xl': 'text-4xl sm:text-5xl',
  '3xl': 'text-5xl sm:text-6xl',
};

const IMAGE_SIZE_MAP: Record<string, string> = {
  small: 'max-w-sm', medium: 'max-w-lg', large: 'max-w-3xl', full: 'max-w-full',
};

const SPACER_MAP: Record<string, string> = {
  sm: 'h-8', md: 'h-16', lg: 'h-24', xl: 'h-32',
};

function getTextAlign(align?: string): string {
  if (align === 'left') return 'text-left';
  if (align === 'right') return 'text-right';
  return 'text-center';
}

function getSectionStyles(style?: SectionStyle): React.CSSProperties {
  const result: React.CSSProperties = {};
  if (style?.backgroundColor) result.backgroundColor = style.backgroundColor;
  if (style?.textColor) result.color = style.textColor;
  return result;
}

function SectionLinkRenderer({ link, align }: { link?: SectionLink; align: string }) {
  if (!link?.linkUrl) return null;
  const isExternal = link.linkTarget === '_blank';
  const text = link.linkText || (isExternal ? 'Visit ↗' : 'Learn more →');
  const classes = `inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 text-sm no-underline`;
  if (isExternal) {
    return <div className={align}><a href={link.linkUrl} target="_blank" rel="noopener noreferrer" className={classes}>{text}</a></div>;
  }
  return <div className={align}><Link href={link.linkUrl} className={classes}>{text}</Link></div>;
}

export const dynamic = 'force-dynamic';

export default async function CustomPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const pages = await readData<Page[]>('pages.json', []);
  const slug = slugParts.join('/');
  const page = pages.find((p) => p.slug === slug);

  if (!page) notFound();

  const sections: Section[] = page.sections ?? [];
  const heroAlign = getTextAlign(page.heroStyle?.textAlign);
  const heroTitleSize = TITLE_SIZE_MAP[page.heroStyle?.titleSize || '2xl'];

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">

        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          {page.heroStyle?.backgroundImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${page.heroStyle.backgroundImage})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: page.heroStyle?.overlayColor || 'rgba(15, 23, 42, 0.85)',
                  opacity: 0.85,
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-blue-950" />
          )}
          <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${heroAlign}`}>
            {page.subtitle && (
              <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
                {page.subtitle}
              </p>
            )}
            <h1 className={`${heroTitleSize} font-bold text-[var(--text-primary)] mb-6`}>
              {page.title}
            </h1>
            {page.description && (
              <p className={`text-[var(--text-muted)] text-lg max-w-2xl leading-relaxed ${
                heroAlign === 'text-center' ? 'mx-auto' : ''
              }`}>
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
          const style = 'style' in section ? section.style : undefined;
          const paddingClass = PADDING_MAP[style?.paddingY || 'md'];
          const fontClass = FONT_SIZE_MAP[style?.fontSize || 'base'];
          const alignClass = getTextAlign(style?.textAlign);
          const inlineStyle = getSectionStyles(style);

          /* ── Spacer ── */
          if (section.type === 'spacer') {
            return <div key={i} className={SPACER_MAP[section.height || 'md']} />;
          }

          /* ── Image ── */
          if (section.type === 'image') {
            const sizeClass = IMAGE_SIZE_MAP[section.imageSize || 'large'];
            return (
              <section key={i} className={paddingClass} style={inlineStyle}>
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${alignClass}`}>
                  {section.title && (
                    <h2 className={`text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-8 ${alignClass}`}>
                      {section.title}
                    </h2>
                  )}
                  <div className={`${sizeClass} ${alignClass === 'text-center' ? 'mx-auto' : alignClass === 'text-right' ? 'ml-auto' : ''}`}>
                    {section.imageUrl && (
                      <Image
                        src={section.imageUrl}
                        alt={section.imageAlt || ''}
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-2xl shadow-lg"
                        unoptimized
                      />
                    )}
                    {section.caption && (
                      <p className="text-[var(--text-muted)] text-sm mt-3 italic">{section.caption}</p>
                    )}
                  </div>
                  <SectionLinkRenderer link={section.link} align={alignClass} />
                </div>
              </section>
            );
          }

          /* ── Text ── */
          if (section.type === 'text') {
            const hasImage = !!(section.imageUrl);
            const imgPos = section.imagePosition || 'below';
            const isHorizontal = imgPos === 'left' || imgPos === 'right';

            const textContent = (
              <div className={isHorizontal ? 'flex-1' : ''}>
                {section.title && (
                  <h2 className={`text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-8 ${alignClass}`}>
                    {section.title}
                  </h2>
                )}
                <div className="glass rounded-2xl p-8">
                  <p className={`leading-relaxed whitespace-pre-wrap ${fontClass} ${alignClass}`}
                    style={{ color: style?.textColor || 'var(--text-secondary)' }}>
                    {section.body}
                  </p>
                </div>
              </div>
            );

            const imageContent = hasImage ? (
              <div className={isHorizontal ? 'flex-1' : ''}>
                <Image
                  src={section.imageUrl!}
                  alt={section.imageAlt || ''}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  unoptimized
                />
              </div>
            ) : null;

            return (
              <section key={i} className={paddingClass} style={inlineStyle}>
                <div className={`${isHorizontal ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
                  {isHorizontal ? (
                    <div className={`flex flex-col md:flex-row gap-8 items-center ${imgPos === 'right' ? '' : 'md:flex-row-reverse'}`}>
                      {imgPos === 'left' ? <>{imageContent}{textContent}</> : <>{textContent}{imageContent}</>}
                    </div>
                  ) : (
                    <>
                      {imgPos === 'above' && imageContent && <div className="mb-8">{imageContent}</div>}
                      {textContent}
                      {imgPos === 'below' && imageContent && <div className="mt-8">{imageContent}</div>}
                    </>
                  )}
                  <SectionLinkRenderer link={section.link} align={alignClass} />
                </div>
              </section>
            );
          }

          /* ── Cards ── */
          if (section.type === 'cards') {
            return (
              <section key={i} className={paddingClass} style={inlineStyle}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <div className={`mb-12 ${alignClass}`}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                        {section.title}
                      </h2>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.items.map((card, j) => {
                      const isExternal = card.linkTarget === '_blank';
                      const cardClasses = `glass rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col ${alignClass} ${card.linkUrl ? 'cursor-pointer no-underline' : ''}`;
                      const cardContent = (
                        <>
                          <div className="mb-4">
                            <span className="text-4xl">{card.icon}</span>
                          </div>
                          <h3 className="text-[var(--text-primary)] font-bold text-xl mb-3">{card.title}</h3>
                          <p className={`text-[var(--text-muted)] leading-relaxed mb-4 flex-1 ${fontClass}`}>
                            {card.description}
                          </p>
                          {card.bullets.length > 0 && (
                            <ul className={`space-y-2 ${alignClass === 'text-left' ? '' : 'inline-block text-left'}`}>
                              {card.bullets.map((b, k) => (
                                <li key={k} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                  <span className="text-green-400 text-xs">✓</span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                          {card.linkUrl && (
                            <div className="mt-4 pt-3 border-t border-slate-700/30">
                              <span className="text-blue-400 text-sm font-medium">
                                {card.linkText || (isExternal ? 'Visit ↗' : 'Learn more →')}
                              </span>
                            </div>
                          )}
                        </>
                      );

                      if (card.linkUrl && isExternal) {
                        return <a key={j} href={card.linkUrl} target="_blank" rel="noopener noreferrer" className={cardClasses}>{cardContent}</a>;
                      }
                      if (card.linkUrl) {
                        return <Link key={j} href={card.linkUrl} className={cardClasses}>{cardContent}</Link>;
                      }
                      return <div key={j} className={cardClasses}>{cardContent}</div>;
                    })}
                  </div>
                </div>
              </section>
            );
          }

          /* ── Steps ── */
          if (section.type === 'steps') {
            return (
              <section key={i} className={`${paddingClass} bg-[var(--surface)]/30`} style={inlineStyle}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <div className={`mb-12 ${alignClass}`}>
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
                      <div key={j} className={alignClass}>
                        <div className={`w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 ${
                          alignClass === 'text-center' ? 'mx-auto' : alignClass === 'text-right' ? 'ml-auto' : ''
                        }`}>
                          <span className="text-blue-400 font-bold text-lg">{step.step}</span>
                        </div>
                        <h3 className="text-[var(--text-primary)] font-bold mb-2">{step.title}</h3>
                        <p className={`text-[var(--text-muted)] leading-relaxed ${fontClass}`}>{step.description}</p>
                      </div>
                    ))}
                  </div>
                  <SectionLinkRenderer link={section.link} align={alignClass} />
                </div>
              </section>
            );
          }

          /* ── CTA ── */
          if (section.type === 'cta') {
            return (
              <section key={i} className={paddingClass} style={inlineStyle}>
                <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${alignClass}`}>
                  <div className="glass rounded-3xl p-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
                      {section.heading}
                    </h2>
                    {section.body && (
                      <p className={`text-[var(--text-muted)] mb-8 max-w-xl ${
                        alignClass === 'text-center' ? 'mx-auto' : ''
                      }`}>
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
