import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { Trophy, Award, Lock, ExternalLink, Github, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function LeaderboardPage() {
  const [event, results] = await Promise.all([
    EventRepository.getEvent(),
    EventRepository.getPublicLeaderboard(),
  ]);

  const isPublished = event.status === 'results_announced' && results.length > 0;

  return (
    <div className="py-20 sm:py-28 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              National Standings
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
            Official{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              leaderboard
            </span>
            .
          </h1>
          <p className="mt-4 text-base text-white/55 leading-relaxed font-light">
            Authoritative national rankings evaluated by our technical judging panel. Top 25 teams earn verifiable digital merit credentials.
          </p>
        </div>

        {!isPublished ? (
          /* Unannounced / Under Evaluation State */
          <div className="max-w-2xl mx-auto rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(14,14,14,0.96))] p-10 sm:p-14 text-center space-y-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
            <div className="p-4 w-fit mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[#c19a88]">
              <Lock className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-white">Results Pending Official Announce</h2>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                Project submissions are currently progressing through multi-criterion evaluation. Official standings and prize conferrals will be published here upon authorization.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wide px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-[#c19a88]">
              <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>CURRENT STAGE: {event.status.replace(/_/g, ' ').toUpperCase()}</span>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-3 rounded-full transition-all shadow-[0_4px_20px_rgba(128,89,72,0.3)] hover:scale-105"
              >
                Go to Team Dashboard
              </Link>
              <Link
                href="/rules"
                className="w-full sm:w-auto text-xs font-medium text-white/70 hover:text-white px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                Review Judging Protocol
              </Link>
            </div>
          </div>
        ) : (
          /* Published Leaderboard State */
          <div className="space-y-8">
            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.slice(0, 3).map((item) => {
                const isChampion = item.rank === 1;
                return (
                  <div
                    key={item.id}
                    className={`rounded-[28px] border p-8 flex flex-col justify-between ${
                      isChampion
                        ? 'border-[#c19a88]/60 bg-[linear-gradient(145deg,rgba(193,154,136,0.08),rgba(17,14,13,0.96))] shadow-[0_25px_70px_rgba(128,89,72,0.3)]'
                        : 'border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#c19a88]">
                          Rank #{item.rank}
                        </span>
                        <Trophy
                          className={`h-5 w-5 ${
                            isChampion ? 'text-[#c19a88]' : item.rank === 2 ? 'text-white/60' : 'text-[#805948]'
                          }`}
                          strokeWidth={1.8}
                        />
                      </div>

                      <h3 className="text-xl font-medium text-white mb-1">{item.team_name}</h3>
                      <p className="text-xs text-white/50 mb-4">{item.project_title}</p>
                      <div className="text-3xl font-mono font-bold text-white tracking-tight">
                        {item.final_score.toFixed(2)}{' '}
                        <span className="text-xs font-sans font-normal text-white/40">/ 100</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/50">
                      <span>{item.track_name || 'General Arena'}</span>
                      <span className="text-[#c19a88] font-medium">{item.prize_category?.replace(/_/g, ' ') || 'Top 25 Merit'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extended Ranks Table */}
            <div className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] uppercase font-mono tracking-[0.18em] text-white/40">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Team</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Track</th>
                      <th className="px-6 py-4 text-right">Score</th>
                      <th className="px-6 py-4 text-right">Award</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs">
                    {results.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-white">#{r.rank}</td>
                        <td className="px-6 py-4 font-medium text-white">{r.team_name}</td>
                        <td className="px-6 py-4 text-white/55">{r.project_title}</td>
                        <td className="px-6 py-4 text-white/55">{r.track_name}</td>
                        <td className="px-6 py-4 text-right font-mono font-semibold text-[#c19a88]">
                          {r.final_score.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.02] text-white/60">
                            {r.prize_category ? r.prize_category.replace(/_/g, ' ') : 'Top 25 Merit'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
