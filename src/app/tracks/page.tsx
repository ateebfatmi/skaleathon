import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import TracksPageClient from '@/components/tracks/TracksPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Competition Tracks | Skaleathon',
  description: 'Explore the active AI/ML, web, and mobile competition tracks for Skaleathon.',
};

export const revalidate = 0;

export default async function TracksPage() {
  const [tracks, event] = await Promise.all([
    EventRepository.getTracks(),
    EventRepository.getEvent(),
  ]);

  return (
    <div className="py-10 sm:py-16 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <TracksPageClient tracks={tracks} event={event} />
      </div>
    </div>
  );
}
