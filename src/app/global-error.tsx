'use client';

import React, { useEffect } from 'react';
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Global Root Error:', error);
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('ChunkLoadError')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0B0B] text-[#EDEDED] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#121212] p-8 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-white">Application Encountered an Error</h2>
          <p className="text-xs text-neutral-400">
            A critical interface issue was caught. Please reload the application.
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="w-full py-2.5 rounded-full bg-[#f5f5f5] hover:bg-[#d4d4d4] text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            Reload Skaleathon
          </button>
        </div>
      </body>
    </html>
  );
}
