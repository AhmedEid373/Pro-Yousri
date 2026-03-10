'use client';

import { useState, useEffect, useRef } from 'react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  featured: boolean;
}

function ImageUploader({
  value,
  onUpload,
  onRemove,
}: {
  value: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) onUpload(data.url);
    } catch { /* ignore */ } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-600">
        {value ? (
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🖼️</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : '📁 Upload Image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-300 text-xs rounded-lg transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );
}

export default function DashboardPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content/portfolio')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (id: string, patch: Partial<PortfolioItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const addItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Short description of this project',
      image: '',
      tags: [],
      link: '',
      featured: false,
    };
    setItems((prev) => [...prev, newItem]);
    setExpanded(newItem.id);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">🖼️ Portfolio</h1>
          <p className="text-slate-400 text-sm">
            Manage your projects — featured ones appear on the home page
          </p>
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

      {/* Portfolio Items */}
      <div className="max-w-3xl space-y-3">
        {items.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-800/50 rounded-xl">
            <p className="text-3xl mb-3">🚀</p>
            <p className="text-sm">No projects yet. Click &quot;+ Add Portfolio&quot; below to add one.</p>
          </div>
        )}

        {items.map((item) => {
          const isOpen = expanded === item.id;
          return (
            <div key={item.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
              {/* Collapsed row */}
              <button
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">🚀</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm truncate">{item.title}</span>
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-blue-600/30 text-blue-400 text-xs rounded-full flex-shrink-0">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  {item.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {item.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-slate-500 text-xs">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-slate-400 text-xs flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded editor */}
              {isOpen && (
                <div className="px-4 pb-5 pt-3 border-t border-slate-700/50 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Project Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Short Description</label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    />
                  </div>

                  {/* Link */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Project URL (opens in new tab)</label>
                    <input
                      type="url"
                      value={item.link}
                      onChange={(e) => updateItem(item.id, { link: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={item.tags.join(', ')}
                      onChange={(e) =>
                        updateItem(item.id, {
                          tags: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="WordPress, WooCommerce, PHP"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-2">Project Image</label>
                    <ImageUploader
                      value={item.image}
                      onUpload={(url) => updateItem(item.id, { image: url })}
                      onRemove={() => updateItem(item.id, { image: '' })}
                    />
                  </div>

                  {/* Featured + Delete row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => updateItem(item.id, { featured: !item.featured })}
                        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                          item.featured ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            item.featured ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                      <span className="text-slate-300 text-sm">
                        Show on home page{item.featured ? ' (Featured)' : ''}
                      </span>
                    </label>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="px-4 py-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-xs rounded-lg transition-colors"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Portfolio button at the bottom */}
        <button
          onClick={addItem}
          className="w-full py-3.5 border-2 border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-xl text-sm font-medium transition-all"
        >
          + Add Portfolio
        </button>
      </div>
    </div>
  );
}
