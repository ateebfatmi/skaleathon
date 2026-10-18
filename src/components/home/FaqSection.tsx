'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who is eligible to participate in Skaleathon 2027?',
      a: 'Participation is open across India to undergraduate and postgraduate students, self-taught developers, and early-career innovators. You can participate individually (team size 1) or in a team of up to 6 members.',
    },
    {
      q: 'What is the team registration fee and how is it paid?',
      a: 'The registration fee is a flat ₹99 per team (not per member). Payment is completed securely via Razorpay supporting UPI, Cards, and Net Banking. Once verified, your team is authorized to submit a project.',
    },
    {
      q: 'What are the official competition tracks?',
      a: 'Skaleathon 2027 features three tracks: (1) AI & Machine Learning, (2) Web Development, and (3) App Development. Teams choose one track during registration and can adjust before the submission deadline.',
    },
    {
      q: 'What are the prizes and certificate recognitions?',
      a: 'The total authorized prize pool is ₹35,000 (1st Prize: ₹20,000, 2nd Prize: ₹10,000, 3rd Prize: ₹5,000). Official merit certificates are awarded to eligible members of the Top 25 teams. Additionally, candidates from the top 5 teams receive an opportunity to interview for technical internships at SkaleKraft (not a guarantee of employment).',
    },
    {
      q: 'Are generative AI tools like ChatGPT or Copilot permitted?',
      a: 'Yes, modern AI developer tools may be utilized. However, you must disclose their usage in your project submission form. Plagiarized projects or turnkey clone repositories will be disqualified.',
    },
    {
      q: 'How does the certificate verification system work?',
      a: 'Every issued certificate features a tamper-evident unique identifier and QR code. Anyone can verify authenticity online at /verify-certificate/[certificateId].',
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 relative">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-cyanAccent-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Clear, authoritative answers to ensure your team has a seamless hackathon experience.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#0c111e] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-sm sm:text-base font-bold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyanAccent-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
