import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await mkdir(uploadsDir, { recursive: true });
    const files = await readdir(uploadsDir);
    const items = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const s = await stat(filePath);
        return { filename, url: `/uploads/${filename}`, size: s.size, createdAt: s.birthtimeMs };
      })
    );
    items.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ files: items });
  } catch {
    return NextResponse.json({ files: [] });
  }
}

export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const filename = request.nextUrl.searchParams.get('filename');
  if (!filename || !SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const filePath = path.join(uploadsDir, filename);
  await unlink(filePath);
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
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
