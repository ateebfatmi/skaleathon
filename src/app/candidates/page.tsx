import React from 'react';
import { Metadata } from 'next';
import { EventRepository } from '@/lib/db/repository';
import CandidatesDirectory from '@/components/candidates/CandidatesDirectory';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Registered Candidates & Teams — Skaleathon 2027 | SkaleKraft',
  description:
    'Directory of registered candidates and engineering squads competing across India in Skaleathon 2027.',
};

export default async function CandidatesPage() {
  const [teams, tracks] = await Promise.all([
    EventRepository.listTeams(),
    EventRepository.getTracks(),
  ]);

  return (
    <div className="py-16 sm:py-24 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              National Participant Registry
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
            Registered{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              candidates & teams
            </span>
            .
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/55 leading-relaxed font-light">
            Meet the ambitious developers, innovators, and squads officially registered across India for Skaleathon 2027. Filter by competition arena or search by team and institution.
          </p>
        </div>

        {/* Interactive Registry Directory */}
        <CandidatesDirectory initialTeams={teams} tracks={tracks} />
      </div>
    </div>
  );
}
