import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import PrizesSection from '@/components/home/PrizesSection';
import StatsSection from '@/components/home/StatsSection';
import ExploreSection from '@/components/home/ExploreSection';
import OrganizerSection from '@/components/home/OrganizerSection';
import { Component as ExperienceHero } from '@/components/ui/experience-hero';

// Render at request time while the repository's shared data cache keeps public
// database reads fast and avoids making builds depend on production services.
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function HomePage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="flex flex-col bg-[#020202]">
      <ExperienceHero registrationDeadline={event.registration_end_at} />
      <PrizesSection event={event} />
      <StatsSection event={event} />
      <ExploreSection />
      <OrganizerSection />
      <div
        className="experience-bento-mask pointer-events-none fixed inset-0 z-[100] opacity-10"
        aria-hidden="true"
      />
    </div>
  );
}
