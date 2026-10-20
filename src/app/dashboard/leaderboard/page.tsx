import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  Trophy,
  Award,
  Lock,
  Layers,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';
import { formatINR } from '@/lib/utils';

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
    <div className="relative w-full space-y-14 pb-24 text-neutral-200">
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
          <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
            RANKINGS
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
            </span>
            <span className="text-[#c19a88]">National Standings {'//'} Jury Evaluation</span>
            <span className="text-white/20">•</span>
            <span className="text-neutral-400">
              Squad: <strong className="text-white font-semibold">{team ? team.name : 'Unassigned'}</strong>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#e8c5b4] font-semibold">
              {isPublished ? '[PUBLISHED]' : '[UNLOCKS STAGE 01]'}
            </span>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Overview</span>
            </Link>

            <span className="text-white/15">|</span>

            <Link
              href="/dashboard/stages"
              className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage Roadmap</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Headline & Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-5 pb-9">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            Competition{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              Leaderboard
            </span>
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
            Official national standings and weighted evaluation scores adjudicated by the SkaleKraft technical jury. Live qualifier percentiles activate immediately following the Stage 01 Online Technical Quiz.
          </p>
        </div>

        {/* Full-Width 4-Column Editorial Section Index Bar with Transition */}
        <EditorialIndexBar
          layoutIdPrefix="leaderboardIndex"
          items={[
            { num: '01', label: 'Stage 01: First Reveal', href: '#progression' },
            { num: '02', label: 'Stage 02 & 03: Sprint Ranks', href: '#progression' },
            { num: '03', label: 'National Honors & Prizes', href: '#honors' },
            { num: '04', label: 'Jury Scoring Rubric', href: '/dashboard/track#rubric' },
          ]}
        />
      </header>

      {!isPublished ? (
        <>
          {/* 2. Section 01: Leaderboard Activation Protocol */}
          <section id="progression" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                  01 {'//'} Standings Activation Protocol
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Unlocks After{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Stage 01 Screening
                  </span>
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400/90">
                <Lock className="h-3.5 w-3.5" />
                <span>AWAITING STAGE 01 QUIZ COMPLETION</span>
              </div>
            </div>

            {/* Side-by-Side Architectural Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
              {/* Pillar 01 */}
              <div className="relative pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                    Pillar 01 • Stage 01 Screening Reveal
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Initial Seeding &amp; Qualifier Cutoffs
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  The national leaderboard remains locked during registration. Once the Stage 01 Online Technical Quiz concludes, official screening percentiles and advancing squad seeds publish directly on this page.
                </p>
              </div>

              {/* Pillar 02 */}
              <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                    Pillar 02 • Cumulative Stage Progression
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Blueprint, Build Sprint &amp; Finale Standings
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Qualifying squads are tracked across Stage 02 (Architecture Blueprint), Stage 03 (Build Sprint), and Stage 04 (Live Grand Finale Defense) to determine the top {event.certificates_top_n} National Merit Roster and podium champions.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Section 02: National Honors & Prize Structure */}
          <section id="honors" className="space-y-6 pt-10 border-t border-white/[0.08] scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                  02 {'//'} Recognition &amp; Bounty Pool
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  National Podium &amp;{' '}
                  <span className="font-serif italic font-normal text-[#e8c5b4]">
                    Merit Distinctions
                  </span>
                </h2>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e8c5b4]">
                {formatINR(event.prize_pool_inr)} Total Cash Pool
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
              {[
                {
                  rank: '01',
                  title: 'National Champion (1st Place)',
                  desc: 'Highest cumulative score across technical architecture, innovation, and live jury defense.',
                  reward: `${formatINR(event.first_prize_inr)} Cash + Winner Citation`,
                  accent: 'text-[#e8c5b4]',
                },
                {
                  rank: '02',
                  title: 'First Runner-Up (2nd Place)',
                  desc: 'Exceptional engineering execution, production readiness, and real-world domain scalability.',
                  reward: `${formatINR(event.second_prize_inr)} Cash + Runner-Up Citation`,
                  accent: 'text-white',
                },
                {
                  rank: '03',
                  title: 'Second Runner-Up (3rd Place)',
                  desc: 'Outstanding technical prototype, problem formulation, and interface craft.',
                  reward: `${formatINR(event.third_prize_inr)} Cash + Finalist Citation`,
                  accent: 'text-[#c19a88]',
                },
                {
                  rank: String(event.certificates_top_n).padStart(2, '0'),
                  title: `Top ${event.certificates_top_n} National Merit Roster`,
                  desc: `Official national rank citation and verified achievement credentials for the top ${event.certificates_top_n} squads.`,
                  reward: `Top ${event.certificates_top_n} Merit Distinction`,
                  accent: 'text-emerald-400',
                },
              ].map((tier) => (
                <div
                  key={tier.rank}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-xs font-bold text-[#c19a88] w-6 shrink-0 pt-0.5 sm:pt-0">
                      #{tier.rank}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm sm:text-base font-bold text-white">{tier.title}</h3>
                      <p className="text-xs text-neutral-400 font-light">{tier.desc}</p>
                    </div>
                  </div>

                  <span className={`font-mono text-xs sm:text-sm font-bold shrink-0 ${tier.accent}`}>
                    {tier.reward}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Published Leaderboard Ledger (Open Hairline Table, No Box) */
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                01 {'//'} Verified Jury Standings
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                National Standings &amp;{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Merit Scores
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OFFICIAL RESULTS</span>
            </div>
          </div>

          <div className="overflow-x-auto border-t border-b border-white/[0.08]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pr-4">Rank</th>
                  <th className="py-3.5 px-4">Squad</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Track</th>
                  <th className="py-3.5 px-4 text-right">Score</th>
                  <th className="py-3.5 pl-4 text-right">Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {results.map((entry, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const isTop25 = rank <= event.certificates_top_n;

                  return (
                    <tr
                      key={entry.team_id}
                      className={`transition-colors ${
                        entry.team_id === session?.teamId ? 'bg-[#c19a88]/[0.06]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="py-4 pr-4 font-mono font-bold text-[#c19a88]">
                        #{String(rank).padStart(2, '0')}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{entry.team_name}</span>
                          {entry.team_id === session?.teamId && (
                            <span className="text-[9px] font-mono uppercase text-[#e8c5b4]">
                              • Your Squad
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-neutral-300 font-light">
                        {entry.project_title || 'Untitled Project'}
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-neutral-400">
                        {entry.track_name}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-[#e8c5b4]">
                        {(entry.final_score ?? 0).toFixed(1)}
                      </td>
                      <td className="py-4 pl-4 text-right font-mono text-[11px]">
                        {isTop3 ? (
                          <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                            <Trophy className="h-3 w-3" />
                            <span>Podium</span>
                          </span>
                        ) : isTop25 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <Award className="h-3 w-3" />
                            <span>Top {event.certificates_top_n} Merit</span>
                          </span>
                        ) : (
                          <span className="text-neutral-500">Participant</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
