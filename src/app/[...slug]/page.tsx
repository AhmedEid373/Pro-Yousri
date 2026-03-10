import { notFound } from 'next/navigation';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { readData } from '@/lib/db';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export const dynamic = 'force-dynamic';

export default async function CustomPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params;
  const pages = readData<Page[]>('pages.json');
  const slug = slugParts.join('/');
  const page = pages.find((p) => p.slug === slug);

  if (!page) notFound();

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-blue-950" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">{page.title}</h1>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8">
              <div
                className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm"
              >
                {page.content}
              </div>
            </div>
          </div>
        </section>
      </div>
    </FrontendWrapper>
  );
}
