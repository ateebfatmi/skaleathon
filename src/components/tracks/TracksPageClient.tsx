'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Globe, Smartphone, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { EventTrack } from '@/lib/db/types';
import RegistrationModal from '@/components/registration/RegistrationModal';
import { motion } from 'framer-motion';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';

interface TracksPageClientProps {
  tracks: EventTrack[];
}

export default function TracksPageClient({ tracks }: TracksPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-ai-ml');
  const [activeTab, setActiveTab] = useState<string>('track-ai-ml');

  const handleOpenRegistration = (trackId: string) => {
    setSelectedTrackId(trackId);
    setModalOpen(true);
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
      <div className="relative w-full space-y-14 pb-24 text-neutral-200">
        {/* Subtle Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
        <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

        {/* 1. Open Luxury Editorial Hero */}
        <header className="relative pt-1">
          {/* Faint Oversized Architectural Watermark */}
          <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
            <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
              ARENAS
            </span>
          </div>

          {/* Top Utility & Context Ribbon */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
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

            <div className="flex items-center gap-5 text-xs">
              <Link
                href="/prizes"
                className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
              >
                <span>Prizes (₹35,000)</span>
              </Link>
              <span className="text-white/15">|</span>
              <Link
                href="/rules"
                className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
              >
                <span>Tournament Rules</span>
                <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Editorial Headline & Manifesto */}
          <div className="relative z-10 max-w-3xl space-y-5 pb-9">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
              Competition{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Tracks
              </span>
            </h1>

            <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
              Skaleathon features three specialized technology arenas with complete open-domain freedom. There are no fixed themes—your squad is free to formulate any problem statement and build for any industry.
            </p>
          </div>

          {/* Full-Width 3-Column Editorial Track Index Bar with Transition */}
          <EditorialIndexBar
            layoutIdPrefix="publicTracksIndex"
            columns={3}
            activeId={activeTab}
            onSelectItem={(item) => {
              if (item.id) setActiveTab(item.id);
            }}
            items={tracks.map((t, idx) => ({
              id: t.id,
              num: String(idx + 1).padStart(2, '0'),
              label: t.name,
              href: `#${t.id}`,
            }))}
          />
        </header>

        {/* 2. Open Track Sections (Blended into Background, No Boxy Cards) */}
        <div className="space-y-16">
          {tracks.map((track, idx) => {
            const Icon = iconMap[track.id] || Bot;
            const extra = details[track.id] || { deliverables: [], recommendedTech: [] };
            const num = String(idx + 1).padStart(2, '0');

            return (
              <section
                id={track.id}
                key={track.id}
                className={`space-y-8 scroll-mt-28 ${
                  idx > 0 ? 'pt-12 border-t border-white/[0.08]' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
                      {num} {'//'} Arena Specification • [{track.slug.toUpperCase()}]
                    </span>
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#c19a88] shrink-0" />
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {track.name.includes('&') ? (
                          <>
                            {track.name.split('&')[0].trim()} &amp;{' '}
                            <span className="font-serif italic font-normal text-[#e8c5b4]">
                              {track.name.split('&')[1].trim()}
                            </span>
                          </>
                        ) : (
                          <>
                            {track.name.split(' ').slice(0, -1).join(' ')}{' '}
                            <span className="font-serif italic font-normal text-[#e8c5b4]">
                              {track.name.split(' ').slice(-1)}
                            </span>
                          </>
                        )}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenRegistration(track.id)}
                    className="w-fit inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-6 py-2.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(128,89,72,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>Register Squad (₹99)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="border-l-2 border-[#c19a88]/40 pl-4 text-sm text-neutral-300 font-light leading-relaxed max-w-3xl">
                  {track.description}
                </p>

                {/* Side-by-Side Architectural Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
                  {/* Pillar 01: Expected Deliverables */}
                  <div className="relative pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                        Pillar 01 • Expected Deliverables
                      </span>
                      <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
                    </div>
                    <div className="space-y-2.5 pt-1">
                      {extra.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-light">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] shrink-0 mt-2" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pillar 02: Recommended Stack */}
                  <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                        Pillar 02 • Recommended Stack
                      </span>
                      <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light">
                      100% stack-agnostic—use any framework or library of your choice. Popular choices for this arena include:
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-1">
                      {extra.recommendedTech.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-200"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tracks={tracks}
        selectedTrackId={selectedTrackId}
      />
    </>
  );
}
