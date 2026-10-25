'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Layers3,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
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

const STATUS_STYLES: Record<StageItem['statusType'], string> = {
  registered: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  eligible: 'border-[#f5f5f5]/35 bg-[#f5f5f5]/10 text-[#ffffff]',
  in_progress: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  submitted: 'border-white/20 bg-white/[0.07] text-white/70',
  locked: 'border-white/10 bg-white/[0.035] text-white/50',
  reserved: 'border-white/15 bg-white/[0.04] text-white/50',
};

function StatusBadge({ stage }: { stage: StageItem }) {
  const Icon =
    stage.statusType === 'registered' || stage.statusType === 'submitted'
      ? CheckCircle2
      : stage.statusType === 'locked'
        ? Lock
        : stage.statusType === 'reserved'
          ? Trophy
          : stage.statusType === 'in_progress'
            ? Clock3
            : Sparkles;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] ${STATUS_STYLES[stage.statusType]}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{stage.status}</span>
    </span>
  );
}

export default function StagesScrollJourney({ stages }: StagesScrollJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeStage = stages[activeIndex];
  const ActiveIcon = STAGE_ICONS[activeStage.number] || Sparkles;
  const nextStage = stages[activeIndex + 1];

  return (
    <div className="relative pb-[max(3rem,env(safe-area-inset-bottom))] text-neutral-200 sm:pb-16">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[#737373]/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 top-48 h-px bg-gradient-to-r from-transparent via-[#f5f5f5]/20 to-transparent" />

      <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101010]/90 px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:rounded-3xl sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#f5f5f5]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c19a88]">
              <span className="flex items-center gap-2 rounded-full border border-[#f5f5f5]/20 bg-[#f5f5f5]/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
                Official roadmap
              </span>
              <span className="text-white/25">04 sequential phases</span>
            </div>
            <h1 className="max-w-2xl text-[2rem] font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Your route from screening to the <span className="font-serif font-normal italic text-[#d4d4d4]">grand finale.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-light leading-6 text-white/55 sm:text-base sm:leading-7">
              Select a phase to review its timeline, evaluation focus, and exact hand-in requirements. Your eligibility updates automatically as the competition progresses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs font-semibold text-white/65 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f5f5] sm:px-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Overview
            </Link>
            <Link
              href="/dashboard/submission"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f5f5f5] px-3 py-2.5 text-xs font-bold text-[#171717] shadow-[0_10px_30px_rgba(255,255,255,.18)] transition hover:bg-[#d4d4d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff] sm:px-4"
            >
              Submission portal
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Competition stages" className="relative mt-4 rounded-2xl border border-white/[0.08] bg-[#0e0e0e] p-2 sm:mt-5 sm:p-3">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {stages.map((stage, index) => {
            const Icon = STAGE_ICONS[stage.number] || Sparkles;
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;

            return (
              <button
                key={stage.number}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={`group relative min-w-0 overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-300 sm:px-4 sm:py-4 ${
                  isActive
                    ? 'border-[#f5f5f5]/45 bg-[#171717] shadow-[0_14px_34px_rgba(0,0,0,.25)]'
                    : 'border-transparent bg-white/[0.018] hover:border-white/10 hover:bg-white/[0.035]'
                }`}
              >
                {isActive && <span className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ffffff] to-transparent" />}
                <span className="flex items-center justify-between">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${isActive ? 'border-[#f5f5f5]/35 bg-[#f5f5f5]/[0.12] text-[#ffffff]' : 'border-white/10 text-white/35'}`}>
                    {isPast ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" strokeWidth={1.6} />}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">{stage.number} / 04</span>
                </span>
                <span className={`mt-3 block min-h-8 text-[11px] font-bold leading-4 sm:mt-4 sm:min-h-0 sm:text-xs ${isActive ? 'text-white' : 'text-white/65'}`}>{stage.title}</span>
                <span className="mt-1 flex items-center gap-1.5 text-[10px] text-white/35">
                  <CalendarDays className="h-3 w-3" />
                  {stage.schedule}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={activeStage.number}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111111] shadow-[0_28px_90px_rgba(0,0,0,.32)] sm:mt-5 sm:rounded-3xl"
        >
          <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]">
            <div className="p-4 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f5f5f5]/25 bg-[#f5f5f5]/10 text-[#ffffff] shadow-[inset_0_1px_rgba(255,255,255,.06)] sm:h-12 sm:w-12">
                    <ActiveIcon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c19a88]">
                      <span>Stage {activeStage.number}</span>
                      <span className="text-white/20">/</span>
                      <span className={`rounded-full border px-2 py-0.5 ${activeStage.categoryColor}`}>{activeStage.category}</span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-[28px]">{activeStage.title}</h2>
                    <p className="mt-1 text-xs font-medium text-[#d4d4d4]/75 sm:text-sm">{activeStage.subtitle}</p>
                  </div>
                </div>
                <div className="shrink-0"><StatusBadge stage={activeStage} /></div>
              </div>

              <p className="mt-5 text-sm font-light leading-6 text-white/65 sm:text-[14px]">{activeStage.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 sm:p-4">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    <Clock3 className="h-3.5 w-3.5 text-[#c19a88]" /> Format &amp; window
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-5 text-white/85">{activeStage.format}</p>
                </div>
                <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 sm:p-4">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    <CalendarDays className="h-3.5 w-3.5 text-[#c19a88]" /> Official schedule
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-5 text-white/85">{activeStage.schedule}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Required deliverables</h3>
                  <span className="font-mono text-[10px] text-white/30">{String(activeStage.deliverables.length).padStart(2, '0')} items</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeStage.deliverables.map((item, index) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-black/15 px-3.5 py-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-xs leading-5 text-white/65"><span className="mr-2 font-mono text-[9px] text-white/25">0{index + 1}</span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeStage.actionHref && (
                <Link
                  href={activeStage.actionHref}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#737373] to-[#f5f5f5] px-5 py-3 text-xs font-bold text-white shadow-[0_14px_36px_rgba(163,163,163,.2)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff] sm:w-auto"
                >
                  {activeStage.actionLabel}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <aside className="border-t border-white/[0.07] bg-black/20 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c19a88]">
                <Target className="h-3.5 w-3.5" /> Evaluation brief
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-[#f5f5f5]/15 bg-[#f5f5f5]/[0.055] p-4">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4d4d4]">
                    <Layers3 className="h-3.5 w-3.5" /> Weightage &amp; impact
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-5 text-white/80">{activeStage.weightage}</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                    <ShieldCheck className="h-3.5 w-3.5" /> What judges assess
                  </span>
                  <p className="mt-2 text-sm font-light leading-6 text-white/65">{activeStage.criteria}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-white/[0.07] pt-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">Progression</span>
                <div className="mt-3 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-[10px] text-[#c19a88]">
                    {activeIndex + 1}/4
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white/75">
                      {nextStage ? `Next: ${nextStage.title}` : 'Final competition milestone'}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-white/35">
                      {nextStage ? `Complete this phase to advance to Stage ${nextStage.number}.` : 'Prize placement follows the final jury decision.'}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <footer className="grid grid-cols-2 gap-2 border-t border-white/[0.07] bg-black/20 px-3 py-2.5 sm:flex sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-white/45 transition hover:bg-white/[0.04] hover:text-white disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous stage
            </button>
            <div className="hidden items-center gap-1.5 sm:flex">
              {stages.map((stage, index) => (
                <button
                  key={stage.number}
                  type="button"
                  aria-label={`View stage ${stage.number}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-7 bg-[#f5f5f5]' : 'w-1.5 bg-white/15 hover:bg-white/30'}`}
                />
              ))}
            </div>
            <button
              type="button"
              disabled={activeIndex === stages.length - 1}
              onClick={() => setActiveIndex((index) => Math.min(stages.length - 1, index + 1))}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-white/45 transition hover:bg-white/[0.04] hover:text-white disabled:pointer-events-none disabled:opacity-25"
            >
              Next stage <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </footer>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
