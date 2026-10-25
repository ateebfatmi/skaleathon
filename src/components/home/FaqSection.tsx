'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';

export default function FaqSection({ event }: { event: EventData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Who is eligible to participate in Skaleathon?',
      a: `Participation is open across India to undergraduate and postgraduate students, self-taught developers, and early-career innovators. Teams may have ${event.min_team_size} to ${event.max_team_size} members.`,
    },
    {
      q: 'What is the team registration fee and how is it processed?',
      a: `The registration fee is a flat ${formatINR(event.registration_fee_inr)} per team (not per member). Payment is completed securely via Razorpay. Once verified, your team is fully authorized.`,
    },
    {
      q: 'What are the technical tracks available?',
      a: 'Skaleathon features three open-domain tracks: (1) AI & Machine Learning, (2) Web Development, and (3) App Development. Teams choose one track during registration and can formulate any problem statement across any domain.',
    },
    {
      q: 'When are the competition rounds conducted?',
      a: 'The competition runs in four stages: an online technical quiz, an idea and architecture review, a core build sprint, and a live grand-finale defense. Current deadlines are published on the event timeline and participant dashboard.',
    },
    {
      q: 'What are the prizes and certificate recognitions?',
      a: `The authorized prize pool is ${formatINR(event.prize_pool_inr)} (first: ${formatINR(event.first_prize_inr)}, second: ${formatINR(event.second_prize_inr)}, third: ${formatINR(event.third_prize_inr)}). Merit certificates are awarded to confirmed members of the top ${event.certificates_top_n} teams.`,
    },
    {
      q: 'Are generative AI tools like Copilot, Cursor, or ChatGPT allowed?',
      a: 'Yes, modern developer tooling is welcomed. However, all AI tool assistance must be transparently disclosed in your submission documentation. Turnkey clones or unattributed code will be disqualified.',
    },
    {
      q: 'How are digital certificates issued?',
      a: `Eligible members of the top ${event.certificates_top_n} teams receive an official digital certificate of merit in their participant dashboard after results are finalized.`,
    },
  ];

  return (
    <section id="faq" className="py-6 sm:py-16 lg:py-24 relative bg-[#0B0B0B] border-t border-white/10 overflow-hidden">
      <div className="container mx-auto max-w-4xl px-1 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 mb-2.5 sm:mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Clarity First
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Frequently asked <span className="text-[#c19a88]">questions</span>.
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/55 leading-relaxed font-light">
            Clear, authoritative answers to ensure your team experiences a seamless competition.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl sm:rounded-[20px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] overflow-hidden transition-all duration-300 hover:border-white/15"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  id={`faq-trigger-${idx}`}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left cursor-pointer"
                >
                  <span className="text-xs sm:text-base font-medium text-white pr-3 sm:pr-4 leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#c19a88] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${idx}`}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-xs sm:text-sm text-white/55 leading-relaxed font-light border-t border-white/[0.06] pt-3 sm:pt-4">
                        {faq.a}
                      </div>
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
