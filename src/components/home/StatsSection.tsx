import React from 'react';
import { Trophy, Users, Tag, Award, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';

interface StatsProps {
  event: EventData;
}

export default function StatsSection({ event }: StatsProps) {
  const stats = [
    {
      id: 'prize',
      label: 'TOTAL PRIZE POOL',
      value: formatINR(event.prize_pool_inr || 35000),
      sublabel: 'Cash rewards for 1st, 2nd, and 3rd rank holders',
      badge: 'Authorized Pool',
      icon: Trophy,
      accentColor: '#c19a88',
      gradientClass: 'from-white via-[#f2d9ce] to-[#c19a88]',
    },
    {
      id: 'fee',
      label: 'REGISTRATION FEE',
      value: `₹${event.registration_fee_inr || 99}`,
      sublabel: 'Nominal flat fee covering the entire team',
      badge: 'Transparent Entry',
      icon: Tag,
      accentColor: '#805948',
      gradientClass: 'from-white via-[#e8cbbf] to-[#805948]',
    },
    {
      id: 'teams',
      label: 'TEAM SIZE RANGE',
      value: `${event.min_team_size}–${event.max_team_size}`,
      suffix: ' Innovators',
      sublabel: `Compete solo or collaborate with up to ${event.max_team_size} builders`,
      badge: 'Flexible Roster',
      icon: Users,
      accentColor: '#c19a88',
      gradientClass: 'from-white via-[#f2d9ce] to-[#c19a88]',
    },
    {
      id: 'certs',
      label: 'OFFICIAL CERTIFICATES',
      value: `Top ${event.certificates_top_n || 25}`,
      suffix: ' Teams',
      sublabel: `Merit certificates awarded to the top ${event.certificates_top_n} teams`,
      badge: 'Official',
      icon: Award,
      accentColor: '#805948',
      gradientClass: 'from-white via-[#e8cbbf] to-[#805948]',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 bg-[#0B0B0B]">
      {/* Background glow matching SkaleKraft */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(128,89,72,0.12),transparent_70%)] blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="mobile-section-heading mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
                Engineered for Builders
              </p>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Competition at a{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                glance
              </span>
              .
            </h2>
          </div>
          <p className="text-xs text-white/40 max-w-xs sm:text-right">
            Measurable prize pool, accessible flat registration, and certificates for the top {event.certificates_top_n} teams.
          </p>
        </div>

        {/* 4-Column Capsule Grid matching SkaleKraft ImpactMetricsBar */}
        <div className="mobile-card-grid grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/[0.09] bg-white/[0.08] shadow-[0_28px_90px_rgba(0,0,0,0.4)]">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group relative flex min-h-[176px] flex-col bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(10,10,10,0.98))] p-4 sm:min-h-[190px] sm:p-6 transition-all duration-300 hover:bg-white/[0.04]"
              >
                {/* Ambient hover light */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[35px] opacity-[0.08] transition duration-700 group-hover:opacity-25"
                  style={{ backgroundColor: stat.accentColor }}
                />

                {/* Top header row */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025] text-[#c19a88] shadow-[inset_0_1px_0_rgba(255,255,255,.05),0_8px_20px_rgba(0,0,0,.25)]">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/30">
                      0{idx + 1}
                    </span>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/30 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-[#c19a88] backdrop-blur-xl">
                    <CheckCircle2 className="h-2.5 w-2.5 text-[#c19a88]" strokeWidth={2} />
                    {stat.badge}
                  </span>
                </div>

                {/* Metric Value */}
                <div className="relative pb-2 pt-5 sm:pt-6">
                  <span
                    className={`bg-gradient-to-br ${stat.gradientClass} bg-clip-text font-mono text-xl sm:text-3xl lg:text-[2.35rem] font-bold leading-none tracking-[-0.03em] text-transparent`}
                  >
                    {stat.value}
                    {stat.suffix && (
                      <span className="block sm:inline text-[11px] sm:text-lg font-sans font-normal text-white/50 tracking-normal mt-1 sm:mt-0 sm:ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </span>
                </div>

                {/* Footer labels */}
                <div className="relative mt-auto border-t border-white/[0.07] pt-3">
                  <h3 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-white/85">
                    {stat.label}
                  </h3>
                  <p className="mobile-card-copy mt-1 text-[10px] sm:text-[11px] font-light leading-snug text-white/45">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
