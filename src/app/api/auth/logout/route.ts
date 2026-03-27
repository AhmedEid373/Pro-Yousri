import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function POST() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth-token');
  return response;
}
