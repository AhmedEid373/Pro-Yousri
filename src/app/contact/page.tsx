'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import FrontendWrapper from '@/components/frontend/FrontendWrapper';
import { useLanguage } from '@/context/LanguageContext';
import Script from 'next/script';
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

const defaultContactData: ContactData = {
  title: 'Get In Touch',
  subtitle: 'Contact Me',
  description: "Have a project in mind? Let's talk! Fill out the form and I'll get back to you within 24 hours.",
  contactInfo: [
    { icon: '📧', label: 'Email', value: 'yousri@example.com', link: 'mailto:yousri@example.com' },
    { icon: '💬', label: 'WhatsApp', value: '+1 234 567 8900', link: 'https://wa.me/12345678900' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/yousri', link: 'https://linkedin.com/in/yousri' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/yousri', link: 'https://github.com/yousri' },
  ],
  availabilityStatus: 'green',
  availabilityOptions: {
    green: 'Available for new projects',
    orange: 'Available but taking select projects',
    red: 'Very busy — emergency projects only',
  },
  responseTime: 'Usually responds within 24 hours',
};

const statusColors = {
  green:  { dot: 'bg-green-400',  text: 'text-green-400'  },
  orange: { dot: 'bg-orange-400', text: 'text-orange-400' },
  red:    { dot: 'bg-red-400',    text: 'text-red-400'    },
};

export default function ContactPage() {
  const { t } = useLanguage();
  const [contactData, setContactData] = useState<ContactData>(defaultContactData);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileConfig, setTurnstileConfig] = useState<{ enabled: boolean; siteKey: string }>({ enabled: false, siteKey: '' });
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    fetch('/api/content/contact')
      .then((r) => r.json())
      .then((data) => { if (data.title) setContactData(data); })
      .catch(() => {});

    fetch('/api/content/site')
      .then((r) => r.json())
      .then((data) => {
        if (data?.turnstile?.enabled && data.turnstile.siteKey) {
          setTurnstileConfig({ enabled: true, siteKey: data.turnstile.siteKey });
        }
      })
      .catch(() => {});
  }, []);

  const renderTurnstile = useCallback(() => {
    if (!turnstileConfig.enabled || !turnstileRef.current) return;
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      return;
    }
    if (window.turnstile && turnstileRef.current) {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileConfig.siteKey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        theme: 'dark',
      });
    }
  }, [turnstileConfig]);

  useEffect(() => {
    if (turnstileConfig.enabled && window.turnstile) {
      renderTurnstile();
    }
  }, [turnstileConfig, renderTurnstile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (turnstileConfig.enabled && !turnstileToken) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...(turnstileConfig.enabled ? { turnstileToken } : {}),
        }),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTurnstileToken('');
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } else setStatus('error');
    } catch { setStatus('error'); }
  };

  const activeStatus = contactData.availabilityStatus ?? 'green';
  const color = statusColors[activeStatus];

  return (
    <FrontendWrapper>
      <div className="min-h-screen bg-[var(--background)] pt-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface-alt)] to-green-100 dark:to-green-950" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-green-600 dark:text-green-400 text-sm font-medium tracking-widest uppercase mb-3">
              {t('contact.subtitle', contactData.subtitle)}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
              {t('contact.title', contactData.title)}
            </h1>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
              {t('contact.description', contactData.description)}
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">{t('ui.letsConnect', "Let's Connect")}</h2>

                <div className="space-y-6 mb-12">
                  {contactData.contactInfo.map((info, i) => (
                    <a
                      key={i}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 glass rounded-xl p-4 hover:border-blue-500/50 transition-all duration-200 group"
                    >
                      <div className="relative w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-blue-600/30 transition-colors overflow-hidden">
                        {info.iconUrl ? (
                          <Image src={info.iconUrl} alt={info.label} fill className="object-cover" unoptimized />
                        ) : (
                          info.icon
                        )}
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">{t(`contact.info.${i}.label`, info.label)}</p>
                        <p className="text-[var(--text-primary)] font-medium text-sm">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 ${color.dot} rounded-full animate-pulse`} />
                    <p className={`${color.text} font-medium text-sm`}>
                      {t(`contact.availability.${activeStatus}`, contactData.availabilityOptions[activeStatus])}
                    </p>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">{t('contact.responseTime', contactData.responseTime)}</p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">{t('ui.sendAMessage', 'Send a Message')}</h2>

                {status === 'success' ? (
                  <div className="glass rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-[var(--text-primary)] font-bold text-xl mb-2">{t('ui.messageSent', 'Message Sent!')}</h3>
                    <p className="text-[var(--text-muted)] mb-6">{t('ui.messageSentDesc', "Thank you for reaching out. I'll get back to you within 24 hours.")}</p>
                    <button onClick={() => setStatus('idle')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                      {t('ui.sendAnother', 'Send Another Message')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">{t('ui.yourName', 'Your Name')} *</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
                      </div>
                      <div>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">{t('ui.yourEmail', 'Email Address')} *</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">{t('ui.subject', 'Subject')} *</label>
                      <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="WordPress Development Project" className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">{t('ui.yourMessage', 'Message')} *</label>
                      <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell me about your project..." className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none" />
                    </div>
                    {/* Cloudflare Turnstile widget */}
                    {turnstileConfig.enabled && (
                      <div className="flex flex-col items-center gap-2">
                        <div ref={turnstileRef} />
                        {!turnstileToken && (
                          <p className="text-slate-500 text-xs">Please complete the verification above to send your message</p>
                        )}
                      </div>
                    )}
                    {status === 'error' && <p className="text-red-400 text-sm">{t('ui.sendFailed', 'Failed to send message. Please try again.')}</p>}
                    <button
                      type="submit"
                      disabled={status === 'sending' || (turnstileConfig.enabled && !turnstileToken)}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                      {status === 'sending' ? t('ui.sending', 'Sending...') : `${t('ui.sendMessage', 'Send Message')} →`}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      {turnstileConfig.enabled && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
          strategy="afterInteractive"
          onReady={() => renderTurnstile()}
        />
      )}
    </FrontendWrapper>
  );
}

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}
