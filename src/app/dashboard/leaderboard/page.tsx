import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  Trophy,
  Award,
  Lock,
  Sparkles,
  Layers,
  Code2,
  Users,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardLeaderboardPage() {
  const session = await getCurrentSession();
  const [event, results, team] = await Promise.all([
    EventRepository.getEvent(),
    EventRepository.getPublicLeaderboard(),
    session?.teamId ? EventRepository.getTeam(session.teamId) : null,
  ]);

  const isPublished = event.status === 'results_announced' && results.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#120F0D]/90 via-[#0B0C12]/90 to-[#120F0D]/90 p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 bg-[#c19a88]/15 rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c19a88] font-bold">
                Participant Workspace Standings
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Competition Leaderboard
            </h1>
            <p className="text-xs text-neutral-400">
              Official national standings and scoring breakdowns evaluated by the SkaleKraft technical jury.
            </p>
          </div>

          {team && (
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-right shrink-0">
              <span className="text-[10px] text-neutral-400 font-mono block">Enrolled Team</span>
              <span className="text-xs font-bold text-[#e8c5b4]">{team.name}</span>
            </div>
          )}
        </div>
      </div>

      {!isPublished ? (
        /* Unannounced / In Progress Evaluation State */
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E0E0E]/90 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-48 bg-[#c19a88]/15 rounded-full blur-[90px]" />

          {/* Lock & Trophy Badge */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c19a88]/40 bg-[#805948]/20 text-[#e8c5b4] shadow-[0_0_30px_rgba(193,154,136,0.25)]">
            <Lock className="h-7 w-7 text-[#c19a88]" strokeWidth={1.8} />
          </div>

          <div className="space-y-3 relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-wider px-3.5 py-1 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#e8c5b4]">
              <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>OFFICIAL STANDINGS LOCKED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Rankings Unlock Post-Defense
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              Scores and national podium standings will be published here in the dashboard following the <strong>Stage 04 Live Panel Defense</strong>. Every deliverable undergoes blind multi-judge evaluation across architectural rigor, code originality, and execution impact.
            </p>
          </div>

          {/* Milestone Progression Cards */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                Round 01
              </span>
              <div className="text-xs font-semibold text-white">Quiz & Screening</div>
              <p className="text-[11px] text-neutral-400 font-light">
                CS logic, algorithm complexity & track fundamentals
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c19a88] block">
                Round 02
              </span>
              <div className="text-xs font-semibold text-white">10-Day Build Sprint</div>
              <p className="text-[11px] text-neutral-400 font-light">
                Public GitHub repo, live demo URL & video walkthrough
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                Round 03
              </span>
              <div className="text-xs font-semibold text-white">Grand Finale Defense</div>
              <p className="text-[11px] text-neutral-400 font-light">
                Live jury defense, Top 25 merit ranks & ₹35K awards
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/stages"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
            >
              <Layers className="h-4 w-4" />
              <span>Explore Stages</span>
            </Link>

            <Link
              href="/dashboard/track"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-2.5 text-xs font-semibold text-neutral-200 transition-colors"
            >
              <Code2 className="h-4 w-4 text-[#c19a88]" />
              <span>Track Specifications</span>
            </Link>

            <Link
              href="/dashboard/team"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-2.5 text-xs font-semibold text-neutral-200 transition-colors"
            >
              <Users className="h-4 w-4 text-[#c19a88]" />
              <span>Manage My Team</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Published Leaderboard Table */
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">National Standings & Merit Scores</h2>
              <p className="text-xs text-neutral-400">Final verified scores calculated across all judging criteria.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Results Published</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6">Rank</th>
                  <th className="py-3 px-6">Team Name</th>
                  <th className="py-3 px-6">Project Title</th>
                  <th className="py-3 px-6">Track</th>
                  <th className="py-3 px-6 text-right">Score</th>
                  <th className="py-3 px-6 text-center">Merit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {results.map((entry, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const isTop25 = rank <= 25;

                  return (
                    <tr
                      key={entry.team_id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        entry.team_id === session?.teamId ? 'bg-[#c19a88]/10' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-mono font-bold">
                        {isTop3 ? (
                          <span
                            className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-black font-bold text-xs ${
                              rank === 1
                                ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                                : rank === 2
                                ? 'bg-slate-300 shadow-[0_0_12px_rgba(203,213,225,0.4)]'
                                : 'bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.4)]'
                            }`}
                          >
                            {rank}
                          </span>
                        ) : (
                          <span className="text-neutral-400">#{rank}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{entry.team_name}</span>
                          {entry.team_id === session?.teamId && (
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#c19a88]/20 text-[#e8c5b4] border border-[#c19a88]/40">
                              Your Team
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-neutral-300 font-medium">
                        {entry.project_title || 'Untitled Project'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-white/10 bg-white/[0.03] text-neutral-300">
                          {entry.track_name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-[#e8c5b4]">
                        {(entry.final_score ?? 0).toFixed(1)} / 100
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isTop3 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                            <Trophy className="h-3 w-3" />
                            <span>Podium Winner</span>
                          </span>
                        ) : isTop25 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            <Award className="h-3 w-3" />
                            <span>Top 25 Merit</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-mono">Participant</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
