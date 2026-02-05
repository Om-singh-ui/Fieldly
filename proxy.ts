// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk',
  '/api/user/status',
  '/api/auth(.*)',
]);

// Allow static files and images
const isStaticFile = (pathname: string) => {
  return (
    pathname.startsWith('/_next/') ||
    pathname.includes('.') && // Has extension
    !pathname.endsWith('.html') &&
    !pathname.endsWith('.php') &&
    !pathname.endsWith('.aspx')
  );
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;
  
  // Allow static files (images, CSS, JS) without authentication
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // If user is not signed in and trying to access a protected route
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // User is signed in
  if (userId) {
    // Skip onboarding logic for API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Check if user needs onboarding (only for protected routes)
    if (!isPublicRoute(req)) {
      try {
        // Call our user status API
        const response = await fetch(
          `${req.nextUrl.origin}/api/user/status`,
          {
            headers: {
              Cookie: req.headers.get('cookie') || '',
            },
            cache: 'no-store',
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // If user needs role selection
          if (!data.user?.role && !pathname.startsWith('/onboarding/role')) {
            return NextResponse.redirect(new URL('/onboarding/role', req.url));
          }
          
          // If user needs onboarding based on role
          if (data.user?.role && !data.user?.isOnboarded) {
            const onboardingPath = data.user.role === 'FARMER' 
              ? '/onboarding/farmer' 
              : '/onboarding/landowner';
            
            if (!pathname.startsWith(onboardingPath)) {
              return NextResponse.redirect(new URL(onboardingPath, req.url));
            }
          }
          
          // If user is fully onboarded and trying to access onboarding pages
          if (data.user?.role && data.user?.isOnboarded) {
            const dashboardPath = data.user.role === 'FARMER'
              ? '/farmer/dashboard'
              : '/landowner/dashboard';
            
            // Prevent access to onboarding pages
            if (pathname.startsWith('/onboarding')) {
              return NextResponse.redirect(new URL(dashboardPath, req.url));
            }
          }
        }
      } catch (error) {
        console.error('Error checking user status in middleware:', error);
      }
    }
    
    // Allow access to homepage
    if (pathname === '/') {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip all internal paths (_next) and files with extensions
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};