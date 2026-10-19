import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import HeroSection from '@/components/home/HeroSection';

export const revalidate = 0; // Ensure live database values are served

export default async function HomePage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="flex flex-col">
      <HeroSection event={event} />
    </div>
  );
}
