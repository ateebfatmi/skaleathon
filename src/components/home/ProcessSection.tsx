import React from 'react';
import { HelpCircle, Presentation, Code2, MessagesSquare, ArrowRight, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import Link from 'next/link';
import type { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';

export default function ProcessSection({ event }: { event: EventData }) {
  const stages = [
    {
      num: 'Stage 01',
      title: 'Online Technical Quiz',
      subtitle: 'Screening & Aptitude Round',
      date: '8 Jan 2028',
      desc: 'A timed technical quiz evaluating core computer science fundamentals, algorithmic logic, and chosen track domain knowledge.',
      icon: HelpCircle,
      accent: 'rgba(52, 211, 153, 0.15)',
      badge: 'Screening',
      badgeClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      num: 'Stage 02',
      title: 'Idea & Architecture PPT',
      subtitle: 'Ideation & Blueprint Submission',
      date: '10–14 Jan 2028',
      desc: 'Shortlisted teams submit a structured presentation deck detailing their problem statement, system architecture, tech stack, and feasibility.',
      icon: Presentation,
      accent: 'rgba(193, 154, 136, 0.15)',
      badge: 'Evaluation',
      badgeClass: 'text-[#c19a88] border-[#c19a88]/30 bg-[#c19a88]/10',
    },
    {
      num: 'Stage 03',
      title: 'Project Submission',
      subtitle: 'Core Engineering & Codebase',
      date: '16/17–25/26 Jan 2028',
      desc: 'The primary building phase. Teams submit their public GitHub repository and live deployed URL (optional demo video provides an evaluation advantage).',
      icon: Code2,
      accent: 'rgba(232, 197, 180, 0.18)',
      badge: 'Build Phase',
      badgeClass: 'text-[#e8c5b4] border-[#c19a88]/30 bg-[#c19a88]/10',
    },
    {
      num: 'Stage 04',
      title: 'Grand Finale Live Q&A',
      subtitle: 'Panel Defense & Interviews',
      date: '29–30 Jan 2028',
      desc: 'Finalist teams present and defend their working system in a live technical Q&A session with industry judges and SkaleKraft leadership.',
      icon: MessagesSquare,
      accent: 'rgba(251, 191, 36, 0.15)',
      badge: 'Grand Finale',
      badgeClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  return (
    <section id="stages" className="py-20 lg:py-28 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Competition Architecture
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Four progressive{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              stages
            </span>
            .
          </h2>
          <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
            A comprehensive four-stage funnel designed to evaluate technical aptitude, architectural design, software execution, and live verbal defense.
          </p>
        </div>

        {/* 4-Column Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx} className="h-full">
                <SpotlightCard
                  enableTilt
                  spotlightColor={stage.accent}
                  className="h-full flex flex-col justify-between p-6 sm:p-7 hover:border-[#c19a88]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-[10px] font-bold text-[#c19a88] tracking-[0.2em] uppercase">
                        {stage.num}
                      </span>
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${stage.badgeClass}`}>
                        {stage.badge}
                      </span>
                    </div>

                    <div className="p-3 w-fit rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/80 group-hover:text-[#c19a88] group-hover:scale-110 transition-all mb-4">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <h3 className="text-base font-semibold tracking-wide text-white mb-1 group-hover:text-[#c19a88] transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#c19a88]/80 mb-3">
                      {stage.subtitle}
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed font-light">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c19a88] font-medium tracking-wide">
                      {stage.date}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-white/30">
                        Round {idx + 1}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.02),rgba(14,14,14,0.96))] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-medium text-sm">
              <Sparkles className="h-4 w-4 text-[#c19a88]" />
              <span>Flat {formatINR(event.registration_fee_inr)} Registration Covers All 4 Stages for Your Entire Team</span>
            </div>
            <p className="text-xs text-white/50 font-light">
              No hidden fees at any stage. {event.min_team_size} to {event.max_team_size} members compete with full access to the quiz, ideation review, build phase, and finale.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#805948]/20 hover:scale-105 transition-all"
          >
            <span>Register Your Team — {formatINR(event.registration_fee_inr)}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
