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
  '/demo(.*)',
  '/api/event(.*)',
  '/api/certificates/verify(.*)',
  '/api/certificates/download(.*)',
  '/api/auth/(.*)',
  '/api/payment/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey || clerkKey.includes('placeholder')) return NextResponse.next();

  try {
    await auth.protect();
  } catch {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
