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
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';

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
    <div className="relative w-full space-y-14 pb-24 text-neutral-200">
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
          <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
            ROADMAP
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
            </span>
            <span className="text-[#c19a88]">Tournament Progression // Sequential Roadmap</span>
            <span className="text-white/20">•</span>
            <span className="text-neutral-400">
              Format: <strong className="text-white font-semibold">4 Evaluation Phases</strong>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#e8c5b4] font-semibold">[SKALEATHON]</span>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Overview</span>
            </Link>

            <span className="text-white/15">|</span>

            <Link
              href="/dashboard/submission"
              className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
            >
              <Send className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Deliverables Portal</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Headline & Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-5 pb-9">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            The 4-Stage{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              Tournament Journey
            </span>
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
            Explore the sequential progression, evaluation benchmarks, and required engineering deliverables for every phase of Skaleathon—from initial technical screening to the live Grand Finale defense.
          </p>
        </div>

        {/* Full-Width 4-Column Editorial Stage Index Bar with Transition */}
        <EditorialIndexBar
          layoutIdPrefix="stagesIndex"
          activeId={activeStage}
          onSelectItem={(item) => setActiveStage(item.num)}
          items={stages.map((st) => ({
            id: st.number,
            num: st.number,
            label: st.title,
            href: `#stage-${st.number}`,
          }))}
        />
      </header>

      {/* 2. Open Vertical Stage Stream */}
      <div className="space-y-16">
        {stages.map((stage, idx) => {
          const Icon = STAGE_ICONS[stage.number] || Sparkles;

          return (
            <motion.section
              id={`stage-${stage.number}`}
              key={stage.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
              onViewportEnter={() => setActiveStage(stage.number)}
              className={`relative scroll-mt-28 space-y-6 ${
                idx > 0 ? 'pt-12 border-t border-white/[0.08]' : ''
              }`}
            >
              {/* Stage Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.26em]">
                    <span className="text-[#c19a88] font-bold">
                      {stage.number} {'//'} {stage.category}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-neutral-400">{stage.schedule}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#c19a88] shrink-0" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {stage.title.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="font-serif italic font-normal text-[#e8c5b4]">
                        {stage.title.split(' ').slice(-1)}
                      </span>
                    </h2>
                  </div>
                </div>

                {/* Status Readout */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-400">Status:</span>
                  <span className="text-white font-semibold">{stage.status}</span>
                </div>
              </div>

              {/* Description */}
              <p className="border-l-2 border-[#c19a88]/40 pl-4 text-sm text-neutral-300 font-light leading-relaxed max-w-3xl">
                {stage.description}
              </p>

              {/* 3-Column Architectural Spec Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 pt-4 pb-4 border-t border-b border-white/[0.06]">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
                      Format &amp; Window
                    </span>
                    <span className="font-mono text-lg font-light text-white/10 select-none">01</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {stage.format}
                  </p>
                </div>

                <div className="md:border-l md:border-white/[0.08] md:pl-6 lg:pl-8 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#e8c5b4] font-bold">
                      Weightage &amp; Impact
                    </span>
                    <span className="font-mono text-lg font-light text-white/10 select-none">02</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#e8c5b4]">
                    {stage.weightage}
                  </p>
                </div>

                <div className="md:border-l md:border-white/[0.08] md:pl-6 lg:pl-8 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 font-bold">
                      Evaluation Criteria
                    </span>
                    <span className="font-mono text-lg font-light text-white/10 select-none">03</span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-300">
                    {stage.criteria}
                  </p>
                </div>
              </div>

              {/* Deliverables & Action Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                    Deliverables:
                  </span>
                  {stage.deliverables.map((d, dIdx) => (
                    <span
                      key={dIdx}
                      className="inline-flex items-center gap-2 text-xs font-mono text-neutral-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>

                {stage.actionHref && (
                  <Link
                    href={stage.actionHref}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8c5b4] hover:text-white transition-colors shrink-0"
                  >
                    <span>{stage.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
