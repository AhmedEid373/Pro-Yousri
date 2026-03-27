import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { readData, writeData } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  status: 'unread' | 'processing' | 'completed' | 'archived' | 'trashed';
}

const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  turnstileToken: z.string().optional(),
});

// Rate limiter: 3 messages per hour per IP
const messageAttempts = new Map<string, { count: number; firstAt: number }>();
const MSG_WINDOW_MS = 60 * 60 * 1000;
const MSG_MAX = 3;

function getIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function isMsgRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = messageAttempts.get(ip);
  if (!entry || now - entry.firstAt > MSG_WINDOW_MS) {
    messageAttempts.set(ip, { count: 1, firstAt: now });
    return false;
  }
  entry.count++;
  return entry.count > MSG_MAX;
}

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await readData<Message[]>('messages.json');
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIp(request);
    if (isMsgRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { name, email, subject, message, turnstileToken } = parsed.data;

    // Verify Cloudflare Turnstile if enabled
    const site = await readData<{ turnstile?: { enabled?: boolean; secretKey?: string } }>('site.json', {});
    if (site.turnstile?.enabled && site.turnstile?.secretKey) {
      if (!turnstileToken) {
        return NextResponse.json({ error: 'Turnstile verification required' }, { status: 400 });
      }
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: site.turnstile.secretKey,
          response: turnstileToken,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 403 });
      }
    }

    const messages = await readData<Message[]>('messages.json');
    const newMessage: Message = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      status: 'unread',
    };

    messages.unshift(newMessage);
    await writeData('messages.json', messages);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = await request.json();
    const messages = await readData<Message[]>('messages.json');
    const msg = messages.find((m) => m.id === id);
    if (!msg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (action === 'read') {
      msg.read = true;
      if (!msg.readAt) msg.readAt = new Date().toISOString();
    } else if (action === 'restored') {
      msg.status = 'unread';
    } else if (['processing', 'completed', 'archived', 'trashed'].includes(action)) {
      msg.status = action as Message['status'];
    }

    await writeData('messages.json', messages);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    const messages = await readData<Message[]>('messages.json');
    const filtered = messages.filter((m) => m.id !== id);
    await writeData('messages.json', filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
