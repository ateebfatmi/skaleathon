import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code of Conduct | Skaleathon',
  description: 'Standards of integrity, safety, inclusion, and respectful participation at Skaleathon.',
};

export default function CodeOfConductPage() {
  const sections = [
    {
      heading: '1. Our Collective Standard',
      body: 'Skaleathon is dedicated to providing a safe, respectful, and harassment-free arena for everyone, regardless of gender identity, orientation, physical appearance, background, or skill level.',
    },
    {
      heading: '2. Expected Conduct',
      body: 'Communicate with professional courtesy across all channels and repositories. Offer constructive technical feedback, uphold attribution standards, and focus on engineering real-world utility.',
    },
    {
      heading: '3. Unacceptable Conduct',
      body: 'Harassment, intimidation, unauthorized distribution of contact info (doxxing), deceptive code tampering, or any attempt to influence judges will result in immediate disqualification and permanent platform ban.',
    },
    {
      heading: '4. Reporting & Governance',
      body: 'To report violations, reach out directly to the SkaleKraft organizer board at skalekraft@gmail.com. All reports are investigated promptly and confidentially.',
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
        <p className="mt-8 text-sm uppercase tracking-[0.26em] text-[#c19a88]">SkaleKraft Community</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl text-white">Code of Conduct</h1>
        <p className="mt-3 text-sm text-white/40">Last updated: October 2026 • Version 1.0</p>
        <p className="mt-6 text-base leading-relaxed text-white/65 font-light">
          Standards of integrity, safety, and respect for all competitors, evaluators, and partners in Skaleathon.
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
            Need support? Reach our incident response team at{' '}
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
