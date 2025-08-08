import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signJWT } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  // Just to prove the route loads without crashing
  return NextResponse.json({ ok: true });
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signJWT({ id: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
