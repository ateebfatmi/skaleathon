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
  ShieldAlert,
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

  return (
    <div className="space-y-8">
      {/* Top Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Registration & Team Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Status</span>
            <Users className="h-4 w-4 text-cyanAccent-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {team ? team.name : 'No Team Registered'}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {team ? `${members.length} Member(s) enrolled` : 'Register a team to compete'}
            </p>
          </div>
          {team ? (
            <Link
              href="/dashboard/team"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyanAccent-400 hover:underline"
            >
              <span>Manage Team</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:underline"
            >
              <span>Register Team (₹99)</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Payment Verification Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Status</span>
            <CreditCard className="h-4 w-4 text-brand-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white flex items-center gap-1.5">
              {team?.status === 'paid' ? (
                <>
                  <span className="text-emerald-400">Verified Paid</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </>
              ) : team ? (
                <span className="text-yellow-400">Payment Required</span>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {team?.status === 'paid' ? 'Authorized for Submission' : '₹99 per team registration fee'}
            </p>
          </div>
          {team && team.status !== 'paid' && (
            <Link
              href="/register"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline"
            >
              <span>Complete Payment</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Project Submission Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submission</span>
            <Send className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {submission?.status === 'submitted' ? (
                <span className="text-emerald-400">Submitted</span>
              ) : submission?.status === 'draft' ? (
                <span className="text-yellow-400">Draft In Progress</span>
              ) : (
                <span className="text-slate-400">Not Submitted</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {submission ? submission.title : 'GitHub repo & demo links'}
            </p>
          </div>
          <Link
            href="/dashboard/submission"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:underline"
          >
            <span>{submission ? 'View / Edit Submission' : 'Create Submission'}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Certificate Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1220] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificates</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {certificates.length > 0 ? (
                <span className="text-emerald-400">{certificates.length} Available</span>
              ) : (
                <span className="text-slate-400">Pending Results</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Conferred to Top 25 Teams
            </p>
          </div>
          <Link
            href="/dashboard/certificates"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:underline"
          >
            <span>Certificate Portal</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Details & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Team & Track Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Selected Track Details</span>
              {track && (
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5"
                  style={{ color: track.color_accent }}
                >
                  {track.name}
                </span>
              )}
            </h3>

            {track ? (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">{track.description}</p>
                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-cyanAccent-400" />
                  <span>Submission Deadline: {formatDate(event.submission_deadline)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                You have not selected a track yet. Register your team to choose AI/ML, Web, or App Development.
              </p>
            )}
          </div>

          {/* Submission Quick Status */}
          {submission && (
            <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Project: {submission.title}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  {submission.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">
                {submission.problem_statement}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                {submission.tech_stack.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Event Announcements */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyanAccent-400" />
              <span>Official Event Announcements</span>
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="rounded-xl border border-white/5 bg-[#080d17] p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
