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
  '/api/event(.*)',
  '/api/certificates/verify(.*)',
  '/api/certificates/download(.*)',
  '/api/auth/(.*)',
]);

export default clerkMiddleware((auth, req) => {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  // If Clerk is not configured with live credentials, bypass to built-in session guard
  if (!clerkKey || clerkKey.includes('placeholder')) {
    return NextResponse.next();
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Strictly exclude Next.js internal static assets, images, and any file with an extension
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|png|jpg|jpeg|gif|svg|webp|ico|ttf|woff2?)).*)',
    '/(api|trpc)(.*)',
  ],
};
