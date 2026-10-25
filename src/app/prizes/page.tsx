import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { Trophy, Award, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prizes and Recognition | Skaleathon',
  description: 'Review Skaleathon prizes, merit certificates, and finalist opportunities.',
};

export const revalidate = 0;

export default async function PrizesPage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="py-10 sm:py-16 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative w-full space-y-14 pb-24 text-neutral-200">
          {/* Subtle Background Ambient Glows */}
          <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
          <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

          {/* 1. Open Luxury Editorial Hero */}
          <header className="relative pt-1">
            <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
              <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
                BOUNTY
              </span>
            </div>

            {/* Top Utility & Context Ribbon */}
            <div className="mobile-utility-row relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
                </span>
                <span className="text-[#c19a88]">Official Honors {'//'} National Bounty Pool</span>
                <span className="text-white/20">•</span>
                <span className="text-neutral-400">
                  Total Pool: <strong className="text-white font-semibold">{formatINR(event.prize_pool_inr || 35000)}</strong>
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[#e8c5b4] font-semibold">[SKALEKRAFT]</span>
              </div>

              <div className="flex items-center gap-5 text-xs">
                <Link
                  href="/tracks"
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
                >
                  <span>Explore Tracks</span>
                </Link>
                <span className="text-white/15">|</span>
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
                >
                  <span>Register Squad ({formatINR(event.registration_fee_inr)})</span>
                  <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Editorial Headline & Manifesto */}
            <div className="relative z-10 max-w-3xl space-y-5 pb-9">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
                Prizes &amp;{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Recognitions
                </span>
              </h1>

              <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
                SkaleKraft has allocated an official cash prize pool of {formatINR(event.prize_pool_inr)} alongside top {event.certificates_top_n} National Merit Citations and direct engineering interview opportunities.
              </p>
            </div>

            {/* Full-Width 4-Column Editorial Index Bar with Transition */}
            <EditorialIndexBar
              layoutIdPrefix="prizesIndex"
              items={[
                { num: '01', label: `1st Prize: ${formatINR(event.first_prize_inr || 20000)}`, href: '#podium' },
                { num: '02', label: `2nd Prize: ${formatINR(event.second_prize_inr || 10000)}`, href: '#podium' },
                { num: '03', label: `3rd Prize: ${formatINR(event.third_prize_inr || 5000)}`, href: '#podium' },
                { num: '04', label: `Top ${event.certificates_top_n} Merit & Careers`, href: '#career' },
              ]}
            />
          </header>

          {/* 2. Section 01: Podium Cash Grants (3-Column Open Architectural Grid) */}
          <section id="podium" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                  01 {'//'} Championship Podium
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  National Cash{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Grants
                  </span>
                </h2>
              </div>
              <p className="text-xs text-neutral-400 font-light max-w-xs">
                Direct cash awards disbursed to winning team leaders following the Stage 04 Finale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-2 border-t border-b border-white/[0.08] pb-8">
              {/* 1st Place */}
              <div className="relative pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                    Grand Champion • 1st Place
                  </span>
                  <Trophy className="h-4 w-4 text-[#c19a88]" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-[#e8c5b4]">
                  {formatINR(event.first_prize_inr || 20000)}
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Awarded to the highest-scoring squad overall for supreme engineering rigor, originality, and real-world domain impact.
                </p>
                <div className="pt-1 text-[11px] font-mono text-[#c19a88]">
                  + Winner Certificate &amp; SkaleKraft Interview
                </div>
              </div>

              {/* 2nd Place */}
              <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-300 font-bold">
                    First Runner-Up • 2nd Place
                  </span>
                  <Award className="h-4 w-4 text-neutral-300" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white">
                  {formatINR(event.second_prize_inr || 10000)}
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Conferred to the second-highest scoring squad for standout system architecture, scalability, and live deployment quality.
                </p>
                <div className="pt-1 text-[11px] font-mono text-neutral-400">
                  + Runner-Up Certificate &amp; SkaleKraft Interview
                </div>
              </div>

              {/* 3rd Place */}
              <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                    Second Runner-Up • 3rd Place
                  </span>
                  <Award className="h-4 w-4 text-[#e8c5b4]" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white">
                  {formatINR(event.third_prize_inr || 5000)}
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Conferred to the third-highest scoring squad for high-craft prototype execution and creative problem formulation.
                </p>
                <div className="pt-1 text-[11px] font-mono text-neutral-400">
                  + Finalist Certificate &amp; SkaleKraft Interview
                </div>
              </div>
            </div>
          </section>

          {/* 3. Section 02: Merit Citations & Career Fast-Track */}
          <section id="career" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                  02 {'//'} Beyond The Podium
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Merit Citations &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Career Fast-Track
                  </span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
              <div className="relative pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                    Pillar 01 • National Merit Roster
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Top {event.certificates_top_n} Squads — Merit Certificates
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  All enrolled members of the top {event.certificates_top_n} ranked squads receive an official Certificate of Engineering Merit issued by SkaleKraft.
                </p>
              </div>

              <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                    Pillar 02 • Talent Pipeline
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  SkaleKraft Internship &amp; Hiring Fast-Track
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Standout engineers observed during the Stage 03 codebase review and Stage 04 live defense are invited to fast-track technical interviews with SkaleKraft.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
