import React from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { EventData } from '@/lib/db/types';

interface HeroProps {
  event: EventData;
}

export default function HeroSection({ event }: HeroProps) {
  const isRegistrationOpen = event.status === 'registration_open';
  const prizePoolFormatted = event.prize_pool_inr.toLocaleString('en-IN');

  return (
    <section id="top" className="relative overflow-hidden pt-8 pb-12 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28 bg-[#0B0B0B]">
      <div className="hero-starfield absolute -inset-[8%] z-0" aria-hidden="true" />

      {/* SkaleKraft Ambient Radial Copper and Bronze Halos */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] pointer-events-none z-[1]">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[260px] sm:h-[380px] bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(255,255,255,0.18),transparent_70%)] blur-2xl" />
        <div className="absolute top-24 left-1/4 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] bg-[#737373]/15 rounded-full blur-[120px] sm:blur-[140px]" />
        <div className="absolute top-36 right-1/4 w-[220px] sm:w-[380px] h-[220px] sm:h-[380px] bg-[#f5f5f5]/12 rounded-full blur-[110px] sm:blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* 1. Refined Brand Tag with Live Status */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/80 mb-5 sm:mb-7 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-serif italic text-xs sm:text-sm text-[#c19a88] tracking-wide">SkaleKraft presents</span>
          <span className="text-white/20">•</span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#c19a88] font-semibold">
            {isRegistrationOpen ? 'Registrations Live' : 'National Online Hackathon'}
          </span>
        </div>

        {/* 2. Master Event Title */}
        <h1 className="text-[2.35rem] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.14em] sm:tracking-[0.20em] md:tracking-[0.24em] text-white max-w-5xl mx-auto leading-[1.08] select-none">
          SKALE<span className="text-[#c19a88]">ATHON</span>
        </h1>

        {/* 3. Official Tagline */}
        <div className="mt-2.5 sm:mt-4 text-xs sm:text-sm lg:text-base font-semibold tracking-[0.28em] text-[#c19a88] uppercase">
          BUILD. INNOVATE. SCALE.
        </div>

        {/* 4. Elegant, Crisp Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed px-2">
          India&apos;s premier 4-stage engineering hackathon. Architect, build, and deploy production-grade software across <span className="text-white font-medium">AI/ML</span>, <span className="text-white font-medium">Web</span>, and <span className="text-white font-medium">Mobile</span> arenas.
        </p>

        {/* 5. High-Impact CTA Row */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          {isRegistrationOpen ? (
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-[#f5f5f5]/60 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_35px_rgba(255,255,255,0.35)]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#737373_0%,#fafafa_40%,#f5f5f5_70%,#737373_100%)] opacity-85 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#171717] via-[#111111] to-[#171717] px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-2xl transition-all duration-300 group-hover:from-[#171717] group-hover:to-[#171717]">
                <Sparkles className="h-4 w-4 text-[#c19a88] group-hover:rotate-12 transition-transform duration-300" />
                <span>Register Squad — ₹{event.registration_fee_inr}</span>
                <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-6 sm:px-8 py-3 text-xs sm:text-sm font-medium text-white/40 cursor-not-allowed"
            >
              Registration Currently Closed
            </button>
          )}

          <Link
            href="/prizes"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-medium text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-[#f5f5f5]/40 transition-all backdrop-blur-xl"
          >
            <Trophy className="h-4 w-4 text-[#c19a88]" />
            <span>Prize Pool Details (₹{prizePoolFormatted})</span>
          </Link>
        </div>

        {/* 6. Squad Reassurance Note */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-white/50 font-light">
          <span>Flat ₹{event.registration_fee_inr} fee covers entire squad (1–{event.max_team_size} members)</span>
          <span className="hidden xs:inline">•</span>
          <span>100% Online</span>
          <span className="hidden xs:inline">•</span>
          <span>No hidden fees</span>
        </div>
      </div>
    </section>
  );
}
