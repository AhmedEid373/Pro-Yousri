import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData, writeData } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

interface AdminData {
  username: string;
  password: string;
  name: string;
  email?: string;
}

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await readData<AdminData>('admin.json');
  return NextResponse.json({
    username: admin.username,
    name: admin.name,
    email: admin.email ?? '',
  });
}

export async function PUT(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, username, email, currentPassword, newPassword } = await request.json();

  if (!currentPassword) {
    return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
  }

  const admin = await readData<AdminData>('admin.json');
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  const updated: AdminData = {
    ...admin,
    name: name?.trim() || admin.name,
    username: username?.trim() || admin.username,
    email: email?.trim() ?? admin.email,
  };

  if (newPassword) {
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }
    updated.password = await bcrypt.hash(newPassword, 10);
  }

  await writeData('admin.json', updated);
  return NextResponse.json({ success: true });
}
