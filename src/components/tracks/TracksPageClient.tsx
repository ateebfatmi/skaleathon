'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Globe, Smartphone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { EventData, EventTrack } from '@/lib/db/types';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';
import RegistrationModal from '@/components/registration/RegistrationModal';

interface TracksPageClientProps {
  tracks: EventTrack[];
  event: EventData;
}

export default function TracksPageClient({ tracks, event }: TracksPageClientProps) {
  const [activeTab, setActiveTab] = useState<string>('track-ai-ml');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const handleOpenRegistration = (trackId: string) => {
    setSelectedTrackId(trackId);
  };

  const details: Record<string, { deliverables: string[]; recommendedTech: string[] }> = {
    'track-ai-ml': {
      deliverables: [
        'End-to-end trained model, fine-tuned agent, or LLM-powered autonomous workflow',
        'Model inference pipeline, API endpoints, or polished user interface',
        'Evaluation benchmarks, system prompt architecture, and failure resilience disclosures',
      ],
      recommendedTech: ['Python', 'PyTorch', 'Hugging Face', 'LangChain / LlamaIndex', 'FastAPI', 'Next.js'],
    },
    'track-web-dev': {
      deliverables: [
        'Full-stack responsive web application with resilient database persistence',
        'Type-safe REST / GraphQL APIs, role-based authorization, and secure session management',
        'Live deployed production URL and end-to-end test verification',
      ],
      recommendedTech: ['Next.js / React', 'Node.js / Go', 'PostgreSQL / Supabase', 'Tailwind CSS', 'TypeScript', 'Docker'],
    },
    'track-app-dev': {
      deliverables: [
        'Native iOS/Android or cross-platform mobile application build',
        'Offline-first synchronization architecture and tactile mobile-first UI patterns',
        'Working demo build (APK/TestFlight or screencast walkthrough video)',
      ],
      recommendedTech: ['React Native / Expo', 'Flutter', 'Swift / Kotlin', 'Supabase / Firebase', 'Tailwind'],
    },
  };

  const iconMap: Record<string, any> = {
    'track-ai-ml': Bot,
    'track-web-dev': Globe,
    'track-app-dev': Smartphone,
  };

  return (
    <>
      <div className="relative w-full space-y-7 pb-16 text-neutral-200">
        {/* Subtle Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#c19a88]/12 blur-[140px]" />
        <div className="pointer-events-none absolute top-40 -left-20 h-60 w-60 rounded-full bg-[#805948]/10 blur-[120px]" />

        {/* 1. Open Luxury Editorial Hero */}
        <header className="relative pt-1">
          {/* Top Utility & Context Ribbon */}
          <div className="mobile-utility-row relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-white/[0.07]">
            <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
              </span>
              <span className="text-[#c19a88]">Curated Arenas // Open Innovation</span>
              <span className="text-white/20">•</span>
              <span className="text-neutral-400">
                Scope: <strong className="text-white font-semibold">100% Self-Defined Problem Statement</strong>
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[#e8c5b4] font-semibold">[3 DISTINCT TRACKS]</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/prizes"
                className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium text-[11px]"
              >
                <span>Prizes (₹{event.prize_pool_inr.toLocaleString('en-IN')})</span>
              </Link>
              <span className="text-white/15">|</span>
              <Link
                href="/rules"
                className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold text-[11px]"
              >
                <span>Tournament Rules</span>
                <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Editorial Headline & Manifesto */}
          <div className="relative z-10 max-w-2xl space-y-2 pb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-white tracking-tight leading-[1.1]">
              Competition <span className="text-[#c19a88]">Tracks</span>
            </h1>

            <p className="border-l-2 border-[#c19a88]/45 pl-3 text-xs sm:text-[13px] text-neutral-300/85 leading-relaxed font-light">
              Skaleathon features three specialized engineering disciplines. Each arena is evaluated independently by domain experts. Choose your track below to view expectations and recommended technologies.
            </p>
          </div>

          {/* Full-Width 3-Column Editorial Track Index Bar */}
          <EditorialIndexBar
            layoutIdPrefix="publicTracksIndex"
            columns={3}
            activeId={activeTab}
            onSelectItem={(item) => {
              if (item.id) setActiveTab(item.id);
            }}
            items={tracks.map((t, idx) => ({
              id: t.id,
              num: `0${idx + 1}`,
              label: t.name,
              href: `#${t.id}`,
            }))}
          />
        </header>

        {/* 2. Standalone Distinct Track Cards */}
        <div className="space-y-6 sm:space-y-8">
          {tracks.map((track, idx) => {
            const Icon = iconMap[track.id] || Bot;
            const extra = details[track.id] || { deliverables: [], recommendedTech: [] };
            const num = String(idx + 1).padStart(2, '0');

            return (
              <article
                id={track.id}
                key={track.id}
                className="relative rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(17,14,13,0.96))] p-4 sm:p-6 lg:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/60 hover:shadow-[0_0_30px_rgba(193,154,136,0.12)] scroll-mt-24 overflow-hidden"
              >
                {/* Subtle top corner ambient glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c19a88]/10 blur-[70px]" />

                {/* Card Header: Distinct Number Badge, Title, and Action */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#e8c5b4] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] animate-pulse" />
                      <span>Track {num} of 03</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white font-bold">[{track.slug.toUpperCase()}]</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-[#c19a88]/20 to-[#805948]/10 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0 shadow-inner">
                        <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                          {track.name}
                        </h2>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-[#e8c5b4]/80 font-mono">
                          Open Innovation Arena • Self-Defined Problem Statement
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenRegistration(track.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-4.5 py-2 sm:px-5 sm:py-2.5 text-xs font-semibold text-white shadow-[0_3px_18px_rgba(128,89,72,0.3)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                    >
                      <span>Register for this Arena (₹{event.registration_fee_inr})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mission Directive */}
                <div className="relative z-10 py-3">
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 sm:p-3.5 text-xs sm:text-[13px] text-neutral-200/90 font-light leading-relaxed">
                    <span className="text-[#c19a88] font-mono text-[10px] uppercase tracking-wider block mb-0.5 font-semibold">
                      Mission Directive:
                    </span>
                    {track.description}
                  </div>
                </div>

                {/* Side-by-Side Architectural Sub-Panels */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pt-0.5">
                  {/* Sub-Card 1: Expected Deliverables */}
                  <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88]" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c19a88] font-bold">
                          Expected Deliverables
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-white/40">Evaluation Requirements</span>
                    </div>
                    <div className="space-y-2">
                      {extra.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-neutral-300 font-light leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-Card 2: Recommended Tech Stack */}
                  <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-[#e8c5b4]" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e8c5b4] font-bold">
                          Recommended Stack
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-white/40">100% Stack-Agnostic</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light">
                      Use any framework or library of your choice. Popular choices for this arena include:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {extra.recommendedTech.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] font-mono text-neutral-200 hover:border-[#c19a88]/40 transition-colors"
                        >
                          <span className="h-1 w-1 rounded-full bg-[#c19a88]" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <RegistrationModal
        isOpen={selectedTrackId !== null}
        onClose={() => setSelectedTrackId(null)}
        tracks={tracks}
        event={event}
        selectedTrackId={selectedTrackId ?? undefined}
      />
    </>
  );
}
