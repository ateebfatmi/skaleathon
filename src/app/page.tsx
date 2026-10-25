import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ExploreSection from '@/components/home/ExploreSection';
import OrganizerSection from '@/components/home/OrganizerSection';

export const revalidate = 0; // Ensure live database values are served

export default async function HomePage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="flex flex-col">
      <HeroSection event={event} />
      <StatsSection event={event} />
      <ExploreSection />
      <OrganizerSection />
    </div>
  );
}
