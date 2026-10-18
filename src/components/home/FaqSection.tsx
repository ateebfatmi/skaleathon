'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who is eligible to participate in Skaleathon 2027?',
      a: 'Participation is open across India to undergraduate and postgraduate students, self-taught developers, and early-career innovators. You can participate individually (team size 1) or in a team of up to 6 members.',
    },
    {
      q: 'What is the team registration fee and how is it processed?',
      a: 'The registration fee is a flat ₹99 per team (not per member). Payment is completed securely via Razorpay supporting UPI, Debit/Credit Cards, and Net Banking. Once verified, your team is fully authorized.',
    },
    {
      q: 'What are the technical tracks available?',
      a: 'Skaleathon 2027 features three tracks: (1) AI & Machine Learning, (2) Web Architecture, and (3) Mobile Systems. Teams choose one track during registration and can adjust before the final submission deadline.',
    },
    {
      q: 'What are the prizes and certificate recognitions?',
      a: 'The total authorized prize pool is ₹35,000 (1st Prize: ₹20,000, 2nd Prize: ₹10,000, 3rd Prize: ₹5,000). Official merit certificates are awarded to confirmed members of the Top 25 teams. Additionally, candidates from the top 5 teams earn interviews for technical internships at SkaleKraft.',
    },
    {
      q: 'Are generative AI tools like Copilot, Cursor, or ChatGPT allowed?',
      a: 'Yes, modern developer tooling is welcomed. However, all AI tool assistance must be transparently disclosed in your submission documentation. Turnkey clones or unattributed code will be disqualified.',
    },
    {
      q: 'How does the digital certificate verification work?',
      a: 'Every issued certificate carries a tamper-evident cryptographic code and QR identifier. Any employer or institution can instantly verify authenticity at /verify-certificate/[certificateId].',
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 relative bg-[#0B0B0B] border-t border-white/10 overflow-hidden">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Clarity First
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Frequently asked{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              questions
            </span>
            .
          </h2>
          <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
            Clear, authoritative answers to ensure your team experiences a seamless competition.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-[20px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] overflow-hidden transition-all duration-300 hover:border-white/15"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#c19a88] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-white/55 leading-relaxed font-light border-t border-white/[0.06] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
