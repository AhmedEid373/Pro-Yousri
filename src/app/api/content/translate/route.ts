import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { texts, sourceLang, targetLang } = await request.json();

    if (!Array.isArray(texts) || !targetLang || !sourceLang) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const translations: string[] = [];

    for (const text of texts) {
      if (!text || typeof text !== 'string') {
        translations.push(text || '');
        continue;
      }

      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
        );
        const data = await res.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          let translated = data.responseData.translatedText;
          // MyMemory sometimes returns uppercase for short strings — preserve original casing style
          if (text[0] === text[0].toLowerCase() && translated[0] !== translated[0].toLowerCase()) {
            translated = translated[0].toLowerCase() + translated.slice(1);
          }
          translations.push(translated);
        } else {
          translations.push(text); // fallback to original
        }
      } catch {
        translations.push(text); // fallback on error
      }
    }

    return NextResponse.json({ translations });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
