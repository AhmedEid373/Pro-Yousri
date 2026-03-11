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

interface ColorsData {
  buttonBg: string;
  buttonText: string;
  heading: string;
  subtext: string;
  hyperlink: string;
  background: string;
  accent: string;
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
  colors: ColorsData;
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
  colors: {
    buttonBg: '#3b82f6',
    buttonText: '#ffffff',
    heading: '#f1f5f9',
    subtext: '#94a3b8',
    hyperlink: '#60a5fa',
    background: '#0f172a',
    accent: '#3b82f6',
  },
};

const builtInPages: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

interface LangItem {
  code: string;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

interface LanguagesData {
  defaultLang: string;
  languages: LangItem[];
  translations: Record<string, Record<string, string>>;
}

const defaultLangsData: LanguagesData = {
  defaultLang: 'en',
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
    { code: 'fr', name: 'French', flag: '🇫🇷', dir: 'ltr' },
  ],
  translations: {},
};

type Tab = 'brand' | 'colors' | 'navigation' | 'seo' | 'security' | 'languages' | 'maintenance';

export default function DashboardSettingsPage() {
  const [data, setData] = useState<SiteData>(defaultData);
  const [tab, setTab] = useState<Tab>('brand');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingGif, setUploadingGif] = useState(false);
  const [customPages, setCustomPages] = useState<Page[]>([]);
  const [langData, setLangData] = useState<LanguagesData>(defaultLangsData);
  const [langSaving, setLangSaving] = useState(false);
  const [langSaved, setLangSaved] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<string | null>(null);
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('');
  const [newLangDir, setNewLangDir] = useState<'ltr' | 'rtl'>('ltr');
  const [translating, setTranslating] = useState<string | null>(null);
  const [translatingAll, setTranslatingAll] = useState(false);
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
            colors: { ...defaultData.colors, ...(d.colors ?? {}) },
          });
        }
      })
      .catch(() => {});

    fetch('/api/content/pages')
      .then((r) => r.json())
      .then((pages: Page[]) => { if (Array.isArray(pages)) setCustomPages(pages); })
      .catch(() => {});

    fetch('/api/content/languages')
      .then((r) => r.json())
      .then((d: LanguagesData) => { if (d?.languages) setLangData(d); })
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

  const handleSaveLangs = async () => {
    setLangSaving(true);
    try {
      await fetch('/api/content/languages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(langData),
      });
      setLangSaved(true);
      setTimeout(() => setLangSaved(false), 3000);
    } finally {
      setLangSaving(false);
    }
  };

  const addLanguage = () => {
    if (!newLangCode.trim() || !newLangName.trim()) return;
    if (langData.languages.some((l) => l.code === newLangCode.trim())) return;
    setLangData((d) => ({
      ...d,
      languages: [...d.languages, { code: newLangCode.trim(), name: newLangName.trim(), flag: newLangFlag.trim() || '🏳️', dir: newLangDir }],
      translations: { ...d.translations, [newLangCode.trim()]: {} },
    }));
    setNewLangCode('');
    setNewLangName('');
    setNewLangFlag('');
    setNewLangDir('ltr');
  };

  const removeLanguage = (code: string) => {
    if (code === langData.defaultLang) return; // can't remove default
    setLangData((d) => {
      const newTranslations = { ...d.translations };
      delete newTranslations[code];
      return { ...d, languages: d.languages.filter((l) => l.code !== code), translations: newTranslations };
    });
  };

  const updateTranslation = (langCode: string, key: string, value: string) => {
    setLangData((d) => ({
      ...d,
      translations: {
        ...d.translations,
        [langCode]: { ...(d.translations[langCode] || {}), [key]: value },
      },
    }));
  };

  // Translatable content keys and their English values
  const getTranslatableContent = (): Record<string, string> => {
    const content: Record<string, string> = {};
    // Nav links
    data.navLinks.forEach((link) => {
      const key = `nav.${link.label.toLowerCase().replace(/\s+/g, '')}`;
      content[key] = link.label;
    });
    // Common UI strings
    content['cta.hireMe'] = 'Hire Me';
    content['cta.viewWork'] = 'View My Work';
    content['cta.contactMe'] = 'Contact Me';
    content['cta.getInTouch'] = 'Get In Touch';
    content['cta.viewAllProjects'] = 'View All Projects';
    content['hero.greeting'] = "Hello, I'm";
    content['hero.readyToStart'] = 'Ready to Start Your Project?';
    content['hero.skills'] = 'Technical Skills';
    content['hero.featuredProjects'] = 'Featured Projects';
    content['footer.rights'] = 'All rights reserved.';
    content['contact.send'] = 'Send Message';
    content['contact.name'] = 'Your Name';
    content['contact.email'] = 'Your Email';
    content['contact.subject'] = 'Subject';
    content['contact.message'] = 'Your Message';
    content['theme.light'] = 'Light';
    content['theme.dark'] = 'Dark';
    return content;
  };

  const translateLanguage = async (langCode: string) => {
    const content = getTranslatableContent();
    const keys = Object.keys(content);
    const texts = Object.values(content);
    setTranslating(langCode);
    try {
      const res = await fetch('/api/content/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, sourceLang: langData.defaultLang, targetLang: langCode }),
      });
      const result = await res.json();
      if (result.translations && Array.isArray(result.translations)) {
        const newTranslations: Record<string, string> = { ...(langData.translations[langCode] || {}) };
        keys.forEach((key, i) => {
          newTranslations[key] = result.translations[i];
        });
        setLangData((d) => ({
          ...d,
          translations: { ...d.translations, [langCode]: newTranslations },
        }));
      }
    } catch {
      // silently fail
    } finally {
      setTranslating(null);
    }
  };

  const translateAllLanguages = async () => {
    setTranslatingAll(true);
    const nonDefault = langData.languages.filter((l) => l.code !== langData.defaultLang);
    for (const lang of nonDefault) {
      await translateLanguage(lang.code);
    }
    setTranslatingAll(false);
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
    { key: 'colors', label: 'Colors' },
    { key: 'navigation', label: 'Navigation' },
    { key: 'seo', label: 'SEO' },
    { key: 'security', label: 'Security' },
    { key: 'languages', label: 'Languages' },
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

        {/* Tab: Colors */}
        {tab === 'colors' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm">Site Colors</h2>
              <p className="text-slate-400 text-xs">Customize the colors used across your site. Changes apply after saving.</p>

              <div className="grid grid-cols-2 gap-5">
                {([
                  { key: 'buttonBg' as const, label: 'Button Background', desc: 'Primary button color' },
                  { key: 'buttonText' as const, label: 'Button Text', desc: 'Text color on buttons' },
                  { key: 'heading' as const, label: 'Heading Text', desc: 'Title and heading color' },
                  { key: 'subtext' as const, label: 'Sub Text', desc: 'Secondary / body text color' },
                  { key: 'hyperlink' as const, label: 'Hyperlink', desc: 'Link and anchor color' },
                  { key: 'background' as const, label: 'Background', desc: 'Main page background' },
                  { key: 'accent' as const, label: 'Accent', desc: 'Accent highlights and borders' },
                ]).map((item) => (
                  <div key={item.key}>
                    <label className="block text-slate-300 text-xs font-medium mb-1">{item.label}</label>
                    <p className="text-slate-500 text-[10px] mb-2">{item.desc}</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={data.colors[item.key]}
                        onChange={(e) => setData((d) => ({ ...d, colors: { ...d.colors, [item.key]: e.target.value } }))}
                        className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-1"
                      />
                      <input
                        type="text"
                        value={data.colors[item.key]}
                        onChange={(e) => setData((d) => ({ ...d, colors: { ...d.colors, [item.key]: e.target.value } }))}
                        className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset to defaults */}
              <button
                onClick={() => setData((d) => ({ ...d, colors: defaultData.colors }))}
                className="px-3 py-1.5 text-slate-400 hover:text-white text-xs border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
            </div>

            {/* Live preview */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Preview</h3>
              <div
                className="rounded-xl p-8 space-y-4"
                style={{ backgroundColor: data.colors.background }}
              >
                <h2 style={{ color: data.colors.heading, fontWeight: 700, fontSize: '1.5rem' }}>
                  Heading Text Preview
                </h2>
                <p style={{ color: data.colors.subtext, fontSize: '0.875rem', lineHeight: 1.6 }}>
                  This is how your sub text and body content will appear on the site.
                  It uses the sub text color you configured above.
                </p>
                <p>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: data.colors.hyperlink, textDecoration: 'underline' }}>
                    This is a hyperlink example
                  </a>
                </p>
                <div className="flex gap-3 items-center">
                  <button
                    style={{
                      backgroundColor: data.colors.buttonBg,
                      color: data.colors.buttonText,
                      padding: '0.625rem 1.5rem',
                      borderRadius: '0.75rem',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Button Preview
                  </button>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '0.5rem',
                      backgroundColor: data.colors.accent,
                      border: `2px solid ${data.colors.accent}`,
                    }}
                    title="Accent color"
                  />
                  <span style={{ color: data.colors.subtext, fontSize: '0.75rem' }}>Accent</span>
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

        {/* Tab: Languages */}
        {tab === 'languages' && (
          <div className="space-y-6">
            {/* Languages list */}
            <div className="bg-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold text-sm">Languages</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Manage site languages and translations</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={translateAllLanguages}
                    disabled={translatingAll || !!translating}
                    className="px-4 py-2 rounded-xl font-medium text-sm transition-all bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    {translatingAll ? 'Translating...' : 'Translate All'}
                  </button>
                  <button
                    onClick={handleSaveLangs}
                    disabled={langSaving}
                    className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${
                      langSaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                    }`}
                  >
                    {langSaving ? 'Saving...' : langSaved ? '✓ Saved!' : 'Save Languages'}
                  </button>
                </div>
              </div>

              {/* Default language selector */}
              <div>
                <label className="block text-slate-400 text-xs mb-1">Default Language</label>
                <select
                  value={langData.defaultLang}
                  onChange={(e) => setLangData((d) => ({ ...d, defaultLang: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                >
                  {langData.languages.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              {/* Language cards */}
              <div className="space-y-2">
                {langData.languages.map((lang) => (
                  <div key={lang.code} className={`flex items-center gap-3 bg-slate-900 border rounded-xl px-4 py-3 ${
                    lang.code === langData.defaultLang ? 'border-blue-500/40' : 'border-slate-700'
                  }`}>
                    <span className="text-xl flex-shrink-0">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{lang.name}</p>
                      <p className="text-slate-500 text-xs">
                        {lang.code} · {lang.dir.toUpperCase()}
                        {lang.code === langData.defaultLang && <span className="text-blue-400 ml-2">Default</span>}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingTranslation(editingTranslation === lang.code ? null : lang.code)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          editingTranslation === lang.code
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        }`}
                      >
                        {editingTranslation === lang.code ? 'Close' : 'Translations'}
                      </button>
                      {lang.code !== langData.defaultLang && (
                        <button
                          onClick={() => translateLanguage(lang.code)}
                          disabled={translating === lang.code || translatingAll}
                          className="px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          {translating === lang.code ? 'Translating...' : 'Translate'}
                        </button>
                      )}
                      {lang.code !== langData.defaultLang && (
                        <button
                          onClick={() => removeLanguage(lang.code)}
                          className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Translation editor */}
              {editingTranslation && editingTranslation !== langData.defaultLang && (
                <div className="bg-slate-900/60 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-sm font-medium">
                      Translations — {langData.languages.find((l) => l.code === editingTranslation)?.flag}{' '}
                      {langData.languages.find((l) => l.code === editingTranslation)?.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs">Add translation keys and their values. Use keys like &quot;nav.home&quot;, &quot;hero.title&quot;, etc.</p>
                  <div className="space-y-2">
                    {Object.entries(langData.translations[editingTranslation] || {}).map(([key, val]) => (
                      <div key={key} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={key}
                          disabled
                          className="w-1/3 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg px-3 py-2 text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateTranslation(editingTranslation, key, e.target.value)}
                          className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => {
                            setLangData((d) => {
                              const t = { ...(d.translations[editingTranslation] || {}) };
                              delete t[key];
                              return { ...d, translations: { ...d.translations, [editingTranslation]: t } };
                            });
                          }}
                          className="text-red-400 hover:text-red-300 text-xs px-2"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const key = prompt('Translation key (e.g. nav.home, hero.title):');
                        if (key?.trim()) updateTranslation(editingTranslation, key.trim(), '');
                      }}
                      className="px-3 py-1.5 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-lg text-xs transition-colors"
                    >+ Add Translation Key</button>
                  </div>
                </div>
              )}
            </div>

            {/* Add new language */}
            <div className="bg-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-semibold text-sm">Add New Language</h3>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Code *</label>
                  <input
                    type="text"
                    value={newLangCode}
                    onChange={(e) => setNewLangCode(e.target.value.toLowerCase())}
                    placeholder="de"
                    maxLength={5}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Name *</label>
                  <input
                    type="text"
                    value={newLangName}
                    onChange={(e) => setNewLangName(e.target.value)}
                    placeholder="German"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Flag emoji</label>
                  <input
                    type="text"
                    value={newLangFlag}
                    onChange={(e) => setNewLangFlag(e.target.value)}
                    placeholder="🇩🇪"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Direction</label>
                  <select
                    value={newLangDir}
                    onChange={(e) => setNewLangDir(e.target.value as 'ltr' | 'rtl')}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addLanguage}
                disabled={!newLangCode.trim() || !newLangName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
              >
                + Add Language
              </button>
            </div>

            {/* Common language presets */}
            <div className="bg-slate-800 rounded-xl p-6 space-y-3">
              <h3 className="text-white font-semibold text-sm">Quick Add</h3>
              <p className="text-slate-400 text-xs">Click to add common languages</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'de', name: 'German', flag: '🇩🇪', dir: 'ltr' as const },
                  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', dir: 'ltr' as const },
                  { code: 'zh', name: 'Chinese', flag: '🇨🇳', dir: 'ltr' as const },
                  { code: 'ja', name: 'Japanese', flag: '🇯🇵', dir: 'ltr' as const },
                  { code: 'ko', name: 'Korean', flag: '🇰🇷', dir: 'ltr' as const },
                  { code: 'hi', name: 'Hindi', flag: '🇮🇳', dir: 'ltr' as const },
                  { code: 'ru', name: 'Russian', flag: '🇷🇺', dir: 'ltr' as const },
                  { code: 'tr', name: 'Turkish', flag: '🇹🇷', dir: 'ltr' as const },
                  { code: 'it', name: 'Italian', flag: '🇮🇹', dir: 'ltr' as const },
                  { code: 'nl', name: 'Dutch', flag: '🇳🇱', dir: 'ltr' as const },
                  { code: 'ur', name: 'Urdu', flag: '🇵🇰', dir: 'rtl' as const },
                  { code: 'he', name: 'Hebrew', flag: '🇮🇱', dir: 'rtl' as const },
                ].filter((p) => !langData.languages.some((l) => l.code === p.code)).map((preset) => (
                  <button
                    key={preset.code}
                    onClick={() => {
                      setLangData((d) => ({
                        ...d,
                        languages: [...d.languages, preset],
                        translations: { ...d.translations, [preset.code]: {} },
                      }));
                    }}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white text-xs rounded-lg transition-colors"
                  >
                    {preset.flag} {preset.name}
                  </button>
                ))}
              </div>
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
