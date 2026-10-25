import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import type { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';

export default function RulesSummarySection({ event }: { event: EventData }) {
  const rules = [
    'Open across India to engineering students, recent graduates, and independent developers.',
    `Teams composed of ${event.min_team_size} to ${event.max_team_size} members. Solo builders are supported when the minimum is one.`,
    `${formatINR(event.registration_fee_inr)} flat team registration fee confirmed prior to competition submission.`,
    'Original codebase written for this event. Plagiarized projects face immediate disqualification.',
    'Open-source libraries, frameworks, and public APIs are permitted with attribution.',
    'AI tool assistance is welcomed with full disclosure in the final submission manifesto.',
    'A public GitHub repository and live deployed URL are required (video demo provides an evaluation advantage).',
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 sm:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
                Integrity & Governance
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Rules of <span className="text-[#c19a88]">engagement</span>.
            </h2>
            <p className="text-sm text-white/55 leading-relaxed font-light">
              We uphold strict engineering integrity. All submissions undergo automated plagiarism checks, commit history verification, and manual code audits.
            </p>
            <div>
              <Link
                href="/rules"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c19a88] hover:text-white transition-colors group"
              >
                <span>Read complete official competition rules</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-[20px] sm:rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 sm:p-9 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
