// client/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Only handle subdomains, not the main domain
  if (hostname.includes('.localhost:3000') && !hostname.startsWith('www.')) {
    const shopName = hostname.split('.')[0];

    // For the root path on subdomain, rewrite to shop page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/shop/${shopName}`, request.url));
    }

    // For all other paths on subdomain, let them through normally
    // This prevents redirect loops for signin/signup pages
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};