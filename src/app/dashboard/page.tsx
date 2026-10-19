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
    <div className="space-y-8 text-neutral-200">
      {/* 1. Executive Header */}
      <div className="space-y-3 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider text-[#c19a88]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Workspace // Skaleathon 2026</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400">Overview</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {session?.fullName?.split(' ')[0] || 'Builder'}
        </h1>

        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-neutral-400">
          <span className="text-white">
            Team:{' '}
            <span className="text-[#e8c5b4] font-semibold">
              {team ? team.name : 'Unassigned'}
            </span>
          </span>
          <span className="text-neutral-700">•</span>
          {isPaid ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Paid
            </span>
          ) : team ? (
            <span className="text-amber-400 font-medium">Payment Pending (₹99)</span>
          ) : (
            <span className="text-neutral-500">Not Registered</span>
          )}
          <span className="text-neutral-700">•</span>
          {track ? (
            <span
              className="font-medium px-2 py-0.5 rounded text-[11px] border border-white/10"
              style={{
                color: track.color_accent || '#c19a88',
                backgroundColor: `${track.color_accent || '#c19a88'}15`,
              }}
            >
              {track.name}
            </span>
          ) : (
            <span className="text-neutral-500">Track Pending</span>
          )}
        </div>
      </div>

      {/* 2. Current Round Status (Immediate Action Focus) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c19a88]">
            <Clock className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider font-semibold">Active Round: Stage 01</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Online Technical Screening Preparation
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Your team is enrolled. Assessment schedule and access instructions will be delivered via the Announcements portal. Please ensure your roster is confirmed prior to round kickoff.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <Link
            href="/dashboard/stages"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors"
          >
            <span>Stage 01 Rubric</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0B0B] bg-gradient-to-r from-[#e8c5b4] to-[#c19a88] hover:opacity-95 transition-opacity"
          >
            <span>My Team ({members.length}/6)</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Dedicated Section Navigation (Clean Directory without Duplicating Content) */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
          Workspace Portals
        </div>

        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {/* Stages */}
          <Link
            href="/dashboard/stages"
            className="group flex items-center justify-between py-4 hover:pl-2 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/40 transition-colors">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Competition Stages & Timeline
                </div>
                <div className="text-xs text-neutral-400">
                  Detailed 4-stage progression: Screening Quiz, Architecture PPT, 10-Day Sprint & Grand Finale.
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          {/* My Team */}
          <Link
            href="/dashboard/team"
            className="group flex items-center justify-between py-4 hover:pl-2 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/40 transition-colors">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  My Team & Roster
                </div>
                <div className="text-xs text-neutral-400">
                  Manage enrolled participants ({members.length}/6 enrolled), invite teammates, and assign roles.
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Track & Specs */}
          <Link
            href="/dashboard/track"
            className="group flex items-center justify-between py-4 hover:pl-2 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/40 transition-colors">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Track & Problem Specifications
                </div>
                <div className="text-xs text-neutral-400">
                  {track ? `Problem domains and technical rubrics for ${track.name}.` : 'Select and review track requirements and challenges.'}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Project Submission */}
          <Link
            href="/dashboard/submission"
            className="group flex items-center justify-between py-4 hover:pl-2 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/40 transition-colors">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Project Submission
                </div>
                <div className="text-xs text-neutral-400">
                  Deliverable specifications, code repository guidelines, and demo portal (activates in Stage 03).
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Announcements */}
          <Link
            href="/dashboard/announcements"
            className="group flex items-center justify-between py-4 hover:pl-2 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/40 transition-colors">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Announcements & Broadcasts
                </div>
                <div className="text-xs text-neutral-400">
                  Official tournament communications, screening dates, and committee updates.
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Leaderboard */}
          <Link
            href="/dashboard/leaderboard"
            className="group flex items-center justify-between py-4 hover:pl-2 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#c19a88] group-hover:border-[#c19a88]/40 transition-colors">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
                  Tournament Leaderboard
                </div>
                <div className="text-xs text-neutral-400">
                  Live team standings and evaluation ranks (unlocks after Stage 01 screening).
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* 4. Support & Regulatory Direct Links */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-[#c19a88]" />
          <span>Need assistance? Contact organizers at</span>
          <a
            href="mailto:skalekraft@gmail.com"
            className="text-[#c19a88] hover:underline font-mono"
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
            Frequently Asked Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
