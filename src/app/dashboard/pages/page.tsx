'use client';

import { useState, useEffect } from 'react';

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
  subtitle: string;
  description: string;
  sections: Section[];
}

// ── Helpers ────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const emptyPage = (): Page => ({
  id: '', title: '', slug: '', subtitle: '', description: '', sections: [],
});

const blankSection = (type: Section['type']): Section => {
  if (type === 'text')  return { type: 'text',  title: 'New Section', body: '' };
  if (type === 'cards') return { type: 'cards', title: 'New Section', items: [{ icon: '⭐', title: 'Card Title', description: 'Card description.', bullets: [] }] };
  if (type === 'steps') return { type: 'steps', title: 'New Section', items: [{ step: '01', title: 'Step 1', description: '' }] };
  return { type: 'cta', heading: 'Ready to Get Started?', body: '', buttonLabel: 'Contact Me', buttonHref: '/contact' };
};

const SECTION_LABELS: Record<string, string> = {
  text: '📝 Text', cards: '🃏 Cards', steps: '🔢 Steps', cta: '🚀 CTA',
};

const BADGE: Record<string, string> = {
  text:  'bg-blue-500/20 text-blue-400',
  cards: 'bg-purple-500/20 text-purple-400',
  steps: 'bg-amber-500/20 text-amber-400',
  cta:   'bg-green-500/20 text-green-400',
};

const INPUT = 'w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm';
const TEXTAREA = INPUT + ' resize-none';

