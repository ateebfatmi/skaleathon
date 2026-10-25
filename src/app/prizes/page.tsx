import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import PrizesPageClient from '@/components/prizes/PrizesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prizes & Recognitions | Skaleathon',
  description: 'Review official cash bounties, merit certificates, and SkaleKraft internship opportunities for Skaleathon.',
};

export const revalidate = 0;

export default async function PrizesPage() {
  const [event, tracks] = await Promise.all([
    EventRepository.getEvent(),
    EventRepository.getTracks(),
  ]);

  return (
    <div className="py-10 sm:py-16 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <PrizesPageClient event={event} tracks={tracks} />
      </div>
    </div>
  );
}
