import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import SubmissionPortalClient from '@/components/dashboard/SubmissionPortalClient';

export const revalidate = 0;

export default async function SubmissionPage() {
  const session = await getCurrentSession();
  const [event, team] = await Promise.all([
    EventRepository.getEvent(),
    session?.teamId ? EventRepository.getTeam(session.teamId) : null,
  ]);

  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;
  const track = team?.track || null;
  const isPaid = team ? team.status === 'paid' || (team as any).status === 'confirmed' : false;

  return (
    <SubmissionPortalClient
      team={team}
      track={track}
      isPaid={isPaid}
      initialSubmission={submission}
      eventStatus={event.status}
    />
  );
}
