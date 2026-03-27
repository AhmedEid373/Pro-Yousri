import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { validatePayload } from '@/lib/validate';

export async function GET() {
  try {
    const data = await readData('contact.json');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const error = validatePayload(data, 'object');
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    await writeData('contact.json', data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
