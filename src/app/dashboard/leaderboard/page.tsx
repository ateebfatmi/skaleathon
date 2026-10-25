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
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
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
    <div className="relative w-full space-y-8 pb-20 text-neutral-200">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-full max-w-5xl rounded-full bg-[#f5f5f5]/10 blur-[150px]" />

      {/* 1. Header & Context */}
      <header className="relative space-y-4 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[#c19a88] font-bold uppercase tracking-wider">
              National Leaderboard
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white font-semibold">
              Squad: {team ? team.name : 'Your Team'}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#ffffff] font-semibold">
              {isPublished ? '[PUBLISHED]' : '[UNLOCKS POST-STAGE 01]'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Back to Overview</span>
            </Link>
            <span className="text-white/15">|</span>
            <Link
              href="/dashboard/stages"
              className="inline-flex items-center gap-1.5 text-[#ffffff] hover:text-white transition-colors font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage Roadmap</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88]" />
            </Link>
          </div>
        </div>

        {/* Page Title */}
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            National <span className="text-[#c19a88]">Leaderboard &amp; Standings</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
            Official national standings and weighted evaluation scores adjudicated by the SkaleKraft technical jury. Live qualifier percentiles activate immediately following the Stage 01 Online Technical Quiz.
          </p>
        </div>
      </header>

      {!isPublished ? (
        <div className="space-y-8">
          {/* Activation Notice Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-amber-400/20 bg-[linear-gradient(135deg,#171717_0%,#111111_72%)] p-5 shadow-[0_24px_75px_rgba(0,0,0,0.42)] sm:p-7">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-amber-400/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-8 font-mono text-[150px] font-black leading-none text-white/[0.018]">01</div>

            <div className="relative flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-300">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">
                    Stage 01 screening in progress
                  </span>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Standings are sealed until scoring is complete
                  </h2>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-[11px] text-neutral-300">
                <Calendar className="h-3.5 w-3.5 text-[#c19a88]" />
                Reveal · Jan 08, 2027
              </span>
            </div>

            <div className="relative mt-5 grid gap-5 lg:grid-cols-[0.62fr_1.38fr] lg:items-stretch">
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-black/20 p-5">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Publication status</span>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-black tracking-tight text-white">Locked</span>
                    <span className="mb-1.5 h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                  </div>
                </div>
                <p className="mt-5 text-xs leading-5 text-white/45">
                  Scores remain private to protect competitive fairness during registration and screening.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-normal leading-6 text-neutral-300">
                  After the <strong className="text-white">Stage 01 Online Technical Quiz</strong>, this dashboard will publish verified percentiles, qualification cutoffs, and seeded squad scores.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#d4d4d4]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Phase 01 · Initial seeding
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-white">Qualifier Cutoffs</h3>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Screening results seed qualifying squads for the architecture and build rounds.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#ffffff]">
                      <Trophy className="h-3.5 w-3.5" />
                      Phase 02 · Cumulative points
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-white">Top 25 Merit Roster</h3>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Final totals determine {formatINR(event.prize_pool_inr)} in prizes and merit certificates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* National Honors Cards */}
          <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                  PODIUM DISTINCTIONS
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  National Honors &amp; Cash Allocations
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#ffffff]">
                {formatINR(event.prize_pool_inr)} Total Pool
              </span>
            </div>

            <div className="mobile-card-grid grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                {
                  rank: '01',
                  badge: '1ST PLACE',
                  title: 'National Champion',
                  reward: formatINR(event.first_prize_inr || 20000),
                  desc: 'Winner Trophy, Interview Call & Citation',
                  border: 'border-[#f5f5f5]/60 bg-[#171717]',
                  accent: 'text-[#ffffff]',
                },
                {
                  rank: '02',
                  badge: '2ND PLACE',
                  title: 'First Runner-Up',
                  reward: formatINR(event.second_prize_inr || 10000),
                  desc: 'Runner-Up Certificate & Interview Call',
                  border: 'border-white/10 bg-[#171717]/70',
                  accent: 'text-white',
                },
                {
                  rank: '03',
                  badge: '3RD PLACE',
                  title: 'Second Runner-Up',
                  reward: formatINR(event.third_prize_inr || 5000),
                  desc: 'Finalist Certificate & Interview Call',
                  border: 'border-white/10 bg-[#171717]/70',
                  accent: 'text-[#c19a88]',
                },
                {
                  rank: '25',
                  badge: 'TOP 25 SQUADS',
                  title: 'Merit Distinctions',
                  reward: 'Merit Certificates',
                  desc: 'Cryptographic QR Verifiable Credentials',
                  border: 'border-emerald-500/20 bg-[#141815]',
                  accent: 'text-emerald-400',
                },
              ].map((tier) => (
                <div key={tier.rank} className={`p-5 rounded-2xl border space-y-2 ${tier.border}`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#c19a88]">{tier.badge}</span>
                    <span className="font-bold text-white/40">#{tier.rank}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{tier.title}</h4>
                  <div className={`text-xl font-mono font-extrabold ${tier.accent}`}>
                    {tier.reward}
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Live Published Leaderboard Table */
        <div className="rounded-3xl border border-white/10 bg-[#141414] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <h2 className="text-xl font-bold text-white">Live Adjudicated Standings</h2>
            <span className="text-xs font-mono text-emerald-400 font-bold">● Standings Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-200">
              <thead className="border-b border-white/10 text-xs font-mono uppercase text-neutral-400">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Squad Name</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {results.map((res: any, idx: number) => (
                  <tr key={res.id || idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#c19a88]">#{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{res.team_name}</td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[#ffffff]">{res.track_name}</td>
                    <td className="py-3.5 px-4 text-xs text-neutral-400">{res.college_or_org || 'Independent'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-right">{res.total_score || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
