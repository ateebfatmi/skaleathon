import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  Users,
  CreditCard,
  Send,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Code2,
  Sparkles,
  ArrowUpRight,
  Layers,
  BrainCircuit,
  FileText,
  Trophy,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Mail,
  Plus,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const event = await EventRepository.getEvent();

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
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;
  const announcements = await EventRepository.getAnnouncements(true);
  const certificates = team ? await EventRepository.getCertificatesByTeam(team.id) : [];

  const isPaid = team?.status === 'paid' || (team as any)?.status === 'confirmed';
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  return (
    <div className="space-y-10 text-neutral-200">
      {/* 1. Header Command Deck (Open Layout, Typographic) */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider text-[#c19a88]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Workspace // Skaleathon 2026</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">Pre-Stage Screening Prep</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {session?.fullName?.split(' ')[0] || 'Builder'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-400">
            <span className="text-white font-medium">
              Team: <span className="text-[#e8c5b4] font-semibold">{team ? team.name : 'Unassigned'}</span>
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

        {/* Quick Access Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {team ? (
            <Link
              href="/dashboard/team"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
            >
              <Users className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Manage Roster</span>
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0B0B] bg-gradient-to-r from-[#e8c5b4] to-[#c19a88] hover:opacity-95 transition-opacity"
            >
              <span>Register Team</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          <Link
            href="/dashboard/stages"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all"
          >
            <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
            <span>Stages & Schedule</span>
          </Link>

          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <span>FAQ</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 2. Integrated Horizontal Telemetry Strip (Unified Ribbon, Not Floating Cards) */}
      <div className="border-y border-white/[0.08] bg-white/[0.015]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          {/* Telemetry Item 1: Roster */}
          <div className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                01 / Squad Roster
              </span>
              <Users className="h-4 w-4 text-[#c19a88]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {team ? `${members.length} / 6` : '0 / 6'}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                {team ? `${members.length} verified participant${members.length > 1 ? 's' : ''}` : 'Team unformed'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/team"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#c19a88] hover:text-[#e8c5b4] transition-colors"
              >
                <span>{team ? 'Manage members' : 'Assemble squad'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Telemetry Item 2: Authorization */}
          <div className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                02 / Enrollment Status
              </span>
              <CreditCard className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">
                {isPaid ? (
                  <span className="text-emerald-400">Verified Entry</span>
                ) : team ? (
                  <span className="text-amber-400">Fee Pending</span>
                ) : (
                  <span className="text-neutral-500">Unregistered</span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                {isPaid ? 'Authorized for all 4 stages' : '₹99 team registration fee'}
              </p>
            </div>
            <div className="pt-2">
              {team && !isPaid ? (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Complete payment</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="text-xs font-mono text-emerald-400/90 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Confirmed & Cleared
                </span>
              )}
            </div>
          </div>

          {/* Telemetry Item 3: Deliverables */}
          <div className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                03 / Submission Portal
              </span>
              <Send className="h-4 w-4 text-[#c19a88]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {submission?.status === 'submitted' ? (
                  <span className="text-emerald-400">Submitted</span>
                ) : (
                  <span className="text-neutral-200">Stage 03 Sprint</span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1 truncate">
                {submission?.title || 'GitHub, Live Demo & Architecture'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/submission"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#c19a88] hover:text-[#e8c5b4] transition-colors"
              >
                <span>Submission roadmap</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Telemetry Item 4: Awards */}
          <div className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                04 / Merit & Honors
              </span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {certificates.length > 0 ? (
                  <span className="text-emerald-400">{certificates.length} Issued</span>
                ) : (
                  <span>Top 25 Teams</span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Conferred to Grand Finale finalists
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/certificates"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Merit portal</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fluid Milestone Stepper (Continuous Horizontal Line, Not Box Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#c19a88]" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
              Competition Milestones & Progression
            </h2>
          </div>
          <Link
            href="/dashboard/stages"
            className="text-xs font-mono text-[#c19a88] hover:text-[#e8c5b4] inline-flex items-center gap-1 transition-colors"
          >
            <span>Full stage rubric</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Continuous Pipeline */}
        <div className="relative pt-3 pb-4">
          {/* Background Connecting Rail (Desktop) */}
          <div className="hidden md:block absolute top-7 left-8 right-8 h-px bg-gradient-to-r from-[#c19a88]/60 via-white/10 to-white/[0.04]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
            {/* Milestone 1: Screening Quiz */}
            <div className="flex md:flex-col items-start gap-3.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111111] border-2 border-[#c19a88] flex items-center justify-center text-xs font-mono font-bold text-[#e8c5b4] shadow-[0_0_12px_rgba(193,154,136,0.3)]">
                01
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Screening Quiz</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                    Next Up
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Online MCQ assessment evaluating core CS principles and track aptitude.
                </p>
                <div className="text-[11px] font-mono text-[#c19a88] pt-0.5">
                  Elimination & Seeding
                </div>
              </div>
            </div>

            {/* Milestone 2: Architecture PPT */}
            <div className="flex md:flex-col items-start gap-3.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111111] border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-neutral-300">
                02
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-200">Architecture Deck</span>
                  <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.05] border border-white/10 px-1.5 py-0.2 rounded">
                    Phase 02
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  10-slide technical blueprint covering system architecture and stack.
                </p>
                <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
                  Design Verification
                </div>
              </div>
            </div>

            {/* Milestone 3: 10-Day Sprint */}
            <div className="flex md:flex-col items-start gap-3.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111111] border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-neutral-300">
                03
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-200">10-Day Build Sprint</span>
                  <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.05] border border-white/10 px-1.5 py-0.2 rounded">
                    Phase 03
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Deliver GitHub codebase and live deployed URL on cloud hosting.
                </p>
                <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
                  Core Implementation
                </div>
              </div>
            </div>

            {/* Milestone 4: Grand Finale */}
            <div className="flex md:flex-col items-start gap-3.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111111] border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold text-amber-400">
                04
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-200">Grand Finale</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
                    Top 25
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Live jury defense, technical grilling, and cash prize conferment.
                </p>
                <div className="text-[11px] font-mono text-amber-400/80 pt-0.5">
                  ₹50,000+ Prize Pool
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Split Command Deck (Open Layout: Editorial Track Scope & Team Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6 border-t border-white/[0.08]">
        {/* Left Column: Assigned Track & Engineering Scope (~62% width) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#c19a88]" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                Assigned Track & Engineering Scope
              </span>
            </div>
            {track ? (
              <h2
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{ color: track.color_accent || '#e8c5b4' }}
              >
                {track.name}
              </h2>
            ) : (
              <h2 className="text-xl font-bold text-white">Track Selection Pending</h2>
            )}
          </div>

          {track ? (
            <div className="space-y-5">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {track.description}
              </p>

              {/* Rubric Pillars */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  Core Evaluation Dimensions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border-l-2 border-[#c19a88] pl-3 py-1 space-y-0.5">
                    <div className="text-xs font-bold text-white">Technical Rigor</div>
                    <div className="text-[11px] text-neutral-400">Architecture, clean git commit history, robust error handling</div>
                  </div>
                  <div className="border-l-2 border-[#e8c5b4] pl-3 py-1 space-y-0.5">
                    <div className="text-xs font-bold text-white">Real-World Utility</div>
                    <div className="text-[11px] text-neutral-400">Addresses genuine domain friction with high practical value</div>
                  </div>
                  <div className="border-l-2 border-amber-400 pl-3 py-1 space-y-0.5">
                    <div className="text-xs font-bold text-white">Deployment</div>
                    <div className="text-[11px] text-neutral-400">Live accessible URL + optional 2-3 min video walkthrough</div>
                  </div>
                </div>
              </div>

              {/* Submission Target Timeline */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-neutral-400 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>
                    Deadline:{' '}
                    <span className="text-white font-mono font-medium">
                      {formatDate(event.submission_deadline)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    Portal status:{' '}
                    <span className="text-emerald-400 font-medium">
                      Unlocks during 10-day sprint
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/track"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
                >
                  <span>Detailed Track Rubric</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/dashboard/submission"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] transition-all"
                >
                  <span>Submission Roadmap</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href="/rules"
                  className="text-xs font-medium text-neutral-400 hover:text-[#c19a88] transition-colors ml-auto"
                >
                  Official Rules →
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] space-y-3">
              <p className="text-sm text-neutral-300">
                You haven&apos;t enrolled a team or selected an engineering track yet.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#c19a88] hover:underline"
              >
                <span>Register your squad & choose your track</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Roster Stream & Latest Broadcast (~38% width) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Section A: Team Squad Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#c19a88]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  Enrolled Squad ({members.length}/6)
                </h3>
              </div>
              <Link
                href="/dashboard/team"
                className="text-xs font-mono text-[#c19a88] hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {members.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[11px] font-mono font-bold text-[#e8c5b4] flex-shrink-0">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{member.name}</span>
                        {member.role === 'leader' && (
                          <span className="text-[9px] font-mono font-bold text-[#c19a88] bg-[#c19a88]/15 px-1.5 py-0.2 rounded">
                            LEADER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono truncate">
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/80">Active</span>
                </div>
              ))}

              {team && members.length < 6 && (
                <div className="pt-2">
                  <Link
                    href="/dashboard/team"
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#c19a88]" />
                    <span>Invite member ({6 - members.length} slot{6 - members.length > 1 ? 's' : ''} left)</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section B: Official Dispatch */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#c19a88]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  Official Dispatch
                </h3>
              </div>
              <Link
                href="/dashboard/announcements"
                className="text-xs font-mono text-[#c19a88] hover:underline"
              >
                All broadcasts ({announcements.length})
              </Link>
            </div>

            {latestAnnouncement ? (
              <div className="space-y-1.5 py-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-[#c19a88] uppercase tracking-wider font-semibold">
                    {latestAnnouncement.category}
                  </span>
                  <span className="text-neutral-500 font-mono">
                    {new Date(latestAnnouncement.published_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  {latestAnnouncement.title}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {latestAnnouncement.content}
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 py-1">
                No active announcements at this time.
              </p>
            )}
          </div>

          {/* Section C: Direct Helpdesk */}
          <div className="pt-4 border-t border-white/[0.06] space-y-1.5 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
              <Mail className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Organizer Support Desk</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Have questions regarding track requirements or team authorization? Reach the committee at{' '}
              <a
                href="mailto:skalekraft@gmail.com"
                className="text-[#c19a88] hover:underline font-mono"
              >
                skalekraft@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
