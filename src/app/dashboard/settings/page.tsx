'use client';

import { useState, useEffect, useRef } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface SeoData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
}

interface MaintenanceData {
  enabled: boolean;
  message: string;
  gif: string;
}

interface TurnstileData {
  enabled: boolean;
  siteKey: string;
  secretKey: string;
}

interface SiteData {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  brandName: string;
  logoColorFrom: string;
  logoColorTo: string;
  navLinks: NavLink[];
  seo: SeoData;
  maintenance: MaintenanceData;
  turnstile: TurnstileData;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

const defaultData: SiteData = {
  logoType: 'text',
  logoText: 'Y',
  logoImage: '',
  brandName: 'Yousri',
  logoColorFrom: '#3b82f6',
  logoColorTo: '#9333ea',
  navLinks: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ],
  seo: {
    title: 'Yousri - WordPress Developer & Web Specialist',
    description: 'Expert WordPress developer with deep knowledge in domains, VPS, and hosting solutions. Building powerful digital experiences.',
    keywords: 'WordPress, VPS, hosting, web developer, WordPress development',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    robots: 'index,follow',
  },
  maintenance: {
    enabled: false,
    message: "We're working on something awesome. Check back soon!",
    gif: '',
  },
  turnstile: {
    enabled: false,
    siteKey: '',
    secretKey: '',
  },
};

const builtInPages: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

type Tab = 'brand' | 'navigation' | 'seo' | 'security' | 'maintenance';

