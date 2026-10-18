import React from 'react';
import { Trophy, Users, Tag, Award } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { EventData } from '@/lib/db/types';

interface StatsProps {
  event: EventData;
}

export default function StatsSection({ event }: StatsProps) {
  const stats = [
    {
      label: 'Total Prize Pool',
      value: formatINR(event.prize_pool_inr || 35000),
      desc: 'Cash rewards for 1st, 2nd, and 3rd winning teams',
      icon: Trophy,
      accent: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      label: 'Registration Fee',
      value: `₹${event.registration_fee_inr || 99}`,
      desc: 'Nominal ₹99 flat fee covering the whole team',
      icon: Tag,
      accent: 'from-brand-500/20 to-indigo-500/20 text-brand-400 border-brand-500/30',
    },
    {
      label: 'Team Size Range',
      value: `${event.min_team_size}–${event.max_team_size} Members`,
      desc: 'Participate as a solo builder or collaborate up to 6',
      icon: Users,
      accent: 'from-cyanAccent-500/20 to-blue-500/20 text-cyanAccent-400 border-cyanAccent-500/30',
    },
    {
      label: 'Official Certificates',
      value: `Top ${event.certificates_top_n || 25} Teams`,
      desc: 'Verified digital credentials with QR verification',
      icon: Award,
      accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-[#090d16]/70">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c111d] p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {stat.label}
                  </span>
                  <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${stat.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{stat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
