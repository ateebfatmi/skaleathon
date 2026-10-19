'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Terminal, Award } from 'lucide-react';
import { EventData } from '@/lib/db/types';
import GlassmorphismCta from '@/components/ui/glassmorphism-cta';
import { motion } from 'framer-motion';
import InteractiveTerminal from '@/components/home/InteractiveTerminal';
import Velaris from '@/components/ui/velaris';

interface HeroProps {
  event: EventData;
}

export default function HeroSection({ event }: HeroProps) {
  const isRegistrationOpen = event.status === 'registration_open';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-32 bg-[#0B0B0B]">
      {/* 1. SkaleKraft Studio Ambient Radial Copper and Bronze Halos */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] pointer-events-none">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(193,154,136,0.22),transparent_70%)] blur-2xl" />
        <div className="absolute top-24 left-1/4 w-[420px] h-[420px] bg-[#805948]/20 rounded-full blur-[140px]" />
        <div className="absolute top-36 right-1/4 w-[380px] h-[380px] bg-[#c19a88]/15 rounded-full blur-[130px]" />
      </div>

      {/* 2. Micro 32px Dot Matrix Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.025)_1px,transparent_0)] [background-size:32px_32px] opacity-70" />

      {/* 3. Velaris WebGL living gradient canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen">
        <Velaris
          height="100%"
          bg="#0B0B0B"
          colors={['#c19a88', '#805948', '#e8c5b4', '#141414']}
          speed={1.0}
          grain={0.15}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Brand Hierarchy Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/70 mb-8 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
          <span className="tracking-[0.24em] uppercase text-white/80 font-semibold text-[11px]">SkaleKraft Presents</span>
        </motion.div>

        {/* Master Event Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] select-none"
        >
          SKALEATHON{' '}
          <motion.span
            drag
            dragSnapToOrigin
            dragElastic={0.25}
            whileHover={{ scale: 1.08, rotate: -3, cursor: 'grab' }}
            whileDrag={{ scale: 1.22, rotate: 6, cursor: 'grabbing', zIndex: 50 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#f5ded3] via-[#e8c5b4] to-[#c19a88] bg-clip-text text-transparent pb-1 inline-block cursor-grab active:cursor-grabbing relative touch-none"
            title="Drag me!"
          >
            2027
          </motion.span>
        </motion.h1>

        {/* Official Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-sm sm:text-base lg:text-lg font-medium tracking-[0.28em] text-[#c19a88] uppercase"
        >
          BUILD. INNOVATE. SCALE.
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          India&apos;s definitive 4-stage national engineering tournament. Architect, build, and deploy production-grade software across AI/ML, Web, and Mobile arenas — competing for a ₹35,000 cash prize pool, Top 25 merit certificates, and SkaleKraft studio internship opportunities.
        </motion.p>

        {/* Status & Funnel Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-7 inline-flex flex-wrap items-center justify-center gap-2.5 px-5 py-2 rounded-full text-xs font-medium border border-[#c19a88]/30 bg-[#805948]/15 text-white/90 shadow-[0_4px_25px_rgba(128,89,72,0.18)] backdrop-blur-xl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">
            {isRegistrationOpen ? 'Registration Officially Open' : event.status.replace(/_/g, ' ').toUpperCase()}
          </span>
          <span className="text-white/30">•</span>
          <span className="text-white/80">Flat ₹99 per Squad (1–6 Members)</span>
          <span className="text-white/30">•</span>
          <span className="text-[#e8c5b4] font-mono">4 Stages: Quiz → PPT → Build → Live Q&A</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          {isRegistrationOpen ? (
            <GlassmorphismCta
              href="/register"
              label="Register Your Team — ₹99"
              avatarSrc="/images/skalekraft-logo.png"
              avatarAlt="SkaleKraft logo"
              shimmerColor="rgba(193,154,136,0.85)"
              className="text-sm py-2.5 px-6 font-semibold"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:border-[#c19a88]/40 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <Terminal className="h-4 w-4 text-[#c19a88]" />
            <span>Explore Arenas</span>
          </Link>

          <Link
            href="/rules"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-transparent hover:border-white/10 px-5 py-2.5 text-xs sm:text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <Sparkles className="h-4 w-4 text-[#c19a88]" />
            <span>Tournament Rules</span>
          </Link>
        </motion.div>

        {/* 4 Official Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/60 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <Award className="h-4 w-4 text-[#c19a88] shrink-0" />
            <span className="font-medium text-white/80">₹35,000 Cash Pool</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <Terminal className="h-4 w-4 text-[#c19a88] shrink-0" />
            <span className="font-medium text-white/80">4 Tournament Stages</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <ShieldCheck className="h-4 w-4 text-[#c19a88] shrink-0" />
            <span className="font-medium text-white/80">Top 25 Merit Certificates</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <Sparkles className="h-4 w-4 text-[#c19a88] shrink-0" />
            <span className="font-medium text-white/80">Studio Internship Interviews</span>
          </div>
        </motion.div>

        {/* Live Interactive Hacker CLI & Telemetry Playground */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-12"
        >
          <InteractiveTerminal />
        </motion.div>
      </div>
    </section>
  );
}
