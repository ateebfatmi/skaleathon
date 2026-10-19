import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import TracksPageClient from '@/components/tracks/TracksPageClient';

export const revalidate = 0;

export default async function TracksPage() {
  const tracks = await EventRepository.getTracks();

  return (
    <div className="py-10 sm:py-16 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <TracksPageClient tracks={tracks} />
      </div>
    </div>
  );
}
