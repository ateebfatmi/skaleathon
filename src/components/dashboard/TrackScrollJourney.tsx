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
  CheckCircle2,
} from 'lucide-react';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';

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

type SectionId = 'scope' | 'stack' | 'deliverables' | 'rubric';

export default function TrackScrollJourney({
  track,
  team,
  trackMeta,
  accentColor: rawAccent,
}: TrackScrollJourneyProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('scope');
  const [pulseCount, setPulseCount] = useState<Record<SectionId, number>>({
    scope: 0,
    stack: 0,
    deliverables: 0,
    rubric: 0,
  });

  // Normalize color to SkaleKraft warm copper / champagne palette
  const isOddColor =
    !rawAccent ||
    rawAccent.toLowerCase().startsWith('#8b') ||
    rawAccent.toLowerCase().startsWith('#63') ||
    rawAccent.toLowerCase().includes('purple');
  const accentColor = isOddColor ? '#c19a88' : rawAccent;

  const handleSectionSelect = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();
    setActiveSection(id);
    setPulseCount((prev) => ({ ...prev, [id]: prev[id] + 1 }));

    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
        <div className="mobile-utility-row relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
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
        <div className="relative z-10 max-w-3xl space-y-5 pb-6">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            {renderStylizedTrackTitle(track?.name)}
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
            {trackMeta ? trackMeta.manifesto : track?.description}
          </p>

          {/* Spec Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-400">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <Compass className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>
                Problem Statement: <strong className="text-white">100% Open &amp; Self-Defined</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <Sparkles className="h-3.5 w-3.5 text-[#e8c5b4]" />
              <span>
                Domain Choice: <strong className="text-white">Any Industry or Custom Domain</strong>
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

        {/* Full-Width 4-Column Editorial Section Index Bar with Transition */}
        <div className="mt-5">
          <EditorialIndexBar
            layoutIdPrefix="trackSpecIndex"
            activeId={activeSection}
            onSelectItem={(item) => {
              if (item.id) {
                const secId = item.id as SectionId;
                setActiveSection(secId);
                setPulseCount((prev) => ({ ...prev, [secId]: prev[secId] + 1 }));
              }
            }}
            items={[
              { id: 'scope', num: '01', label: 'Open Domain Freedom', href: '#scope' },
              { id: 'stack', num: '02', label: 'Recommended Stack', href: '#stack' },
              { id: 'deliverables', num: '03', label: 'Required Deliverables', href: '#deliverables' },
              { id: 'rubric', num: '04', label: 'Jury Rubric', href: '#rubric' },
            ]}
          />
        </div>
      </header>

      {/* 2. Section 01: Open Problem Statement & Creative Autonomy */}
      <motion.section
        id="scope"
        key={`scope-${pulseCount.scope}`}
        initial={{ opacity: 0.65, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`relative space-y-8 scroll-mt-28 rounded-2xl transition-all duration-500 ${
          activeSection === 'scope' && pulseCount.scope > 0
            ? 'ring-1 ring-[#c19a88]/30 bg-gradient-to-b from-[#c19a88]/[0.04] to-transparent p-5 -mx-5'
            : ''
        }`}
      >
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

        {/* Side-by-Side Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
          {/* Pillar 01 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
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

        {/* Open Domain Spectrum Index */}
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
            {VERSATILE_EXAMPLE_DOMAINS.map((domain, idx) => (
              <motion.div
                key={domain.code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.025 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. Section 02: Recommended Tech Toolkit */}
      {trackMeta && (
        <motion.section
          id="stack"
          key={`stack-${pulseCount.stack}`}
          initial={{ opacity: 0.65, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`space-y-6 pt-10 border-t border-white/[0.08] scroll-mt-28 rounded-2xl transition-all duration-500 ${
            activeSection === 'stack'
              ? 'ring-1 ring-[#c19a88]/30 bg-gradient-to-b from-[#c19a88]/[0.04] to-transparent p-5 -mx-5'
              : ''
          }`}
        >
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
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group inline-flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200 hover:text-[#e8c5b4] transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] group-hover:scale-125 transition-transform" />
                <span className="font-mono">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 4. Split Section: Official Deliverables (Left) & Jury Rubric (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/[0.08]">
        {/* Left 7 Cols: Deliverables Ledger */}
        <motion.section
          id="deliverables"
          key={`deliverables-${pulseCount.deliverables}`}
          initial={{ opacity: 0.65, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-7 space-y-5 scroll-mt-28 rounded-2xl transition-all duration-500 ${
            activeSection === 'deliverables'
              ? 'ring-1 ring-[#c19a88]/35 bg-gradient-to-b from-[#c19a88]/[0.05] to-transparent p-5 -m-5'
              : ''
          }`}
        >
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
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.04 }}
              className="py-4 flex items-start gap-4"
            >
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
            </motion.div>

            {/* Item 02 */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="py-4 flex items-start gap-4"
            >
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
            </motion.div>

            {/* Item 03 */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="py-4 flex items-start gap-4"
            >
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
            </motion.div>

            {/* Item 04 */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.22 }}
              className="py-4 flex items-start gap-4"
            >
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
            </motion.div>
          </div>
        </motion.section>

        {/* Right 5 Cols: Jury Evaluation Rubric */}
        <motion.section
          id="rubric"
          key={`rubric-${pulseCount.rubric}`}
          initial={{ opacity: 0.65, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-5 space-y-5 scroll-mt-28 rounded-2xl transition-all duration-500 ${
            activeSection === 'rubric'
              ? 'ring-1 ring-[#c19a88]/35 bg-gradient-to-b from-[#c19a88]/[0.05] to-transparent p-5 -m-5'
              : ''
          }`}
        >
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
                targetWidth: '30%',
                desc: 'Novelty of problem formulation, creative autonomy, and distinct edge over existing solutions.',
              },
              {
                title: 'Technical Architecture & Rigor',
                weight: '30%',
                targetWidth: '30%',
                desc: 'System design depth, code quality, performance benchmarks, and production resilience.',
              },
              {
                title: 'Real-World Utility & Scale',
                weight: '20%',
                targetWidth: '20%',
                desc: 'Practical viability, domain impact, and architectural scalability under load.',
              },
              {
                title: 'UX & Interface Craft',
                weight: '20%',
                targetWidth: '20%',
                desc: 'Intuitive user flow, visual polish, responsiveness, and overall product execution.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="py-3.5 space-y-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#e8c5b4]">
                    {item.weight}
                  </span>
                </div>
                <div className="h-[2px] w-full bg-white/[0.06] overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.targetWidth }}
                    transition={{ duration: 0.65, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4]"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
