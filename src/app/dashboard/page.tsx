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
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const event = await EventRepository.getEvent();

  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const members = team ? await EventRepository.getTeamMembers(team.id) : [];
  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;
  const announcements = await EventRepository.getAnnouncements(true);
  const certificates = team ? await EventRepository.getCertificatesByTeam(team.id) : [];

  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  return (
    <div className="space-y-5">
      {/* 4 Compact Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Team Status */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-4 space-y-2.5 backdrop-blur-md hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Team Roster
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-white truncate">
              {team ? team.name : 'No Team'}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {team ? `${members.length} / 6 members enrolled` : 'Register a team (₹99)'}
            </p>
          </div>
          <div className="pt-1 border-t border-white/[0.06]">
            {team ? (
              <Link
                href="/dashboard/team"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Manage Roster</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c19a88] hover:underline"
              >
                <span>Register Team</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Payment Verification */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-4 space-y-2.5 backdrop-blur-md hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Payment Status
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              {team?.status === 'paid' ? (
                <>
                  <span className="text-emerald-400">Verified Paid</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </>
              ) : team ? (
                <span className="text-amber-400">Payment Pending</span>
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {team?.status === 'paid' ? 'Authorized for Submission' : '₹99 registration fee'}
            </p>
          </div>
          <div className="pt-1 border-t border-white/[0.06]">
            {team && team.status !== 'paid' ? (
              <Link
                href="/register"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline"
              >
                <span>Complete Fee</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <span className="text-[11px] font-mono text-emerald-400/80">Fee Cleared</span>
            )}
          </div>
        </div>

        {/* Submission */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-4 space-y-2.5 backdrop-blur-md hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Deliverables
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Send className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {submission?.status === 'submitted' ? (
                <span className="text-emerald-400">Submitted</span>
              ) : submission?.status === 'draft' ? (
                <span className="text-amber-400">Draft In Progress</span>
              ) : (
                <span className="text-neutral-400">Not Submitted</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              {submission?.title || 'GitHub, Demo & Video'}
            </p>
          </div>
          <div className="pt-1 border-t border-white/[0.06]">
            <Link
              href="/dashboard/submission"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c19a88] hover:text-[#e8c5b4] transition-colors"
            >
              <span>{submission ? 'Edit Submission' : 'Submit Project'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Certificates */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-4 space-y-2.5 backdrop-blur-md hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Certificates
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {certificates.length > 0 ? (
                <span className="text-emerald-400">{certificates.length} Issued</span>
              ) : (
                <span className="text-neutral-400">Pending Results</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Conferred to Top 25 Teams
            </p>
          </div>
          <div className="pt-1 border-t border-white/[0.06]">
            <Link
              href="/dashboard/certificates"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Merit Portal</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Focus Row (2 Compact Columns - Designed to fit in viewport without excess scrolling) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Track & Submission Status Hub (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#c19a88]" />
              <h2 className="text-sm font-bold text-white">Assigned Track & Submission</h2>
            </div>
            {track && (
              <span
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-white/10"
                style={{
                  color: track.color_accent,
                  backgroundColor: `${track.color_accent}15`,
                }}
              >
                {track.name}
              </span>
            )}
          </div>

          {track ? (
            <div className="space-y-3">
              <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                {track.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                    Submission Deadline
                  </span>
                  <div className="flex items-center gap-1.5 text-white font-mono font-semibold mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
                    <span>{formatDate(event.submission_deadline)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                    Deliverable Status
                  </span>
                  <div className="flex items-center gap-1.5 text-white font-semibold mt-1">
                    {submission?.status === 'submitted' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Project Locked
                      </span>
                    ) : submission ? (
                      <span className="text-amber-400">Draft in Review</span>
                    ) : (
                      <span className="text-neutral-400">Ready for Draft</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/dashboard/track"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <span>Track Specs & Rubric</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                <Link
                  href="/dashboard/submission"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B0B0B] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e8c5b4] to-[#c19a88] hover:opacity-95 transition-opacity shadow-sm"
                >
                  <span>{submission ? 'Open Submission Editor' : 'Start Submission'}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 space-y-2 py-2">
              <p>You have not registered or selected a track yet.</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c19a88] hover:underline"
              >
                <span>Register a team to choose your track →</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Latest Announcement Preview (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 space-y-3.5 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#c19a88]" />
                <h2 className="text-sm font-bold text-white">Latest Announcement</h2>
              </div>
              <Link
                href="/dashboard/announcements"
                className="text-[11px] font-mono text-[#c19a88] hover:underline inline-flex items-center gap-1"
              >
                <span>View All ({announcements.length})</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>

            {latestAnnouncement ? (
              <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#080d17]/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="font-mono text-[#c19a88] uppercase font-semibold">
                    {latestAnnouncement.category}
                  </span>
                  <span>{new Date(latestAnnouncement.published_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">
                  {latestAnnouncement.title}
                </h3>
                <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                  {latestAnnouncement.content}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] text-center text-xs text-neutral-400">
                No active announcements at this time.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
            <span>Need assistance?</span>
            <Link
              href="/faq"
              className="text-[#c19a88] hover:text-[#e8c5b4] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Check FAQ</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
