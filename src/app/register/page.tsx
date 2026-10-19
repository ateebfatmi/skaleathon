import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import { getCurrentSession } from '@/lib/auth/session';
import MultiStepRegistration from '@/components/registration/MultiStepRegistration';
import RegisteredTeamView from '@/components/registration/RegisteredTeamView';
import { TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Trophy,
  Award,
  Briefcase,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import Velaris from '@/components/ui/velaris';

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
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-32 selection:bg-[#805948]/30">
      {/* Living WebGL Ambient Mesh Canvas */}
      <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-screen z-0">
        <Velaris
          height="100%"
          bg="#0B0B0B"
          colors={['#c19a88', '#805948', '#e8c5b4', '#151016']}
          speed={1.0}
          grain={0.18}
        />
      </div>

      {/* Radial ambient copper & bronze lights */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] z-0">
        <div className="absolute top-10 left-1/4 w-[520px] h-[520px] bg-[#805948]/20 rounded-full blur-[140px]" />
        <div className="absolute top-24 right-1/4 w-[420px] h-[420px] bg-[#c19a88]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/3 w-[360px] h-[360px] bg-[#e8c5b4]/10 rounded-full blur-[130px]" />
      </div>

      {/* Micro dot matrix pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:28px_28px] opacity-75 z-0" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation back */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400 hover:text-white hover:border-[#c19a88]/40 hover:bg-white/[0.06] backdrop-blur-md transition-all shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#c19a88] group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Overview</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#c19a88] bg-[#805948]/10 border border-[#c19a88]/20 px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Portal • January 2028</span>
          </div>
        </div>

        {/* Dynamic Header */}
        {!showRegistrationForm && registeredTeam ? (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-5 backdrop-blur-xl shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="tracking-[0.24em] uppercase font-bold text-[10px]">
                National Registration Verified
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.15]">
              Registration{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                confirmed
              </span>
              .
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed font-light">
              Welcome back, <strong className="text-white font-medium">{session?.fullName || registeredTeam.name}</strong>. Your squad is authoritatively enrolled and verified for Skaleathon (January 2028). Below is your digital team pass, roster details, and competition roadmap.
            </p>
          </div>
        ) : (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/70 mb-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
              <span className="tracking-[0.24em] uppercase text-white/60 font-semibold text-[10px]">
                SkaleKraft Presents
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[#c19a88] font-medium tracking-wider text-[11px]">
                National Hackathon Registration
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.15]">
              Register your{' '}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
                squad
              </span>
              .
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed font-light">
              Form your team of 1–6 engineers, choose your technical arena, and finalize the flat ₹99 entry fee to compete for ₹35,000 in cash prizes, certificates for Top 25 teams, and fast-track interviews at SkaleKraft.
            </p>

            {/* Value Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-8 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-left">
                <div className="h-8 w-8 rounded-lg bg-[#805948]/20 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Flat ₹99 Entry</div>
                  <div className="text-[10px] text-neutral-400">1 to 6 members</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-left">
                <div className="h-8 w-8 rounded-lg bg-[#805948]/20 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">₹35,000 Pool</div>
                  <div className="text-[10px] text-neutral-400">Top 3 Cash Awards</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-left">
                <div className="h-8 w-8 rounded-lg bg-[#805948]/20 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Top 25 Merit</div>
                  <div className="text-[10px] text-neutral-400">Certificates</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm text-left">
                <div className="h-8 w-8 rounded-lg bg-[#805948]/20 border border-[#c19a88]/30 flex items-center justify-center text-[#c19a88] shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">SkaleKraft Fast-Track</div>
                  <div className="text-[10px] text-neutral-400">Direct Interviews</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If user is registering another team while already having an active team */}
        {searchParams?.new === 'true' && registeredTeam && (
          <div className="max-w-3xl mx-auto mb-8 rounded-2xl border border-[#c19a88]/30 bg-[#c19a88]/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs backdrop-blur-md">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-[#c19a88] shrink-0" />
              <span>
                You currently have an active registration for team <strong className="text-[#e8c5b4]">{registeredTeam.name}</strong>.
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

        {/* Main Content Area */}
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
          <div className="max-w-xl mx-auto rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-10 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <h2 className="text-xl font-medium text-white">Registration is Currently Closed</h2>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              The portal is currently inactive ({event.status.replace(/_/g, ' ')}). Please monitor updates on the homepage or contact SkaleKraft at skalekraft@gmail.com.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-2.5 text-xs font-semibold text-white shadow-lg hover:scale-105 transition-all"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="relative">
            <MultiStepRegistration tracks={tracks} />

            {/* Bottom Trust & Assurance Note */}
            <div className="mt-8 text-center text-[11px] text-neutral-500 font-mono flex flex-wrap items-center justify-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-[#c19a88]" />
                256-Bit SSL Encryption
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Razorpay Automated Reconciliation
              </span>
              <span>•</span>
              <span>Instant Team Dashboard Provisioning</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
