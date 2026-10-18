import React from 'react';
import Link from 'next/link';
import { Bot, Globe, Smartphone, ArrowRight } from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

interface TracksProps {
  tracks: EventTrack[];
}

export default function TracksSection({ tracks }: TracksProps) {
  const iconMap: Record<string, any> = {
    'track-ai-ml': Bot,
    'track-web-dev': Globe,
    'track-app-dev': Smartphone,
  };

  return (
    <section id="tracks" className="py-20 lg:py-28 bg-[#080c15] border-t border-white/5 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanAccent-500/30 bg-cyanAccent-950/30 px-3.5 py-1 text-xs font-semibold text-cyanAccent-300 mb-4">
            <span>Specialized Arenas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Three Challenging Technical Tracks
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Select the track that best fits your team&apos;s architectural strengths. Each track is judged by specialized industry evaluators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = iconMap[track.id] || Bot;
            return (
              <div
                key={track.id}
                className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0c121f] p-8 hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/10 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="p-3.5 rounded-xl border border-white/10 bg-white/5 group-hover:scale-110 transition-transform"
                      style={{ color: track.color_accent }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-slate-400">
                      Track #{track.slug.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyanAccent-300 transition-colors">
                    {track.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/register?track=${track.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <span>Register in this track</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
