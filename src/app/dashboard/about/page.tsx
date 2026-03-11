'use client';

import { useState, useEffect } from 'react';

interface AboutData {
  title: string;
  subtitle: string;
  profileIcon: string;
  showProfileIcon: boolean;
  profileGradientFrom: string;
  profileGradientTo: string;
  bios: string[];
  details: Array<{ label: string; value: string }>;
  expertise: Array<{ icon: string; title: string; description: string }>;
  timeline: Array<{ year: string; title: string; description: string }>;
}

export default function DashboardAboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetch('/api/content/about').then((r) => r.json()).then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/about', {
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

  const tabs = ['general', 'details', 'expertise', 'timeline'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">👤 About Page</h1>
          <p className="text-slate-400 text-sm">Edit your about page content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
          }`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          {(['title', 'subtitle'] as const).map((key) => (
            <div key={key}>
              <label className="block text-slate-300 text-sm font-medium mb-2 capitalize">{key}</label>
              <input
                type="text"
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          ))}

          {/* Profile Icon Box */}
          <div className="glass rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-slate-300 text-sm font-medium">Profile Icon Box</label>
                <p className="text-slate-500 text-xs mt-1">The gradient box with icon/emoji shown on the about page</p>
              </div>
              <button
                onClick={() => setData({ ...data, showProfileIcon: !data.showProfileIcon })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  data.showProfileIcon !== false ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    data.showProfileIcon !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {data.showProfileIcon !== false && (
              <>
                {/* Preview + Icon input */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      background: `linear-gradient(to bottom right, ${data.profileGradientFrom || '#3b82f6'}, ${data.profileGradientTo || '#9333ea'})`,
                    }}
                  >
                    {data.profileIcon || ''}
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Icon / Emoji</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={data.profileIcon ?? ''}
                        onChange={(e) => setData({ ...data, profileIcon: e.target.value })}
                        placeholder="Enter emoji..."
                        className="w-28 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm text-center text-2xl"
                      />
                      {data.profileIcon && (
                        <button
                          onClick={() => setData({ ...data, profileIcon: '' })}
                          className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gradient Colors */}
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Gradient Colors</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.profileGradientFrom || '#3b82f6'}
                        onChange={(e) => setData({ ...data, profileGradientFrom: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <div>
                        <span className="text-slate-500 text-xs block">From</span>
                        <input
                          type="text"
                          value={data.profileGradientFrom || '#3b82f6'}
                          onChange={(e) => setData({ ...data, profileGradientFrom: e.target.value })}
                          className="w-24 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.profileGradientTo || '#9333ea'}
                        onChange={(e) => setData({ ...data, profileGradientTo: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <div>
                        <span className="text-slate-500 text-xs block">To</span>
                        <input
                          type="text"
                          value={data.profileGradientTo || '#9333ea'}
                          onChange={(e) => setData({ ...data, profileGradientTo: e.target.value })}
                          className="w-24 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setData({ ...data, profileGradientFrom: '#3b82f6', profileGradientTo: '#9333ea' })}
                      className="px-3 py-1.5 text-slate-400 hover:text-white text-xs border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">Bio Paragraphs</label>
            <div className="space-y-4">
              {(data.bios ?? []).map((bio, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">Paragraph #{i + 1}</span>
                    <button
                      onClick={() => {
                        const bios = data.bios.filter((_, idx) => idx !== i);
                        setData({ ...data, bios });
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => {
                      const bios = [...data.bios];
                      bios[i] = e.target.value;
                      setData({ ...data, bios });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setData({ ...data, bios: [...(data.bios ?? []), ''] })}
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Bio Paragraph
          </button>
        </div>
      )}

      {/* Details */}
      {activeTab === 'details' && (
        <div className="space-y-4 max-w-2xl">
          {data.details.map((detail, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs">Detail #{i + 1}</span>
                <button
                  onClick={() => {
                    const details = data.details.filter((_, idx) => idx !== i);
                    setData({ ...data, details });
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-slate-400 text-xs mb-1">Label</label>
                  <input
                    type="text"
                    value={detail.label}
                    onChange={(e) => {
                      const details = [...data.details];
                      details[i] = { ...detail, label: e.target.value };
                      setData({ ...data, details });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-slate-400 text-xs mb-1">Value</label>
                  <input
                    type="text"
                    value={detail.value}
                    onChange={(e) => {
                      const details = [...data.details];
                      details[i] = { ...detail, value: e.target.value };
                      setData({ ...data, details });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setData({ ...data, details: [...data.details, { label: 'Label', value: 'Value' }] })
            }
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Detail
          </button>
        </div>
      )}

      {/* Expertise */}
      {activeTab === 'expertise' && (
        <div className="space-y-6 max-w-2xl">
          {data.expertise.map((item, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Expertise #{i + 1}</span>
                <button
                  onClick={() => {
                    const expertise = data.expertise.filter((_, idx) => idx !== i);
                    setData({ ...data, expertise });
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-24">
                    <label className="block text-slate-400 text-xs mb-1">Icon</label>
                    <input
                      type="text"
                      placeholder="⭐"
                      value={item.icon}
                      onChange={(e) => {
                        const expertise = [...data.expertise];
                        expertise[i] = { ...item, icon: e.target.value };
                        setData({ ...data, expertise });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm text-center text-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-slate-400 text-xs mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => {
                        const expertise = [...data.expertise];
                        expertise[i] = { ...item, title: e.target.value };
                        setData({ ...data, expertise });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const expertise = [...data.expertise];
                    expertise[i] = { ...item, description: e.target.value };
                    setData({ ...data, expertise });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setData({
                ...data,
                expertise: [...data.expertise, { icon: 'star', title: 'New Expertise', description: '' }],
              })
            }
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Expertise
          </button>
        </div>
      )}

      {/* Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 max-w-2xl">
          {data.timeline.map((item, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Timeline Item #{i + 1}</span>
                <button
                  onClick={() => {
                    const timeline = data.timeline.filter((_, idx) => idx !== i);
                    setData({ ...data, timeline });
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Year (e.g. 2024)"
                  value={item.year}
                  onChange={(e) => {
                    const timeline = [...data.timeline];
                    timeline[i] = { ...item, year: e.target.value };
                    setData({ ...data, timeline });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const timeline = [...data.timeline];
                    timeline[i] = { ...item, title: e.target.value };
                    setData({ ...data, timeline });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const timeline = [...data.timeline];
                    timeline[i] = { ...item, description: e.target.value };
                    setData({ ...data, timeline });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setData({
                ...data,
                timeline: [...data.timeline, { year: '2025', title: 'New Milestone', description: 'Description here' }],
              })
            }
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Timeline Item
          </button>
        </div>
      )}
    </div>
  );
}
