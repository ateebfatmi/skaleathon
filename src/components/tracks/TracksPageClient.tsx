'use client';

import React, { useState } from 'react';
import { Bot, Globe, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import { EventTrack } from '@/lib/db/types';
import RegistrationModal from '@/components/registration/RegistrationModal';

interface TracksPageClientProps {
  tracks: EventTrack[];
}

export default function TracksPageClient({ tracks }: TracksPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-ai-ml');

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
      <div className="space-y-10">
        {tracks.map((track, idx) => {
          const Icon = iconMap[track.id] || Bot;
          const extra = details[track.id] || { deliverables: [], recommendedTech: [] };

          return (
            <div
              key={track.id}
              className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(14,14,14,0.96))] p-8 sm:p-12 relative overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.4)] hover:border-[#c19a88]/30 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="space-y-5 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <Icon className="h-7 w-7" strokeWidth={1.7} />
                    </div>
                    <div>
                      <span className="font-mono text-xs tracking-[0.2em] text-[#c19a88]/80 uppercase">
                        ARENA 0{idx + 1}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                        {track.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light">
                    {track.description}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80 mb-3">
                      Expected Deliverables:
                    </h3>
                    <ul className="space-y-2.5">
                      {extra.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/55 font-light">
                          <CheckCircle className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:w-80 space-y-6 lg:border-l lg:border-white/[0.07] lg:pl-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80 mb-3">
                      Recommended Technologies:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {extra.recommendedTech.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs font-mono px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.07]">
                    <button
                      type="button"
                      onClick={() => handleOpenRegistration(track.id)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-3.5 text-xs font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      <span>Register for Track</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="text-center text-[11px] font-mono text-white/40 mt-2">
                      ₹99 Flat Registration per Team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up Candidate & Team Registration Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tracks={tracks}
        selectedTrackId={selectedTrackId}
      />
    </>
  );
}
