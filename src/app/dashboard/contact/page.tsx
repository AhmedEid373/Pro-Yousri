'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ContactInfo {
  icon: string;
  iconUrl?: string;
  label: string;
  value: string;
  link: string;
}

interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  contactInfo: ContactInfo[];
  availabilityStatus: 'green' | 'orange' | 'red';
  availabilityOptions: { green: string; orange: string; red: string };
  responseTime: string;
}

const statusStyles = {
  green:  { ring: 'ring-green-500',  dot: 'bg-green-400',  label: 'Green — Available' },
  orange: { ring: 'ring-orange-500', dot: 'bg-orange-400', label: 'Orange — Selective' },
  red:    { ring: 'ring-red-500',    dot: 'bg-red-400',    label: 'Red — Emergency only' },
};

function IconUploader({ info, index, onChange }: {
  info: ContactInfo;
  index: number;
  onChange: (index: number, field: keyof ContactInfo, value: string) => void;
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
      if (data.url) onChange(index, 'iconUrl', data.url);
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
        {info.iconUrl ? (
          <Image src={info.iconUrl} alt={info.label} fill className="object-cover" unoptimized />
        ) : (
          info.icon || '❓'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 mb-1">
          <div className="flex-1">
            <label className="block text-slate-400 text-xs mb-1">Emoji icon</label>
            <input
              type="text"
              value={info.icon}
              onChange={(e) => onChange(index, 'icon', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
              placeholder="📧"
            />
          </div>
          <div className="flex-1">
            <label className="block text-slate-400 text-xs mb-1">Or upload image</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading ? '…' : '📁 Upload'}
              </button>
              {info.iconUrl && (
                <button
                  type="button"
                  onClick={() => onChange(index, 'iconUrl', '')}
                  className="px-2 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-300 text-xs rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardContactPage() {
  const [data, setData] = useState<ContactData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content/contact').then((r) => r.json()).then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const updateContactInfo = (index: number, field: keyof ContactInfo, value: string) => {
    if (!data) return;
    const contactInfo = [...data.contactInfo];
    contactInfo[index] = { ...contactInfo[index], [field]: value };
    setData({ ...data, contactInfo });
  };

  const removeContactInfo = (index: number) => {
    if (!data) return;
    setData({ ...data, contactInfo: data.contactInfo.filter((_, i) => i !== index) });
  };

  if (!data) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">📞 Contact Page</h1>
          <p className="text-slate-400 text-sm">Edit your contact page content</p>
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
        {/* Page Header */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm">Page Header</h2>
          {(['title', 'subtitle'] as const).map((key) => (
            <div key={key}>
              <label className="block text-slate-400 text-xs mb-1 capitalize">{key}</label>
              <input
                type="text"
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Description</label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-white font-semibold text-sm">Availability Status</h2>
            <p className="text-slate-500 text-xs mt-1">Click a card to set the active status. Edit the text inline.</p>
          </div>
          {(['green', 'orange', 'red'] as const).map((color) => {
            const s = statusStyles[color];
            const isActive = data.availabilityStatus === color;
            return (
              <div
                key={color}
                onClick={() => setData({ ...data, availabilityStatus: color })}
                className={`flex items-center gap-3 bg-slate-900 rounded-lg p-3 cursor-pointer border transition-all ${
                  isActive ? `border-transparent ring-2 ${s.ring}` : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot}`} />
                <input
                  type="text"
                  value={data.availabilityOptions[color]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setData({
                    ...data,
                    availabilityOptions: { ...data.availabilityOptions, [color]: e.target.value },
                  })}
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  placeholder={s.label}
                />
                {isActive && <span className="text-xs text-slate-500 flex-shrink-0">● Active</span>}
              </div>
            );
          })}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Response Time (shown below status)</label>
            <input
              type="text"
              value={data.responseTime}
              onChange={(e) => setData({ ...data, responseTime: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-sm">Contact Information</h2>
          {data.contactInfo.map((info, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">Contact #{i + 1}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => { const a=[...data.contactInfo];if(i>0){[a[i],a[i-1]]=[a[i-1],a[i]];setData({...data,contactInfo:a});} }} disabled={i===0} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs px-1.5 py-0.5 bg-slate-700 rounded">↑</button>
                  <button onClick={() => { const a=[...data.contactInfo];if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]];setData({...data,contactInfo:a});} }} disabled={i===data.contactInfo.length-1} className="text-slate-400 hover:text-white disabled:opacity-30 text-xs px-1.5 py-0.5 bg-slate-700 rounded">↓</button>
                  <button onClick={() => removeContactInfo(i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
              </div>
              <IconUploader info={info} index={i} onChange={updateContactInfo} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Label</label>
                  <input type="text" value={info.label} onChange={(e) => updateContactInfo(i, 'label', e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Displayed Value</label>
                  <input type="text" value={info.value} onChange={(e) => updateContactInfo(i, 'value', e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Link URL</label>
                <input type="text" value={info.link} onChange={(e) => updateContactInfo(i, 'link', e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setData({ ...data, contactInfo: [...data.contactInfo, { icon: '📧', iconUrl: '', label: 'New Contact', value: '', link: '' }] })
            }
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors w-full"
          >
            + Add Contact Way
          </button>
        </div>
      </div>
    </div>
  );
}
