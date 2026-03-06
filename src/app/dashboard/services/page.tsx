'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  popular: boolean;
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
                  <span className="text-xl">{service.icon}</span>
                  <span className="text-white font-medium text-sm">{service.title}</span>
                  {service.popular && (
                    <span className="px-2 py-0.5 bg-blue-600/30 text-blue-400 text-xs rounded-full">Popular</span>
                  )}
                </div>
                <span className="text-slate-400">{expandedService === i ? '▲' : '▼'}</span>
              </button>

              {expandedService === i && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Icon (emoji)</label>
                      <input
                        type="text"
                        value={service.icon}
                        onChange={(e) => {
                          const services = [...data.services];
                          services[i] = { ...service, icon: e.target.value };
                          setData({ ...data, services });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Price</label>
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) => {
                          const services = [...data.services];
                          services[i] = { ...service, price: e.target.value };
                          setData({ ...data, services });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={service.title}
                    onChange={(e) => {
                      const services = [...data.services];
                      services[i] = { ...service, title: e.target.value };
                      setData({ ...data, services });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <textarea
                    rows={3}
                    placeholder="Description"
                    value={service.description}
                    onChange={(e) => {
                      const services = [...data.services];
                      services[i] = { ...service, description: e.target.value };
                      setData({ ...data, services });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                  <div>
                    <label className="block text-slate-400 text-xs mb-2">Features (one per line)</label>
                    <textarea
                      rows={4}
                      value={service.features.join('\n')}
                      onChange={(e) => {
                        const services = [...data.services];
                        services[i] = { ...service, features: e.target.value.split('\n').filter(Boolean) };
                        setData({ ...data, services });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.popular}
                      onChange={(e) => {
                        const services = [...data.services];
                        services[i] = { ...service, popular: e.target.checked };
                        setData({ ...data, services });
                      }}
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
