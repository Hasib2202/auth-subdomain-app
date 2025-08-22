// client/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Handle subdomain routing for development and production
  if (hostname.includes('.localhost:3001') && !hostname.startsWith('www.')) {
    // Development subdomain handling
    const shopName = hostname.split('.')[0];

    // For the root path on subdomain, rewrite to shop page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/shop/${shopName}`, request.url));
    }

    // For all other paths on subdomain, let them through normally
    return NextResponse.next();
  } else if (process.env.NODE_ENV === 'production' && hostname.includes('.') && !hostname.startsWith('www.') && !hostname.endsWith('.vercel.app')) {
    // Production custom domain subdomain handling
    const shopName = hostname.split('.')[0];

    // For the root path on subdomain, rewrite to shop page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/shop/${shopName}`, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};