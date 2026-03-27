'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  source: string;
  sourceCustom?: string;
  text: string;
  avatar?: string;
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ name, src }: { name: string; src?: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="relative w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
      {src && !error ? (
        <Image src={src} alt={name} fill className="object-cover" unoptimized onError={() => setError(true)} />
      ) : (
        initials(name)
      )}
    </div>
  );
}

function SourceBadge({ source, sourceCustom }: { source: string; sourceCustom?: string }) {
  if (source === 'trustpilot') return <span className="text-green-400 text-xs">★ Trustpilot</span>;
  if (source === 'google') return <span className="text-blue-400 text-xs font-medium">G Google</span>;
  return <span className="text-slate-400 text-xs">{sourceCustom || source}</span>;
}

export default function TestimonialSlider({
  testimonials,
  pauseDuration,
}: {
  testimonials: Testimonial[];
  pauseDuration: number;
}) {
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);

  const itemsPerPage = 3;
  const pages: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += itemsPerPage) {
    const chunk = testimonials.slice(i, i + itemsPerPage);
    // Fill last page with wrap-around items if needed
    while (chunk.length < itemsPerPage && testimonials.length >= itemsPerPage) {
      chunk.push(testimonials[(i + chunk.length) % testimonials.length]);
    }
    pages.push(chunk);
  }

  const totalPages = pages.length;

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setPage((p) => (p + 1) % totalPages);
        setAnimating(false);
      }, 600);
    }, pauseDuration * 1000);
    return () => clearInterval(t);
  }, [pauseDuration, totalPages]);

  if (testimonials.length === 0) return null;

  const current = pages[page] ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        {current.map((t, i) => (
          <div key={i} className="flex items-start gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-4">
            <Avatar name={t.name} src={t.avatar} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-secondary)] line-clamp-3 mb-2">{t.text}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">{t.name}</span>
                <SourceBadge source={t.source} sourceCustom={t.sourceCustom} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === page ? 'bg-blue-400 w-4' : 'bg-[var(--border)]'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
