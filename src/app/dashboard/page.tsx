import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  Layers,
  Send,
  Bell,
  Trophy,
  ArrowUpRight,
  ShieldCheck,
  Mail,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const rawMembers = team ? await EventRepository.getTeamMembers(team.id) : [];

  const members =
    rawMembers.length > 0
      ? rawMembers
      : team
      ? [
          {
            id: 'leader-self',
            team_id: team.id,
            name: session?.fullName || 'Team Leader',
            email: session?.email || '',
            role: 'leader' as const,
            created_at: team.created_at,
            updated_at: team.updated_at,
          },
        ]
      : [];

  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;
  const isPaid = team?.status === 'paid' || (team as any)?.status === 'confirmed';

  return (
    <div className="space-y-10 text-neutral-200">
      {/* 1. Executive Editorial Header */}
      <div className="space-y-4 pb-8 border-b border-white/[0.08] relative">
        <div className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full bg-[#c19a88]/10 blur-[100px]" />

        <div className="flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Workspace // Skaleathon 2027</span>
          <span className="text-neutral-700">•</span>
          <span className="text-neutral-400">Command Center</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
          Welcome back,{' '}
          <span className="font-serif italic font-normal text-[#e8c5b4]">
            {session?.fullName?.split(' ')[0] || 'Innovator'}
          </span>
          .
        </h1>

        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
            <span className="text-neutral-500 text-[10px] font-mono uppercase tracking-wider">
              Squad:
            </span>
            <span className="text-white font-medium">
              {team ? team.name : 'Unassigned'}
            </span>
          </div>

          {isPaid ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Paid</span>
            </div>
          ) : team ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium">
              <span>Payment Pending (₹99)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-neutral-500">
              <span>Not Registered</span>
            </div>
          )}

          {track ? (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium"
              style={{
                borderColor: `${track.color_accent || '#c19a88'}40`,
                backgroundColor: `${track.color_accent || '#c19a88'}15`,
                color: track.color_accent || '#c19a88',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: track.color_accent || '#c19a88' }} />
              <span>{track.name}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-neutral-500">
              <span>Track Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Active Round Status Hero */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.92))] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#c19a88]/10 blur-[80px]" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.24em] text-[#c19a88] uppercase">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-bold">Active Round // Stage 01</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Online Technical{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              Screening
            </span>{' '}
            Preparation
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Your squad is enrolled and confirmed. Assessment schedule and access instructions will be delivered via the Announcements portal. Please ensure your roster is confirmed prior to round kickoff.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0 relative z-10">
          <Link
            href="/dashboard/stages"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#c19a88]/40 transition-all hover:scale-105"
          >
            <span>Stage 01 Rubric</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#c19a88]" />
          </Link>
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] shadow-lg shadow-[#805948]/25 transition-all hover:scale-105"
          >
            <span>My Team ({members.length}/6)</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Workspace Command Portals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold">
            <Sparkles className="h-3 w-3 text-[#c19a88]" />
            <span>Tournament Command Directory</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            6 Modules Active
          </span>
        </div>

        <div className="divide-y divide-white/[0.06] border-y border-white/[0.08]">
          {/* Stages */}
          <Link
            href="/dashboard/stages"
            className="group flex items-center justify-between py-4 sm:py-5 hover:pl-2.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/50 group-hover:bg-[#c19a88]/10 group-hover:scale-105 transition-all">
                <Layers className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Competition Stages &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Timeline
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  Detailed 4-stage progression: Screening Quiz, Architecture PPT, 10-Day Build Sprint &amp; Grand Finale.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span className="hidden sm:inline text-[11px] text-[#c19a88]">View Flow</span>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-[#c19a88] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* My Team */}
          <Link
            href="/dashboard/team"
            className="group flex items-center justify-between py-4 sm:py-5 hover:pl-2.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/50 group-hover:bg-[#c19a88]/10 group-hover:scale-105 transition-all">
                <Users className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Squad Architecture &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Roster
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  Manage enrolled participants ({members.length}/6 squad seats filled), invite teammates, and assign roles.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span className="hidden sm:inline text-[11px] text-[#c19a88]">Manage</span>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-[#c19a88] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Track & Specs */}
          <Link
            href="/dashboard/track"
            className="group flex items-center justify-between py-4 sm:py-5 hover:pl-2.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/50 group-hover:bg-[#c19a88]/10 group-hover:scale-105 transition-all">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Track Rubrics &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Challenges
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  {track ? `Problem domains, guidelines, and technical scoring criteria for ${track.name}.` : 'Select and review track requirements and challenges.'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span className="hidden sm:inline text-[11px] text-[#c19a88]">Inspect</span>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-[#c19a88] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Submission (PPT & Project) */}
          <Link
            href="/dashboard/submission"
            className="group flex items-center justify-between py-4 sm:py-5 hover:pl-2.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/50 group-hover:bg-[#c19a88]/10 group-hover:scale-105 transition-all">
                <Send className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Deliverables &amp; Code{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Submission
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  Stage 02 Architecture PPT slide deck &amp; Stage 03 GitHub + deployed demo repository.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span className="hidden sm:inline text-[11px] text-[#c19a88]">Submit</span>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-[#c19a88] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Announcements */}
          <Link
            href="/dashboard/announcements"
            className="group flex items-center justify-between py-4 sm:py-5 hover:pl-2.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/50 group-hover:bg-[#c19a88]/10 group-hover:scale-105 transition-all">
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Official Bulletins &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Broadcasts
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  Direct tournament communications, technical briefing dates, and organizer announcements.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span className="hidden sm:inline text-[11px] text-[#c19a88]">Feed</span>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-[#c19a88] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Leaderboard */}
          <Link
            href="/dashboard/leaderboard"
            className="group flex items-center justify-between py-4 sm:py-5 hover:pl-2.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/50 group-hover:bg-[#c19a88]/10 group-hover:scale-105 transition-all">
                <Trophy className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Live Standings &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Leaderboard
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  Live tournament evaluation scores and merit rankings (unlocked following Stage 01 evaluation).
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
              <span className="hidden sm:inline text-[11px] text-[#c19a88]">Ranks</span>
              <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-[#c19a88] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Support & Direct Organizers Line */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-[#c19a88]" />
          <span>Need assistance? Contact organizers at</span>
          <a
            href="mailto:skalekraft@gmail.com"
            className="text-[#c19a88] hover:text-[#e8c5b4] transition-colors font-mono"
          >
            skalekraft@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/rules" className="hover:text-neutral-300 transition-colors">
            Tournament Rules
          </Link>
          <span className="text-neutral-700">•</span>
          <Link href="/faq" className="hover:text-neutral-300 transition-colors">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
