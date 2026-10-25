import React from 'react';
import Link from 'next/link';
import { Bot, Trophy, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function ExploreSection() {
  const cards = [
    {
      title: 'Competition Tracks',
      badge: '3 Arenas',
      desc: 'Explore dedicated problem domains across AI/ML, Web Development, and Mobile Engineering.',
      href: '/tracks',
      cta: 'Explore Tracks',
      icon: Bot,
      accent: '#c19a88',
    },
    {
      title: 'Prizes & Citations',
      badge: '₹35,000 Pool',
      desc: 'prize awards for top 3 teams, merit certificates for Top 25 squads, and internship interviews.',
      href: '/prizes',
      cta: 'View Prize Breakdown',
      icon: Trophy,
      accent: '#ffe5d9',
    },
    {
      title: 'Official Rules',
      badge: 'Integrity',
      desc: 'Team eligibility, submission requirements, original code standards, and evaluation rubrics.',
      href: '/rules',
      cta: 'Read Official Rules',
      icon: ShieldCheck,
      accent: '#c19a88',
    },
    {
      title: 'Participant FAQ',
      badge: 'Knowledge Base',
      desc: 'Answers to common questions about squad sizes, flat ₹99 pricing, deadlines, and online mode.',
      href: '/faq',
      cta: 'Browse Help & FAQ',
      icon: HelpCircle,
      accent: '#ffe5d9',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#c19a88] font-mono font-semibold">
              Competition Directory
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dive deeper into the <span className="text-[#c19a88]">hackathon details</span>.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/55 font-light">
            Dedicated portals for track requirements, bounty breakdowns, official rules, and support.
          </p>
        </div>

        <div className="mobile-card-grid grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c19a88]/40 h-full"
              >
                <SpotlightCard className="mobile-card h-full p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 flex flex-col justify-between group-hover:border-[#c19a88]/40">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] group-hover:scale-110 transition-transform">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="mobile-card-copy text-[10px] sm:text-xs text-white/55 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] sm:text-xs font-medium text-[#c19a88] group-hover:text-white transition-colors">
                    <span className="truncate">{item.cta}</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
