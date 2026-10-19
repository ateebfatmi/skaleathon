import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { Trophy, Award, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export const revalidate = 0;

export default async function PrizesPage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="py-10 sm:py-20 lg:py-28 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-8 sm:mb-16">
          <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Official Honors
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
            Prizes &{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              recognitions
            </span>
            .
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-white/55 leading-relaxed font-light">
            SkaleKraft has allocated an official prize pool of {formatINR(event.prize_pool_inr || 35000)} alongside merit certificates and internship opportunities for selected candidates.
          </p>
        </div>

        {/* Podium Cash Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {/* 1st Place */}
          <div className="rounded-2xl sm:rounded-[28px] border border-[#c19a88]/60 bg-[linear-gradient(145deg,rgba(193,154,136,0.08),rgba(17,14,13,0.96))] p-5 sm:p-8 flex flex-col justify-between shadow-[0_25px_70px_rgba(128,89,72,0.3)] md:-translate-y-2">
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#c19a88]">
                  Grand Champion
                </span>
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-[#c19a88]" strokeWidth={1.8} />
              </div>
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-white/60">First Prize</h2>
              <div className="text-3xl sm:text-5xl font-mono font-bold my-2 sm:my-3 tracking-tight bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent">
                {formatINR(event.first_prize_inr || 20000)}
              </div>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                Awarded to the overall highest scoring team across all arenas for supreme engineering rigor, originality, and impact.
              </p>
            </div>
            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08] text-xs text-[#c19a88] font-medium">
              Cash Grant + Winner Certificate + SkaleKraft Interview Opportunity
            </div>
          </div>

          {/* 2nd Place */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white/70">
                  First Runner-Up
                </span>
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white/60" strokeWidth={1.8} />
              </div>
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Second Prize</h2>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white my-2 sm:my-3 tracking-tight">
                {formatINR(event.second_prize_inr || 10000)}
              </div>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                Conferred to the second-highest scoring team for standout architectural cleanliness and product delivery.
              </p>
            </div>
            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08] text-xs text-white/60 font-light">
              Cash Grant + Runner-up Certificate + SkaleKraft Interview Opportunity
            </div>
          </div>

          {/* 3rd Place */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#c19a88]">
                  Second Runner-Up
                </span>
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-[#c19a88]" strokeWidth={1.8} />
              </div>
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Third Prize</h2>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white my-2 sm:my-3 tracking-tight">
                {formatINR(event.third_prize_inr || 5000)}
              </div>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                Conferred to the third-highest scoring team for high-quality prototype execution and creative problem solving.
              </p>
            </div>
            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08] text-xs text-white/60 font-light">
              Cash Grant + 2nd Runner-up Certificate + SkaleKraft Interview Opportunity
            </div>
          </div>
        </div>

        {/* Certificates & Internship Opportunity Deep-Dive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Top 25 Certificates */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 sm:p-8 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
                <Award className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white">Top 25 Teams — Certificates</h3>
            </div>
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed font-light">
              Eligible members of the top 25 teams will receive an official digital certificate of merit from SkaleKraft.
            </p>
          </div>

          {/* Internship Opportunity */}
          <div className="rounded-2xl sm:rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 sm:p-8 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
                <Briefcase className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white">SkaleKraft Internship Gateway</h3>
            </div>
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed font-light">
              Internship opportunities are available for selected candidates, offering direct fast-track interviews for technical internships at SkaleKraft, working alongside SkaleKraft leads on client systems and AI products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
