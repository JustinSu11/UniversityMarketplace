import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

async function getUser(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload; // { id, email, role }
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only guard /user and /admin
  if (!pathname.startsWith('/user') && !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const user = await getUser(req);

  // No token? send to home
  if (!user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Admin area needs ADMIN role
  if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
};
