import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define your public and protected routes
const publicRoutes = ['/login'];
const protectedRoutes = ['/home'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Special case for root path
  if (pathname === '/') {
    if (token) {
        // Redirect to home page if authenticated
        return NextResponse.rewrite(new URL('/home', request.url));
    } else {
      // Redirect to landing page if not authenticated
      return NextResponse.rewrite(new URL('/login', request.url));
    }
  }

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  console.log("isPublicRoute",isPublicRoute)
  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if trying to access public route with token
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except those starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};