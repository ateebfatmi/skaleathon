import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import HeroAscii from '@/components/ui/hero-ascii';
import TechMarquee from '@/components/home/TechMarquee';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import TracksSection from '@/components/home/TracksSection';
import PrizesSection from '@/components/home/PrizesSection';
import ProcessSection from '@/components/home/ProcessSection';
import VelarisShowcase from '@/components/home/VelarisShowcase';
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
      <HeroAscii />
      <TechMarquee />
      <StatsSection event={event} />
      <AboutSection />
      <TracksSection tracks={tracks} />
      <PrizesSection event={event} />
      <ProcessSection />
      <VelarisShowcase />
      <TimelineSection event={event} />
      <RulesSummarySection />
      <FaqSection />
      <OrganizerSection />
    </div>
  );
}

