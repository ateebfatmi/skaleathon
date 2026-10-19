import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import Link from 'next/link';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import TeamWorkspaceClient from '@/components/dashboard/TeamWorkspaceClient';

export const revalidate = 0;

export default async function TeamPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const rawMembers = team ? await EventRepository.getTeamMembers(team.id) : [];
  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;
  const paymentOrder = team ? await EventRepository.getPaymentOrderByTeam(team.id) : null;

  const members =
    rawMembers.length > 0
      ? rawMembers
      : team
      ? [
          {
            id: 'leader-self',
            team_id: team.id,
            name: session?.fullName || team.name,
            email: session?.email || '',
            role: 'leader' as const,
            created_at: team.created_at,
            updated_at: team.updated_at,
          },
        ]
      : [];

  if (!team) {
    return (
      <div className="relative max-w-2xl mx-auto py-16 text-center space-y-5">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#c19a88]/10 blur-[120px]" />
        <div className="relative z-10 flex items-center justify-center text-[#c19a88] mx-auto">
          <Users className="h-8 w-8" />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">No Squad Registered</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
            You are not affiliated with an active tournament squad yet. Register your team of 1–6 engineers to access the competition arena.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-7 py-3 text-xs font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            <span>Register Squad — Flat ₹99</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TeamWorkspaceClient
      team={team}
      members={members}
      track={track}
      paymentOrder={paymentOrder}
      userName={session?.fullName}
      userEmail={session?.email}
    />
  );
}
