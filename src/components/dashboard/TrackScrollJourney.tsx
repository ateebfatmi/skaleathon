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

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              Assigned Problem Arena
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white font-semibold">{track ? track.name : 'Open Arena'}</span>
            <span className="text-white/20">•</span>
            <span className="text-[#e8c5b4] font-semibold">
              Squad: {team ? team.name : 'Your Team'}
            </span>
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
              href="/dashboard/stages"
              className="inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage Roadmap</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88]" />
            </Link>
          </div>
        </div>

        {/* Page Title & Scope Manifesto */}
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {track ? track.name : 'Engineering'}{' '}
            <span className="text-[#c19a88]">Specifications</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-200 font-normal leading-relaxed">
            {trackMeta ? trackMeta.manifesto : track?.description}
          </p>

          {/* Quick Attribute Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#141211] text-neutral-200 font-medium">
              <Compass className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Problem Statement: <strong className="text-white">100% Self-Defined</strong></span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#141211] text-neutral-200 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#e8c5b4]" />
              <span>Domain Choice: <strong className="text-white">Any Real-World Industry</strong></span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#141211] text-neutral-200 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Squad Format: <strong className="text-white">1 to 6 Members</strong></span>
            </div>
          </div>
        </div>

        {/* Fast Navigation Tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeSection === item.id
                  ? 'bg-[#c19a88]/20 border-[#c19a88] text-white shadow-md'
                  : 'bg-[#141211] border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
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
          className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                01 // UNRESTRICTED IDEATION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Versatile Ideas &amp; <span className="text-[#c19a88]">Open Domain Freedom</span>
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
              Zero Restrictive Prompts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#c19a88] font-bold text-xs uppercase tracking-wider">
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

            <div className="rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#e8c5b4] font-bold text-xs uppercase tracking-wider">
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
              <span className="text-xs text-[#c19a88] font-mono">12+ Example Verticals</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {VERSATILE_EXAMPLE_DOMAINS.map((domain) => (
                <div
                  key={domain.code}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${
                    domain.highlight
                      ? 'border-[#c19a88]/60 bg-[#c19a88]/15 text-[#e8c5b4] font-bold'
                      : 'border-white/[0.08] bg-white/[0.03] text-neutral-200 hover:border-white/20'
                  }`}
                >
                  <span className="font-mono text-[#c19a88] text-[11px] font-bold">{domain.code}</span>
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
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                  02 // ARCHITECTURAL VELOCITY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Recommended Stacks &amp; <span className="text-[#c19a88]">Toolkits</span>
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
                  className="p-3.5 rounded-xl border border-white/[0.08] bg-[#1a1715]/70 hover:border-[#c19a88]/40 transition-all flex flex-col items-center justify-center text-center gap-1.5"
                >
                  <Code2 className="h-4 w-4 text-[#c19a88]" />
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
            className="lg:col-span-7 scroll-mt-28 rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="space-y-1 pb-4 border-b border-white/[0.08]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                03 // MILESTONE DELIVERABLES
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Required Project <span className="text-[#c19a88]">Artifacts</span>
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
                    className="p-4 rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <ItemIcon className="h-4 w-4 text-[#c19a88]" />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-[#e8c5b4]">
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
            className="lg:col-span-5 scroll-mt-28 rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="space-y-1 pb-4 border-b border-white/[0.08]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                04 // SCORING WEIGHTAGE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Jury Evaluation <span className="text-[#c19a88]">Rubric</span>
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
                <div key={idx} className="p-3.5 rounded-xl border border-white/[0.08] bg-[#1a1715]/70 space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-white">{item.title}</span>
                    <span className="font-mono text-[#e8c5b4]">{item.weight}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88]"
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
