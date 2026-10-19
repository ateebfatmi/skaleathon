import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      heading: '1. Agreement to Terms',
      body: 'By accessing the Skaleathon 2028 platform, registering a team, or completing fee payment, you agree to be bound by these Terms and Conditions and our Official Competition Rules.',
    },
    {
      heading: '2. Team Responsibilities',
      body: 'The Team Leader acts as the official representative for all team members. The Team Leader warrants that all registered members have consented to participation and will adhere to code originality standards.',
    },
    {
      heading: '3. Intellectual Property Rights',
      body: 'Participants retain 100% intellectual property ownership of the software, design, and code they build during Skaleathon 2028. SkaleKraft claims zero ownership over your code repository or product. By submitting, teams grant SkaleKraft a non-exclusive license to showcase the project title, team name, and public demonstration video for event promotional purposes.',
    },
    {
      heading: '4. Internship Opportunity Disclaimer',
      body: 'There are internship opportunities for selected candidates to interview for technical internships at SkaleKraft. This is an interview pathway only and is not a guarantee of employment. Hiring decisions remain at the sole discretion of SkaleKraft based on performance, technical fit, and background verification.',
    },
    {
      heading: '5. Governing Law & Dispute Resolution',
      body: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of the hackathon shall be subject to the exclusive jurisdiction of the competent courts in India.',
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
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl text-white">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-white/40">Last updated: October 2026 • Version 1.0</p>
        <p className="mt-6 text-base leading-relaxed text-white/65 font-light">
          These Terms govern team registration, participation, and intellectual property rights for Skaleathon 2028.
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
            Questions regarding terms? Email our team at{' '}
            <a href="mailto:skalekraft@gmail.com" className="text-white transition hover:text-[#c19a88] font-medium">
              skalekraft@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
