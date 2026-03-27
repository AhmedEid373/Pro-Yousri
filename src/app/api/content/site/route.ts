import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

const defaultSite = {
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

export async function GET() {
  const data = await readData('site.json', defaultSite);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    await writeData('site.json', data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
