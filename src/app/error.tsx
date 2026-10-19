'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Page Error:', error);
    // If a chunk failed to load because of a rebuild or updated deployment, auto-refresh to get new chunks
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('ChunkLoadError')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative bg-[#0B0B0B]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#805948]/15 rounded-full blur-[140px]" />
      <div className="relative z-10 max-w-lg w-full rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-8 sm:p-10 text-center shadow-2xl space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-400 shadow-inner">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#c19a88]">
            System Notice
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Encountered an unexpected state
          </h1>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            The application intercepted an unhandled error. Please attempt to refresh the view or return to the main dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#805948]/20 hover:scale-105 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Page</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
