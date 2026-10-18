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
        'End-to-end trained model, fine-tuned agent, or LLM-powered application',
        'Model inference code, API endpoints, or user interface',
        'Evaluation metrics, dataset schema, and prompt architectures',
      ],
      recommendedTech: ['Python', 'PyTorch / TensorFlow', 'Hugging Face', 'LangChain / LlamaIndex', 'FastAPI', 'Next.js'],
    },
    'track-web-dev': {
      deliverables: [
        'Full-stack responsive web application with database persistence',
        'REST / GraphQL APIs, secure authentication, and role authorization',
        'Live deployed link and automated test coverage',
      ],
      recommendedTech: ['Next.js / React', 'Node.js / Go', 'PostgreSQL / Supabase', 'Tailwind CSS', 'TypeScript', 'Docker'],
    },
    'track-app-dev': {
      deliverables: [
        'Native iOS/Android or cross-platform mobile application',
        'Clean offline-first or sync architectures and touch UI patterns',
        'Working demo build (APK/TestFlight or screencast walkthrough)',
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
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanAccent-500/30 bg-cyanAccent-950/30 px-3.5 py-1 text-xs font-semibold text-cyanAccent-300 mb-4">
            <span>Specialized Arenas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Competition Tracks
          </h1>
          <p className="mt-4 text-base text-slate-300">
            Skaleathon 2027 features three specialized technology tracks. Review the technical expectations, recommended tools, and deliverable standards below.
          </p>
        </div>

        <div className="space-y-12">
          {tracks.map((track) => {
            const Icon = iconMap[track.id] || Bot;
            const extra = details[track.id] || { deliverables: [], recommendedTech: [] };

            return (
              <div
                key={track.id}
                className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 sm:p-12 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3.5 rounded-xl border border-white/10 bg-white/5"
                        style={{ color: track.color_accent }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Track #{track.slug.toUpperCase()}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {track.name}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      {track.description}
                    </p>

                    <div className="pt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Expected Deliverables:
                      </h3>
                      <ul className="space-y-2">
                        {extra.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Common Tech Stack:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {extra.recommendedTech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:text-right shrink-0">
                    <Link
                      href={`/register?track=${track.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:from-brand-500 hover:to-indigo-500 transition-all"
                    >
                      <span>Register In This Track</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
