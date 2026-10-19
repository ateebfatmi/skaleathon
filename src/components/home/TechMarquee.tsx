'use client';

import React from 'react';
import { Sparkles, Terminal, Cpu, Globe, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function TechMarquee() {
  const items = [
    { label: 'AI & Machine Learning Track', icon: Cpu, highlight: true },
    { label: '₹35,000 Authorized Prize Pool', icon: Sparkles, highlight: false },
    { label: 'Web Architecture Track', icon: Globe, highlight: true },
    { label: '₹99 Flat Team Registration', icon: Zap, highlight: false },
    { label: 'Mobile Systems Track', icon: Smartphone, highlight: true },
    { label: 'Top 25 Cryptographic Certificates', icon: ShieldCheck, highlight: false },
    { label: 'SkaleKraft Interview Opportunities', icon: Terminal, highlight: true },
    { label: '1 to 6 Member Team Rosters', icon: Sparkles, highlight: false },
    { label: 'National Online Hackathon — India', icon: Globe, highlight: true },
    { label: 'Tamper-Evident SHA-256 Badges', icon: ShieldCheck, highlight: false },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.07] bg-[#07090E]/80 py-3.5 backdrop-blur-xl">
      {/* Edge gradient fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 sm:w-32 bg-gradient-to-r from-[#0B0B0B] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 sm:w-32 bg-gradient-to-l from-[#0B0B0B] to-transparent" />

      <div className="flex w-max animate-marquee space-x-8 select-none">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs font-medium tracking-wide text-white/70 hover:border-[#c19a88]/40 hover:text-white transition-all cursor-default"
            >
              <Icon
                className={`h-3.5 w-3.5 ${
                  item.highlight ? 'text-[#c19a88]' : 'text-white/40'
                }`}
              />
              <span className={item.highlight ? 'text-[#e8c5b4] font-semibold' : ''}>
                {item.label}
              </span>
              <span className="text-white/20 ml-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
