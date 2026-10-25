import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Trophy, Layers } from 'lucide-react';
import { EventData } from '@/lib/db/types';
import GlassmorphismCta from '@/components/ui/glassmorphism-cta';
import LazyInteractiveTerminal from '@/components/home/LazyInteractiveTerminal';

interface HeroProps {
  event: EventData;
}

export default function HeroSection({ event }: HeroProps) {
  const isRegistrationOpen = event.status === 'registration_open';
  const prizePoolFormatted = event.prize_pool_inr.toLocaleString('en-IN');
  const firstPrizeFormatted = (event.first_prize_inr || 20000).toLocaleString('en-IN');
  const secondPrizeFormatted = (event.second_prize_inr || 10000).toLocaleString('en-IN');
  const thirdPrizeFormatted = (event.third_prize_inr || 5000).toLocaleString('en-IN');

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

        {/* Eye-Catching Hero Cash Prize Showcase Bar */}
        <div className="mt-4 sm:mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#c19a88]/25 via-[#805948]/35 to-[#c19a88]/25 border-2 border-[#c19a88]/70 shadow-[0_0_40px_rgba(193,154,136,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-300 hover:border-[#e8c5b4] hover:shadow-[0_0_55px_rgba(193,154,136,0.55)]">
          <div className="flex items-center gap-2 bg-black/45 px-3 py-1 rounded-full border border-[#c19a88]/40 shadow-inner">
            <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe5d9] via-[#e8c5b4] to-[#c19a88] text-black shadow-[0_0_12px_rgba(193,154,136,0.6)]">
              <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-black text-black" />
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.18em] uppercase text-[#ffe5d9]">
              CASH PRIZE POOL
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl lg:text-3xl font-mono font-black tracking-tight text-white drop-shadow-[0_2px_14px_rgba(193,154,136,0.6)]">
              ₹{prizePoolFormatted}
            </span>
          </div>

          <span className="hidden sm:inline-block h-4 w-px bg-white/25" />

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#f5ded3]">
            <span className="font-bold text-[#ffe5d9] bg-white/10 px-2 py-0.5 rounded-full border border-white/15 shadow-sm">
              🥇 1st: ₹{firstPrizeFormatted}
            </span>
            <span className="text-white/30 hidden xs:inline">•</span>
            <span className="text-white/90 hidden xs:inline">🥈 2nd: ₹{secondPrizeFormatted}</span>
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-white/80 hidden md:inline">🥉 3rd: ₹{thirdPrizeFormatted}</span>
          </div>
        </div>

        <p
          className="mt-3.5 sm:mt-5 text-xs sm:text-base lg:text-lg text-white/70 max-w-xl sm:max-w-2xl mx-auto font-normal leading-relaxed px-1"
        >
          India&apos;s premier 4-stage hackathon conducted by SkaleKraft as SKALEATHON. Architect, build, and deploy production-grade software across AI/ML, Web, and Mobile arenas — competing for a{' '}
          <Link
            href="/prizes"
            className="inline-flex items-center gap-1.5 font-bold text-white bg-gradient-to-r from-[#c19a88]/30 via-[#805948]/35 to-[#c19a88]/30 border border-[#c19a88]/60 px-2.5 py-0.5 rounded-lg shadow-[0_0_20px_rgba(193,154,136,0.35)] hover:border-[#e8c5b4] hover:shadow-[0_0_30px_rgba(193,154,136,0.5)] transition-all"
          >
            <Trophy className="h-3.5 w-3.5 text-[#ffe5d9] inline shrink-0" />
            <span>₹{prizePoolFormatted} cash prize pool</span>
          </Link>
          , Top {event.certificates_top_n} merit certificates, and SkaleKraft internship opportunities.
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

            <span className="h-3 w-px bg-white/20" />

            <Link href="/prizes" className="text-[#ffe5d9] font-bold flex items-center gap-1 hover:text-white transition-colors">
              <Trophy className="h-3 w-3 text-[#c19a88]" />
              <span>₹{prizePoolFormatted} Bounty</span>
            </Link>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-white/20" />

          <div className="text-[#e8c5b4] font-medium tracking-wide text-[10px] sm:text-xs border-t border-white/10 sm:border-none pt-1 sm:pt-0 w-full sm:w-auto text-center">
            Screening → Architecture → Build Sprint → Live Defense
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="mt-6 sm:mt-9 flex flex-col items-center justify-center"
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

          {/* Cash Incentive Subtext */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#e8c5b4]/90 font-medium">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#c19a88] animate-ping" />
            <span>Nominal ₹{event.registration_fee_inr} team entry fee to compete for ₹{prizePoolFormatted} in direct cash grants (1st: ₹{firstPrizeFormatted})</span>
          </div>
        </div>

        {/* 4 Official Trust Badges - Highlighted Cash Prize Card */}
        <div
          className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Trophy,
              title: `₹${prizePoolFormatted} Prize Pool`,
              subtitle: `1st ₹${firstPrizeFormatted} • 2nd ₹${secondPrizeFormatted} • 3rd ₹${thirdPrizeFormatted}`,
              isPrimary: true,
              href: '/prizes',
              badge: '★ CASH PRIZES',
            },
            {
              icon: Layers,
              title: '4 Progressive Rounds',
              subtitle: 'Quiz to Grand Finale',
              isPrimary: false,
            },
            {
              icon: ShieldCheck,
              title: `Top ${event.certificates_top_n} Merit Awards`,
              subtitle: 'Certificates',
              isPrimary: false,
            },
            {
              icon: Sparkles,
              title: 'Internship Fast-Track',
              subtitle: 'SkaleKraft Interviews',
              isPrimary: false,
            },
          ].map((badge) => {
            const Icon = badge.icon;
            const content = (
              <div
                key={badge.title}
                className={`group relative flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm ${
                  badge.isPrimary
                    ? 'border-2 border-[#c19a88] bg-gradient-to-br from-[#c19a88]/25 via-[#805948]/20 to-black/80 shadow-[0_0_30px_rgba(193,154,136,0.35)] ring-1 ring-[#c19a88]/60 hover:shadow-[0_0_40px_rgba(193,154,136,0.55)] hover:scale-[1.02]'
                    : 'border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#c19a88]/40'
                }`}
              >
                {badge.badge && (
                  <span className="absolute -top-2.5 left-3 sm:left-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ffe5d9] via-[#e8c5b4] to-[#c19a88] text-[8px] sm:text-[9px] font-mono font-black text-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-black" />
                    <span>{badge.badge}</span>
                  </span>
                )}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    badge.isPrimary
                      ? 'bg-gradient-to-br from-[#ffe5d9] to-[#c19a88] text-black shadow-[0_0_15px_rgba(193,154,136,0.6)] group-hover:scale-105'
                      : 'bg-[#c19a88]/10 border border-[#c19a88]/20 text-[#c19a88] group-hover:scale-105 group-hover:bg-[#c19a88]/20 group-hover:border-[#c19a88]/40'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${badge.isPrimary ? 'stroke-[2.5]' : ''}`} />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span
                    className={`font-semibold text-[11px] sm:text-[13px] tracking-tight leading-tight truncate ${
                      badge.isPrimary
                        ? 'font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffe5d9] to-[#c19a88]'
                        : 'text-white/95 group-hover:text-white transition-colors'
                    }`}
                  >
                    {badge.title}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${
                      badge.isPrimary
                        ? 'text-[#ffe5d9] font-medium'
                        : 'text-white/50 group-hover:text-[#c19a88] transition-colors'
                    }`}
                  >
                    {badge.subtitle}
                  </span>
                </div>
              </div>
            );

            if (badge.href) {
              return (
                <Link key={badge.title} href={badge.href} className="block">
                  {content}
                </Link>
              );
            }

            return content;
          })}
        </div>

        {/* Live Interactive Hacker CLI & Telemetry Playground */}
        <div
          className="mt-8 sm:mt-12"
        >
          <LazyInteractiveTerminal event={event} />
        </div>
      </div>
    </section>
  );
}
