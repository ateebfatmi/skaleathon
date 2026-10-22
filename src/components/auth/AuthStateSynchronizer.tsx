'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const AUTH_STATE_KEY = 'skaleathon:clerk-user';

/**
 * Keeps server components in sync when Clerk changes authentication state.
 * Without this refresh, a prefetched public route can retain its signed-out
 * server payload even after the client-side Clerk session becomes active.
 */
export default function AuthStateSynchronizer() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const currentState = userId || 'signed-out';
    const previousState = window.sessionStorage.getItem(AUTH_STATE_KEY);

    window.sessionStorage.setItem(AUTH_STATE_KEY, currentState);

    if (previousState !== null && previousState !== currentState) {
      router.refresh();
    }
  }, [isLoaded, router, userId]);

  return null;
}
