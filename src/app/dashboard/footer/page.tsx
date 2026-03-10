'use client';

import { useState, useEffect } from 'react';

interface FooterData {
  techStack: string;
}

export default function DashboardFooterPage() {
  const [data, setData] = useState<FooterData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content/footer').then((r) => r.json()).then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/footer', {
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Footer</h1>
          <p className="text-slate-400 mt-1">Manage the footer bottom text shown on your site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Footer Credit Text
        </label>
        <p className="text-slate-500 text-xs mb-3">
          This text appears at the bottom right of the footer on every page.
        </p>
        <textarea
          value={data.techStack}
          onChange={(e) => setData({ ...data, techStack: e.target.value })}
          rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="e.g. Built with Next.js & Tailwind CSS"
        />

        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Preview</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
            <span>© {new Date().getFullYear()} Yousri. All rights reserved.</span>
            <span>{data.techStack || '...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