// ── Section editors ────────────────────────────────────────────
function TextEditor({ s, onChange }: { s: TextSection; onChange: (p: Partial<TextSection>) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-slate-400 text-xs mb-1">Section Title</label>
        <input className={INPUT} value={s.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>
      <div>
        <label className="block text-slate-400 text-xs mb-1">Body Text</label>
        <textarea className={TEXTAREA} rows={5} value={s.body} onChange={(e) => onChange({ body: e.target.value })} />
      </div>
    </div>
  );
}

function CardsEditor({ s, onChange }: { s: CardsSection; onChange: (p: Partial<CardsSection>) => void }) {
  const update = (i: number, patch: Partial<CardItem>) => {
    const items = s.items.map((item, idx) => idx === i ? { ...item, ...patch } : item);
    onChange({ items });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-400 text-xs mb-1">Section Title</label>
        <input className={INPUT} value={s.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>
      {s.items.map((item, i) => (
        <div key={i} className="bg-slate-900/60 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 text-xs font-medium">Card {i + 1}</span>
            <button
              onClick={() => onChange({ items: s.items.filter((_, idx) => idx !== i) })}
              className="text-red-400 hover:text-red-300 text-xs"
            >Remove</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Icon (emoji)</label>
              <input className={INPUT} value={item.icon} onChange={(e) => update(i, { icon: e.target.value })} />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Title</label>
              <input className={INPUT} value={item.title} onChange={(e) => update(i, { title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Description</label>
            <textarea className={TEXTAREA} rows={2} value={item.description} onChange={(e) => update(i, { description: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Bullet points (one per line)</label>
            <textarea className={TEXTAREA} rows={3} value={item.bullets.join('\n')} onChange={(e) => update(i, { bullets: e.target.value.split('\n').filter(Boolean) })} />
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange({ items: [...s.items, { icon: '⭐', title: 'New Card', description: '', bullets: [] }] })}
        className="px-3 py-1.5 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-lg text-xs transition-colors"
      >+ Add Card</button>
    </div>
  );
}

function StepsEditor({ s, onChange }: { s: StepsSection; onChange: (p: Partial<StepsSection>) => void }) {
  const update = (i: number, patch: Partial<StepItem>) => {
    const items = s.items.map((item, idx) => idx === i ? { ...item, ...patch } : item);
    onChange({ items });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-400 text-xs mb-1">Section Title</label>
        <input className={INPUT} value={s.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>
      {s.items.map((item, i) => (
        <div key={i} className="bg-slate-900/60 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 text-xs font-medium">Step {i + 1}</span>
            <button
              onClick={() => onChange({ items: s.items.filter((_, idx) => idx !== i) })}
              className="text-red-400 hover:text-red-300 text-xs"
            >Remove</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">No.</label>
              <input className={INPUT} value={item.step} onChange={(e) => update(i, { step: e.target.value })} />
            </div>
            <div className="col-span-3">
              <label className="block text-slate-400 text-xs mb-1">Title</label>
              <input className={INPUT} value={item.title} onChange={(e) => update(i, { title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Description</label>
            <textarea className={TEXTAREA} rows={2} value={item.description} onChange={(e) => update(i, { description: e.target.value })} />
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const n = s.items.length + 1;
          onChange({ items: [...s.items, { step: String(n).padStart(2, '0'), title: `Step ${n}`, description: '' }] });
        }}
        className="px-3 py-1.5 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-lg text-xs transition-colors"
      >+ Add Step</button>
    </div>
  );
}

function CtaEditor({ s, onChange }: { s: CtaSection; onChange: (p: Partial<CtaSection>) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-slate-400 text-xs mb-1">Heading</label>
        <input className={INPUT} value={s.heading} onChange={(e) => onChange({ heading: e.target.value })} />
      </div>
      <div>
        <label className="block text-slate-400 text-xs mb-1">Body text</label>
        <textarea className={TEXTAREA} rows={3} value={s.body} onChange={(e) => onChange({ body: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 text-xs mb-1">Button Label</label>
          <input className={INPUT} value={s.buttonLabel} onChange={(e) => onChange({ buttonLabel: e.target.value })} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Button URL</label>
          <input className={INPUT} value={s.buttonHref} onChange={(e) => onChange({ buttonHref: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function DashboardPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'sections'>('general');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/content/pages')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPages(d); })
      .catch(() => {});
  }, []);

  const savePages = async (updated: Page[]) => {
    setSaving(true);
    try {
      await fetch('/api/content/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setPages(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const handleSave = async () => {
    if (!editing || !editing.title.trim()) return;
    const page: Page = {
      ...editing,
      id: editing.id || Date.now().toString(),
      slug: editing.slug || slugify(editing.title),
    };
    const updated = editing.id
      ? pages.map((p) => p.id === editing.id ? page : p)
      : [...pages, page];
    await savePages(updated);
    setEditing(page);
  };

  const handleDelete = async (id: string) => {
    await savePages(pages.filter((p) => p.id !== id));
  };

  const handleEdit = (page: Page) => {
    setEditing({ ...page, subtitle: page.subtitle ?? '', description: page.description ?? '', sections: page.sections ?? [] });
    setActiveTab('general');
    setExpandedSection(null);
  };

  const updateSection = (i: number, patch: Partial<Section>) => {
    if (!editing) return;
    const sections = editing.sections.map((s, idx) => idx === i ? { ...s, ...patch } as Section : s);
    setEditing({ ...editing, sections });
  };

  const removeSection = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, sections: editing.sections.filter((_, idx) => idx !== i) });
    if (expandedSection === i) setExpandedSection(null);
  };

  const addSection = (type: Section['type']) => {
    if (!editing) return;
    const sections = [...editing.sections, blankSection(type)];
    setEditing({ ...editing, sections });
    setExpandedSection(sections.length - 1);
  };

  const moveSection = (i: number, dir: -1 | 1) => {
    if (!editing) return;
    const sections = [...editing.sections];
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    [sections[i], sections[j]] = [sections[j], sections[i]];
    setEditing({ ...editing, sections });
    setExpandedSection(j);
  };

  // ── List view ──────────────────────────────────────────────
  if (!editing) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">📄 Pages</h1>
            <p className="text-slate-400 text-sm">Create and manage custom pages on your site</p>
          </div>
          <button
            onClick={() => { setEditing(emptyPage()); setActiveTab('general'); }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            + Add Page
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-sm">No custom pages yet. Click &quot;Add Page&quot; to create one.</p>
          </div>
        ) : (
          <div className="max-w-2xl space-y-3">
            {pages.map((page) => (
              <div key={page.id} className="bg-slate-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{page.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    /{page.slug} · {(page.sections ?? []).length} section{(page.sections ?? []).length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors">
                    View ↗
                  </a>
                  <button onClick={() => handleEdit(page)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(page.id)}
                    className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Editor view ────────────────────────────────────────────
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-0.5">
              {editing.id ? editing.title || 'Edit Page' : 'New Page'}
            </h1>
            {editing.slug && <p className="text-slate-500 text-xs">/{editing.slug}</p>}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !editing.title.trim()}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
          }`}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-700/50">
        {(['general', 'sections'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}>
            {tab === 'sections' ? `Sections (${editing.sections.length})` : 'General'}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Page Title *</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
                value={editing.title}
                onChange={(e) => setEditing({
                  ...editing,
                  title: e.target.value,
                  slug: editing.slug || slugify(e.target.value),
                })}
                placeholder="About My Journey"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">URL Slug</label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                <span className="text-slate-500 text-xs px-3 border-r border-slate-700 py-3 flex-shrink-0">/</span>
                <input
                  className="flex-1 bg-transparent text-white px-3 py-3 focus:outline-none text-sm"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  placeholder="about-my-journey"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Subtitle <span className="text-slate-500 font-normal">(shown in hero)</span>
            </label>
            <input
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
              value={editing.subtitle}
              onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
              placeholder="A short tagline above the title"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Description <span className="text-slate-500 font-normal">(shown in hero)</span>
            </label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm resize-none"
              rows={3}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              placeholder="A brief description shown below the title…"
            />
          </div>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-4 max-w-2xl">
          {editing.sections.length === 0 && (
            <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-xl">
              <p className="text-2xl mb-2">🧩</p>
              <p className="text-sm">No sections yet. Add one below.</p>
            </div>
          )}

          {editing.sections.map((section, i) => {
            const isOpen = expandedSection === i;
            const label = 'title' in section ? section.title : (section as CtaSection).heading;
            return (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 p-4">
                  <button
                    onClick={() => setExpandedSection(isOpen ? null : i)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${BADGE[section.type]}`}>
                      {SECTION_LABELS[section.type]}
                    </span>
                    <span className="text-white text-sm font-medium truncate">{label}</span>
                    <span className="text-slate-400 ml-auto flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => moveSection(i, -1)} disabled={i === 0}
                      className="px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30 text-xs rounded transition-colors">↑</button>
                    <button onClick={() => moveSection(i, 1)} disabled={i === editing.sections.length - 1}
                      className="px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30 text-xs rounded transition-colors">↓</button>
                    <button onClick={() => removeSection(i)}
                      className="px-2 py-1 text-red-400 hover:text-red-300 text-xs rounded transition-colors">✕</button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                    {section.type === 'text'  && <TextEditor  s={section} onChange={(p) => updateSection(i, p as Partial<Section>)} />}
                    {section.type === 'cards' && <CardsEditor s={section} onChange={(p) => updateSection(i, p as Partial<Section>)} />}
                    {section.type === 'steps' && <StepsEditor s={section} onChange={(p) => updateSection(i, p as Partial<Section>)} />}
                    {section.type === 'cta'   && <CtaEditor   s={section} onChange={(p) => updateSection(i, p as Partial<Section>)} />}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2">
            <p className="text-slate-500 text-xs mb-3">Add section:</p>
            <div className="flex flex-wrap gap-2">
              {(['text', 'cards', 'steps', 'cta'] as const).map((type) => (
                <button key={type} onClick={() => addSection(type)}
                  className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors">
                  {SECTION_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
