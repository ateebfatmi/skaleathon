'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Github,
  Globe,
  Video,
  Award,
  HelpCircle,
} from 'lucide-react';
import { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/spotlight-card';

interface RulesPageClientProps {
  event: EventData;
}

export default function RulesPageClient({ event }: RulesPageClientProps) {
  const rubric = [
    {
      weight: '30%',
      title: 'Architecture & Code Quality',
      desc: 'System modularity, database resilience, clean git commit history, and secure API boundaries.',
      color: 'from-[#f5f5f5]/15 to-[#737373]/25',
      border: 'border-[#f5f5f5]/40',
      badge: 'Core Engineering',
    },
    {
      weight: '25%',
      title: 'Innovation & Problem Relevance',
      desc: 'Originality of technical approach, feasibility, and real-world value of the chosen solution.',
      color: 'from-white/[0.03] to-white/[0.07]',
      border: 'border-white/15',
      badge: 'Concept & Impact',
    },
    {
      weight: '25%',
      title: 'Working Prototype & UX',
      desc: 'Stability of live deployment, mobile responsiveness, intuitive workflow, and edge-case handling.',
      color: 'from-emerald-500/10 to-teal-500/15',
      border: 'border-emerald-500/30',
      badge: 'Execution',
    },
    {
      weight: '20%',
      title: 'Documentation & Jury Defense',
      desc: 'Clarity of the repository README, architecture diagrams, and squad confidence during live Q&A.',
      color: 'from-amber-500/10 to-orange-500/15',
      border: 'border-amber-500/30',
      badge: 'Defense',
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. Header & Context Ribbon */}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5f5f5] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f5f5f5]" />
            </span>
            <span>Official Tournament Protocol // Governance &amp; Standards</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/tracks" className="text-neutral-400 hover:text-white transition-colors">
              Tracks
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/prizes" className="text-neutral-400 hover:text-white transition-colors">
              Prizes
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/faq" className="text-neutral-400 hover:text-white transition-colors">
              FAQs
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Rules &amp; <span className="text-[#c19a88]">Integrity Standards</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Standardized rules across all tracks to ensure fair play, original engineering craft, and transparent evaluation.
          </p>
        </div>
      </header>

      {/* 2. Core Eligibility & Squad Protocol (4 Focused Cards) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5f5f5] animate-pulse" />
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            01 // Squad &amp; Eligibility Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <SpotlightCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#f5f5f5]/10 border border-[#f5f5f5]/20 flex items-center justify-center text-[#c19a88]">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Squad Size</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {event.min_team_size} to {event.max_team_size} members per team. Solo builders are fully supported and judged equally.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#ffffff] pt-2 border-t border-white/[0.06] block">
              Cross-college &amp; inter-city allowed
            </span>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#f5f5f5]/10 border border-[#f5f5f5]/20 flex items-center justify-center text-[#c19a88]">
                <Trophy className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Flat Team Pass</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Flat {formatINR(event.registration_fee_inr)} entry fee covers the entire squad across all 4 tournament stages.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#ffffff] pt-2 border-t border-white/[0.06] block">
              Zero per-head or hidden fees
            </span>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#f5f5f5]/10 border border-[#f5f5f5]/20 flex items-center justify-center text-[#c19a88]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Single Roster Rule</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Each participant may belong to only one squad. Dual membership results in squad disqualification.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#ffffff] pt-2 border-t border-white/[0.06] block">
              Finalized before Stage 02
            </span>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#f5f5f5]/10 border border-[#f5f5f5]/20 flex items-center justify-center text-[#c19a88]">
                <Globe className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">100% Online Mode</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Build and submit remotely from anywhere in India. Live presentations conducted via online video panel.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#ffffff] pt-2 border-t border-white/[0.06] block">
              No physical travel required
            </span>
          </SpotlightCard>
        </div>
      </section>

      {/* 3. Code Integrity Policy: Allowed vs Strictly Prohibited */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5f5f5] animate-pulse" />
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            02 // Code Integrity: Allowed vs. Prohibited
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allowed Column */}
          <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.02] space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-500/15">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-300">Allowed &amp; Encouraged</h3>
                <p className="text-[10px] text-neutral-400">Accepted tools and open engineering workflows</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">AI Assistance (Copilot, Cursor, ChatGPT)</strong>
                  <span className="text-neutral-400 font-light">Permitted for boilerplate, debugging, and ideation with transparency.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Open-Source Frameworks &amp; APIs</strong>
                  <span className="text-neutral-400 font-light">React, Next.js, PyTorch, Supabase, Tailwind, UI kits, and public APIs.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Cloud Free Tiers &amp; Serverless Deployments</strong>
                  <span className="text-neutral-400 font-light">Vercel, Render, Railway, AWS, Supabase, or Hugging Face Spaces.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prohibited Column */}
          <div className="p-5 sm:p-6 rounded-2xl border border-rose-500/25 bg-rose-500/[0.02] space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-rose-500/15">
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-300">Strictly Prohibited</h3>
                <p className="text-[10px] text-neutral-400">Violations result in immediate disqualification</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Pre-Built Projects &amp; Historical Repos</strong>
                  <span className="text-neutral-400 font-light">Codebases authored prior to competition kickoff are not eligible.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Plagiarism &amp; Cloned Codebases</strong>
                  <span className="text-neutral-400 font-light">Forking existing projects without original logic leads to immediate ejection.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Private Repositories at Evaluation</strong>
                  <span className="text-neutral-400 font-light">GitHub repositories must be public for automated and manual audit.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mandatory Deliverables by Stage */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5f5f5] animate-pulse" />
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            03 // Submission Milestones
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2">
            <span className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] font-semibold text-white/60">
              Stage 01 • 8 Jan
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white">Online Technical Quiz</h3>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
              Timed 30–45 min screening test in CS core fundamentals &amp; track logic to qualify for Stage 02.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2">
            <span className="text-[10px] font-mono text-[#c19a88] bg-[#f5f5f5]/10 px-2 py-0.5 rounded-full border border-[#f5f5f5]/20 inline-block font-semibold">
              Stage 02 • 10–14 Jan
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white">Architecture PPT Deck</h3>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
              Max 10-slide PDF covering problem scope, system architecture, database schema, and APIs.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block font-semibold">
              Stage 03 • 16–25 Jan
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white">Codebase &amp; Live URL</h3>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
              Public GitHub repo with clean commit history + live deployed URL (+ optional demo video).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2">
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 inline-block font-semibold">
              Stage 04 • 29–30 Jan
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white">Grand Finale Q&amp;A</h3>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
              10-minute live demo and 5-minute technical panel defense before industry judges.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Official Judging Rubric (100 Points) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5f5f5] animate-pulse" />
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            04 // Evaluation Criteria (100 Points Total)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {rubric.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border ${item.border} bg-gradient-to-b ${item.color} space-y-2 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white font-mono">{item.weight}</span>
                <span className="text-[9px] font-mono text-[#ffffff] uppercase tracking-wider">{item.badge}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-[11px] text-neutral-300 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Clean Call to Action & Support Banner */}
      <div className="rounded-2xl border border-white/[0.1] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(17,17,17,0.96))] p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c19a88] font-bold block">
            Ready to Compete?
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Register your squad pass for flat {formatINR(event.registration_fee_inr)}.
          </h3>
          <p className="text-xs text-neutral-400 font-light">
            One pass covers up to {event.max_team_size} members across all competition stages.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Link
            href="/register"
            className="flex-1 md:flex-initial px-6 py-2.5 rounded-full bg-gradient-to-r from-[#737373] to-[#f5f5f5] text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-[#737373]/20 hover:scale-105 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Register Squad</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/faq"
            className="px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-white text-xs font-medium text-center transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#c19a88]" />
            <span>Help FAQ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
