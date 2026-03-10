'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [techStack, setTechStack] = useState('Built with Next.js & Tailwind CSS');
  const [copyright, setCopyright] = useState('Yousri. All rights reserved.');
  const [bio, setBio] = useState('WordPress Developer & Web Specialist. Building powerful digital experiences with expertise in WordPress, VPS, and hosting solutions.');
  const [quickLinks, setQuickLinks] = useState([
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ]);
  const [footerServices, setFooterServices] = useState([
    { label: 'WordPress Development', link: '/services' },
    { label: 'VPS Server Setup', link: '/services' },
    { label: 'Domain Management', link: '/services' },
    { label: 'Speed Optimization', link: '/services' },
    { label: 'Website Migration', link: '/services' },
  ]);

  useEffect(() => {
    fetch('/api/content/footer')
      .then((r) => r.json())
      .then((data) => {
        if (data.techStack) setTechStack(data.techStack);
        if (data.copyright) setCopyright(data.copyright);
        if (data.bio) setBio(data.bio);
        if (data.quickLinks) setQuickLinks(data.quickLinks);
        if (data.footerServices) setFooterServices(data.footerServices);
      })
      .catch(() => {});
  }, []);

  const isExternal = (url: string) => /^https?:\/\//.test(url);

  return (
    <footer className="bg-[var(--surface-alt)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-[var(--text-primary)] font-bold text-lg">Yousri</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              {bio}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  {isExternal(link.href) ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-blue-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[var(--text-muted)] hover:text-blue-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerServices.map((service, i) => (
                <li key={i}>
                  {isExternal(service.link) ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-blue-400 text-sm transition-colors duration-200"
                    >
                      {service.label}
                    </a>
                  ) : (
                    <Link
                      href={service.link || '/services'}
                      className="text-[var(--text-muted)] hover:text-blue-400 text-sm transition-colors duration-200"
                    >
                      {service.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} {copyright}
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            {techStack}
          </p>
        </div>
      </div>
    </footer>
  );
}
