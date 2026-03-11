import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { headers } from "next/headers";
import { readData } from "@/lib/db";

interface SiteData {
  logoType?: string;
  logoText?: string;
  logoImage?: string;
  brandName?: string;
  logoColorFrom?: string;
  logoColorTo?: string;
  navLinks?: Array<{ href: string; label: string }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    robots?: string;
  };
  maintenance?: {
    enabled?: boolean;
    message?: string;
    gif?: string;
  };
}

const defaultSite: SiteData = {
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
};

export async function generateMetadata(): Promise<Metadata> {
  const site = readData<SiteData>('site.json', defaultSite);
  const seo = site.seo ?? defaultSite.seo!;

  return {
    title: seo.title || defaultSite.seo!.title,
    description: seo.description || defaultSite.seo!.description,
    keywords: seo.keywords || undefined,
    robots: seo.robots || 'index,follow',
    openGraph: {
      title: seo.ogTitle || seo.title || defaultSite.seo!.title,
      description: seo.ogDescription || seo.description || defaultSite.seo!.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = readData<SiteData>('site.json', defaultSite);
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') ?? '/';

  const isProtected = ['/dashboard', '/login', '/maintenance'].some((p) =>
    pathname.startsWith(p)
  );

  const maintenanceEnabled = site.maintenance?.enabled === true;

  if (maintenanceEnabled && !isProtected) {
    const msg = site.maintenance?.message ?? "We're working on something awesome. Check back soon!";
    const gif = site.maintenance?.gif ?? '';

    return (
      <html lang="en">
        <head />
        <body className="antialiased">
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px' }}>
              {gif ? (
                <img
                  src={gif}
                  alt="Maintenance"
                  style={{ width: '200px', height: '200px', objectFit: 'contain', margin: '0 auto 2rem', borderRadius: '12px' }}
                />
              ) : (
                <div style={{ fontSize: '80px', marginBottom: '2rem' }}>⚙️</div>
              )}
              <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Under Maintenance
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6 }}>{msg}</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light')document.documentElement.classList.add('dark');}catch(e){}})();`
        }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
