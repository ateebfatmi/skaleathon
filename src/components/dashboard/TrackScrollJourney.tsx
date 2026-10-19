'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCheck2,
  Cpu,
  Globe,
  Smartphone,
  ShieldCheck,
  Terminal,
  Zap,
  Boxes,
  Compass,
  Database,
  Eye,
  GitBranch,
  Video,
  FileCode,
} from 'lucide-react';

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  cpu: Cpu,
  database: Database,
  eye: Eye,
  zap: Zap,
  boxes: Boxes,
  globe: Globe,
  shield: ShieldCheck,
  terminal: Terminal,
  smartphone: Smartphone,
  layers: Layers,
  compass: Compass,
};

interface DomainItem {
  title: string;
  tag: string;
  description: string;
  iconKey: string;
}

interface TrackScrollJourneyProps {
  track: {
    id: string;
    name: string;
    slug: string;
    description: string;
    color_accent?: string;
  } | null;
  team: {
    name: string;
  } | null;
  trackMeta: {
    manifesto: string;
    domains: DomainItem[];
    suggestedStack: string[];
  } | null;
  accentColor: string;
}

export default function TrackScrollJourney({
  track,
  team,
  trackMeta,
  accentColor: rawAccent,
}: TrackScrollJourneyProps) {
  const [activeSection, setActiveSection] = useState<'vectors' | 'stack' | 'deliverables' | 'rubric'>('vectors');

  // Normalize color to SkaleKraft warm copper / champagne palette to avoid odd purple tint
  const isOddColor =
    !rawAccent ||
    rawAccent.toLowerCase().startsWith('#8b') ||
    rawAccent.toLowerCase().startsWith('#63') ||
    rawAccent.toLowerCase().includes('purple');
  const accentColor = isOddColor ? '#c19a88' : rawAccent;

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 text-neutral-200">
      {/* 1. Open Editorial Track Hero (No Card Container) */}
      <div className="relative border-b border-white/[0.08] pb-10 pt-2">
        {/* Ambient Glow */}
        <div
          className="pointer-events-none absolute -top-12 -right-8 h-80 w-80 rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.26em]">
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <span style={{ color: accentColor }}>Competition Arena // Technical Scope</span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">Squad: {team ? team.name : 'Unassigned'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                {track ? track.name : 'Engineering Track Specifications'}
              </h1>
              {track && (
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                  style={{
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                    backgroundColor: `${accentColor}12`,
                  }}
                >
                  {track.slug.toUpperCase()}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              {trackMeta ? trackMeta.manifesto : track?.description}
            </p>

            {/* Spec Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>
                  Final Submission Deadline: <strong className="text-white">Hard Deadline (10-Day Sprint)</strong>
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  Squad Capacity: <strong className="text-white">1 to 6 Members</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Capsule */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all backdrop-blur-xl"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard/stages"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] shadow-lg shadow-[#805948]/25 transition-all hover:scale-105"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Stage Roadmap</span>
            </Link>
          </div>
        </div>

        {/* Section Jump Anchors */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'vectors', label: '01. Specialized Vectors' },
            { id: 'stack', label: '02. Recommended Stack' },
            { id: 'deliverables', label: '03. Required Deliverables' },
            { id: 'rubric', label: '04. Jury Rubric' },
          ].map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                activeSection === sec.id
                  ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.06] text-white border border-[#c19a88]/40 shadow-[0_0_15px_rgba(193,154,136,0.15)] font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span>{sec.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 2. Specialized Technical Vectors (Scrollable Flow, NOT in Cards) */}
      {trackMeta && (
        <section id="vectors" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/[0.06] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                Domain Specialization
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Specialized Technical{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Vectors &amp; Themes
                </span>
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-light max-w-sm">
              Select or formulate your squad&apos;s problem statement within these technical trajectories.
            </p>
          </div>

          {/* Open Scroll Stream */}
          <div className="space-y-12 sm:space-y-16">
            {trackMeta.domains.map((domain, idx) => {
              const Icon = DOMAIN_ICONS[domain.iconKey] || Compass;
              const numStr = String(idx + 1).padStart(2, '0');

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group pl-5 sm:pl-8 border-l-2 transition-colors duration-300"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  {/* Subtle Big Watermark Number */}
                  <span className="pointer-events-none absolute right-2 -top-6 text-6xl sm:text-8xl font-black text-white/[0.03] select-none font-mono">
                    {numStr}
                  </span>

                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: accentColor,
                        borderColor: `${accentColor}35`,
                        backgroundColor: `${accentColor}10`,
                      }}
                    >
                      {domain.tag}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">Vector {numStr}</span>
                  </div>

                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 mt-0.5"
                      style={{
                        borderColor: `${accentColor}30`,
                        backgroundColor: `${accentColor}10`,
                        color: accentColor,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-[#e8c5b4] transition-colors">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-3xl">
                    {domain.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Recommended Tech Toolkit (Open Cloud, No Card) */}
      {trackMeta && (
        <section id="stack" className="space-y-6 pt-10 border-t border-white/[0.08] scroll-mt-28">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
              Architectural Velocity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recommended Stacks &amp;{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Toolkits
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Free choice of framework &amp; libraries — recommended for optimal production speed and jury evaluation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {trackMeta.suggestedStack.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-neutral-200 hover:text-white hover:border-[#c19a88]/40 hover:bg-white/[0.06] transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Split Scroll Section: Deliverables (Left) & Rubric (Right) - Open Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/[0.08]">
        {/* Left: Required Deliverables */}
        <section id="deliverables" className="lg:col-span-7 space-y-6 scroll-mt-28">
          <div className="space-y-1 border-b border-white/[0.06] pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
              Milestone Deliverables
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Official Deliverable{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Guidelines
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Mandatory and optional artifacts submitted during the Stage 03 build sprint.
            </p>
          </div>

          <div className="space-y-8">
            {/* Deliverable 1 */}
            <div className="border-l-2 border-emerald-400/50 pl-4 py-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <GitBranch className="h-4 w-4 text-emerald-400" />
                  <span>Public GitHub Repository</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Mandatory
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Clean commit history authored during the competition period. Must include a clear <code className="text-[#e8c5b4] font-mono">README.md</code> with setup instructions, environment variables template, and architectural breakdown.
              </p>
            </div>

            {/* Deliverable 2 */}
            <div className="border-l-2 border-emerald-400/50 pl-4 py-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span>Live Production Prototype URL</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Mandatory
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Fully functional deployment on cloud hosting (Vercel, Render, Railway, AWS, Cloudflare, etc.). Must be accessible by judges with zero login barriers or test credentials provided.
              </p>
            </div>

            {/* Deliverable 3 */}
            <div className="border-l-2 border-[#c19a88]/60 pl-4 py-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Video className="h-4 w-4 text-[#c19a88]" />
                  <span>Video Demonstration Walkthrough</span>
                </div>
                <span className="text-[10px] font-mono text-[#e8c5b4] bg-[#c19a88]/15 px-2.5 py-0.5 rounded-full border border-[#c19a88]/40 font-bold">
                  Optional Advantage
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                A 2 to 3 minute unlisted YouTube or Loom video walkthrough demonstrating real-time user flow and key technical innovations. Not strictly necessary, but will give your team a distinct evaluation advantage with the jury.
              </p>
            </div>

            {/* Deliverable 4 */}
            <div className="border-l-2 border-white/20 pl-4 py-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <FileCode className="h-4 w-4 text-neutral-300" />
                  <span>AI Tool &amp; Model Disclosure</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/10">
                  Policy
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Transparent declaration in your repository README acknowledging any LLMs, starter kits, or third-party APIs used in development.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Jury Rubric */}
        <section id="rubric" className="lg:col-span-5 space-y-6 scroll-mt-28">
          <div className="space-y-1 border-b border-white/[0.06] pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
              Scoring Weightage
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Jury Evaluation{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Rubric
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Weighted scoring criteria applied by judges during Stage 03 and Stage 04 evaluations.
            </p>
          </div>

          <div className="space-y-6">
            {/* 30% Innovation */}
            <div className="space-y-2 border-l-2 border-[#c19a88]/40 pl-4 py-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Innovation &amp; Originality</span>
                <span className="font-mono font-bold text-[#e8c5b4] text-sm">30%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[30%]" />
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Novelty of problem formulation, uniqueness of approach, and distinct edge over existing market solutions.
              </p>
            </div>

            {/* 30% Architecture */}
            <div className="space-y-2 border-l-2 border-[#c19a88]/40 pl-4 py-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Technical Architecture &amp; Rigor</span>
                <span className="font-mono font-bold text-[#e8c5b4] text-sm">30%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[30%]" />
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Code cleanliness, modular software design, performance benchmarks, and robust error resilience.
              </p>
            </div>

            {/* 20% Scalability */}
            <div className="space-y-2 border-l-2 border-[#c19a88]/40 pl-4 py-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Real-World Utility &amp; Scalability</span>
                <span className="font-mono font-bold text-[#e8c5b4] text-sm">20%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[20%]" />
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Practical viability, market relevance, architectural scalability, and low operational friction.
              </p>
            </div>

            {/* 20% UX Polish */}
            <div className="space-y-2 border-l-2 border-[#c19a88]/40 pl-4 py-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">UX &amp; Interface Craft</span>
                <span className="font-mono font-bold text-[#e8c5b4] text-sm">20%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[20%]" />
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Visual hierarchy, intuitive ergonomics, responsive layouts, and attention to detail.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
