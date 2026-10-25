'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  BrainCircuit,
  Send,
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Lock,
  Layers,
  ChevronRight,
  Check,
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

  const scrollToStage = (stageNum: string) => {
    setActiveStage(stageNum);
    const el = document.getElementById(`stage-${stageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getStatusBadge = (statusType: StageItem['statusType'], statusText: string) => {
    switch (statusType) {
      case 'registered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{statusText}</span>
          </span>
        );
      case 'eligible':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c19a88]/20 border border-[#c19a88]/40 text-[#e8c5b4] font-semibold text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#c19a88]" />
            <span>{statusText}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-xs animate-pulse">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{statusText}</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold text-xs">
            <Check className="h-3.5 w-3.5 shrink-0" />
            <span>{statusText}</span>
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/60 font-medium text-xs">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>{statusText}</span>
          </span>
        );
      case 'reserved':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold text-xs">
            <Trophy className="h-3.5 w-3.5 shrink-0 text-purple-400" />
            <span>{statusText}</span>
          </span>
        );
    }
  };

  return (
    <div className="relative w-full space-y-8 pb-20 text-neutral-200">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-full max-w-5xl rounded-full bg-[#c19a88]/10 blur-[150px]" />

      {/* 1. Header & Context */}
      <header className="relative space-y-4 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#c19a88] font-bold uppercase tracking-wider">
              Sequential 4-Stage Hackathon Roadmap
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white/60">SkaleKraft Official Progression</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Back to Overview</span>
            </Link>
            <span className="text-white/15">|</span>
            <Link
              href="/dashboard/submission"
              className="inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
            >
              <Send className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Submission Portal</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88]" />
            </Link>
          </div>
        </div>

        {/* Page Title with High-Contrast Typography */}
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Competition <span className="text-[#c19a88]">Stages &amp; Milestones</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Review detailed timelines, evaluation rubrics, and deliverable specifications for each of the four sequential competition stages.
          </p>
        </div>

        {/* Fast Stage Navigation Pills */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {stages.map((st) => {
            const Icon = STAGE_ICONS[st.number] || Sparkles;
            const isActive = activeStage === st.number;
            return (
              <button
                key={st.number}
                type="button"
                onClick={() => scrollToStage(st.number)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#c19a88]/20 border-[#c19a88] text-white shadow-md shadow-[#c19a88]/20'
                    : 'bg-[#141211] border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#c19a88]' : 'text-neutral-400'}`} />
                <span>Stage {st.number}</span>
                <span className="text-[11px] text-white/40 hidden sm:inline">• {st.title}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. Elevated High-Contrast Stage Cards */}
      <div className="space-y-8">
        {stages.map((stage) => {
          const Icon = STAGE_ICONS[stage.number] || Sparkles;

          return (
            <section
              id={`stage-${stage.number}`}
              key={stage.number}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all hover:border-[#c19a88]/40"
            >
              {/* Card Header: Stage Number, Category, Title & Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#c19a88] px-2.5 py-0.5 rounded-md bg-[#c19a88]/15 border border-[#c19a88]/30">
                      STAGE {stage.number}
                    </span>
                    <span className="text-xs font-semibold text-[#e8c5b4] uppercase tracking-wider">
                      {stage.category}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-neutral-300 font-mono flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-[#c19a88]" />
                      <span>{stage.schedule}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[#c19a88]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {stage.title}
                      </h2>
                      <p className="text-xs text-[#e8c5b4]/80 font-medium mt-0.5">
                        {stage.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prominent Status Badge */}
                <div className="shrink-0 pt-1">
                  {getStatusBadge(stage.statusType, stage.status)}
                </div>
              </div>

              {/* Stage Description - High-Contrast and Readable */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-5">
                <p className="text-sm sm:text-base text-neutral-200 font-normal leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* 3 Parameter Tiles Grid: Format, Weightage, Rubric */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tile 1: Format */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#c19a88] font-bold">
                      Format &amp; Window
                    </span>
                    <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {stage.format}
                  </p>
                </div>

                {/* Tile 2: Weightage */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#e8c5b4] font-bold">
                      Weightage &amp; Impact
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-[#e8c5b4]" />
                  </div>
                  <p className="text-sm font-semibold text-[#e8c5b4]">
                    {stage.weightage}
                  </p>
                </div>

                {/* Tile 3: Evaluation Criteria */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Evaluation Criteria
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 font-normal leading-relaxed">
                    {stage.criteria}
                  </p>
                </div>
              </div>

              {/* Deliverables Checklist & Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold block">
                    Key Deliverables:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {stage.deliverables.map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-neutral-200"
                      >
                        <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                {stage.actionHref && (
                  <Link
                    href={stage.actionHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                  >
                    <span>{stage.actionLabel}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
