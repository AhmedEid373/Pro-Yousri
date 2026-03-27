import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readData, writeData } from '@/lib/db';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

interface MediaEntry {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: number;
  data: string; // base64
}

interface MediaData {
  files: MediaEntry[];
}

const defaultMedia: MediaData = { files: [] };

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const media = await readData<MediaData>('media.json', defaultMedia);
  const files = (media.files ?? []).map(({ id, filename, mimeType, size, createdAt }) => ({
    id,
    filename,
    mimeType,
    size,
    createdAt,
    url: `/api/media/${id}`,
  }));
  return NextResponse.json({ files });
}

export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const media = await readData<MediaData>('media.json', defaultMedia);
  const files = (media.files ?? []).filter((f) => f.id !== id);
  await writeData('media.json', { files });
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed. Only images are accepted.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const entry: MediaEntry = {
    id,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    createdAt: Date.now(),
    data: Buffer.from(bytes).toString('base64'),
  };

  const media = await readData<MediaData>('media.json', defaultMedia);
  const files = [entry, ...(media.files ?? [])];
  await writeData('media.json', { files });

  return NextResponse.json({ url: `/api/media/${id}` });
}
