import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/tracks(.*)',
  '/prizes(.*)',
  '/rules(.*)',
  '/faq(.*)',
  '/leaderboard(.*)',
  '/verify-certificate(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/refund-policy(.*)',
  '/code-of-conduct(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/register(.*)',
  '/candidates(.*)',
  '/registered-candidates(.*)',
  '/checkout(.*)',
  '/demo(.*)',
  '/api/event(.*)',
  '/api/certificates/verify(.*)',
  '/api/certificates/download(.*)',
  '/api/auth/(.*)',
  '/api/create-order(.*)',
  '/api/verify-payment(.*)',
  '/api/payment/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // If user has active custom skale_session cookie or accessing a public route, allow through
  const hasSkaleSession = req.cookies.has('skale_session');
  if (hasSkaleSession || isPublicRoute(req)) {
    return NextResponse.next();
  }

  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey || clerkKey.includes('placeholder')) {
    return NextResponse.next();
  }

  try {
    await auth.protect();
  } catch {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
