import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import TracksPageClient from '@/components/tracks/TracksPageClient';

export const revalidate = 0;

export default async function TracksPage() {
  const tracks = await EventRepository.getTracks();

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
            Skaleathon 2028 features three specialized technology arenas. Review the engineering standards, recommended stack, and deliverable expectations below.
          </p>
        </div>

        <TracksPageClient tracks={tracks} />
      </div>
    </div>
  );
}
