'use client';

import { useState, useEffect, useRef } from 'react';

interface SiteData {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  brandName: string;
}

export default function DashboardSettingsPage() {
  const [data, setData] = useState<SiteData>({
    logoType: 'text',
    logoText: 'Y',
    logoImage: '',
    brandName: 'Yousri',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/content/site')
      .then((r) => r.json())
      .then((d) => { if (d.brandName) setData(d); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/site', {
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const result = await res.json();
      if (result.url) setData({ ...data, logoImage: result.url, logoType: 'image' });
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">⚙️ Settings</h1>
          <p className="text-slate-400 text-sm">Manage your site logo and brand name</p>
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

      <div className="max-w-2xl space-y-8">
        {/* Logo Settings */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-sm">Logo & Brand</h2>

          {/* Brand Name */}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Brand Name (shown next to logo)</label>
            <input
              type="text"
              value={data.brandName}
              onChange={(e) => setData({ ...data, brandName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              placeholder="Yousri"
            />
          </div>

          {/* Logo Type */}
          <div>
            <label className="block text-slate-400 text-xs mb-2">Logo Type</label>
            <div className="flex gap-3">
              {(['text', 'image'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setData({ ...data, logoType: type })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    data.logoType === type
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {type === 'text' ? '✏️ Text / Letter' : '🖼️ Image'}
                </button>
              ))}
            </div>
          </div>

          {/* Text Logo */}
          {data.logoType === 'text' && (
            <div>
              <label className="block text-slate-400 text-xs mb-1">Letter shown in logo box</label>
              <input
                type="text"
                value={data.logoText}
                onChange={(e) => setData({ ...data, logoText: e.target.value.slice(0, 3) })}
                maxLength={3}
                className="w-24 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm text-center"
                placeholder="Y"
              />
            </div>
          )}

          {/* Image Logo */}
          {data.logoType === 'image' && (
            <div>
              <label className="block text-slate-400 text-xs mb-2">Logo Image</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {data.logoImage ? (
                    <img src={data.logoImage} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-500 text-xs">No image</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading…' : '📁 Upload Image'}
                  </button>
                  {data.logoImage && (
                    <button
                      type="button"
                      onClick={() => setData({ ...data, logoImage: '' })}
                      className="px-3 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 text-sm rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>
              <p className="text-slate-500 text-xs mt-2">Recommended: square image, at least 64×64px</p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-sm mb-4">Preview</h2>
          <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-3 w-fit">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              {data.logoType === 'image' && data.logoImage ? (
                <img src={data.logoImage} alt={data.brandName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{data.logoText || 'Y'}</span>
                </div>
              )}
            </div>
            <span className="text-white font-bold text-lg">{data.brandName || 'Yousri'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
