import React from 'react';
import FaqSection from '@/components/home/FaqSection';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function FaqPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FaqSection />

        <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1220] p-8 text-center space-y-4">
          <div className="p-3 w-fit mx-auto rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Our organizing team is available to assist you with registration queries, track selection, or payment verification.
          </p>
          <div className="pt-2">
            <a
              href="mailto:contact@skalekraft.in"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-6 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <span>Email: contact@skalekraft.in</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
