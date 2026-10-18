import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  const sections = [
    {
      heading: '1. General Registration Policy',
      body: 'The Skaleathon 2027 flat team fee of ₹99 is a nominal entry contribution committed to hosting infrastructure, judge synchronization, and tamper-evident certificate issuance. Once verified, the fee is generally non-refundable as computational allocations are reserved immediately.',
    },
    {
      heading: '2. Eligible Refund Circumstances',
      body: 'Refunds are issued exclusively for duplicate transactions resulting from payment gateway anomalies, or in the unlikely event that the competition is cancelled prior to the submission phase.',
    },
    {
      heading: '3. Non-Refundable Scenarios',
      body: 'Refunds will not be granted if a team withdraws voluntarily, fails to submit before the deadline, or is disqualified due to plagiarism, code theft, or code of conduct violations.',
    },
    {
      heading: '4. Refund Processing Procedure',
      body: 'For duplicate payment investigations, the Team Leader should email ateeb@skalekraft.in within 7 days of the charge with the Order ID and Razorpay reference. Confirmed duplicate charges are credited back to the original source within 5–7 business days.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-5 pb-24 pt-28 text-white md:px-10 md:pt-32">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-white/50 hover:text-[#c19a88] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <p className="mt-8 text-sm uppercase tracking-[0.26em] text-[#c19a88]">SkaleKraft Legal</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl text-white">Refund Policy</h1>
        <p className="mt-3 text-sm text-white/40">Last updated: October 2026 • Version 1.0</p>
        <p className="mt-6 text-base leading-relaxed text-white/65 font-light">
          This policy defines refund and cancellation guidelines for the nominal ₹99 team registration fee.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading} className="border-t border-white/10 pt-8">
              <h2 className="text-lg font-medium text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55 font-light">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-[22px] border border-white/10 bg-[#101010] p-6">
          <p className="text-sm leading-6 text-white/55 font-light">
            Billing inquiries? Email our finance desk at{' '}
            <a href="mailto:ateeb@skalekraft.in" className="text-white transition hover:text-[#c19a88] font-medium">
              ateeb@skalekraft.in
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
