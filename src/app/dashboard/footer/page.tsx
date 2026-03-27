'use client';

import { useState, useEffect } from 'react';

interface FooterData {
  techStack: string;
  copyright: string;
  bio: string;
  quickLinks: Array<{ href: string; label: string }>;
  footerServices: Array<{ label: string; link: string }>;
  legalLinks: Array<{ label: string; href: string }>;
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
          <p className="text-slate-400 mt-1">Manage the footer bottom bar text shown on your site</p>
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

      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl space-y-6">
        {/* Copyright text */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Copyright Text
          </label>
          <p className="text-slate-500 text-xs mb-2">
            Appears after the year on the bottom left. The year updates automatically.
          </p>
          <input
            type="text"
            value={data.copyright}
            onChange={(e) => setData({ ...data, copyright: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            placeholder="e.g. Yousri. All rights reserved."
          />
        </div>

        {/* Tech stack text */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Footer Credit Text
          </label>
          <p className="text-slate-500 text-xs mb-2">
            Appears on the bottom right of the footer on every page.
          </p>
          <textarea
            value={data.techStack}
            onChange={(e) => setData({ ...data, techStack: e.target.value })}
            rows={2}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="e.g. Built with Next.js & Tailwind CSS"
          />
        </div>

        {/* Preview */}
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Preview</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
            <span>© {new Date().getFullYear()} {data.copyright || '...'}</span>
            <span>{data.techStack || '...'}</span>
          </div>
        </div>
      </div>

      {/* Brand Bio */}
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl space-y-4 mt-6">
        <div>
          <h2 className="text-white font-semibold text-sm">Brand Bio</h2>
          <p className="text-slate-500 text-xs mt-1">Short description shown under the logo in the footer.</p>
        </div>
        <textarea
          rows={3}
          value={data.bio ?? ''}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Short description about you or your work..."
        />
      </div>

      {/* Quick Links */}
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl space-y-4 mt-6">
        <div>
          <h2 className="text-white font-semibold text-sm">Quick Links</h2>
          <p className="text-slate-500 text-xs mt-1">Navigation links shown in the footer middle column.</p>
        </div>
        <div className="space-y-3">
          {(data.quickLinks ?? []).map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => { const a=[...data.quickLinks];if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]];setData({...data,quickLinks:a});} }} disabled={i===0} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs leading-none px-1">↑</button>
                <button onClick={() => { const a=[...data.quickLinks];if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]];setData({...data,quickLinks:a});} }} disabled={i===(data.quickLinks??[]).length-1} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs leading-none px-1">↓</button>
              </div>
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const quickLinks = [...data.quickLinks];
                  quickLinks[i] = { ...link, label: e.target.value };
                  setData({ ...data, quickLinks });
                }}
                placeholder="Label"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => {
                  const quickLinks = [...data.quickLinks];
                  quickLinks[i] = { ...link, href: e.target.value };
                  setData({ ...data, quickLinks });
                }}
                placeholder="URL (e.g. /about)"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={() => setData({ ...data, quickLinks: data.quickLinks.filter((_, idx) => idx !== i) })}
                className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setData({ ...data, quickLinks: [...(data.quickLinks ?? []), { href: '/', label: 'New Link' }] })}
          className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors w-full"
        >
          + Add Link
        </button>
      </div>

      {/* Footer Services */}
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl space-y-4 mt-6">
        <div>
          <h2 className="text-white font-semibold text-sm">Services List</h2>
          <p className="text-slate-500 text-xs mt-1">Service names shown in the footer right column. Each can have its own link.</p>
        </div>
        <div className="space-y-3">
          {(data.footerServices ?? []).map((service, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => { const a=[...data.footerServices];if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]];setData({...data,footerServices:a});} }} disabled={i===0} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs leading-none px-1">↑</button>
                <button onClick={() => { const a=[...data.footerServices];if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]];setData({...data,footerServices:a});} }} disabled={i===(data.footerServices??[]).length-1} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs leading-none px-1">↓</button>
              </div>
              <input
                type="text"
                value={service.label}
                onChange={(e) => {
                  const footerServices = [...data.footerServices];
                  footerServices[i] = { ...service, label: e.target.value };
                  setData({ ...data, footerServices });
                }}
                placeholder="Service name"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                value={service.link}
                onChange={(e) => {
                  const footerServices = [...data.footerServices];
                  footerServices[i] = { ...service, link: e.target.value };
                  setData({ ...data, footerServices });
                }}
                placeholder="Link (e.g. /services)"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={() => setData({ ...data, footerServices: data.footerServices.filter((_, idx) => idx !== i) })}
                className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setData({ ...data, footerServices: [...(data.footerServices ?? []), { label: 'New Service', link: '/services' }] })}
          className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors w-full"
        >
          + Add Service
        </button>
      </div>

      {/* Legal Pages */}
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl space-y-4 mt-6">
        <div>
          <h2 className="text-white font-semibold text-sm">Legal Pages</h2>
          <p className="text-slate-500 text-xs mt-1">Links shown at the bottom of the footer (Privacy Policy, Terms of Service, etc.)</p>
        </div>
        <div className="space-y-3">
          {(data.legalLinks ?? []).map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => { const a=[...(data.legalLinks??[])];if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]];setData({...data,legalLinks:a});} }} disabled={i===0} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs leading-none px-1">↑</button>
                <button onClick={() => { const a=[...(data.legalLinks??[])];if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]];setData({...data,legalLinks:a});} }} disabled={i===(data.legalLinks??[]).length-1} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs leading-none px-1">↓</button>
              </div>
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const legalLinks = [...(data.legalLinks ?? [])];
                  legalLinks[i] = { ...link, label: e.target.value };
                  setData({ ...data, legalLinks });
                }}
                placeholder="Label (e.g. Privacy Policy)"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => {
                  const legalLinks = [...(data.legalLinks ?? [])];
                  legalLinks[i] = { ...link, href: e.target.value };
                  setData({ ...data, legalLinks });
                }}
                placeholder="URL (e.g. /privacy)"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={() => setData({ ...data, legalLinks: (data.legalLinks ?? []).filter((_, idx) => idx !== i) })}
                className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setData({ ...data, legalLinks: [...(data.legalLinks ?? []), { label: 'New Page', href: '/' }] })}
          className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors w-full"
        >
          + Add Legal Link
        </button>
      </div>
    </div>
  );
}
