import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

const defaultLanguages = {
  defaultLang: 'en',
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
    { code: 'fr', name: 'French', flag: '🇫🇷', dir: 'ltr' },
  ],
  translations: {} as Record<string, Record<string, string>>,
};

export async function GET() {
  const data = await readData('languages.json', defaultLanguages);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    await writeData('languages.json', data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
