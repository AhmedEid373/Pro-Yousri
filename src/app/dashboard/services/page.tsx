'use client';

import { useState, useEffect, useRef } from 'react';

interface Service {
  id: number;
  icon: string;
  iconUrl?: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  showPrice?: boolean;
  popular: boolean;
  ctaText?: string;
  ctaLink?: string;
}

function ServiceIconUploader({ service, index, onChange }: {
  service: Service;
  index: number;
  onChange: (index: number, patch: Partial<Service>) => void;
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
      if (data.url) onChange(index, { iconUrl: data.url });
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
        {service.iconUrl ? (
          <img src={service.iconUrl} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          service.icon || '❓'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-slate-400 text-xs mb-1">Emoji icon</label>
            <input
              type="text"
              value={service.icon}
              onChange={(e) => onChange(index, { icon: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
              placeholder="🌐"
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
              {service.iconUrl && (
                <button
                  type="button"
                  onClick={() => onChange(index, { iconUrl: '' })}
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

interface ServicesData {
  title: string;
  subtitle: string;
  description: string;
  services: Service[];
  process: Array<{ step: string; title: string; description: string }>;
}

export default function DashboardServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [expandedService, setExpandedService] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/content/services').then((r) => r.json()).then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content/services', {
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

  const updateService = (index: number, patch: Partial<Service>) => {
    if (!data) return;
    const services = [...data.services];
    services[index] = { ...services[index], ...patch };
    setData({ ...data, services });
  };

  const removeService = (index: number) => {
    if (!data) return;
    setData((d) => d ? { ...d, services: d.services.filter((_, i) => i !== index) } : d);
  };

  const moveService = (index: number, dir: -1 | 1) => {
    if (!data) return;
    setData((d) => {
      if (!d) return d;
      const arr = [...d.services];
      const swap = index + dir;
      if (swap < 0 || swap >= arr.length) return d;
      [arr[index], arr[swap]] = [arr[swap], arr[index]];
      return { ...d, services: arr };
    });
  };

  if (!data) return <div className="p-8 text-slate-400">Loading...</div>;

  const tabs = ['general', 'services', 'process'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">⚙️ Services Page</h1>
          <p className="text-slate-400 text-sm">Edit your services page content</p>
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
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>
        </div>
      )}

      {/* Services */}
      {activeTab === 'services' && (
        <div className="space-y-4 max-w-2xl">
          {data.services.map((service, i) => (
            <div key={service.id} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedService(expandedService === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                    {service.iconUrl ? (
                      <img src={service.iconUrl} alt={service.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      service.icon
                    )}
                  </div>
                  <span className="text-white font-medium text-sm">{service.title}</span>
                  {service.popular && (
                    <span className="px-2 py-0.5 bg-blue-600/30 text-blue-400 text-xs rounded-full">Popular</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 mr-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveService(i, -1)}
                      disabled={i === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                    >↑</button>
                    <button
                      onClick={() => moveService(i, 1)}
                      disabled={i === data.services.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                    >↓</button>
                    <button
                      onClick={() => removeService(i)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >×</button>
                  </div>
                  <span className="text-slate-400">{expandedService === i ? '▲' : '▼'}</span>
                </div>
              </button>

              {expandedService === i && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
                  <ServiceIconUploader service={service} index={i} onChange={updateService} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Price</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) => updateService(i, { price: e.target.value })}
                          className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                        />
                        <button
                          onClick={() => updateService(i, { showPrice: !(service.showPrice ?? true) })}
                          className={`relative w-10 h-5 rounded-full overflow-hidden transition-colors flex-shrink-0 ${(service.showPrice ?? true) ? 'bg-blue-600' : 'bg-slate-600'}`}
                          title={(service.showPrice ?? true) ? 'Hide price' : 'Show price'}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(service.showPrice ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(i, { title: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Description"
                    value={service.description}
                    onChange={(e) => updateService(i, { description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                  <div>
                    <label className="block text-slate-400 text-xs mb-2">Features (one per line)</label>
                    <textarea
                      rows={4}
                      value={service.features.join('\n')}
                      onChange={(e) => updateService(i, { features: e.target.value.split('\n').filter(Boolean) })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Button Text</label>
                      <input
                        type="text"
                        value={service.ctaText ?? ''}
                        onChange={(e) => updateService(i, { ctaText: e.target.value })}
                        placeholder="Get Started"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Button Link</label>
                      <input
                        type="text"
                        value={service.ctaLink ?? ''}
                        onChange={(e) => updateService(i, { ctaLink: e.target.value })}
                        placeholder="/contact"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.popular}
                      onChange={(e) => updateService(i, { popular: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300 text-sm">Mark as Popular</span>
                  </label>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const newService: Service = {
                id: Date.now(),
                icon: '⚡',
                iconUrl: '',
                title: 'New Service',
                description: 'Service description',
                features: ['Feature 1', 'Feature 2'],
                price: 'Starting from $50',
                popular: false,
              };
              setData({ ...data, services: [...data.services, newService] });
            }}
            className="px-4 py-2 border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-xl text-sm transition-colors"
          >
            + Add Service
          </button>
        </div>
      )}

      {/* Process */}
      {activeTab === 'process' && (
        <div className="space-y-6 max-w-2xl">
          {data.process.map((step, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Step (e.g. 01)"
                  value={step.step}
                  onChange={(e) => {
                    const process = [...data.process];
                    process[i] = { ...step, step: e.target.value };
                    setData({ ...data, process });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={step.title}
                  onChange={(e) => {
                    const process = [...data.process];
                    process[i] = { ...step, title: e.target.value };
                    setData({ ...data, process });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={step.description}
                  onChange={(e) => {
                    const process = [...data.process];
                    process[i] = { ...step, description: e.target.value };
                    setData({ ...data, process });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
