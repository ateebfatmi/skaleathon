'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  Globe,
  ShieldCheck,
  Compass,
  GitBranch,
  Video,
  FileCode,
  Send,
  Cpu,
  Terminal,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

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
    coreExpectation: string;
    suggestedStack: string[];
  } | null;
  accentColor: string;
}

const VERSATILE_EXAMPLE_DOMAINS = [
  { code: '01', name: 'Healthcare & BioTech' },
  { code: '02', name: 'FinTech & Payments' },
  { code: '03', name: 'EdTech & Learning' },
  { code: '04', name: 'Climate & Sustainability' },
  { code: '05', name: 'AgriTech & Rural Impact' },
  { code: '06', name: 'Cybersecurity & Privacy' },
  { code: '07', name: 'Logistics & Supply Chain' },
  { code: '08', name: 'Developer Tooling' },
  { code: '09', name: 'Creator Economy & Media' },
  { code: '10', name: 'Smart Cities & CivicTech' },
  { code: '11', name: 'E-Commerce & Retail' },
  { code: '∞', name: 'Custom / Your Own Domain', highlight: true },
];

export default function TrackScrollJourney({
  track,
  team,
  trackMeta,
  accentColor: rawAccent,
}: TrackScrollJourneyProps) {
  const [activeSection, setActiveSection] = useState<'scope' | 'stack' | 'deliverables' | 'rubric'>('scope');

  // Normalize color to SkaleKraft warm copper / champagne palette
  const isOddColor =
    !rawAccent ||
    rawAccent.toLowerCase().startsWith('#8b') ||
    rawAccent.toLowerCase().startsWith('#63') ||
    rawAccent.toLowerCase().includes('purple');
  const accentColor = isOddColor ? '#c19a88' : rawAccent;

  // Split track title for editorial serif contrast (e.g. "AI &" + "Machine Learning")
  const renderStylizedTrackTitle = (name?: string) => {
    if (!name) {
      return (
        <>
          Engineering{' '}
          <span className="font-serif italic font-normal text-[#e8c5b4]">
            Track Specifications
          </span>
        </>
      );
    }
    if (name.includes('&')) {
      const [first, ...rest] = name.split('&');
      return (
        <>
          {first.trim()} &amp;{' '}
          <span className="font-serif italic font-normal text-[#e8c5b4]">
            {rest.join('&').trim()}
          </span>
        </>
      );
    }
    const words = name.split(' ');
    if (words.length > 1) {
      const firstPart = words.slice(0, -1).join(' ');
      const lastWord = words[words.length - 1];
      return (
        <>
          {firstPart}{' '}
          <span className="font-serif italic font-normal text-[#e8c5b4]">
            {lastWord}
          </span>
        </>
      );
    }
    return name;
  };

  return (
    <div className="relative w-full space-y-14 pb-24 text-neutral-200">
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div
        className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full blur-[160px] opacity-20"
        style={{ backgroundColor: accentColor }}
      />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        {track && (
          <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
            <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
              {track.slug}
            </span>
          </div>
        )}

        {/* Top Utility & Context Ribbon */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: accentColor }}
              />
            </span>
            <span style={{ color: accentColor }}>Competition Arena // Open Innovation</span>
            <span className="text-white/20">•</span>
            <span className="text-neutral-400">
              Squad: <strong className="text-white font-semibold">{team ? team.name : 'Unassigned'}</strong>
            </span>
            {track && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-[#e8c5b4] font-semibold">
                  [{track.slug.toUpperCase()}]
                </span>
              </>
            )}
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
              href="/dashboard/stages"
              className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage Roadmap</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Headline & Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-5 pb-9">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            {renderStylizedTrackTitle(track?.name)}
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
            {trackMeta ? trackMeta.manifesto : track?.description}
          </p>
        </div>

        {/* Full-Width 4-Column Editorial Section Index Bar */}
        <nav className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-white/[0.08] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
          {[
            { id: 'scope', num: '01', label: 'Open Domain Freedom' },
            { id: 'stack', num: '02', label: 'Recommended Stack' },
            { id: 'deliverables', num: '03', label: 'Required Deliverables' },
            { id: 'rubric', num: '04', label: 'Jury Rubric' },
          ].map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id as any)}
                className={`group relative py-3.5 px-4 flex items-center justify-between text-xs transition-all ${
                  isActive
                    ? 'text-white font-semibold bg-white/[0.02]'
                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-mono text-[10px] text-[#c19a88] font-bold">
                    {sec.num}
                  </span>
                  <span className="truncate">{sec.label}</span>
                </div>
                <ArrowUpRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    isActive
                      ? 'text-[#e8c5b4]'
                      : 'text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                  }`}
                />
                {isActive && (
                  <motion.span
                    layoutId="trackSectionUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4]"
                  />
                )}
              </a>
            );
          })}
        </nav>
      </header>

      {/* 2. Section 01: Open Problem Statement & Creative Autonomy */}
      <section id="scope" className="space-y-8 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              01 // Unrestricted Ideation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Versatile Ideas &amp;{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Open Domain Freedom
              </span>
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-light max-w-xs">
            Zero restrictive prompts — formulate any problem statement and pioneer your own domain.
          </p>
        </div>

        {/* Side-by-Side Architectural Pillars (Blended with Fine Hairlines, No Boxy Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
          {/* Pillar 01 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative pt-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                Pillar 01 • No Fixed Prompts
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Define Your Own Problem Statement
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Skaleathon does not box participants into narrow themes or pre-assigned prompts. The strongest engineering emerges when builders solve real-world challenges they genuinely care about — across any industry or an entirely new category.
            </p>
          </motion.div>

          {/* Pillar 02 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                Pillar 02 • Technical Alignment
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Powered by {track ? track.name : 'Your Selected Track'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              {trackMeta
                ? trackMeta.coreExpectation
                : 'Your domain is completely open—simply ensure the core technical execution aligns with your chosen competition track.'}{' '}
              Cross-disciplinary architectures blending multiple technologies are encouraged.
            </p>
          </motion.div>
        </div>

        {/* Open Domain Spectrum Index (Editorial Grid Line Stream) */}
        <div className="pt-6 border-t border-white/[0.06] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
              Inspiration Spectrum — Explore Any Vertical or Invent Your Own
            </span>
            <span className="text-[10px] font-mono text-[#c19a88]">
              Unrestricted Industry Choice
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 pt-1">
            {VERSATILE_EXAMPLE_DOMAINS.map((domain) => (
              <div
                key={domain.code}
                className={`group flex items-baseline gap-2.5 py-1.5 border-b transition-colors ${
                  domain.highlight
                    ? 'border-[#c19a88]/40 text-[#e8c5b4]'
                    : 'border-white/[0.05] hover:border-[#c19a88]/30 text-neutral-300 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-mono text-[#c19a88]/80 shrink-0">
                  {domain.code}
                </span>
                <span
                  className={`text-xs truncate ${
                    domain.highlight ? 'font-semibold text-[#e8c5b4]' : 'font-light'
                  }`}
                >
                  {domain.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section 02: Recommended Tech Toolkit */}
      {trackMeta && (
        <section id="stack" className="space-y-6 pt-10 border-t border-white/[0.08] scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                02 // Architectural Velocity
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Recommended Stacks &amp;{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Toolkits
                </span>
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>100% Freedom of Stack &amp; Cloud</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-3 border-t border-white/[0.06]">
            {trackMeta.suggestedStack.map((tech, idx) => (
              <div
                key={idx}
                className="group inline-flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200 hover:text-[#e8c5b4] transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] group-hover:scale-125 transition-transform" />
                <span className="font-mono">{tech}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Split Section: Official Deliverables (Left) & Jury Rubric (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/[0.08]">
        {/* Left 7 Cols: Deliverables Ledger */}
        <section id="deliverables" className="lg:col-span-7 space-y-5 scroll-mt-28">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
              03 // Milestone Artifacts
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Official Deliverable{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Guidelines
              </span>
            </h3>
          </div>

          <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
            {/* Item 01 */}
            <div className="py-4 flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-[#c19a88] pt-0.5">01</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Public GitHub Repository</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    • Mandatory
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Clean commit history authored during the sprint, with a comprehensive{' '}
                  <code className="text-[#e8c5b4] font-mono">README.md</code> detailing setup and system architecture.
                </p>
              </div>
            </div>

            {/* Item 02 */}
            <div className="py-4 flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-[#c19a88] pt-0.5">02</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Globe className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Live Production Prototype URL</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    • Mandatory
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Accessible cloud deployment (Vercel, Railway, Render, AWS, or APK/TestFlight build) ready for live jury verification.
                </p>
              </div>
            </div>

            {/* Item 03 */}
            <div className="py-4 flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-[#c19a88] pt-0.5">03</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Video className="h-3.5 w-3.5 text-[#c19a88]" />
                    <span>Video Demonstration Walkthrough</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#e8c5b4]">
                    • Optional Advantage
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  A 2–3 minute unlisted YouTube or Loom walkthrough demonstrating real-time execution and core technical highlights.
                </p>
              </div>
            </div>

            {/* Item 04 */}
            <div className="py-4 flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-white/30 pt-0.5">04</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <FileCode className="h-3.5 w-3.5 text-neutral-400" />
                    <span>AI Tool &amp; Model Disclosure</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    • Policy
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Transparent declaration in your repository README acknowledging LLMs, foundational models, or external APIs integrated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right 5 Cols: Jury Evaluation Rubric */}
        <section id="rubric" className="lg:col-span-5 space-y-5 scroll-mt-28">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
              04 // Scoring Weightage
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Jury Evaluation{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Rubric
              </span>
            </h3>
          </div>

          <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
            {[
              {
                title: 'Innovation & Originality',
                weight: '30%',
                width: 'w-[30%]',
                desc: 'Novelty of problem formulation, creative autonomy, and distinct edge over existing solutions.',
              },
              {
                title: 'Technical Architecture & Rigor',
                weight: '30%',
                width: 'w-[30%]',
                desc: 'System design depth, code quality, performance benchmarks, and production resilience.',
              },
              {
                title: 'Real-World Utility & Scale',
                weight: '20%',
                width: 'w-[20%]',
                desc: 'Practical viability, domain impact, and architectural scalability under load.',
              },
              {
                title: 'UX & Interface Craft',
                weight: '20%',
                width: 'w-[20%]',
                desc: 'Intuitive user flow, visual polish, responsiveness, and overall product execution.',
              },
            ].map((item, idx) => (
              <div key={idx} className="py-3.5 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#e8c5b4]">
                    {item.weight}
                  </span>
                </div>
                <div className="h-[2px] w-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] ${item.width}`}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
