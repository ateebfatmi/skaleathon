import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { formatDate } from '@/lib/utils';
import {
  Code2,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck2,
  Cpu,
  Globe,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardTrackPage() {
  const session = await getCurrentSession();
  const event = await EventRepository.getEvent();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;
  const allTracks = await EventRepository.getTracks();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/80 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-10 -bottom-10 w-60 h-60 rounded-full blur-[100px]"
          style={{
            backgroundColor: track?.color_accent ? `${track.color_accent}25` : '#c19a8820',
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: track?.color_accent || '#c19a88' }}
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c19a88] font-bold">
                Assigned Track & Problem Domain
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span>{track ? track.name : 'Track Specifications'}</span>
              {track && (
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10"
                  style={{
                    color: track.color_accent,
                    backgroundColor: `${track.color_accent}15`,
                  }}
                >
                  {track.slug.toUpperCase()}
                </span>
              )}
            </h1>
            <p className="text-xs text-white/50 mt-1 max-w-xl">
              Official technical specifications, problem domains, evaluation rubrics, and deliverable guidelines for your team.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard/submission"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B0B0B] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e8c5b4] to-[#c19a88] hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Submit Project</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {track ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Track Detail Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/70 p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#c19a88]" />
                <span>Track Scope & Objective</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {track.description}
              </p>

              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Submission Deadline:</span>
                  <strong className="text-white font-mono">
                    {formatDate(event.submission_deadline)}
                  </strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Team Size:</span>
                  <strong className="text-white">1–6 Innovators</strong>
                </div>
              </div>
            </div>

            {/* Deliverable Requirements */}
            <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/70 p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#c19a88]" />
                <span>Required Deliverables</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Public GitHub Repository</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed pl-5.5">
                    Clean commit history created during the hackathon period with comprehensive README setup instructions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Live Hosted Application</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed pl-5.5">
                    Functional deployment (Vercel, Railway, Render, Cloudflare, etc.) accessible by judges without credentials.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
                    <span>2-3 Minute Video Demo (Optional Advantage)</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed pl-5.5">
                    Unlisted YouTube, Loom, or Drive video. A video link is not necessary, but will give your team a distinct evaluation advantage with the judges.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>AI Tool Disclosure</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed pl-5.5">
                    Transparent declaration of any LLMs, generative APIs, or pre-existing templates utilized in development.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Evaluation Rubric */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/70 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#c19a88]" />
                <span>Judging Criteria</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-semibold text-white">Innovation & Originality</span>
                    <span className="font-mono text-[#c19a88]">30%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[30%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-semibold text-white">Technical Execution</span>
                    <span className="font-mono text-[#c19a88]">30%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[30%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-semibold text-white">Practical Scalability & Impact</span>
                    <span className="font-mono text-[#c19a88]">20%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[20%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-semibold text-white">UX & Presentation Quality</span>
                    <span className="font-mono text-[#c19a88]">20%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[20%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/70 p-5 text-center space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Ready to submit?</h4>
              <p className="text-[11px] text-neutral-400">
                You can save drafts and finalize your submission any time before the deadline.
              </p>
              <Link
                href="/dashboard/submission"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                <span>Go to Submission Portal</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback if no team or track selected yet */
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/70 p-8 text-center space-y-3">
            <h2 className="text-lg font-bold text-white">No Track Selected Yet</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              You haven&apos;t registered a team or chosen a track yet. Choose one of our three core tracks during team registration:
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] to-[#c19a88] px-5 py-2 text-xs font-bold text-white shadow-md"
            >
              <span>Register Team (₹99)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allTracks.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-white/10 bg-[#0E0E0E]/60 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      borderColor: `${t.color_accent}40`,
                      backgroundColor: `${t.color_accent}15`,
                      color: t.color_accent,
                    }}
                  >
                    {t.slug.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{t.name}</h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
