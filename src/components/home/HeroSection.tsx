'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Award,
  Layers,
  Code2,
  Users,
  Trophy,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { EventData } from '@/lib/db/types';
import GlassmorphismCta from '@/components/ui/glassmorphism-cta';
import { motion } from 'framer-motion';
import InteractiveTerminal from '@/components/home/InteractiveTerminal';

interface HeroProps {
  event: EventData;
}

export default function HeroSection({ event }: HeroProps) {
  const isRegistrationOpen = event.status === 'registration_open';

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-36 bg-transparent">
      {/* 1. Multi-Layer Atmospheric Lighting & Grid Mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Core Warm Bronze Radial Corona */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[950px] lg:w-[1200px] h-[480px] sm:h-[620px] bg-[radial-gradient(ellipse_60%_50%_at_50%_25%,rgba(193,154,136,0.24),rgba(128,89,72,0.12)_45%,rgba(11,11,11,0)_75%)] blur-[120px]" />

        {/* Ethereal Indigo-Copper Ambient Accents */}
        <div className="absolute top-28 left-1/4 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] bg-[#805948]/12 rounded-full blur-[140px]" />
        <div className="absolute top-36 right-1/4 translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] bg-[#c19a88]/10 rounded-full blur-[140px]" />

        {/* High-Precision Cyber Grid with Vignette Mask */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_35%,#000_30%,transparent_100%)] opacity-75"
        />

        {/* Ambient Curved Horizon Light Beam */}
        <div className="absolute top-[28rem] sm:top-[32rem] left-1/2 -translate-x-1/2 w-[85%] max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-[#c19a88]/40 to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* 2. Top Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] p-1 pr-4 text-xs backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-[#c19a88]/40 transition-all duration-300 group"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-sm shadow-[#805948]/30">
            <Sparkles className="h-3 w-3 text-[#fdf6f0] group-hover:rotate-12 transition-transform duration-300" />
            SkaleKraft Presents
          </span>
          <span className="text-white/85 font-medium tracking-wide text-[11px] sm:text-xs">
            National Online Hackathon
          </span>
          <span className="h-1 w-1 rounded-full bg-[#c19a88]" />
          <span className="text-[#e8c5b4] font-mono text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">
            Edition 2027
          </span>
        </motion.div>

        {/* 3. Master Cinematic Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          className="mt-6 sm:mt-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-white max-w-5xl mx-auto leading-[1.02] select-none">
            <span className="inline-block bg-gradient-to-b from-white via-[#EDEDED] to-[#A1A1A1] bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(255,255,255,0.15)]">
              SKALEATHON
            </span>{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#fdf6f0] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block drop-shadow-[0_4px_30px_rgba(193,154,136,0.35)]">
              2027
            </span>
          </h1>

          {/* Micro Tagline with Diamond Accents */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold tracking-[0.32em] text-[#c19a88] uppercase">
            <span>Build</span>
            <span className="text-[10px] text-[#c19a88]/60">◆</span>
            <span>Innovate</span>
            <span className="text-[10px] text-[#c19a88]/60">◆</span>
            <span>Scale</span>
          </div>
        </motion.div>

        {/* 4. Refined Value Proposition Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          India&apos;s premier national online hackathon uniting ambitious developers, designers, and problem solvers to engineer scalable, production-grade solutions across{' '}
          <span className="text-white font-medium">AI/ML</span>,{' '}
          <span className="text-white font-medium">Web</span>, and{' '}
          <span className="text-white font-medium">Mobile</span> ecosystems.
        </motion.p>

        {/* 5. Live Registration Beacon Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-7 inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 px-4 py-1.5 rounded-full text-xs font-medium border border-[#c19a88]/30 bg-gradient-to-r from-[#805948]/20 via-[#c19a88]/15 to-[#805948]/20 backdrop-blur-2xl text-white/90 shadow-[0_0_24px_rgba(193,154,136,0.14)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-semibold tracking-wide">
            {isRegistrationOpen ? 'Registration is Officially Open' : event.status.replace(/_/g, ' ').toUpperCase()}
          </span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[#e8c5b4] font-bold">₹99 Flat per Team</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/70 text-[11px] hidden sm:inline">1 to 6 Innovators</span>
        </motion.div>

        {/* 6. High-Conversion CTA Action Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
        >
          {isRegistrationOpen ? (
            <GlassmorphismCta
              href="/register"
              label="Register Your Team — ₹99"
              avatarSrc="/images/skalekraft-logo.png"
              avatarAlt="SkaleKraft logo"
              shimmerColor="rgba(193,154,136,0.9)"
              className="text-sm py-3 px-6 shadow-[0_4px_30px_rgba(193,154,136,0.25)] hover:shadow-[0_6px_40px_rgba(193,154,136,0.4)]"
            />
          ) : (
            <button
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-8 py-3 text-sm font-medium text-white/40 cursor-not-allowed"
            >
              Registration Currently Closed
            </button>
          )}

          <Link
            href="/tracks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] hover:border-[#c19a88]/40 px-6 py-3 text-sm font-semibold text-white/90 hover:text-white transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl group"
          >
            <Code2 className="h-4 w-4 text-[#c19a88] group-hover:scale-110 transition-transform" />
            <span>Explore 3 Tracks</span>
            <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/rules"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] px-5 py-3 text-sm font-medium text-white/70 hover:text-white transition-all backdrop-blur-xl"
          >
            <Layers className="h-4 w-4 text-neutral-400" />
            <span>4-Stage Roadmap</span>
          </Link>
        </motion.div>

        {/* 7. Four Luxury Glassmorphism Metric Cards (Bento HUD) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left"
        >
          {/* Card 1: Prize Pool */}
          <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] p-4.5 backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/40 hover:shadow-[0_8px_30px_rgba(193,154,136,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Prize Distribution
              </span>
              <div className="p-2 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ₹35,000{' '}
              <span className="text-xs font-mono font-normal text-amber-400/90">Pool</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Top 3 national winners plus Best Track Innovation awards.
            </p>
          </div>

          {/* Card 2: Merit Certificates */}
          <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] p-4.5 backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/40 hover:shadow-[0_8px_30px_rgba(193,154,136,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Merit Credentials
              </span>
              <div className="p-2 rounded-xl border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#c19a88] group-hover:scale-110 transition-transform">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Top 25{' '}
              <span className="text-xs font-mono font-normal text-[#e8c5b4]">Finalists</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Official Certificates of Merit with QR cryptographic verification.
            </p>
          </div>

          {/* Card 3: Team Format */}
          <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] p-4.5 backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/40 hover:shadow-[0_8px_30px_rgba(193,154,136,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Team Format
              </span>
              <div className="p-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              1–6{' '}
              <span className="text-xs font-mono font-normal text-cyan-400">Innovators</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Flat ₹99 entry per team. Cross-college collaboration permitted.
            </p>
          </div>

          {/* Card 4: Format & Arena */}
          <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] p-4.5 backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/40 hover:shadow-[0_8px_30px_rgba(193,154,136,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Structure
              </span>
              <div className="p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              4 Stages{' '}
              <span className="text-xs font-mono font-normal text-emerald-400">Online</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Quiz screening → PPT blueprint → Build & submit → Live jury Q&A.
            </p>
          </div>
        </motion.div>

        {/* 8. Live Interactive Hacker CLI Terminal Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-12 sm:mt-16"
        >
          <InteractiveTerminal />
        </motion.div>
      </div>
    </section>
  );
}
