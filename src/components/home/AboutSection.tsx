'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Zap, Globe2, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function AboutSection() {
  const highlights = [
    {
      number: '01',
      title: 'National Scope, Fully Online',
      desc: 'Participate remotely from anywhere in India. Build asynchronously or in real-time without geographic constraints.',
      icon: Globe2,
    },
    {
      number: '02',
      title: 'Production-Grade Standards',
      desc: 'We bypass shallow pitch decks to evaluate running code, clean architecture, resilient data layers, and live deployed software.',
      icon: Target,
    },
    {
      number: '03',
      title: 'Audited & Transparent Judging',
      desc: 'Weighted multi-judge scoring with locked rubrics, immutable score audit trails, and zero conflict of interest.',
      icon: ShieldCheck,
    },
    {
      number: '04',
      title: 'SkaleKraft Engineering Gateway',
      desc: 'Internship opportunities are available for selected candidates, offering direct interviews for paid software engineering and AI roles at SkaleKraft.',
      icon: Zap,
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-[#0B0B0B]">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#805948]/10 blur-[130px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Mission Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
                The Studio Standard
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12]">
              A platform engineered for builders who{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                ship real software
              </span>
              .
            </h2>

            <p className="text-base text-white/70 leading-relaxed font-light">
              <strong className="text-white font-medium">Skaleathon</strong> is presented by{' '}
              <strong className="text-[#c19a88] font-medium">SkaleKraft</strong> — an independent product studio engineering modern websites, mobile applications, and autonomous AI systems for ambitious brands.
            </p>

            <p className="text-sm text-white/50 leading-relaxed font-light">
              Whether you are architecting agentic workflows, engineering ultra-resilient web infrastructure, or crafting native cross-platform mobile apps, Skaleathon provides an uncompromising arena to prove what you can build under real-world constraints.
            </p>

            <div className="pt-2">
              <Link
                href="/rules"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c19a88] hover:text-white transition-colors group"
              >
                <span>Read the official competition guidelines</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 4 Key Tenets Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="h-full"
                >
                  <SpotlightCard
                    spotlightColor="rgba(193, 154, 136, 0.12)"
                    className="h-full p-6 hover:border-[#c19a88]/30 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.2em] text-white/25">
                        {item.number}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold tracking-wide text-white mb-2 group-hover:text-[#c19a88] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/45 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
