// client/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Check if it's a subdomain
  if (hostname.includes('.localhost:3000') && !hostname.startsWith('www.')) {
    const shopName = hostname.split('.')[0];
    
    // Rewrite to shop page
    return NextResponse.rewrite(new URL(`/shop/${shopName}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};