'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Globe, Smartphone, ArrowRight } from 'lucide-react';
import { EventTrack } from '@/lib/db/types';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import RegistrationModal from '@/components/registration/RegistrationModal';

interface TracksProps {
  tracks: EventTrack[];
}

export default function TracksSection({ tracks }: TracksProps) {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedTrackForModal, setSelectedTrackForModal] = useState<string>('track-ai-ml');

  const handleOpenRegistration = (trackId: string) => {
    setSelectedTrackForModal(trackId);
    setRegisterModalOpen(true);
  };

  const iconMap: Record<string, any> = {
    'track-ai-ml': Bot,
    'track-web-dev': Globe,
    'track-app-dev': Smartphone,
  };

  return (
    <section id="tracks" className="py-20 lg:py-28 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[70%] rounded-full bg-[#805948]/10 blur-[140px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Curated Arenas
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Three engineering{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              disciplines
            </span>
            .
          </h2>
          <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
            Choose your arena. Build focused, production-grade solutions evaluated by domain experts according to uncompromising engineering criteria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track, idx) => {
            const Icon = iconMap[track.id] || Bot;
            const techStacks: Record<string, string[]> = {
              'track-ai-ml': ['PyTorch', 'LLMs & Agents', 'Transformers', 'FastAPI'],
              'track-web-dev': ['Next.js 14', 'TypeScript', 'WebSockets', 'Supabase'],
              'track-app-dev': ['Flutter', 'React Native', 'Offline-First', 'On-Device ML'],
            };
            const currentStack = techStacks[track.id] || ['Full-Stack', 'APIs', 'Cloud'];

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <SpotlightCard
                  enableTilt
                  spotlightColor={idx === 0 ? 'rgba(52,211,153,0.12)' : idx === 1 ? 'rgba(56,189,248,0.12)' : 'rgba(251,191,36,0.12)'}
                  className="h-full flex flex-col justify-between group hover:border-[#c19a88]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:text-white transition-all">
                        <Icon className="h-6 w-6" strokeWidth={1.7} />
                      </div>
                      <span className="font-mono text-xs tracking-[0.2em] text-[#c19a88]/70 uppercase px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02]">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-medium tracking-tight text-white mb-3 group-hover:text-[#c19a88] transition-colors">
                      {track.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light mb-6">
                      {track.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {currentStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-mono border border-white/[0.08] bg-white/[0.03] text-white/60 group-hover:border-white/15 group-hover:text-white/80 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/[0.07] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenRegistration(track.id)}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#c19a88] hover:text-white transition-colors cursor-pointer group/btn"
                    >
                      <span>Register for Track</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                    </button>
                    <span className="text-[10px] font-mono text-white/30">₹99 / Team</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pop-up Candidate & Team Registration Modal */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        tracks={tracks}
        selectedTrackId={selectedTrackForModal}
      />
    </section>
  );
}
