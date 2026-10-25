'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Code2,
  Check,
  Cpu,
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
}: TrackScrollJourneyProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('scope');

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full space-y-8 pb-20 text-neutral-200">
      <div className="experience-bento-mask pointer-events-none absolute inset-x-0 -top-10 h-[34rem] opacity-[0.08]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-full max-w-5xl -translate-x-1/2 rounded-full bg-white/[0.06] blur-[160px]" />

      {/* 1. Header & Context */}
      <header className="relative space-y-6 pt-2 sm:pt-4">
        <div className="experience-glass-panel flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold uppercase tracking-wider text-white/55">
              Assigned Problem Arena
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white font-semibold">{track ? track.name : 'Open Arena'}</span>
            <span className="text-white/20">•</span>
            <span className="font-semibold text-white/75">
              Squad: {team ? team.name : 'Your Team'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-white/60" />
              <span>Back to Overview</span>
            </Link>
            <span className="text-white/15">|</span>
            <Link
              href="/dashboard/stages"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-white/60" />
              <span>Stage Roadmap</span>
              <ArrowRight className="h-3 w-3 text-white/60" />
            </Link>
          </div>
        </div>

        {/* Page Title & Scope Manifesto */}
        <div className="max-w-4xl space-y-4 py-3 sm:py-6">
          <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
            Competition track / Technical brief
          </span>
          <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {track ? track.name : 'Engineering'} <br />
            <span className="experience-text-outline">Specifications</span>
          </h1>
          <p className="max-w-3xl text-sm font-normal leading-relaxed text-white/55 sm:text-base">
            {trackMeta ? trackMeta.manifesto : track?.description}
          </p>

          {/* Quick Attribute Pills */}
          <div className="grid grid-cols-1 gap-2.5 pt-2 text-xs sm:flex sm:flex-wrap sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 font-medium text-white/65 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 text-white/70" />
              <span>Problem Statement: <strong className="text-white">100% Self-Defined</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 font-medium text-white/65 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span>Domain Choice: <strong className="text-white">Any Real-World Industry</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 font-medium text-white/65 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Squad Format: <strong className="text-white">1 to 6 Members</strong></span>
            </div>
          </div>
        </div>

        {/* Fast Navigation Tabs */}
        <div className="relative z-30 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/75 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl sm:sticky sm:top-[8.5rem] sm:flex sm:items-center sm:overflow-x-auto">
          {[
            { id: 'scope' as SectionId, label: 'Open Domain Scope' },
            { id: 'stack' as SectionId, label: 'Recommended Tech Stacks' },
            { id: 'deliverables' as SectionId, label: 'Official Deliverables' },
            { id: 'rubric' as SectionId, label: 'Jury Evaluation Rubric' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`min-h-11 cursor-pointer rounded-xl border px-3 py-2.5 text-center text-[11px] font-semibold leading-4 transition-all sm:whitespace-nowrap sm:px-4 sm:text-xs ${
                activeSection === item.id
                  ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                  : 'border-transparent bg-transparent text-white/50 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Elevated Cards for Each Section */}
      <div className="space-y-8">
        {/* Section 01: Open Domain Scope */}
        <section
          id="scope"
          className="experience-glass-panel scroll-mt-52 space-y-7 p-5 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
                01 // UNRESTRICTED IDEATION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Versatile Ideas &amp; <span className="text-white/55">Open Domain Freedom</span>
              </h2>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white/55">
              Zero Restrictive Prompts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/45">
                <Compass className="h-4 w-4" />
                <span>Pillar 01 • Define Your Own Problem Statement</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Solve a Problem You Genuinely Care About
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                Skaleathon does not force narrow themes. The strongest engineering happens when squads tackle real-world pain points across any vertical—from healthcare and finance to developer tools or climate tech.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/45">
                <Cpu className="h-4 w-4" />
                <span>Pillar 02 • Technical Core Alignment</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Powered by {track ? track.name : 'Your Track'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                {trackMeta
                  ? trackMeta.coreExpectation
                  : 'Your problem domain is 100% open—simply ensure the core technical execution aligns with your chosen competition arena.'}
              </p>
            </div>
          </div>

          {/* Inspiration Domain Spectrum */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                Example Domain Spectrum (Choose One or Pioneer Your Own)
              </span>
              <span className="font-mono text-xs text-white/35">12+ Example Verticals</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {VERSATILE_EXAMPLE_DOMAINS.map((domain) => (
                <div
                  key={domain.code}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${
                    domain.highlight
                      ? 'border-white/30 bg-white/[0.09] text-white font-bold'
                      : 'border-white/[0.08] bg-white/[0.03] text-neutral-200 hover:border-white/20'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold text-white/40">{domain.code}</span>
                  <span className="truncate">{domain.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 02: Recommended Tech Toolkit */}
        {trackMeta && (
          <section
            id="stack"
            className="experience-glass-panel scroll-mt-52 space-y-7 p-5 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
                  02 // ARCHITECTURAL VELOCITY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Recommended Stacks &amp; <span className="text-white/55">Toolkits</span>
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>100% Freedom of Language &amp; Cloud</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {trackMeta.suggestedStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5 text-center transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.055]"
                >
                  <Code2 className="h-4 w-4 text-white/55" />
                  <span className="text-xs font-semibold text-white font-mono">{tech}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 03 & 04: Deliverables & Rubric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 Cols: Deliverables Card */}
          <section
            id="deliverables"
            className="experience-glass-panel scroll-mt-52 space-y-6 p-5 sm:p-8 lg:col-span-7"
          >
            <div className="space-y-1 pb-4 border-b border-white/[0.08]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
                03 // MILESTONE DELIVERABLES
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Required Project <span className="text-white/55">Artifacts</span>
              </h3>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  icon: GitBranch,
                  title: 'Public GitHub Repository',
                  tag: 'Mandatory',
                  desc: 'Clean commit history authored during the sprint, with a comprehensive README.md detailing setup, environment variables, and system architecture.',
                },
                {
                  icon: Globe,
                  title: 'Live Production URL',
                  tag: 'Mandatory',
                  desc: 'Accessible cloud deployment (Vercel, Railway, Render, AWS, or APK build) ready for real-time judge testing and performance checks.',
                },
                {
                  icon: Video,
                  title: 'Video Demo Walkthrough',
                  tag: 'Optional Advantage',
                  desc: 'A 2–3 minute Loom or unlisted YouTube video demonstrating the live app features and solving the core use cases.',
                },
                {
                  icon: FileCode,
                  title: 'Architecture & Tech Disclosure',
                  tag: 'Policy',
                  desc: 'Clear disclosure of any third-party APIs, foundational LLMs, or pre-existing datasets integrated into your project.',
                },
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:bg-white/[0.045]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <ItemIcon className="h-4 w-4 text-white/55" />
                        <span>{item.title}</span>
                      </div>
                      <span className="rounded-full bg-white/[0.07] px-2 py-0.5 font-mono text-[11px] font-semibold text-white/55">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right 5 Cols: Jury Rubric Card */}
          <section
            id="rubric"
            className="experience-glass-panel scroll-mt-52 space-y-6 p-5 sm:p-8 lg:col-span-5"
          >
            <div className="space-y-1 pb-4 border-b border-white/[0.08]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
                04 // SCORING WEIGHTAGE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Jury Evaluation <span className="text-white/55">Rubric</span>
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Innovation & Originality', weight: '25%', desc: 'Novelty of problem formulation and distinct edge.' },
                { title: 'Technical Implementation', weight: '25%', desc: 'Code quality, architecture resilience, and security.' },
                { title: 'Problem Relevance & Impact', weight: '20%', desc: 'Practical utility and real-world domain viability.' },
                { title: 'Usability & Design', weight: '15%', desc: 'User experience polish, responsiveness, and flow.' },
                { title: 'Presentation & Documentation', weight: '15%', desc: 'Clear demo, documentation, and live defense clarity.' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-white">{item.title}</span>
                    <span className="font-mono text-white/55">{item.weight}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/80"
                      style={{ width: item.weight }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
