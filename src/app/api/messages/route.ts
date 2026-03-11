import { NextRequest, NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = readData<Message[]>('messages.json');
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, turnstileToken } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify Cloudflare Turnstile if enabled
    const site = readData<{ turnstile?: { enabled?: boolean; secretKey?: string } }>('site.json', {});
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

    const messages = readData<Message[]>('messages.json');
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
    writeData('messages.json', messages);

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
    const messages = readData<Message[]>('messages.json');
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

    writeData('messages.json', messages);
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
    const messages = readData<Message[]>('messages.json');
    const filtered = messages.filter((m) => m.id !== id);
    writeData('messages.json', filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
