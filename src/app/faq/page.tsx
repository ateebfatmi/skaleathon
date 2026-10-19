import React from 'react';
import FaqSection from '@/components/home/FaqSection';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function FaqPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <FaqSection />

        <div className="mt-12 rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-8 sm:p-10 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="p-3 w-fit mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88]">
            <MessageSquare className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h3 className="text-xl font-medium text-white">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto font-light leading-relaxed">
            Our engineering and operations team is available to assist you with registration queries, track adjustments, or submission guidelines.
          </p>
          <div className="pt-2">
            <a
              href="mailto:skalekraft@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-3 text-xs font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-105 transition-all"
            >
              <span>Email: skalekraft@gmail.com</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
