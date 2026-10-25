import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Skaleathon',
  description: 'How Skaleathon collects, uses, protects, and retains participant information.',
};

export default function PrivacyPage() {
  const sections = [
    {
      heading: '1. Information We Collect',
      body: 'Skaleathon operates under a data minimization principle. We collect only the information necessary to register teams, coordinate project evaluations, process the published team entry fee securely via Razorpay, and issue certificates. We do not store payment card details, UPI PINs, or bank account numbers.',
    },
    {
      heading: '2. Use of Information',
      body: 'Your information is utilized solely to administer event participation, authenticate submissions, distribute official prize awards, and generate digital certificates.',
    },
    {
      heading: '3. Data Privacy & Confidentiality',
      body: 'We strictly protect participant privacy. Phone numbers, personal email addresses, and internal judging notes remain confidential. They are never sold, traded, or shared with external third-party advertisers.',
    },
    {
      heading: '4. Data Retention and Rights',
      body: 'Participants may request the inspection or deletion of their personal records upon conclusion of the event, subject to statutory financial compliance obligations. Contact skalekraft@gmail.com for privacy inquiries.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] px-5 pb-24 pt-28 text-white md:px-10 md:pt-32">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-white/50 hover:text-[#c19a88] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <p className="mt-8 text-sm uppercase tracking-[0.26em] text-[#c19a88]">SkaleKraft Legal</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl text-white">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/40">Last updated: October 2026 • Version 1.0</p>
        <p className="mt-6 text-base leading-relaxed text-white/65 font-light">
          This Privacy Policy explains how participant information is collected, processed, and safeguarded during Skaleathon.
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
            Privacy inquiries? Email our compliance team at{' '}
            <a href="mailto:skalekraft@gmail.com" className="text-white transition hover:text-[#c19a88] font-medium">
              skalekraft@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
