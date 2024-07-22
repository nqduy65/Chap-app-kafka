import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.pathname;
  const cookieData = request.cookies.get('userId') || null;
  if (nextUrl.includes('login')) {
    if (cookieData) {
      return NextResponse.redirect(new URL('/conversations', request.nextUrl));
    }
    return;
  } else {
    if (cookieData) {
      return;
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
