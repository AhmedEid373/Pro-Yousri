'use client';

import { useState, useEffect } from 'react';

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
  brandTicker: { speed: number; brands: Array<{ name: string }> };
  testimonialTicker: { speed: number; testimonials: Array<{ name: string; source: string; text: string; avatar?: string }> };
}

export default function DashboardHomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetch('/api/content/home').then((r) => r.json()).then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="p-8 text-slate-400">Loading...</div>;

  const tabs = ['hero', 'stats', 'skills', 'projects', 'tickers'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">🏠 Home Page</h1>
          <p className="text-slate-400 text-sm">Edit your home page content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
          }`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-700/50 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-6 max-w-2xl">
          {(Object.keys(data.hero) as Array<keyof typeof data.hero>).map((key) => (
            <div key={key}>
              <label className="block text-slate-300 text-sm font-medium mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {key === 'description' ? (
                <textarea
                  rows={3}
                  value={data.hero[key]}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, [key]: e.target.value } })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={data.hero[key]}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, [key]: e.target.value } })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4 max-w-2xl">
          {data.stats.map((stat, i) => (
            <div key={i} className="glass rounded-xl p-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1">Number</label>
                <input
                  type="text"
                  value={stat.number}
                  onChange={(e) => {
                    const stats = [...data.stats];
                    stats[i] = { ...stat, number: e.target.value };
                    setData({ ...data, stats });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const stats = [...data.stats];
                    stats[i] = { ...stat, label: e.target.value };
                    setData({ ...data, stats });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-4 max-w-2xl">
          {data.skills.map((skill, i) => (
            <div key={i} className="glass rounded-xl p-4 flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1">Skill Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const skills = [...data.skills];
                    skills[i] = { ...skill, name: e.target.value };
                    setData({ ...data, skills });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="w-32">
                <label className="block text-slate-400 text-xs mb-1">Level (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => {
                    const skills = [...data.skills];
                    skills[i] = { ...skill, level: Number(e.target.value) };
                    setData({ ...data, skills });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  const skills = data.skills.filter((_, idx) => idx !== i);
                  setData({ ...data, skills });
                }}
                className="text-red-400 hover:text-red-300 text-sm mt-4"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setData({ ...data, skills: [...data.skills, { name: 'New Skill', level: 80 }] })
            }
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Skill
          </button>
        </div>
      )}

      {/* Tickers Tab */}
      {activeTab === 'tickers' && (
        <div className="space-y-8 max-w-2xl">

          {/* Brand Ticker */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Brand Ticker (left → right)</h2>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Scroll Speed: {data.brandTicker?.speed ?? 30}s per loop</label>
              <input
                type="range" min="5" max="120" step="5"
                value={data.brandTicker?.speed ?? 30}
                onChange={(e) => setData({ ...data, brandTicker: { ...(data.brandTicker ?? { brands: [] }), speed: Number(e.target.value) } })}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Fast (5s)</span><span>Slow (120s)</span></div>
            </div>
            <div className="space-y-2">
              {(data.brandTicker?.brands ?? []).map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={b.name}
                    onChange={(e) => {
                      const brands = [...(data.brandTicker?.brands ?? [])];
                      brands[i] = { name: e.target.value };
                      setData({ ...data, brandTicker: { ...(data.brandTicker ?? { speed: 30 }), brands } });
                    }}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="Brand name"
                  />
                  <button
                    onClick={() => {
                      const brands = (data.brandTicker?.brands ?? []).filter((_, idx) => idx !== i);
                      setData({ ...data, brandTicker: { ...(data.brandTicker ?? { speed: 30 }), brands } });
                    }}
                    className="text-red-400 hover:text-red-300 px-2"
                  >✕</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setData({ ...data, brandTicker: { ...(data.brandTicker ?? { speed: 30 }), brands: [...(data.brandTicker?.brands ?? []), { name: 'New Brand' }] } })}
              className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
            >+ Add Brand</button>
          </div>

          {/* Testimonial Ticker */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Testimonials Ticker (right → left)</h2>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Scroll Speed: {data.testimonialTicker?.speed ?? 25}s per loop</label>
              <input
                type="range" min="5" max="120" step="5"
                value={data.testimonialTicker?.speed ?? 25}
                onChange={(e) => setData({ ...data, testimonialTicker: { ...(data.testimonialTicker ?? { testimonials: [] }), speed: Number(e.target.value) } })}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Fast (5s)</span><span>Slow (120s)</span></div>
            </div>
            <div className="space-y-4">
              {(data.testimonialTicker?.testimonials ?? []).map((t, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => {
                        const testimonials = [...(data.testimonialTicker?.testimonials ?? [])];
                        testimonials[i] = { ...t, name: e.target.value };
                        setData({ ...data, testimonialTicker: { ...(data.testimonialTicker ?? { speed: 25 }), testimonials } });
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      placeholder="Reviewer name"
                    />
                    <select
                      value={t.source}
                      onChange={(e) => {
                        const testimonials = [...(data.testimonialTicker?.testimonials ?? [])];
                        testimonials[i] = { ...t, source: e.target.value };
                        setData({ ...data, testimonialTicker: { ...(data.testimonialTicker ?? { speed: 25 }), testimonials } });
                      }}
                      className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="google">Google</option>
                      <option value="trustpilot">Trustpilot</option>
                    </select>
                    <button
                      onClick={() => {
                        const testimonials = (data.testimonialTicker?.testimonials ?? []).filter((_, idx) => idx !== i);
                        setData({ ...data, testimonialTicker: { ...(data.testimonialTicker ?? { speed: 25 }), testimonials } });
                      }}
                      className="text-red-400 hover:text-red-300 px-2"
                    >✕</button>
                  </div>
                  <textarea
                    rows={2}
                    value={t.text}
                    onChange={(e) => {
                      const testimonials = [...(data.testimonialTicker?.testimonials ?? [])];
                      testimonials[i] = { ...t, text: e.target.value };
                      setData({ ...data, testimonialTicker: { ...(data.testimonialTicker ?? { speed: 25 }), testimonials } });
                    }}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    placeholder="Review text"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setData({ ...data, testimonialTicker: { ...(data.testimonialTicker ?? { speed: 25 }), testimonials: [...(data.testimonialTicker?.testimonials ?? []), { name: 'New Reviewer', source: 'google', text: 'Great work!', avatar: '' }] } })}
              className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
            >+ Add Testimonial</button>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6 max-w-2xl">
          {data.featuredProjects.map((project, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium text-sm">Project #{i + 1}</h3>
                <button
                  onClick={() => {
                    const projects = data.featuredProjects.filter((_, idx) => idx !== i);
                    setData({ ...data, featuredProjects: projects });
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={project.title}
                  onChange={(e) => {
                    const projects = [...data.featuredProjects];
                    projects[i] = { ...project, title: e.target.value };
                    setData({ ...data, featuredProjects: projects });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) => {
                    const projects = [...data.featuredProjects];
                    projects[i] = { ...project, description: e.target.value };
                    setData({ ...data, featuredProjects: projects });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={project.tags.join(', ')}
                  onChange={(e) => {
                    const projects = [...data.featuredProjects];
                    projects[i] = { ...project, tags: e.target.value.split(',').map((t) => t.trim()) };
                    setData({ ...data, featuredProjects: projects });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newProject = {
                id: Date.now(),
                title: 'New Project',
                description: 'Project description',
                tags: ['Tag1'],
                link: '#',
              };
              setData({ ...data, featuredProjects: [...data.featuredProjects, newProject] });
            }}
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Project
          </button>
        </div>
      )}
    </div>
  );
}
