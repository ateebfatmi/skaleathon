import React from 'react';
import { Trophy, Users, Tag, Award, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';

interface StatsProps {
  event: EventData;
}

export default function StatsSection({ event }: StatsProps) {
  const firstPrize = (event.first_prize_inr || 20000).toLocaleString('en-IN');
  const secondPrize = (event.second_prize_inr || 10000).toLocaleString('en-IN');
  const thirdPrize = (event.third_prize_inr || 5000).toLocaleString('en-IN');

  const stats = [
    {
      id: 'prize',
      label: 'Total Prize Pool',
      value: formatINR(event.prize_pool_inr || 35000),
      sublabel: `1st: ₹${firstPrize} • 2nd: ₹${secondPrize} • 3rd: ₹${thirdPrize}`,
      badge: '★ Guaranteed Bounty',
      icon: Trophy,
      accentColor: '#f5f5f5',
      gradientClass: 'from-white via-[#fafafa] to-[#f5f5f5]',
      isFeatured: true,
    },
    {
      id: 'fee',
      label: 'REGISTRATION FEE',
      value: `₹${event.registration_fee_inr || 99}`,
      sublabel: 'Nominal flat fee covering the entire team',
      badge: 'Transparent Entry',
      icon: Tag,
      accentColor: '#737373',
      gradientClass: 'from-white via-[#e5e5e5] to-[#737373]',
      isFeatured: false,
    },
    {
      id: 'teams',
      label: 'TEAM SIZE RANGE',
      value: `${event.min_team_size}–${event.max_team_size}`,
      suffix: ' Innovators',
      sublabel: `Compete solo or collaborate with up to ${event.max_team_size} builders`,
      badge: 'Flexible Roster',
      icon: Users,
      accentColor: '#f5f5f5',
      gradientClass: 'from-white via-[#f5f5f5] to-[#f5f5f5]',
      isFeatured: false,
    },
    {
      id: 'certs',
      label: 'OFFICIAL CERTIFICATES',
      value: `Top ${event.certificates_top_n || 25}`,
      suffix: ' Teams',
      sublabel: `Merit certificates awarded to the top ${event.certificates_top_n} teams`,
      badge: 'Official',
      icon: Award,
      accentColor: '#737373',
      gradientClass: 'from-white via-[#e5e5e5] to-[#737373]',
      isFeatured: false,
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 bg-[#0B0B0B]">
      {/* Background glow matching SkaleKraft */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,163,163,0.12),transparent_70%)] blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="mobile-section-heading mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#f5f5f5]/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
                Engineered for Builders
              </p>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Competition at a{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#ffffff] via-[#f5f5f5] to-[#737373] bg-clip-text text-transparent pb-1 inline-block">
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
                className={`group relative flex min-h-[176px] sm:min-h-[190px] flex-col p-4 sm:p-6 transition-all duration-300 ${
                  stat.isFeatured
                    ? 'bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(12,12,12,0.98))] shadow-[inset_0_0_25px_rgba(255,255,255,0.12)]'
                    : 'bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(10,10,10,0.98))] hover:bg-white/[0.04]'
                }`}
              >
                {/* Ambient hover light */}
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[35px] transition duration-700 ${
                    stat.isFeatured ? 'opacity-30' : 'opacity-[0.08] group-hover:opacity-25'
                  }`}
                  style={{ backgroundColor: stat.accentColor }}
                />

                {/* Top header row */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                        stat.isFeatured
                          ? 'border-[#f5f5f5]/60 bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                          : 'border-white/[0.09] bg-white/[0.025] text-[#c19a88] shadow-[inset_0_1px_0_rgba(255,255,255,.05),0_8px_20px_rgba(0,0,0,.25)]'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={stat.isFeatured ? 2.2 : 1.8} />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/30">
                      0{idx + 1}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-[0.14em] backdrop-blur-xl ${
                      stat.isFeatured
                        ? 'border border-[#f5f5f5]/60 bg-[#f5f5f5]/20 text-[#fafafa] shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                        : 'hidden sm:inline-flex border border-white/[0.08] bg-black/30 text-[#c19a88]'
                    }`}
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 text-[#c19a88]" strokeWidth={2} />
                    {stat.badge}
                  </span>
                </div>

                {/* Metric Value */}
                <div className="relative pb-2 pt-5 sm:pt-6">
                  <span
                    className={`bg-gradient-to-br ${stat.gradientClass} bg-clip-text font-mono text-xl sm:text-3xl lg:text-[2.35rem] font-black leading-none tracking-[-0.03em] text-transparent ${
                      stat.isFeatured ? 'drop-shadow-[0_2px_15px_rgba(255,255,255,0.5)]' : ''
                    }`}
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
                  <h3
                    className={`text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] ${
                      stat.isFeatured ? 'text-[#fafafa] font-bold' : 'text-white/85 font-semibold'
                    }`}
                  >
                    {stat.label}
                  </h3>
                  <p
                    className={`mobile-card-copy mt-1 text-[10px] sm:text-[11px] leading-snug ${
                      stat.isFeatured ? 'text-[#ffffff] font-medium' : 'text-white/45 font-light'
                    }`}
                  >
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
