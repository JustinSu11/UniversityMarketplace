// middleware.js (project root)
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    // Not signed in → block protected areas, send to landing
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Non-admin trying to access /admin → send to landing
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Admin trying to access /user → send to landing
    if (pathname.startsWith('/user') && token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: '/signin' },
  }
)

// ✅ Do NOT include '/' or '/after-login' here so they stay public
export const config = {
  matcher: [
    '/admin', '/admin/:path*',
    '/user', '/user/:path*',
  ],
}
