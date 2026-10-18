'use client';

import React from 'react';
import { Trophy, Award, Briefcase } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';
import { motion } from 'framer-motion';

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
      cardStyle: 'border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.025),rgba(14,14,14,0.95))]',
      amountClass: 'bg-gradient-to-br from-white via-slate-200 to-slate-400',
    },
    {
      place: '1st Place',
      amount: formatINR(event.first_prize_inr || 20000),
      subtitle: 'National Champion',
      badge: 'Grand Winner',
      order: 'order-1 md:order-2',
      cardStyle: 'border-[#c19a88]/60 bg-[linear-gradient(145deg,rgba(193,154,136,0.08),rgba(17,14,13,0.96))] shadow-[0_25px_70px_rgba(128,89,72,0.28)] md:-translate-y-3 z-10',
      amountClass: 'bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948]',
      isGrand: true,
    },
    {
      place: '3rd Place',
      amount: formatINR(event.third_prize_inr || 5000),
      subtitle: 'Second Runner-Up',
      badge: 'Bronze Rank',
      order: 'order-3',
      cardStyle: 'border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.025),rgba(14,14,14,0.95))]',
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
            ₹35,000 cash rewards, tamper-proof merit credentials, and direct technical internship interviews with the SkaleKraft product team.
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
              className={`rounded-[24px] border p-8 flex flex-col justify-between transition-all duration-300 ${prize.cardStyle} ${prize.order}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#c19a88]">
                    {prize.badge}
                  </span>
                  {prize.isGrand && (
                    <Trophy className="h-5 w-5 text-[#c19a88]" strokeWidth={1.8} />
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

              <div className="mt-7 pt-4 border-t border-white/[0.08] text-[11px] text-white/40 font-light">
                Official Cash Grant + Certificate of Excellence
              </div>
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
            className="rounded-[22px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-6 sm:p-7 flex items-start gap-4"
          >
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
          </motion.div>

          {/* Internship Opportunity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[22px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-6 sm:p-7 flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
              <Briefcase className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                SkaleKraft Studio Internship Gateway
              </h3>
              <p className="mt-1 text-xs text-white/50 leading-relaxed font-light">
                High-performing builders from top 5 teams receive direct fast-track interviews for paid software engineering and AI internships at SkaleKraft.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
