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
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/30 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-4">
            <Trophy className="h-3.5 w-3.5" />
            <span>National Standings</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Official Leaderboard & Results
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Authoritative rankings evaluated by our technical judging panel. Top 25 teams receive verified merit certificates.
          </p>
        </div>

        {!isPublished ? (
          /* Unannounced / Under Evaluation State */
          <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-[#0c1220] p-12 text-center space-y-6">
            <div className="p-4 w-fit mx-auto rounded-2xl bg-white/5 border border-white/10 text-slate-400">
              <Lock className="h-8 w-8 text-cyanAccent-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Results Have Not Yet Been Announced</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Project submissions are currently progressing through rigorous multi-criterion evaluation. Official standings and prize announcements will be published here once authorized by the organizers.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-brand-500/30 bg-brand-950/40 text-brand-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Current Stage: {event.status.replace(/_/g, ' ').toUpperCase()}</span>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-6 py-2.5 rounded-xl transition-colors"
              >
                Go to Team Dashboard
              </Link>
              <Link
                href="/rules"
                className="w-full sm:w-auto text-xs font-semibold text-slate-300 hover:text-white px-6 py-2.5 rounded-xl border border-white/10 transition-colors"
              >
                Review Judging Criteria
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
                    className={`rounded-3xl border p-8 flex flex-col justify-between ${
                      isChampion
                        ? 'border-amber-500/50 bg-gradient-to-b from-[#182035] to-[#0c111e] shadow-xl shadow-amber-500/10'
                        : 'border-white/10 bg-[#0c1220]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md border ${
                            isChampion
                              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          Rank #{item.rank}
                        </span>
                        <Trophy
                          className={`h-6 w-6 ${
                            isChampion ? 'text-amber-400' : item.rank === 2 ? 'text-slate-300' : 'text-orange-400'
                          }`}
                        />
                      </div>

                      <h3 className="text-xl font-extrabold text-white mb-1">{item.team_name}</h3>
                      <p className="text-xs font-medium text-cyanAccent-400 mb-3">{item.project_title}</p>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                        {item.track_name}
                      </span>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase">
                        {item.prize_category?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        Score: {item.final_score.toFixed(1)}/100
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remaining Top 25 Teams Table */}
            <div className="rounded-3xl border border-white/10 bg-[#0c1220] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 bg-[#080d17] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Published Rankings (Top 25 Merit List)
                </span>
                <span className="text-xs text-cyanAccent-400 flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  Eligible for Official Certificate Conferral
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-[#0a0f1d] text-slate-400 font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">Rank</th>
                      <th className="py-3.5 px-6">Team Name</th>
                      <th className="py-3.5 px-6">Project Title</th>
                      <th className="py-3.5 px-6">Track</th>
                      <th className="py-3.5 px-6">Recognition</th>
                      <th className="py-3.5 px-6 text-right">Final Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.map((res) => (
                      <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-bold text-white">#{res.rank}</td>
                        <td className="py-4 px-6 font-bold text-slate-200">{res.team_name}</td>
                        <td className="py-4 px-6 text-slate-300">{res.project_title || '—'}</td>
                        <td className="py-4 px-6 text-slate-400">{res.track_name || 'General'}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-brand-950/50 text-brand-300 border border-brand-500/30">
                            {res.prize_category ? res.prize_category.replace(/_/g, ' ') : 'Top 25 Finalist'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-slate-200">
                          {res.final_score.toFixed(1)}
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
