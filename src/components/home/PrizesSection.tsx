import React from 'react';
import { Trophy, Award, Briefcase, Info } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';

interface PrizesProps {
  event: EventData;
}

export default function PrizesSection({ event }: PrizesProps) {
  const prizes = [
    {
      place: '2nd Place',
      amount: formatINR(event.second_prize_inr || 10000),
      subtitle: 'Runner-Up Winner',
      badge: 'Silver Medalist',
      cardStyle: 'border-slate-500/30 bg-[#0d1322]',
      tagColor: 'text-slate-300 bg-slate-800/80',
    },
    {
      place: '1st Place',
      amount: formatINR(event.first_prize_inr || 20000),
      subtitle: 'National Champion',
      badge: 'Grand Winner',
      cardStyle: 'border-amber-500/50 bg-gradient-to-b from-[#141b2d] to-[#0d1322] scale-105 shadow-2xl shadow-amber-500/10 z-10',
      tagColor: 'text-amber-300 bg-amber-950/80 border-amber-500/40',
      isGrand: true,
    },
    {
      place: '3rd Place',
      amount: formatINR(event.third_prize_inr || 5000),
      subtitle: 'Second Runner-Up',
      badge: 'Bronze Medalist',
      cardStyle: 'border-orange-500/30 bg-[#0d1322]',
      tagColor: 'text-orange-300 bg-orange-950/80',
    },
  ];

  return (
    <section id="prizes" className="py-20 lg:py-28 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/30 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-4">
            <Trophy className="h-3.5 w-3.5" />
            <span>₹35,000 Authorized Prize Pool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Rewards for Technical Excellence
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Cash rewards, verified merit certificates, and exclusive technical interview pathways with SkaleKraft.
          </p>
        </div>

        {/* Podium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto mb-12">
          {prizes.map((prize, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-8 flex flex-col justify-between transition-all ${prize.cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${prize.tagColor}`}>
                    {prize.badge}
                  </span>
                  {prize.isGrand && <Trophy className="h-6 w-6 text-amber-400" />}
                </div>

                <div className="text-sm font-semibold text-slate-400">{prize.place}</div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
                  {prize.amount}
                </div>
                <p className="text-xs text-slate-400">{prize.subtitle}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400">
                Official Cash Prize + Certificate of Merit
              </div>
            </div>
          ))}
        </div>

        {/* Additional Rewards Cards: Certificates & Internship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Top 25 Certificates */}
          <div className="rounded-2xl border border-white/10 bg-[#0c121e] p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyanAccent-500/10 border border-cyanAccent-500/20 text-cyanAccent-400 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Top 25 Teams — Merit Certificates</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Eligible members of the top 25 teams will receive an official, cryptographically verifiable digital certificate conferral from SkaleKraft.
              </p>
            </div>
          </div>

          {/* Internship Opportunity */}
          <div className="rounded-2xl border border-white/10 bg-[#0c121e] p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Top 5 Teams — SkaleKraft Internship Opportunity</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Candidates from the top five teams receive an opportunity to interview for internships at SkaleKraft.
              </p>
              <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>This interview opportunity is not a guarantee of an internship or employment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
