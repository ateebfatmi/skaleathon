import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import DashboardQuickIndexBar from '@/components/dashboard/DashboardQuickIndexBar';
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Code2,
  Users,
  Send,
  Trophy,
  Mail,
  CheckCircle2,
  Download,
} from 'lucide-react';

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
  const firstName = session?.fullName?.split(' ')[0] || 'Innovator';

  return (
    <div className="relative w-full space-y-8 pb-20 text-neutral-200 sm:space-y-14 sm:pb-24">
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div className="pointer-events-none absolute -top-20 right-10 hidden h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px] sm:block" />
      <div className="pointer-events-none absolute top-40 -left-20 hidden h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px] sm:block" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
          <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
            COMMAND
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="mobile-utility-row relative z-10 mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4 sm:mb-7">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[10px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
            </span>
            <span className="text-[#c19a88]">Participant Workspace {'//'} Command Center</span>
            <span className="text-white/20">•</span>
            <span className="text-neutral-400">
              Squad: <strong className="text-white font-semibold">{team ? team.name : 'Unassigned'}</strong>
            </span>
            {track && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-[#e8c5b4] font-semibold">
                  [{track.slug.toUpperCase()}]
                </span>
              </>
            )}
            <span className="text-white/20">•</span>
            {isPaid ? (
              <span className="text-emerald-400 font-semibold">STATUS: PAID</span>
            ) : (
              <span className="text-amber-400 font-semibold">STATUS: PENDING</span>
            )}
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-4 sm:gap-5 text-xs">
            {team && isPaid && (
              <>
                <a
                  href={`/api/receipt/download?pass=${encodeURIComponent(team.id)}`}
                  download={`Skaleathon_Receipt_${team.id}.pdf`}
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
                  title="Download Official Registration Receipt (PDF)"
                >
                  <Download className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Download Receipt</span>
                </a>

                <span className="text-white/15">|</span>
              </>
            )}

            <Link
              href="/dashboard/team"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
            >
              <Users className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>My Team ({members.length}/6)</span>
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
        <div className="relative z-10 max-w-3xl space-y-3 pb-5 sm:space-y-5 sm:pb-9">
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.08]">
            Welcome back,{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              {firstName}
            </span>
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-4 text-xs sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
            Your squad <strong className="text-white font-medium">{team ? team.name : 'workspace'}</strong> is enrolled in{' '}
            <strong className="text-[#e8c5b4] font-normal">{track ? track.name : 'Skaleathon'}</strong>. Review your active stage progression, manage your engineering roster, and prepare your technical deliverables below.
          </p>
        </div>

        {/* Full-Width 4-Column Interactive Editorial Section Index Bar with Pre-Redirect Transition */}
        <DashboardQuickIndexBar memberCount={members.length} />
      </header>

      {/* 2. Section 01: Active Round & Upcoming Milestone Pillars */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              01 {'//'} Live Tournament Telemetry
            </span>
            <h2 className="text-[1.65rem] leading-tight sm:text-3xl font-bold text-white tracking-tight">
              Active Phase &amp;{' '}
              <span className="block font-serif italic font-normal text-[#e8c5b4] sm:inline">
                Upcoming Milestones
              </span>
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-light max-w-xs">
            Sequential progression from foundational screening to the 10-day engineering sprint.
          </p>
        </div>

        {/* Side-by-Side Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
          {/* Pillar 01: Stage 01 */}
          <div className="relative pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                Phase 01 • Active Round
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Online Technical Screening Quiz
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Timed 30–45 minute multiple-choice assessment evaluating core computer science fundamentals, algorithmic logic, and domain aptitude. Ensure your squad roster is finalized prior to round kickoff.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Squad Enrolled &amp; Eligible</span>
              </span>
              <Link
                href="/dashboard/stages"
                className="inline-flex items-center gap-1 text-[#e8c5b4] hover:text-white font-medium transition-colors"
              >
                <span>Inspect Rubric</span>
                <ArrowRight className="h-3 w-3 text-[#c19a88]" />
              </Link>
            </div>
          </div>

          {/* Pillar 02: Stage 02 & 03 */}
          <div className="relative pt-4 border-t border-white/[0.06] md:border-t-0 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                Phase 02 &amp; 03 • Blueprint &amp; Build
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Architecture Deck &amp; Working Prototype
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Formulate any real-world problem statement within {track ? track.name : 'your chosen arena'}. Submit a 10-slide system blueprint in Stage 02, followed by your GitHub repository and live cloud deployment in Stage 03.
            </p>
            <div className="pt-1 flex items-center gap-4 text-xs">
              <Link
                href="/dashboard/track"
                className="inline-flex items-center gap-1 text-[#e8c5b4] hover:text-white font-medium transition-colors"
              >
                <span>Explore Open Domain Scope</span>
                <ArrowRight className="h-3 w-3 text-[#c19a88]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 02: Workspace Command Directory */}
      <section className="space-y-6 pt-8 sm:pt-10 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              02 {'//'} Workspace Navigation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tournament Command{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Directory
              </span>
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            5 Core Modules
          </span>
        </div>

        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {[
            {
              num: '01',
              href: '/dashboard/stages',
              icon: Layers,
              title: 'Competition Stages &',
              italic: 'Timeline',
              desc: 'Detailed 4-stage progression: Screening Quiz, Architecture PPT, 10-Day Build Sprint & Grand Finale.',
              cta: 'Explore Stages',
            },
            {
              num: '02',
              href: '/dashboard/track',
              icon: Code2,
              title: 'Track Specifications &',
              italic: 'Open Scope',
              desc: track
                ? `Open domain guidelines, recommended stack, and evaluation rubric for ${track.name}.`
                : 'Review open innovation guidelines, recommended toolkits, and jury scoring weightage.',
              cta: 'Inspect Track',
            },
            {
              num: '03',
              href: '/dashboard/team',
              icon: Users,
              title: 'Squad Roster &',
              italic: 'Credentials',
              desc: `View official squad pass, verified team members (${members.length}/6 seats filled), and share invite credentials.`,
              cta: 'Open Squad Pass',
            },
            {
              num: '04',
              href: '/dashboard/submission',
              icon: Send,
              title: 'Deliverables & Code',
              italic: 'Submission',
              desc: 'Independent submission portals for Stage 02 Architecture PDF and Stage 03 GitHub + Live Prototype.',
              cta: 'Open Portal',
            },
            {
              num: '05',
              href: '/dashboard/leaderboard',
              icon: Trophy,
              title: 'National Standings &',
              italic: 'Leaderboard',
              desc: 'Official evaluation scores, qualifier cutoffs, and Top 25 merit rankings (activates after Stage 01).',
              cta: 'View Standings',
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.num}
                href={mod.href}
                className="group py-4 sm:py-5 flex items-center justify-between gap-4 hover:pl-2 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#c19a88] pt-0.5 sm:pt-0 w-6 shrink-0">
                    {mod.num}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white group-hover:text-[#e8c5b4] transition-colors">
                      <Icon className="h-4 w-4 text-[#c19a88] shrink-0" />
                      <span>
                        {mod.title}{' '}
                        <span className="font-serif italic font-normal text-[#e8c5b4]">
                          {mod.italic}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light truncate sm:whitespace-normal">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-[#e8c5b4] shrink-0 transition-colors">
                  <span className="hidden sm:inline text-[11px]">{mod.cta}</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Minimal Footer Strip */}
      <footer className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-[#c19a88]" />
          <span>Organizer Support:</span>
          <a
            href="mailto:skalekraft@gmail.com"
            className="text-[#e8c5b4] hover:text-white transition-colors font-mono"
          >
            skalekraft@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/rules" className="hover:text-neutral-300 transition-colors">
            Tournament Rules
          </Link>
          <span className="text-white/15">•</span>
          <Link href="/faq" className="hover:text-neutral-300 transition-colors">
            FAQ
          </Link>
        </div>
      </footer>
    </div>
  );
}
