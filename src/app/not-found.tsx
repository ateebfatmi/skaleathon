import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative bg-[#0B0B0B]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#805948]/15 rounded-full blur-[140px]" />
      <div className="relative z-10 max-w-lg w-full rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-8 sm:p-10 text-center shadow-2xl space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#c19a88] shadow-inner">
          <Compass className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#c19a88]">
            404 Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            The requested page does not exist or has been relocated within the Skaleathon portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#805948]/20 hover:scale-105 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </Link>
          <Link
            href="/faq"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <span>Read FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