export default function DashboardSettingsPage() {
  const [data, setData] = useState<SiteData>(defaultData);
  const [tab, setTab] = useState<Tab>('brand');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingGif, setUploadingGif] = useState(false);
  const [customPages, setCustomPages] = useState<Page[]>([]);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const ogFileRef = useRef<HTMLInputElement>(null);
  const gifFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/content/site')
      .then((r) => r.json())
      .then((d) => {
        if (d && (d.brandName || d.logoType)) {
          setData({
            ...defaultData,
            ...d,
            seo: { ...defaultData.seo, ...(d.seo ?? {}) },
            maintenance: { ...defaultData.maintenance, ...(d.maintenance ?? {}) },
            turnstile: { ...defaultData.turnstile, ...(d.turnstile ?? {}) },
          });
        }
      })
      .catch(() => {});

    fetch('/api/content/pages')
      .then((r) => r.json())
      .then((pages: Page[]) => { if (Array.isArray(pages)) setCustomPages(pages); })
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (json.url) setData((d) => ({ ...d, logoImage: json.url }));
    } finally {
      setUploading(false);
    }
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOg(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (json.url) setData((d) => ({ ...d, seo: { ...d.seo, ogImage: json.url } }));
    } finally {
      setUploadingOg(false);
    }
  };

  const handleGifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGif(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (json.url) setData((d) => ({ ...d, maintenance: { ...d.maintenance, gif: json.url } }));
    } finally {
      setUploadingGif(false);
    }
  };

  // Navigation helpers
  const moveLink = (index: number, dir: -1 | 1) => {
    const links = [...data.navLinks];
    const target = index + dir;
    if (target < 0 || target >= links.length) return;
    [links[index], links[target]] = [links[target], links[index]];
    setData((d) => ({ ...d, navLinks: links }));
  };

  const removeLink = (index: number) => {
    setData((d) => ({ ...d, navLinks: d.navLinks.filter((_, i) => i !== index) }));
  };

  const addLink = (link: NavLink) => {
    if (data.navLinks.some((l) => l.href === link.href)) return;
    setData((d) => ({ ...d, navLinks: [...d.navLinks, link] }));
  };

  const updateLink = (index: number, field: 'href' | 'label', value: string) => {
    const links = data.navLinks.map((l, i) => (i === index ? { ...l, [field]: value } : l));
    setData((d) => ({ ...d, navLinks: links }));
  };

  // Available pages not yet in navLinks
  const allAvailable: NavLink[] = [
    ...builtInPages,
    ...customPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];
  const availableToAdd = allAvailable.filter(
    (p) => !data.navLinks.some((l) => l.href === p.href)
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'brand', label: 'Logo & Brand' },
    { key: 'navigation', label: 'Navigation' },
    { key: 'seo', label: 'SEO' },
    { key: 'security', label: 'Security' },
    { key: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">⚙️ Settings</h1>
            <p className="text-slate-400 text-sm">Manage site-wide configuration</p>
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
        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === t.key
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Logo & Brand */}
        {tab === 'brand' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm">Logo & Brand</h2>

              {/* Brand Name */}
              <div>
                <label className="block text-slate-400 text-xs mb-1">Brand Name</label>
                <input
                  type="text"
                  value={data.brandName}
                  onChange={(e) => setData((d) => ({ ...d, brandName: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Logo Type */}
              <div>
                <label className="block text-slate-400 text-xs mb-2">Logo Type</label>
                <div className="flex gap-3">
                  {(['text', 'image'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setData((d) => ({ ...d, logoType: type }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        data.logoType === type
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {type === 'text' ? '✏️ Text Letter' : '🖼️ Image Upload'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Logo options */}
              {data.logoType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Logo Letter</label>
                    <input
                      type="text"
                      value={data.logoText}
                      maxLength={3}
                      onChange={(e) => setData((d) => ({ ...d, logoText: e.target.value }))}
                      className="w-24 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm text-center"
                    />
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-slate-400 text-xs mb-1">Gradient From</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={data.logoColorFrom}
                          onChange={(e) => setData((d) => ({ ...d, logoColorFrom: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-1"
                        />
                        <input
                          type="text"
                          value={data.logoColorFrom}
                          onChange={(e) => setData((d) => ({ ...d, logoColorFrom: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-400 text-xs mb-1">Gradient To</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={data.logoColorTo}
                          onChange={(e) => setData((d) => ({ ...d, logoColorTo: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-1"
                        />
                        <input
                          type="text"
                          value={data.logoColorTo}
                          onChange={(e) => setData((d) => ({ ...d, logoColorTo: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Logo options */}
              {data.logoType === 'image' && (
                <div className="space-y-3">
                  <label className="block text-slate-400 text-xs">Logo Image</label>
                  {data.logoImage && (
                    <div className="flex items-center gap-3">
                      <img src={data.logoImage} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                      <button
                        onClick={() => setData((d) => ({ ...d, logoImage: '' }))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <input ref={logoFileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <button
                    onClick={() => logoFileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading…' : '📁 Upload Image'}
                  </button>
                </div>
              )}

              {/* Live preview */}
              <div>
                <label className="block text-slate-400 text-xs mb-2">Preview</label>
                <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-3 w-fit">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    {data.logoType === 'image' && data.logoImage ? (
                      <img src={data.logoImage} alt={data.brandName} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(to bottom right, ${data.logoColorFrom}, ${data.logoColorTo})` }}
                      >
                        <span className="text-white font-bold text-sm">{data.logoText || 'Y'}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-white font-bold text-lg">{data.brandName || 'Yousri'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Navigation */}
        {tab === 'navigation' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-white font-semibold text-sm">Header Navigation Links</h2>
              <p className="text-slate-400 text-xs">Use arrows to reorder. Changes apply to the site navbar after saving.</p>

              {/* Nav link list */}
              <div className="space-y-2">
                {data.navLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveLink(i, -1)}
                        disabled={i === 0}
                        className="text-slate-500 hover:text-slate-300 disabled:opacity-30 leading-none text-xs px-1"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveLink(i, 1)}
                        disabled={i === data.navLinks.length - 1}
                        className="text-slate-500 hover:text-slate-300 disabled:opacity-30 leading-none text-xs px-1"
                      >
                        ▼
                      </button>
                    </div>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(i, 'label', e.target.value)}
                      placeholder="Label"
                      className="w-28 bg-transparent text-white text-sm focus:outline-none border-b border-slate-700 pb-0.5"
                    />
                    <span className="text-slate-600">|</span>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateLink(i, 'href', e.target.value)}
                      placeholder="/path"
                      className="flex-1 bg-transparent text-slate-400 text-sm font-mono focus:outline-none border-b border-slate-700 pb-0.5"
                    />
                    <button
                      onClick={() => removeLink(i)}
                      className="text-red-400 hover:text-red-300 text-sm px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* + Add custom link */}
              <button
                onClick={() => setData((d) => ({ ...d, navLinks: [...d.navLinks, { href: '/', label: 'New Link' }] }))}
                className="w-full py-2.5 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
              >
                + Add Custom Link
              </button>
            </div>

            {/* Available pages */}
            {availableToAdd.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 space-y-3">
                <h3 className="text-white font-medium text-sm">Available Pages — click to add to navbar</h3>
                <div className="flex flex-wrap gap-2">
                  {availableToAdd.map((p) => (
                    <button
                      key={p.href}
                      onClick={() => addLink(p)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white text-xs rounded-lg transition-colors"
                    >
                      {p.label} <span className="text-slate-500 hover:text-blue-200 font-mono">{p.href}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: SEO */}
        {tab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm">SEO Meta Tags</h2>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Meta Title</label>
                <input
                  type="text"
                  value={data.seo.title}
                  onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, title: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <p className="text-slate-500 text-xs mt-1">{data.seo.title.length} chars · recommended ≤60</p>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Meta Description</label>
                <textarea
                  value={data.seo.description}
                  onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, description: e.target.value } }))}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
                <p className="text-slate-500 text-xs mt-1">{data.seo.description.length} chars · recommended ≤160</p>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Keywords</label>
                <input
                  type="text"
                  value={data.seo.keywords}
                  onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, keywords: e.target.value } }))}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Robots</label>
                <select
                  value={data.seo.robots}
                  onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, robots: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="index,follow">index, follow (recommended)</option>
                  <option value="noindex,nofollow">noindex, nofollow</option>
                  <option value="noindex,follow">noindex, follow</option>
                  <option value="index,nofollow">index, nofollow</option>
                </select>
              </div>
            </div>

            {/* Open Graph */}
            <div className="bg-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm">Open Graph (Social Sharing)</h2>

              <div>
                <label className="block text-slate-400 text-xs mb-1">
                  OG Title <span className="text-slate-600">(blank = use Meta Title)</span>
                </label>
                <input
                  type="text"
                  value={data.seo.ogTitle}
                  onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, ogTitle: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">
                  OG Description <span className="text-slate-600">(blank = use Meta Description)</span>
                </label>
                <textarea
                  value={data.seo.ogDescription}
                  onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, ogDescription: e.target.value } }))}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">OG Image</label>
                {data.seo.ogImage && (
                  <div className="mb-2 flex items-center gap-3">
                    <img src={data.seo.ogImage} alt="OG" className="w-20 h-12 rounded-lg object-cover border border-slate-700" />
                    <button
                      onClick={() => setData((d) => ({ ...d, seo: { ...d.seo, ogImage: '' } }))}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.seo.ogImage}
                    onChange={(e) => setData((d) => ({ ...d, seo: { ...d.seo, ogImage: e.target.value } }))}
                    placeholder="https://... or upload"
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <input ref={ogFileRef} type="file" accept="image/*" onChange={handleOgUpload} className="hidden" />
                  <button
                    onClick={() => ogFileRef.current?.click()}
                    disabled={uploadingOg}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploadingOg ? '…' : '📁 Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Security (Cloudflare Turnstile) */}
        {tab === 'security' && (
          <div className="space-y-6">
            <div className={`rounded-xl p-6 space-y-5 border ${
              data.turnstile.enabled
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-slate-800 border-slate-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold text-sm">Cloudflare Turnstile</h2>
                  <p className={`text-xs mt-0.5 ${data.turnstile.enabled ? 'text-green-400' : 'text-slate-400'}`}>
                    {data.turnstile.enabled
                      ? '🛡️ Bot protection is active on the contact form'
                      : 'Contact form is unprotected — enable to block bots'}
                  </p>
                </div>
                <button
                  onClick={() => setData((d) => ({ ...d, turnstile: { ...d.turnstile, enabled: !d.turnstile.enabled } }))}
                  className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ${
                    data.turnstile.enabled ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      data.turnstile.enabled ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {data.turnstile.enabled && (
                <>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Site Key</label>
                    <input
                      type="text"
                      value={data.turnstile.siteKey}
                      onChange={(e) => setData((d) => ({ ...d, turnstile: { ...d.turnstile, siteKey: e.target.value } }))}
                      placeholder="0x4AAAAAAA..."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm font-mono"
                    />
                    <p className="text-slate-500 text-xs mt-1">Public key — used in the contact form widget</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={data.turnstile.secretKey}
                      onChange={(e) => setData((d) => ({ ...d, turnstile: { ...d.turnstile, secretKey: e.target.value } }))}
                      placeholder="0x4AAAAAAA..."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm font-mono"
                    />
                    <p className="text-slate-500 text-xs mt-1">Secret key — used server-side to verify the token</p>
                  </div>

                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <p className="text-slate-400 text-xs mb-2">How to get your keys:</p>
                    <ol className="text-slate-500 text-xs space-y-1 list-decimal list-inside">
                      <li>Go to the Cloudflare dashboard</li>
                      <li>Navigate to Turnstile under Security</li>
                      <li>Add a new site and copy the Site Key &amp; Secret Key</li>
                    </ol>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab: Maintenance */}
        {tab === 'maintenance' && (
          <div className="space-y-6">
            <div className={`rounded-xl p-6 space-y-5 border ${
              data.maintenance.enabled
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-slate-800 border-slate-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold text-sm">Maintenance Mode</h2>
                  <p className={`text-xs mt-0.5 ${data.maintenance.enabled ? 'text-red-400' : 'text-slate-400'}`}>
                    {data.maintenance.enabled
                      ? '⚠️ Site is offline — visitors see the maintenance page'
                      : 'Site is live and accessible to all visitors'}
                  </p>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => setData((d) => ({ ...d, maintenance: { ...d.maintenance, enabled: !d.maintenance.enabled } }))}
                  className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ${
                    data.maintenance.enabled ? 'bg-red-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      data.maintenance.enabled ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Maintenance Message</label>
                <textarea
                  value={data.maintenance.message}
                  onChange={(e) => setData((d) => ({ ...d, maintenance: { ...d.maintenance, message: e.target.value } }))}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">GIF / Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.maintenance.gif}
                    onChange={(e) => setData((d) => ({ ...d, maintenance: { ...d.maintenance, gif: e.target.value } }))}
                    placeholder="https://... or upload a GIF"
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <input ref={gifFileRef} type="file" accept="image/*,image/gif" onChange={handleGifUpload} className="hidden" />
                  <button
                    onClick={() => gifFileRef.current?.click()}
                    disabled={uploadingGif}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploadingGif ? '…' : '📁 Upload'}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-slate-400 text-xs mb-2">Preview</label>
                <div
                  className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
                  style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
                >
                  {data.maintenance.gif ? (
                    <img
                      src={data.maintenance.gif}
                      alt="Maintenance"
                      className="w-24 h-24 object-contain rounded-xl mb-4"
                    />
                  ) : (
                    <div className="text-5xl mb-4">⚙️</div>
                  )}
                  <h3 className="text-white font-bold text-lg mb-2">Under Maintenance</h3>
                  <p className="text-slate-400 text-sm">{data.maintenance.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom save */}
        <div className="mt-6 flex justify-end">
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
      </div>
    </div>
  );
}
