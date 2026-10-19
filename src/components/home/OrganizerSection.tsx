'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Sparkles, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrganizerSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(17,14,13,0.96))] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
        >
          {/* Ambient copper corner glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#805948]/20 blur-[100px]" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
                The Product Studio
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1c1b1a] shadow-[0_0_25px_rgba(193,154,136,0.25)]"
                style={{ width: 56, height: 56, minWidth: 56, minHeight: 56 }}
              >
                <Image
                  src="/images/skalekraft-mark.png"
                  alt="SkaleKraft logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  style={{ width: 56, height: 56, maxWidth: 56, maxHeight: 56 }}
                />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
                Crafted by{' '}
                <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                  SkaleKraft
                </span>
                .
              </h2>
            </div>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light">
              <strong className="text-white font-medium">SkaleKraft</strong> is an independent software product studio engineering modern websites, mobile applications, AI agents, and scalable digital systems for ambitious brands.
            </p>

            <p className="text-sm text-white/50 leading-relaxed font-light">
              Skaleathon is our flagship initiative to discover, mentor, and elevate the next generation of software builders in India — evaluating genuine technical craft, production readiness, and architectural elegance.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="https://skalekraft.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-3 text-xs font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-105 transition-all duration-300"
              >
                <span>Visit SkaleKraft Studio</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href="https://skalekraft.in/work"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] px-5 py-3 text-xs font-medium text-white/75 hover:text-white transition-all"
              >
                <Globe className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Explore Client Systems</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
