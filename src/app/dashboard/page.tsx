import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  ArrowRight,
  Layers,
  Code2,
  Users,
  Send,
  Trophy,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const rawMembers = team?.members || [];
  const track = team?.track || null;

  const members =
    rawMembers.length > 0
      ? rawMembers
      : team
      ? [
          {
            id: 'leader-self',
            team_id: team.id,
            name: session?.fullName || 'Team Leader',
            email: session?.email || '',
            role: 'leader' as const,
            created_at: team.created_at,
            updated_at: team.updated_at,
          },
        ]
      : [];

  const isPaid = team?.status === 'paid' || (team as any)?.status === 'confirmed';
  const firstName = session?.fullName?.split(' ')[0] || 'Builder';

  return (
    <div className="relative w-full space-y-8 pb-20 text-neutral-200">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-full max-w-5xl rounded-full bg-[#c19a88]/10 blur-[150px]" />

      {/* 1. Welcome & Status Banner Card */}
      <header className="rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[#c19a88] font-bold uppercase tracking-wider">
                Workspace Active
              </span>
              <span className="text-white/20">•</span>
              <span className="text-neutral-400">Squad:</span>
              <span className="text-white font-bold">{team ? team.name : 'Unassigned'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-[#c19a88]">{firstName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 font-normal">
              Track your hackathon progress, view deliverables rubric, and manage your squad roster.
            </p>
          </div>

          {/* Status & Pass Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified &amp; Registered</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                <Clock className="h-4 w-4" />
                <span>Pending Verification</span>
              </span>
            )}

            {team && isPaid && (
              <a
                href={`/api/receipt/download?pass=${encodeURIComponent(team.id)}`}
                download={`Skaleathon_Receipt_${team.id}.pdf`}
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Official Receipt (PDF)</span>
              </a>
            )}
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 space-y-1">
            <span className="text-[11px] font-mono text-[#c19a88] font-bold uppercase tracking-wider block">
              Competition Track
            </span>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {track ? track.name : 'Open Track'}
            </div>
            <p className="text-xs text-neutral-400">
              Open innovation, self-defined problem statement
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 space-y-1">
            <span className="text-[11px] font-mono text-[#e8c5b4] font-bold uppercase tracking-wider block">
              Squad Members
            </span>
            <div className="text-base sm:text-lg font-bold text-white">
              {members.length} of 6 Members Confirmed
            </div>
            <p className="text-xs text-neutral-400">
              <Link href="/dashboard/team" className="text-[#c19a88] hover:underline font-medium">
                View &amp; manage roster →
              </Link>
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#1a1715]/70 space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
              Active Stage
            </span>
            <div className="text-base sm:text-lg font-bold text-white">
              Stage 01: Screening Quiz
            </div>
            <p className="text-xs text-neutral-400">
              Scheduled for Jan 08, 2027
            </p>
          </div>
        </div>
      </header>

      {/* 2. Visual 4-Stage Stepper Pipeline */}
      <section className="rounded-3xl border border-white/10 bg-[#141211] p-6 sm:p-8 space-y-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
              TIMELINE PIPELINE
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sequential 4-Stage Progression
            </h2>
          </div>
          <Link
            href="/dashboard/stages"
            className="text-xs font-bold text-[#c19a88] hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Full Roadmap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              num: '01',
              title: 'Screening Quiz',
              date: 'Jan 08, 2027',
              desc: 'Timed online CS fundamentals & domain MCQs.',
              active: true,
              status: 'Upcoming',
            },
            {
              num: '02',
              title: 'Architecture PPT',
              date: 'Jan 10–14, 2027',
              desc: '10-slide system design & feasibility blueprint.',
              active: false,
              status: 'Eligible',
            },
            {
              num: '03',
              title: 'Build Sprint & Demo',
              date: 'Jan 16–25, 2027',
              desc: 'Public GitHub repo + live deployed URL.',
              active: false,
              status: 'Sprint Phase',
            },
            {
              num: '04',
              title: 'Grand Finale Live Q&A',
              date: 'Jan 29–30, 2027',
              desc: 'Top 25 live panel defense & ₹35K prizes.',
              active: false,
              status: 'Finalists',
            },
          ].map((st) => (
            <div
              key={st.num}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                st.active
                  ? 'border-[#c19a88]/60 bg-[#1a1715] shadow-md shadow-[#c19a88]/10'
                  : 'border-white/[0.08] bg-[#1a1715]/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#c19a88]">STAGE {st.num}</span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    st.active
                      ? 'bg-[#c19a88]/20 text-[#e8c5b4] border border-[#c19a88]/30'
                      : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  {st.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">{st.title}</h3>
              <p className="text-xs text-neutral-300 font-normal leading-relaxed">{st.desc}</p>
              <div className="pt-1 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-[#c19a88]" />
                <span>{st.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Workspace Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
              WORKSPACE MODULES
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Essential Dashboard Tools
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-500">5 Direct Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              href: '/dashboard/stages',
              icon: Layers,
              title: 'Competition Stages & Rubric',
              desc: 'Review timing windows, evaluation benchmarks, and guidelines for each round.',
              cta: 'View 4 Stages',
              badge: 'Roadmap',
            },
            {
              href: '/dashboard/track',
              icon: Code2,
              title: 'Track Scope & Suggested Stacks',
              desc: 'Explore open domain freedom, recommended libraries, and rubric weightages.',
              cta: 'Inspect Arena',
              badge: track ? track.slug.toUpperCase() : 'Arena',
            },
            {
              href: '/dashboard/team',
              icon: Users,
              title: 'Squad Workspace & Pass',
              desc: 'Manage your members, print credentials, and generate official team badges.',
              cta: 'Manage Squad',
              badge: `${members.length}/6 Members`,
            },
            {
              href: '/dashboard/submission',
              icon: Send,
              title: 'Submission Portal',
              desc: 'Submit your Stage 02 architecture deck and Stage 03 GitHub + deployed demo URL.',
              cta: 'Open Portal',
              badge: 'Deliverables',
            },
            {
              href: '/dashboard/leaderboard',
              icon: Trophy,
              title: 'Live Leaderboard & Ranks',
              desc: 'Inspect national percentiles and rankings after Stage 01 scores are tabulated.',
              cta: 'Check Leaderboard',
              badge: 'National Standings',
            },
          ].map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-5 rounded-3xl border border-white/10 bg-[#141211] hover:border-[#c19a88]/40 hover:bg-[#181514] transition-all flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-[#c19a88]/10 border border-[#c19a88]/20 text-[#c19a88] group-hover:scale-105 transition-transform">
                      <ItemIcon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#e8c5b4]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#e8c5b4] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#c19a88] group-hover:text-white transition-colors">
                  <span>{item.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
