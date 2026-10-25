'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Globe, Smartphone, ArrowRight, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { EventData, EventTrack } from '@/lib/db/types';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';
import RegistrationModal from '@/components/registration/RegistrationModal';
import { motion, AnimatePresence } from 'framer-motion';

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

  const indexItems = [
    ...tracks.map((t, idx) => ({
      id: t.id,
      num: `0${idx + 1}`,
      label: `${t.name} Arena`,
      href: `#${t.id}`,
    })),
    {
      id: 'all',
      num: '04',
      label: 'All Arenas View',
      href: '#all',
    },
  ];

  const displayedTracks = activeTab === 'all' 
    ? tracks 
    : tracks.filter((t) => t.id === activeTab);

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
              <span className="text-[#e8c5b4] font-semibold">[3 ARENAS]</span>
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
              Select an arena below to view evaluation benchmarks, expected deliverables, and recommended stacks.
            </p>
          </div>

          {/* Full-Width 4-Column Track Index Bar (Synchronized with Active Tab) */}
          <EditorialIndexBar
            layoutIdPrefix="publicTracksIndex"
            columns={4}
            activeId={activeTab}
            onSelectItem={(item) => {
              if (item.id) setActiveTab(item.id);
            }}
            items={indexItems}
          />
        </header>

        {/* 2. Standalone Distinct Arena Cards */}
        <div className="space-y-6 sm:space-y-8">
          {/* Section Indicator */}
          <div className="flex items-center justify-between pt-1 pb-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
                {activeTab === 'all' ? 'All Competition Arenas' : 'Selected Arena Specification'}
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="hidden sm:inline text-xs text-neutral-400 font-light">
                {activeTab === 'all' ? 'Viewing all 3 tracks' : 'Filtered to active arena'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              {activeTab !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="text-[#c19a88] hover:underline cursor-pointer"
                >
                  View All Arenas
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-6 sm:space-y-8"
            >
              {displayedTracks.map((track) => {
                const trackIdx = tracks.findIndex((t) => t.id === track.id);
                const Icon = iconMap[track.id] || Bot;
                const extra = details[track.id] || { deliverables: [], recommendedTech: [] };
                const num = String(trackIdx + 1).padStart(2, '0');

                // Next/Previous track helpers
                const prevTrack = trackIdx > 0 ? tracks[trackIdx - 1] : null;
                const nextTrack = trackIdx < tracks.length - 1 ? tracks[trackIdx + 1] : null;

                return (
                  <article
                    id={track.id}
                    key={track.id}
                    className="relative rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(17,14,13,0.96))] p-4 sm:p-6 lg:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/60 hover:shadow-[0_0_30px_rgba(193,154,136,0.12)] scroll-mt-24 overflow-hidden"
                  >
                    {/* Subtle top corner ambient glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c19a88]/10 blur-[70px]" />

                    {/* Faint Architectural Arena Watermark inside the card */}
                    <div className="pointer-events-none select-none absolute right-4 top-2 hidden sm:block overflow-hidden">
                      <span className="font-mono text-[72px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
                        ARENA {num}
                      </span>
                    </div>

                    {/* Card Header: Distinct Number Badge, Title, and Action */}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#e8c5b4] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] animate-pulse" />
                          <span>Arena {num} of 03</span>
                          <span className="text-white/30">•</span>
                          <span className="text-white font-bold">[{track.slug.toUpperCase()}]</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#c19a88]/20 to-[#805948]/10 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0 shadow-inner">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                              {track.name} <span className="font-serif italic font-normal text-[#e8c5b4] text-lg sm:text-xl lg:text-2xl">Arena</span>
                            </h2>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-[#e8c5b4]/80 font-mono">
                              Open Innovation Arena • Self-Defined Problem Statement
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenRegistration(track.id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(128,89,72,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <span>Register for this Arena (₹{event.registration_fee_inr})</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mission Directive */}
                    <div className="relative z-10 py-3.5">
                      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3.5 sm:p-4 text-xs sm:text-sm text-neutral-200/90 font-light leading-relaxed">
                        <span className="text-[#c19a88] font-mono text-[10px] uppercase tracking-wider block mb-0.5 font-semibold">
                          Mission Directive:
                        </span>
                        {track.description}
                      </div>
                    </div>

                    {/* Side-by-Side Architectural Sub-Panels */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Sub-Card 1: Expected Deliverables */}
                      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3.5 sm:p-4 space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                          <div className="flex items-center gap-1.5">
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
                          <div className="flex items-center gap-1.5">
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

                    {/* Arena Step Switcher Controls at Bottom of Card */}
                    {activeTab !== 'all' && (
                      <div className="relative z-10 mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        {prevTrack ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab(prevTrack.id)}
                            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="h-3.5 w-3.5 text-[#c19a88]" />
                            <span>Previous: {prevTrack.name}</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {nextTrack ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab(nextTrack.id)}
                            className="inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold cursor-pointer"
                          >
                            <span>Next: {nextTrack.name} Arena</span>
                            <ChevronRight className="h-3.5 w-3.5 text-[#c19a88]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className="inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold cursor-pointer"
                          >
                            <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
                            <span>Compare All 3 Arenas</span>
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>
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
