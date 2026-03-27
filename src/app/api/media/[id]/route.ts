import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/db';

interface MediaEntry {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: number;
  data: string;
}

interface MediaData {
  files: MediaEntry[];
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const media = await readData<MediaData>('media.json', { files: [] });
    const entry = (media.files ?? []).find((f) => f.id === id);
    if (!entry) return new NextResponse(null, { status: 404 });

    const buffer = Buffer.from(entry.data, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': entry.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
