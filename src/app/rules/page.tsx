import React from 'react';
import type { Metadata } from 'next';
import { EventRepository } from '@/lib/db/repository';
import RulesPageClient from '@/components/rules/RulesPageClient';

export const metadata: Metadata = {
  title: 'Official Rules & Guidelines | Skaleathon',
  description: 'Review the official eligibility, team formation, competition stages, code integrity, and evaluation guidelines for Skaleathon.',
};

export const revalidate = 0;

export default async function RulesPage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="pt-20 pb-16 sm:pt-24 sm:pb-24 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Subtle Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/10 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/10 blur-[140px]" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <RulesPageClient event={event} />
      </div>
    </div>
  );
}
