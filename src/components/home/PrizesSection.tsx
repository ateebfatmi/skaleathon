'use client';

import React from 'react';
import { Trophy, Award, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import CertificatePreviewModal from '@/components/home/CertificatePreviewModal';

interface PrizesProps {
  event: EventData;
}

export default function PrizesSection({ event }: PrizesProps) {
  const prizes = [
    {
      place: '2nd Place',
      amount: formatINR(event.second_prize_inr || 10000),
      subtitle: 'Runner-Up Winner',
      badge: 'Silver Rank',
      order: 'order-2 md:order-1',
      spotlight: 'rgba(203, 213, 225, 0.14)',
      amountClass: 'bg-gradient-to-br from-white via-slate-200 to-slate-400',
    },
    {
      place: '1st Place',
      amount: formatINR(event.first_prize_inr || 20000),
      subtitle: 'National Champion',
      badge: 'Grand Winner',
      order: 'order-1 md:order-2',
      spotlight: 'rgba(232, 197, 180, 0.25)',
      amountClass: 'bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948]',
      isGrand: true,
    },
    {
      place: '3rd Place',
      amount: formatINR(event.third_prize_inr || 5000),
      subtitle: 'Second Runner-Up',
      badge: 'Bronze Rank',
      order: 'order-3',
      spotlight: 'rgba(193, 154, 136, 0.14)',
      amountClass: 'bg-gradient-to-br from-white via-[#f2d9ce] to-[#805948]',
    },
  ];

  return (
    <section id="prizes" className="py-20 lg:py-28 relative bg-[#0B0B0B] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[75%] rounded-full bg-[#805948]/10 blur-[150px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
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
              Recognizing Craft
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Rewards for exceptional{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              execution
            </span>
            .
          </h2>
          <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
            ₹35,000 cash rewards, tamper-proof merit credentials, and internship opportunities for selected candidates with the SkaleKraft product team.
          </p>
        </motion.div>

        {/* Podium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto mb-12">
          {prizes.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`h-full ${prize.order} ${prize.isGrand ? 'md:-translate-y-4 z-10' : ''}`}
            >
              <SpotlightCard
                enableTilt
                spotlightColor={prize.spotlight}
                className={`h-full flex flex-col justify-between transition-all duration-300 relative ${
                  prize.isGrand
                    ? 'border-[#c19a88]/70 bg-[linear-gradient(145deg,rgba(193,154,136,0.1),rgba(17,14,13,0.98))] shadow-[0_30px_90px_rgba(128,89,72,0.35)]'
                    : 'border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                }`}
              >
                {prize.isGrand && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] text-[10px] font-bold text-black uppercase tracking-widest shadow-md flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Grand Champion</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#c19a88]">
                      {prize.badge}
                    </span>
                    {prize.isGrand ? (
                      <div className="p-2 rounded-xl bg-[#c19a88]/20 border border-[#c19a88]/40 text-[#c19a88] shadow-[0_0_15px_rgba(193,154,136,0.4)]">
                        <Trophy className="h-5 w-5 text-[#e8c5b4]" strokeWidth={2} />
                      </div>
                    ) : (
                      <Trophy className="h-4 w-4 text-white/30" strokeWidth={1.8} />
                    )}
                  </div>

                  <div className="text-xs uppercase tracking-[0.14em] text-white/45 font-medium">
                    {prize.place}
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight my-2.5 bg-clip-text text-transparent ${prize.amountClass}`}
                  >
                    {prize.amount}
                  </div>
                  <p className="text-xs text-white/60 font-light">{prize.subtitle}</p>
                </div>

                <div className="mt-7 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-white/40 font-light">
                  <span>Official Cash Grant</span>
                  <span className="text-[#c19a88] font-mono text-[10px]">+ Certificate</span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Additional Rewards Cards: Certificates & Internship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Top 25 Certificates */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <SpotlightCard
              spotlightColor="rgba(193,154,136,0.18)"
              className="h-full flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
                  <Award className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                    Top 25 Teams — Merit Credentials
                  </h3>
                  <p className="mt-1 text-xs text-white/50 leading-relaxed font-light">
                    All confirmed members of top 25 teams receive an official, cryptographically verifiable digital certificate with live QR verification.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <CertificatePreviewModal />
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Tamper-Proof</span>
                </span>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Internship Opportunity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full"
          >
            <SpotlightCard
              spotlightColor="rgba(193,154,136,0.18)"
              className="h-full flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
                  <Briefcase className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                    SkaleKraft Internship Gateway
                  </h3>
                  <p className="mt-1 text-xs text-white/50 leading-relaxed font-light">
                    Internship opportunities are available for selected candidates, offering direct fast-track interviews for paid software engineering and AI internships at SkaleKraft.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[10px] text-white/40 italic">
                  *Disclaimer: Non-guarantee interview evaluation
                </span>
                <span className="text-[10px] font-mono text-[#c19a88]">Selected Candidates</span>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
