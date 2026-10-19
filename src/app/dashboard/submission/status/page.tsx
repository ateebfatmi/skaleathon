import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { CheckCircle2, Github, Globe, Video, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function SubmissionStatusPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;

  if (!submission) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Submission Found</h2>
        <p className="text-xs text-slate-400">
          Your team has not yet recorded a project submission for Skaleathon 2027.
        </p>
        <Link
          href="/dashboard/submission"
          className="inline-block rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
        >
          Create Submission
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0e1628] to-[#0a0e19] p-8 sm:p-12 space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Authoritative Server Receipt
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Submission Received & Locked
          </h1>
          <p className="text-xs text-slate-300">
            Project <strong>{submission.title}</strong> submitted for team <strong>{team?.name}</strong> has been logged for evaluation.
          </p>
        </div>

        {/* Receipt Details Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3 text-xs">
          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400">Submission Identifier</span>
            <span className="font-mono font-bold text-white">{submission.id}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400">Review Status</span>
            <span className="font-bold text-emerald-400 uppercase">{submission.status}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400">Timestamp</span>
            <span className="font-mono text-slate-200">
              {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'Draft'}
            </span>
          </div>

          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400">Repository</span>
            <a
              href={submission.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-cyanAccent-400 hover:underline flex items-center gap-1"
            >
              <span>{submission.github_url}</span>
            </a>
          </div>

          {submission.live_demo_url && (
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Live Demo</span>
              <a
                href={submission.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-cyanAccent-400 hover:underline"
              >
                {submission.live_demo_url}
              </a>
            </div>
          )}

          {submission.demo_video_url && (
            <div className="flex justify-between">
              <span className="text-slate-400">Video Walkthrough</span>
              <a
                href={submission.demo_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-cyanAccent-400 hover:underline"
              >
                {submission.demo_video_url}
              </a>
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/dashboard/submission"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Update Submission</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
