import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { CheckCircle2, Github, Globe, Video, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export const revalidate = 0;

export default async function SubmissionStatusPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;

  if (!submission) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
        <h2 className="text-xl font-bold text-white">No Submission Found</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Your team has not yet recorded a submission for the current Skaleathon event.
        </p>
        <Link
          href="/dashboard/submission"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
        >
          <span>Create Submission</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#131211] via-[#0E0E0E] to-[#0A0A0A] p-8 sm:p-12 space-y-6 shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-3 w-3" />
            <span>Official Deliverable Receipt</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submission Received & Queued
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
            Project <strong className="text-white">{submission.title}</strong> by team <strong className="text-[#e8c5b4]">{team?.name}</strong> has been logged for technical jury review.
          </p>
        </div>

        {/* Receipt Details Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 space-y-3.5 text-xs backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-neutral-400">Submission Identifier</span>
            <span className="font-mono font-bold text-white tracking-wider">{submission.id}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-neutral-400">Evaluation Status</span>
            <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{submission.status}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-neutral-400">Submission Timestamp</span>
            <span className="font-mono text-neutral-300">
              {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'Draft'}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-neutral-400">Code Repository</span>
            <a
              href={submission.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#e8c5b4] hover:text-white hover:underline flex items-center gap-1 max-w-[240px] truncate"
            >
              <Github className="h-3.5 w-3.5 shrink-0 text-[#c19a88]" />
              <span className="truncate">{submission.github_url.replace('https://github.com/', '')}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>

          {submission.live_demo_url && (
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-neutral-400">Live Demo</span>
              <a
                href={submission.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#c19a88] hover:underline flex items-center gap-1 max-w-[240px] truncate"
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{submission.live_demo_url}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          )}

          {submission.demo_video_url && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Walkthrough Video</span>
              <a
                href={submission.demo_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#c19a88] hover:underline flex items-center gap-1 max-w-[240px] truncate"
              >
                <Video className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{submission.demo_video_url}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/dashboard/submission"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-2.5 text-xs font-semibold text-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Update Submission</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
