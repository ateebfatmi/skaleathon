import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import { getCurrentSession } from '@/lib/auth/session';
import MultiStepRegistration from '@/components/registration/MultiStepRegistration';
import RegisteredTeamView from '@/components/registration/RegisteredTeamView';
import { TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export const revalidate = 0;

interface RegisterPageProps {
  searchParams?: {
    new?: string;
  };
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const [event, tracks, session] = await Promise.all([
    EventRepository.getEvent(),
    EventRepository.getTracks(),
    getCurrentSession(),
  ]);

  let registeredTeam = null;
  let teamMembers: TeamMember[] = [];
  let registeredTrack: EventTrack | undefined = undefined;
  let paymentOrder: PaymentOrder | null = null;

  if (session?.teamId) {
    registeredTeam = await EventRepository.getTeam(session.teamId);
  } else if (session?.email) {
    registeredTeam = await EventRepository.getTeamByMemberEmail(session.email);
  }

  if (registeredTeam) {
    [teamMembers, paymentOrder] = await Promise.all([
      EventRepository.getTeamMembers(registeredTeam.id),
      EventRepository.getPaymentOrderByTeam(registeredTeam.id),
    ]);
    registeredTrack = tracks.find((t) => t.id === registeredTeam?.track_id);
  }

  const isClosed = event.status !== 'registration_open';
  const showRegistrationForm = !registeredTeam || searchParams?.new === 'true';

  return (
    <div className="py-14 sm:py-20 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-white/50 hover:text-[#c19a88] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Skaleathon</span>
          </Link>
        </div>

        {/* Dynamic Header */}
        {!showRegistrationForm && registeredTeam ? (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="h-px w-6 bg-emerald-500/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-emerald-400 font-semibold">
                National Registration • Verified Candidate
              </p>
              <span className="h-px w-6 bg-emerald-500/70" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
              Registration{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                confirmed
              </span>
              .
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-white/55 leading-relaxed font-light">
              Welcome back, <strong className="text-white font-medium">{session?.fullName || registeredTeam.name}</strong>. Your squad is officially verified and enrolled for Skaleathon (January 2028). Below is your digital team pass and stage roadmap.
            </p>
          </div>
        ) : (
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
                National Registration
              </p>
              <span className="h-px w-6 bg-[#c19a88]/70" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
              Register your{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                team
              </span>
              .
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-white/55 leading-relaxed font-light">
              Form your squad of 1–6 engineers, pick your arena, and complete the flat ₹99 team entry fee to compete for ₹35,000 in prizes and SkaleKraft studio internship opportunities for selected candidates.
            </p>
          </div>
        )}

        {/* If user is registering another team while already having an active team */}
        {searchParams?.new === 'true' && registeredTeam && (
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-[#c19a88]/30 bg-[#c19a88]/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-[#c19a88] shrink-0" />
              <span>
                You currently have an active registration for <strong className="text-[#e8c5b4]">{registeredTeam.name}</strong>.
              </span>
            </div>
            <Link
              href="/register"
              className="rounded-full bg-white/10 px-4 py-1.5 font-semibold text-white hover:bg-white/20 transition-all shrink-0"
            >
              View Registered Pass
            </Link>
          </div>
        )}

        {/* Content View */}
        {!showRegistrationForm && registeredTeam ? (
          <RegisteredTeamView
            team={registeredTeam}
            members={teamMembers}
            track={registeredTrack}
            paymentOrder={paymentOrder}
            userName={session?.fullName}
            userEmail={session?.email}
          />
        ) : isClosed ? (
          <div className="max-w-xl mx-auto rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-10 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <h2 className="text-xl font-medium text-white">Registration is Currently Closed</h2>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              The portal is currently inactive ({event.status.replace(/_/g, ' ')}). Please monitor updates on the homepage or contact the studio at skalekraft@gmail.com.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full bg-white/[0.05] border border-white/10 px-6 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <MultiStepRegistration tracks={tracks} />
        )}
      </div>
    </div>
  );
}
