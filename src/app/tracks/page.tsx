import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { Bot, Globe, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function TracksPage() {
  const tracks = await EventRepository.getTracks();

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
    <div className="py-20 sm:py-28 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Curated Arenas
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
            Competition{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              tracks
            </span>
            .
          </h1>
          <p className="mt-4 text-base text-white/55 leading-relaxed font-light">
            Skaleathon 2027 features three specialized technology arenas. Review the engineering standards, recommended stack, and deliverable expectations below.
          </p>
        </div>

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
                      <Link
                        href={`/register?track=${track.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-3.5 text-xs font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-[1.02] transition-transform"
                      >
                        <span>Register in this Track</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
