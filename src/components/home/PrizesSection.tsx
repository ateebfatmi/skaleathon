import React from 'react';
import { Trophy, Award, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';
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
      badge: 'Grand Champion',
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
    <section id="prizes" className="py-14 sm:py-20 lg:py-28 relative bg-[#0B0B0B] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[75%] rounded-full bg-[#805948]/10 blur-[150px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mobile-section-heading text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-3.5">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-semibold">
              Recognizing Craft • {formatINR(event.prize_pool_inr)} Prize Pool
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

          <p className="mt-4 text-sm text-white/60 leading-relaxed font-light max-w-xl">
            <strong className="text-white/90 font-medium">{formatINR(event.prize_pool_inr)} in direct cash grants</strong> across the top three podium positions, official merit certificates for the top {event.certificates_top_n} squads, and fast-track internship interviews with SkaleKraft.
          </p>
        </div>

        {/* Podium Grid */}
        <div className="mobile-card-grid grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 items-stretch md:items-end max-w-5xl mx-auto mb-10 sm:mb-12">
          {prizes.map((prize, idx) => (
            <div key={idx} className={`h-full ${prize.order} ${prize.isGrand ? 'mobile-grid-wide md:-translate-y-4 z-10' : ''}`}>
              <SpotlightCard
                enableTilt
                spotlightColor={prize.spotlight}
                className={`mobile-card h-full flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 relative ${
                  prize.isGrand
                    ? 'border-[#c19a88]/70 bg-[linear-gradient(145deg,rgba(193,154,136,0.1),rgba(17,14,13,0.98))] shadow-[0_30px_90px_rgba(128,89,72,0.35)]'
                    : 'border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {prize.isGrand ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] text-black shadow-sm whitespace-nowrap">
                        <Sparkles className="h-3 w-3 shrink-0" />
                        <span>{prize.badge}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#c19a88] whitespace-nowrap">
                        {prize.badge}
                      </span>
                    )}
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
            </div>
          ))}
        </div>

        {/* Additional Rewards Cards: Certificates & Internship */}
        <div className="mobile-card-grid grid grid-cols-2 gap-3 sm:gap-6 max-w-5xl mx-auto">
          {/* Top 25 Certificates */}
          <div className="h-full">
            <SpotlightCard
              spotlightColor="rgba(193,154,136,0.18)"
              className="mobile-card h-full flex flex-col justify-between p-4 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
                  <Award className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                    Top {event.certificates_top_n} Teams — Certificates
                  </h3>
                  <p className="mobile-card-copy mt-1 text-[11px] sm:text-xs text-white/50 leading-relaxed font-light">
                    All confirmed members of top 25 teams receive an official digital certificate of merit.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CertificatePreviewModal event={event} />
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Official</span>
                </span>
              </div>
            </SpotlightCard>
          </div>

          {/* Internship Opportunity */}
          <div className="h-full">
            <SpotlightCard
              spotlightColor="rgba(193,154,136,0.18)"
              className="mobile-card h-full flex flex-col justify-between p-4 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shrink-0">
                  <Briefcase className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                    SkaleKraft Internship Gateway
                  </h3>
                  <p className="mobile-card-copy mt-1 text-[11px] sm:text-xs text-white/50 leading-relaxed font-light">
                    Internship opportunities are available for selected candidates, offering direct fast-track interviews for paid software engineering and AI internships at SkaleKraft.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-end">
                <span className="text-[10px] font-mono text-[#c19a88]">Selected Candidates</span>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
