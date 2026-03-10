'use client';

import { useState, useEffect } from 'react';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const emptyForm = (): Page => ({
  id: '',
  title: '',
  slug: '',
  content: '',
});

export default function DashboardPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Page>(emptyForm());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/content/pages')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPages(data); })
      .catch(() => {});
  }, []);

  const savePages = async (updatedPages: Page[]) => {
    setSaving(true);
    try {
      await fetch('/api/content/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPages),
      });
      setPages(updatedPages);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = async () => {
    if (!form.title.trim()) return;
    const page: Page = {
      ...form,
      id: editingId || Date.now().toString(),
      slug: form.slug || slugify(form.title),
    };
    const updated = editingId
      ? pages.map((p) => (p.id === editingId ? page : p))
      : [...pages, page];
    await savePages(updated);
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (page: Page) => {
    setForm(page);
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const updated = pages.filter((p) => p.id !== id);
    await savePages(updated);
  };

  const handleCancel = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">📄 Pages</h1>
          <p className="text-slate-400 text-sm">Create and manage custom pages on your site</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setForm(emptyForm()); setEditingId(null); setShowForm(true); }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            + Add Page
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-xl p-6 mb-8 max-w-2xl space-y-4">
          <h2 className="text-white font-semibold text-sm">{editingId ? 'Edit Page' : 'New Page'}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Page Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({
                  ...form,
                  title: e.target.value,
                  slug: form.slug || slugify(e.target.value),
                })}
                placeholder="About My Journey"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">URL Slug (auto-generated)</label>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                <span className="text-slate-500 text-xs px-2 border-r border-slate-700 py-2 flex-shrink-0">/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="about-my-journey"
                  className="flex-1 bg-transparent text-white px-3 py-2 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Content</label>
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your page content here..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleFormSubmit}
              disabled={saving || !form.title.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? '✓ Saved!' : editingId ? 'Update Page' : 'Create Page'}
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pages List */}
      {pages.length === 0 && !showForm ? (
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
                <p className="text-slate-500 text-xs mt-0.5">/{page.slug}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  View ↗
                </a>
                <button
                  onClick={() => handleEdit(page)}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg transition-colors"
                >
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
