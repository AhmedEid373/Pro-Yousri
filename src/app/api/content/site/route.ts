import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

const defaultSite = { logoType: 'text', logoText: 'Y', logoImage: '', brandName: 'Yousri' };

export async function GET() {
  const data = readData('site.json', defaultSite);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    writeData('site.json', data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
