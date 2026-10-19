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
      {/* Velaris WebGL Living Gradient Ambient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen">
        <Velaris
          height="100%"
          bg="#0B0B0B"
          colors={['#c19a88', '#805948', '#e8c5b4', '#18121d']}
          speed={1.4}
          grain={0.2}
        />
      </div>

      {/* Background radial ambient copper & bronze lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#805948]/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] bg-[#c19a88]/15 rounded-full blur-[120px]" />
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
          <span className="tracking-[0.24em] uppercase text-white/60 font-semibold">SkaleKraft Presents</span>
          <span className="text-white/20">•</span>
          <span className="text-[#c19a88] font-medium tracking-wide">National Online Hackathon</span>
        </motion.div>

        {/* Master Event Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
        >
          SKALEATHON{' '}
          <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
            2027
          </span>
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
          className="mt-6 text-base sm:text-lg text-white/65 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          India&apos;s premier national online hackathon uniting ambitious developers, designers, and problem solvers to engineer scalable, production-grade solutions across AI/ML, Web, and Mobile ecosystems.
        </motion.p>

        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium border border-[#805948]/30 bg-[#805948]/10 text-white/80"
        >
          <span className="h-2 w-2 rounded-full bg-[#c19a88] animate-pulse" />
          <span>Status: {isRegistrationOpen ? 'Registration is Officially Open' : event.status.replace(/_/g, ' ').toUpperCase()}</span>
          <span className="text-white/40">•</span>
          <span className="text-[#c19a88] font-semibold">₹99 / Team</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {isRegistrationOpen ? (
            <GlassmorphismCta
              href="/register"
              label="Register Your Team — ₹99"
              avatarSrc="/images/skalekraft-logo.png"
              avatarAlt="SkaleKraft logo"
              shimmerColor="rgba(193,154,136,0.85)"
              className="text-sm py-2.5 px-5"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] px-6 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <Terminal className="h-4 w-4 text-[#c19a88]" />
            <span>Explore Tracks</span>
          </Link>

          <Link
            href="/rules"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-transparent hover:border-white/10 px-5 py-2.5 text-sm font-medium text-white/55 hover:text-white transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Rules</span>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-xs text-white/55"
        >
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#c19a88]" />
            <span>₹35,000 Authorized Prize Pool</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#c19a88]" />
            <span>Official Certificates for Top 25 Teams</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#c19a88]" />
            <span>Team Size: 1 to 6 Innovators</span>
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
