'use client';

import { useState, useEffect } from 'react';

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  link: string;
}

interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  contactInfo: ContactInfo[];
  availability: string;
  responseTime: string;
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
    } finally {
      setSaving(false);
    }
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
        {/* Page Info */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm">Page Header</h2>
          {(['title', 'subtitle'] as const).map((key) => (
            <div key={key}>
              <label className="block text-slate-400 text-xs mb-1 capitalize">{key}</label>
              <input
                type="text"
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Description</label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>
        </div>

        {/* Availability */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm">Status</h2>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Availability Message</label>
            <input
              type="text"
              value={data.availability}
              onChange={(e) => setData({ ...data, availability: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Response Time</label>
            <input
              type="text"
              value={data.responseTime}
              onChange={(e) => setData({ ...data, responseTime: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-sm">Contact Information</h2>
          {data.contactInfo.map((info, i) => (
            <div key={i} className="glass rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={info.icon}
                    onChange={(e) => {
                      const contactInfo = [...data.contactInfo];
                      contactInfo[i] = { ...info, icon: e.target.value };
                      setData({ ...data, contactInfo });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Label</label>
                  <input
                    type="text"
                    value={info.label}
                    onChange={(e) => {
                      const contactInfo = [...data.contactInfo];
                      contactInfo[i] = { ...info, label: e.target.value };
                      setData({ ...data, contactInfo });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Value (displayed text)</label>
                <input
                  type="text"
                  value={info.value}
                  onChange={(e) => {
                    const contactInfo = [...data.contactInfo];
                    contactInfo[i] = { ...info, value: e.target.value };
                    setData({ ...data, contactInfo });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Link (URL)</label>
                <input
                  type="text"
                  value={info.link}
                  onChange={(e) => {
                    const contactInfo = [...data.contactInfo];
                    contactInfo[i] = { ...info, link: e.target.value };
                    setData({ ...data, contactInfo });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
