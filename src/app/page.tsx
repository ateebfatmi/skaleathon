import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import TracksSection from '@/components/home/TracksSection';
import PrizesSection from '@/components/home/PrizesSection';
import ProcessSection from '@/components/home/ProcessSection';
import TimelineSection from '@/components/home/TimelineSection';
import RulesSummarySection from '@/components/home/RulesSummarySection';
import FaqSection from '@/components/home/FaqSection';
import OrganizerSection from '@/components/home/OrganizerSection';

export const revalidate = 0; // Ensure live database values are served

export default async function HomePage() {
  const [event, tracks] = await Promise.all([
    EventRepository.getEvent(),
    EventRepository.getTracks(),
  ]);

  return (
    <div className="flex flex-col">
      <HeroSection event={event} />
      <StatsSection event={event} />
      <AboutSection />
      <TracksSection tracks={tracks} event={event} />
      <PrizesSection event={event} />
      <ProcessSection event={event} />
      <TimelineSection event={event} />
      <RulesSummarySection event={event} />
      <FaqSection event={event} />
      <OrganizerSection />
    </div>
  );
}
