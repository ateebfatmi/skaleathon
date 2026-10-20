import React from 'react';
import { Sparkles, ShieldCheck, Trophy, Layers } from 'lucide-react';
import { EventData } from '@/lib/db/types';
import GlassmorphismCta from '@/components/ui/glassmorphism-cta';
import InteractiveTerminal from '@/components/home/InteractiveTerminal';

interface HeroProps {
  event: EventData;
}

export default function HeroSection({ event }: HeroProps) {
  const isRegistrationOpen = event.status === 'registration_open';

  return (
    <section id="top" className="relative overflow-hidden pt-8 pb-12 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-32 bg-[#0B0B0B]">
      <div className="hero-starfield absolute -inset-[8%] z-0" aria-hidden="true" />

      {/* 2. SkaleKraft Ambient Radial Copper and Bronze Halos */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] pointer-events-none z-[1]">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[260px] sm:h-[380px] bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(193,154,136,0.18),transparent_70%)] blur-2xl" />
        <div className="absolute top-24 left-1/4 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] bg-[#805948]/15 rounded-full blur-[120px] sm:blur-[140px]" />
        <div className="absolute top-36 right-1/4 w-[220px] sm:w-[380px] h-[220px] sm:h-[380px] bg-[#c19a88]/12 rounded-full blur-[110px] sm:blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Brand Hierarchy Header */}
        <div
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 sm:px-4 sm:py-1.5 text-xs font-medium text-white/70 mb-4 sm:mb-8 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#c19a88]" />
          <span className="font-serif italic text-xs sm:text-sm text-[#f5ded3] tracking-wide">SkaleKraft presents</span>
        </div>

        {/* Master Event Title */}
        <h1
          className="text-[2.15rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.14em] sm:tracking-[0.20em] md:tracking-[0.24em] text-white max-w-5xl mx-auto leading-[1.1] select-none"
        >
          SKALE<span className="text-[#c19a88]">ATHON</span>
        </h1>

        {/* Official Tagline */}
        <div
          className="mt-2.5 sm:mt-5 text-[11px] sm:text-base lg:text-lg font-medium tracking-[0.22em] sm:tracking-[0.28em] text-[#c19a88] uppercase"
        >
          BUILD. INNOVATE. SCALE.
        </div>

        <p
          className="mt-3.5 sm:mt-6 text-xs sm:text-base lg:text-lg text-white/70 max-w-xl sm:max-w-2xl mx-auto font-normal leading-relaxed px-1"
        >
          India&apos;s definitive 4-stage national engineering tournament. Architect, build, and deploy production-grade software across AI/ML, Web, and Mobile arenas — competing for a ₹{event.prize_pool_inr.toLocaleString('en-IN')} cash prize pool, Top {event.certificates_top_n} merit certificates, and SkaleKraft internship opportunities.
        </p>

        {/* Status & Funnel Pill (Clean 2-row layout on mobile, single pill on desktop) */}
        <div
          className="mt-5 sm:mt-7 inline-flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-2 rounded-2xl sm:rounded-full text-[11px] sm:text-xs font-medium border border-[#c19a88]/30 bg-[#805948]/15 text-white/90 shadow-[0_4px_25px_rgba(128,89,72,0.18)] backdrop-blur-xl max-w-full"
        >
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 tracking-wide">
              {isRegistrationOpen ? 'Registrations Live' : event.status.replace(/_/g, ' ').toUpperCase()}
            </span>

            <span className="h-3 w-px bg-white/20" />

            <span className="text-white/90">
              ₹{event.registration_fee_inr} / Team <span className="text-white/55 text-[10px] sm:text-[11px]">({event.min_team_size}–{event.max_team_size} Members)</span>
            </span>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-white/20" />

          <div className="text-[#e8c5b4] font-medium tracking-wide text-[10px] sm:text-xs border-t border-white/10 sm:border-none pt-1 sm:pt-0 w-full sm:w-auto text-center">
            Screening → Architecture → Build Sprint → Live Defense
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="mt-6 sm:mt-9 flex items-center justify-center"
        >
          {isRegistrationOpen ? (
            <GlassmorphismCta
              href="/register"
              label={`Register Your Team — ₹${event.registration_fee_inr}`}
              avatarSrc="/images/skalekraft-logo.png"
              avatarAlt="SkaleKraft logo"
              shimmerColor="rgba(193,154,136,0.85)"
              className="text-xs sm:text-sm py-2.5 px-5 sm:px-6 font-semibold"
            />
          ) : (
            <button
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-6 sm:px-8 py-3 text-xs sm:text-sm font-medium text-white/40 cursor-not-allowed"
            >
              Registration Currently Closed
            </button>
          )}
        </div>

        {/* 4 Official Trust Badges */}
        <div
          className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Trophy,
              title: `₹${event.prize_pool_inr.toLocaleString('en-IN')} Prize Pool`,
              subtitle: 'Top 3 Cash Grants',
            },
            {
              icon: Layers,
              title: '4 Progressive Rounds',
              subtitle: 'Quiz to Grand Finale',
            },
            {
              icon: ShieldCheck,
              title: `Top ${event.certificates_top_n} Merit Awards`,
              subtitle: 'Certificates',
            },
            {
              icon: Sparkles,
              title: 'Internship Fast-Track',
              subtitle: 'SkaleKraft Interviews',
            },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="group relative flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#c19a88]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center shrink-0 text-[#c19a88] group-hover:scale-105 group-hover:bg-[#c19a88]/20 group-hover:border-[#c19a88]/40 transition-all">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-semibold text-white/95 text-[11px] sm:text-[13px] tracking-tight group-hover:text-white transition-colors leading-tight truncate">
                    {badge.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-white/50 group-hover:text-[#c19a88] transition-colors truncate mt-0.5">
                    {badge.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Interactive Hacker CLI & Telemetry Playground */}
        <div
          className="mt-8 sm:mt-12"
        >
          <InteractiveTerminal event={event} />
        </div>
      </div>
    </section>
  );
}
