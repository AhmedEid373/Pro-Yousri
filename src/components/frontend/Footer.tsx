import Link from 'next/link';

export default function Footer() {
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
              WordPress Developer & Web Specialist. Building powerful digital experiences with expertise in WordPress, VPS, and hosting solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-muted)] hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                'WordPress Development',
                'VPS Server Setup',
                'Domain Management',
                'Speed Optimization',
                'Website Migration',
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-[var(--text-muted)] hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} Yousri. All rights reserved.
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
