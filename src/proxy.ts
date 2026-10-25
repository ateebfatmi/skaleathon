import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { shouldBypassAuthentication } from '@/lib/auth/e2e-bypass';

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
  '/api/payment/webhook',
]);

const authenticatedProxy = clerkMiddleware(
  async (auth, req) => {
    if (isPublicRoute(req)) return NextResponse.next();

    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (!clerkKey || clerkKey.includes('placeholder')) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Authentication service is not configured.' },
          { status: 503 }
        );
      }
      return NextResponse.next();
    }

    try {
      await auth.protect();
    } catch {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
  },
  {
    frontendApiProxy: {
      enabled: true,
    },
  } as any,
);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  // Browser tests exercise public pages in an isolated CI environment where no
  // third-party credentials are available. Keep this escape hatch explicit and
  // impossible to activate in a production runtime.
  if (shouldBypassAuthentication() && isPublicRoute(request)) {
    return NextResponse.next();
  }

  return authenticatedProxy(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};
