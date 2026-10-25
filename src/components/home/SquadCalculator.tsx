'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Briefcase,
  Award,
  Zap,
} from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';
import type { EventData, EventTrack } from '@/lib/db/types';
import RegistrationModal from '@/components/registration/RegistrationModal';

interface SquadCalculatorProps {
  event: EventData;
  tracks?: EventTrack[];
}

const DEFAULT_TRACKS: EventTrack[] = [
  {
    id: 'track-ai-ml',
    event_id: 'skaleathon-2027',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Build autonomous agents, predictive pipelines, and LLM-powered applications.',
    color_accent: '#c19a88',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'track-web-dev',
    event_id: 'skaleathon-2027',
    name: 'Web Development',
    slug: 'web-dev',
    description: 'Architect scalable full-stack applications with high-throughput backend APIs.',
    color_accent: '#38bdf8',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'track-app-dev',
    event_id: 'skaleathon-2027',
    name: 'App Development',
    slug: 'app-dev',
    description: 'Craft high-performance native or cross-platform mobile apps for iOS & Android.',
    color_accent: '#34d399',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

const TRACK_ICONS: Record<string, React.ElementType> = {
  'track-ai-ml': Bot,
  'track-web-dev': Globe,
  'track-app-dev': Smartphone,
};

const TRACK_STACKS: Record<string, string[]> = {
  'track-ai-ml': ['PyTorch', 'LangChain', 'Hugging Face', 'FastAPI'],
  'track-web-dev': ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Tailwind'],
  'track-app-dev': ['Flutter', 'React Native', 'Offline-First', 'Supabase'],
};

export default function SquadCalculator({ event, tracks = DEFAULT_TRACKS }: SquadCalculatorProps) {
  const availableTracks = tracks && tracks.length > 0 ? tracks : DEFAULT_TRACKS;
  const [selectedTrackId, setSelectedTrackId] = useState<string>(availableTracks[0]?.id || 'track-ai-ml');
  const [squadSize, setSquadSize] = useState<number>(4);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const flatFee = event.registration_fee_inr || 99;
  const firstPrize = event.first_prize_inr || 20000;
  const prizePool = event.prize_pool_inr || 35000;

  const costPerBuilder = Math.round(flatFee / squadSize);
  const selectedTrack = availableTracks.find((t) => t.id === selectedTrackId) || availableTracks[0];
  const Icon = TRACK_ICONS[selectedTrack.id] || Bot;
  const stack = TRACK_STACKS[selectedTrack.id] || ['Full-Stack', 'APIs'];

  const roiMultiplier = Math.round(firstPrize / flatFee);

  const squadOptions = [
    { size: 1, label: 'Solo Builder', desc: 'Full ownership' },
    { size: 2, label: 'Duo Squad', desc: 'Partner synergy' },
    { size: 3, label: 'Trio Squad', desc: 'Cross-functional' },
    { size: 4, label: 'Full Squad (4)', desc: 'Max firepower' },
  ];

  return (
    <section className="relative w-full max-w-4xl mx-auto rounded-3xl border border-white/[0.12] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(15,13,12,0.96))] p-5 sm:p-8 lg:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden text-left">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c19a88]/12 blur-[100px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#805948]/12 blur-[100px]" />

      <div className="relative z-10 space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#e8c5b4] text-[10px] font-mono uppercase tracking-[0.22em] font-semibold">
              <Zap className="h-3 w-3 text-[#c19a88]" />
              <span>Squad ROI & Value Calculator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Calculate your return on <span className="text-[#c19a88]">innovation</span>.
            </h3>
            <p className="text-xs text-white/55 font-light">
              One flat ₹{flatFee} fee covers your entire squad (1–{event.max_team_size || 4} builders). No hidden per-seat costs.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-right self-start sm:self-auto shrink-0">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Total Prize Pool</div>
              <div className="text-sm font-bold text-[#e8c5b4]">₹{prizePool.toLocaleString('en-IN')}</div>
            </div>
            <Trophy className="h-4 w-4 text-[#c19a88] ml-1" />
          </div>
        </div>

        {/* Step 1: Select Arena */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/50 font-medium">
              1. Select Arena Track
            </span>
            <span className="text-[11px] text-[#e8c5b4]/80 font-mono">
              Open Innovation • Self-Defined Topic
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {availableTracks.map((track) => {
              const TrackIcon = TRACK_ICONS[track.id] || Bot;
              const isSelected = track.id === selectedTrackId;

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    cyberAudio.playHover();
                  }}
                  className={`group relative flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'border-[#c19a88]/60 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-[0_0_20px_rgba(193,154,136,0.15)] text-white'
                      : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 text-white/70'
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isSelected
                        ? 'bg-[#c19a88]/20 text-[#e8c5b4] scale-105'
                        : 'bg-white/[0.04] text-white/50 group-hover:text-white'
                    }`}
                  >
                    <TrackIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate group-hover:text-white">{track.name}</div>
                    <div className="text-[10px] text-white/40 truncate font-mono">Arena Pass: ₹{flatFee}</div>
                  </div>
                  {isSelected && (
                    <motion.div
                      layoutId="active-track-indicator"
                      className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#c19a88]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Squad Size */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/50 font-medium">
              2. Select Squad Size
            </span>
            <span className="text-[11px] text-[#c19a88] font-mono font-semibold">
              Flat ₹{flatFee} divided by {squadSize} = ₹{costPerBuilder} / builder
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {squadOptions.map((opt) => {
              const isSelected = squadSize === opt.size;
              return (
                <button
                  key={opt.size}
                  type="button"
                  onClick={() => {
                    setSquadSize(opt.size);
                    cyberAudio.playHover();
                  }}
                  className={`relative rounded-xl p-3 text-center border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#c19a88] bg-[#c19a88]/15 text-white shadow-[0_0_15px_rgba(193,154,136,0.2)]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] text-white/60'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="mt-0.5 text-[10px] font-mono text-white/40">{opt.desc}</div>
                  <div className="mt-1 text-xs font-semibold text-[#e8c5b4]">
                    ₹{Math.round(flatFee / opt.size)} <span className="text-[9px] text-white/40 font-normal">/ person</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Dynamic Breakdown Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Per Person Investment */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <Users className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Per Builder Cost</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              ₹{costPerBuilder}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              {squadSize === 4
                ? '★ 75% savings / person'
                : squadSize === 3
                ? '★ 66% savings / person'
                : squadSize === 2
                ? '★ 50% savings / person'
                : 'Solo builder total pass'}
            </div>
          </div>

          {/* Card 2: 1st Prize Bounty Return */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>1st Prize Bounty</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
              ₹{firstPrize.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-300/80 font-mono font-semibold">
              {roiMultiplier}× Team ROI Multiplier
            </div>
          </div>

          {/* Card 3: Career Gateway */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5 text-[#e8c5b4]" />
              <span>Career Gateway</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white pt-1">
              SkaleKraft Internship
            </div>
            <div className="text-[10px] text-[#e8c5b4] font-mono">
              Shortlisted Candidates
            </div>
          </div>

          {/* Card 4: Official Credentials */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <Award className="h-3.5 w-3.5 text-purple-400" />
              <span>Recognition</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white pt-1">
              Top 25 Certificates
            </div>
            <div className="text-[10px] text-purple-300 font-mono">
              Verifiable QR Credentials
            </div>
          </div>
        </div>

        {/* Selected Track Details Strip */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-white font-semibold">{selectedTrack.name}: </span>
              <span className="text-white/60 font-light truncate">{selectedTrack.description}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {stack.map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/60"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playSuccess();
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a87a66] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Lock In Squad for ₹{flatFee} ({selectedTrack.name})</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            href={`/tracks#${selectedTrack.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#e8c5b4] hover:text-white transition-colors"
          >
            <span>View Full Arena Deliverables</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Embedded Registration Modal */}
      {isModalOpen && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tracks={availableTracks}
          event={event}
          selectedTrackId={selectedTrackId}
        />
      )}
    </section>
  );
}
