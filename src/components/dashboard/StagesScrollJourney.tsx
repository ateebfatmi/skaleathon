'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  BrainCircuit,
  Send,
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '01': BrainCircuit,
  '02': FileText,
  '03': Send,
  '04': Trophy,
};

interface StageItem {
  number: string;
  title: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  description: string;
  format: string;
  schedule: string;
  weightage: string;
  criteria: string;
  deliverables: string[];
  status: string;
  statusType: 'registered' | 'eligible' | 'in_progress' | 'submitted' | 'locked' | 'reserved';
  actionHref?: string;
  actionLabel?: string;
}

interface StagesScrollJourneyProps {
  stages: StageItem[];
}

export default function StagesScrollJourney({ stages }: StagesScrollJourneyProps) {
  const [activeStage, setActiveStage] = useState<string>('01');

  return (
    <div className="space-y-10 sm:space-y-16 pb-20">
      {/* Editorial Header */}
      <div className="relative border-b border-white/[0.08] pb-8 pt-2">
        <div className="pointer-events-none absolute -top-10 right-0 h-72 w-72 rounded-full bg-[#c19a88]/10 blur-[120px]" />
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 text-xs text-[#e8c5b4] font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
              <span className="font-mono uppercase tracking-[0.2em] text-[10px]">
                Sequential Roadmap
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              The 4-Stage{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Tournament Journey
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
              Scroll down to explore the progression, evaluation benchmarks, and deliverables for every phase of Skaleathon.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] hover:border-[#c19a88]/40 transition-all w-fit shrink-0 backdrop-blur-xl"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard Overview</span>
          </Link>
        </div>

        {/* Quick Stage Anchor Links */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto scrollbar-none pb-1">
          {stages.map((st) => (
            <a
              key={st.number}
              href={`#stage-${st.number}`}
              onClick={() => setActiveStage(st.number)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                activeStage === st.number
                  ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.06] text-white border border-[#c19a88]/40 shadow-[0_0_15px_rgba(193,154,136,0.15)] font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span className="font-mono text-[10px] text-[#c19a88]">{st.number}</span>
              <span>{st.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Vertical Scroll Flow (Not In Cards) */}
      <div className="relative">
        {/* Continuous Connected Glowing Timeline Track */}
        <div className="absolute left-4 sm:left-8 top-6 bottom-20 w-[2px] bg-gradient-to-b from-[#c19a88] via-[#805948]/60 to-white/10 pointer-events-none hidden md:block" />

        <div className="space-y-20 sm:space-y-28">
          {stages.map((stage, idx) => {
            const Icon = STAGE_ICONS[stage.number] || Sparkles;

            return (
              <motion.section
                id={`stage-${stage.number}`}
                key={stage.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onViewportEnter={() => setActiveStage(stage.number)}
                className="relative scroll-mt-28 md:pl-24"
              >
                {/* Timeline Milestone Node Marker */}
                <div className="hidden md:flex absolute -left-[11px] sm:-left-[3px] top-1.5 h-10 w-10 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/20 bg-[#0B0B0B] text-white shadow-[0_0_20px_rgba(193,154,136,0.25)]">
                  <Icon className="h-4 w-4 text-[#c19a88]" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c19a88]" />
                  </span>
                </div>

                {/* Open Stage Content Block (No Card Container) */}
                <div className="relative">
                  {/* Watermark Stage Numeral */}
                  <span className="pointer-events-none absolute -right-4 -top-12 text-7xl sm:text-9xl font-black text-white/[0.03] select-none font-mono">
                    {stage.number}
                  </span>

                  {/* Header Meta Line */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#c19a88] uppercase">
                      Stage {stage.number}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${stage.categoryColor}`}>
                      {stage.category}
                    </span>
                    <span className="text-neutral-600 hidden sm:inline">•</span>
                    <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                      {stage.schedule}
                    </span>
                  </div>

                  {/* Stage Headline */}
                  <div className="space-y-1 mb-5">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                      {stage.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-serif italic text-[#e8c5b4]/90 tracking-wide">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Narrative Body Copy */}
                  <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-3xl mb-8">
                    {stage.description}
                  </p>

                  {/* Minimal Spec Pillars (Border-free, Open Minimalist Badges) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mb-8">
                    <div className="border-l-2 border-[#c19a88]/40 pl-3.5 py-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                        Submission Format
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-white mt-0.5 block leading-snug">
                        {stage.format}
                      </span>
                    </div>

                    <div className="border-l-2 border-[#e8c5b4]/40 pl-3.5 py-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                        Weightage & Impact
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[#e8c5b4] mt-0.5 block leading-snug">
                        {stage.weightage}
                      </span>
                    </div>

                    <div className="border-l-2 border-white/20 pl-3.5 py-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                        Core Evaluation Lens
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-neutral-300 mt-0.5 block leading-snug">
                        {stage.criteria}
                      </span>
                    </div>
                  </div>

                  {/* Key Deliverables Bullet Pills */}
                  {stage.deliverables && stage.deliverables.length > 0 && (
                    <div className="space-y-2 max-w-3xl mb-8">
                      <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neutral-400 block">
                        Required Stage Deliverables
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {stage.deliverables.map((d, dIdx) => (
                          <div
                            key={dIdx}
                            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs text-neutral-200"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status & CTA Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06] max-w-3xl">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-neutral-400">Current Squad Status:</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1 rounded-full border border-white/10 bg-white/[0.04]">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{stage.status}</span>
                      </span>
                    </div>

                    {stage.actionHref ? (
                      <Link
                        href={stage.actionHref}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-[#805948]/20 transition-all hover:scale-105"
                      >
                        <span>{stage.actionLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-neutral-500 font-mono">
                        Milestone unlocks in progression
                      </span>
                    )}
                  </div>
                </div>

                {/* Delicate Divider Between Stages */}
                {idx < stages.length - 1 && (
                  <div className="mt-16 sm:mt-24 border-b border-white/[0.06]" />
                )}
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
