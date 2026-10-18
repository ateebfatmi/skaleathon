import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RulesSummarySection() {
  const rules = [
    'Open across India to eligible college students, recent graduates, and software builders.',
    'Teams must consist of between 1 and 6 members. Individual participation is fully supported.',
    'Registration fee of ₹99 per team must be confirmed prior to submission eligibility.',
    'All code submitted must be original work developed for this competition.',
    'Open-source libraries, frameworks, and APIs are permitted with appropriate attribution.',
    'Any generative AI code assistance must be disclosed in the project submission form.',
    'A public GitHub repository and working demo link/video are mandatory for evaluation.',
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#080c16] border-t border-white/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300">
              <ShieldAlert className="h-3.5 w-3.5 text-brand-400" />
              <span>Integrity & Governance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Rules & Eligibility Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We uphold strict academic and engineering standards. Projects found using plagiarized code or deceptive submissions will be disqualified without refund.
            </p>
            <div>
              <Link
                href="/rules"
                className="inline-flex items-center gap-2 text-sm font-bold text-cyanAccent-400 hover:text-cyanAccent-300 transition-colors"
              >
                <span>Read complete official competition rules</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0c111e] p-8 space-y-4">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
