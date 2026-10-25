import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Download,
  FileCheck2,
  Layers3,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Code2,
} from 'lucide-react';
import DashboardQuickIndexBar from '@/components/dashboard/DashboardQuickIndexBar';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { formatINR } from '@/lib/utils';

export const revalidate = 0;

const stages = [
  { num: '01', title: 'Technical Screening', date: '08 Jan 2027', description: 'Timed CS fundamentals and track aptitude assessment.' },
  { num: '02', title: 'Architecture Blueprint', date: '10–14 Jan 2027', description: 'Ten-slide system design, scope, and feasibility review.' },
  { num: '03', title: 'Build Sprint', date: '16–25 Jan 2027', description: 'Production repository, working product, and live deployment.' },
  { num: '04', title: 'Live Defense', date: '29–30 Jan 2027', description: 'Top 25 teams present and defend their engineering decisions.' },
];

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const [event, team] = await Promise.all([
    EventRepository.getEvent(),
    session?.teamId ? EventRepository.getTeam(session.teamId) : null,
  ]);
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;
  const rawMembers = team?.members || [];
  const track = team?.track || null;
  const members = rawMembers.length > 0 ? rawMembers : team ? [{
    id: 'leader-self', team_id: team.id, name: session?.fullName || 'Team Leader',
    email: session?.email || '', role: 'leader' as const,
    created_at: team.created_at, updated_at: team.updated_at,
  }] : [];

  const isPaid = team?.status === 'paid';
  const firstName = session?.fullName?.split(' ')[0] || 'Builder';
  const rosterPercent = Math.round((members.length / 6) * 100);
  const submissionReady = Boolean(submission?.title && submission.github_url && submission.live_demo_url);
  const submissionLabel = submission
    ? submission.status === 'draft' ? 'Draft in progress' : submission.status.replace('_', ' ')
    : 'Not started';

  const actionItems = [
    { label: 'Registration payment verified', complete: isPaid, href: '/dashboard/team' },
    { label: 'Competition track selected', complete: Boolean(track), href: '/dashboard/track' },
    { label: 'Squad roster reviewed', complete: members.length > 0, href: '/dashboard/team' },
    { label: 'Project deliverables prepared', complete: submissionReady, href: '/dashboard/submission' },
  ];
  const completedActions = actionItems.filter((item) => item.complete).length;

  const nextAction = !team
    ? { title: 'Register your engineering squad', description: 'Create a squad pass and select your competition track to enter Skaleathon.', href: '/register', cta: 'Start registration' }
    : !isPaid
      ? { title: 'Complete squad verification', description: 'Finish registration payment to unlock stages, submissions, and official credentials.', href: '/register', cta: 'Complete verification' }
      : !submissionReady
        ? { title: 'Prepare for Stage 01 screening', description: 'Review the screening scope now, then begin building your project submission workspace.', href: '/dashboard/stages', cta: 'Review screening scope' }
        : { title: 'Review your submitted build', description: 'Confirm that every project link and artifact is current before the submission window closes.', href: '/dashboard/submission/status', cta: 'Inspect submission' };

  return (
    <div className="relative w-full pb-16 text-neutral-200 sm:pb-24">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[34rem] w-[90%] max-w-6xl -translate-x-1/2 rounded-full bg-[#737373]/12 blur-[150px]" />

      <header className="relative overflow-hidden border-b border-white/[0.08] pb-7 pt-2 sm:pb-9 sm:pt-4">
        <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 select-none font-mono text-[8rem] font-black leading-none tracking-[-0.08em] text-white/[0.018] lg:block">COMMAND</div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
              <span className="inline-flex items-center gap-2 text-[#ffffff]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Participant workspace
              </span>
              <span className="text-white/20">{'//'}</span><span className="text-neutral-500">Squad</span>
              <span className="text-white">{team?.name || 'Unassigned'}</span><span className="text-white/20">•</span>
              <span className={isPaid ? 'text-emerald-400' : 'text-amber-300'}>{isPaid ? 'Status: verified' : 'Status: action required'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {team && isPaid && (
                <a href={`/api/receipt/download?pass=${encodeURIComponent(team.id)}`} download={`Skaleathon_Receipt_${team.id}.pdf`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 text-xs font-semibold text-neutral-300 transition-colors hover:border-white/20 hover:text-white">
                  <Download className="h-3.5 w-3.5 text-[#f5f5f5]" />Receipt
                </a>
              )}
              <Link href="/dashboard/team" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#f5f5f5]/30 bg-[#f5f5f5]/10 px-4 text-xs font-semibold text-[#ffffff] transition-colors hover:border-[#f5f5f5]/60 hover:bg-[#f5f5f5]/15 hover:text-white">
                <ShieldCheck className="h-3.5 w-3.5" />Squad pass
              </Link>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-medium text-neutral-500">Good to have you back.</p>
              <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.4rem]">
                Welcome, <span className="font-serif font-normal italic text-[#ffffff]">{firstName}</span>
              </h1>
              <p className="mt-4 max-w-2xl border-l border-[#f5f5f5]/50 pl-4 text-sm font-light leading-6 text-neutral-400 sm:text-base">
                Your squad is competing in <strong className="font-medium text-white">{track?.name || 'the open arena'}</strong>. Use this command center to prepare for each stage, maintain your roster, and deliver a jury-ready build.
              </p>
            </div>
            <div className="rounded-2xl border border-[#f5f5f5]/15 bg-[linear-gradient(145deg,rgba(245,245,245,0.08),rgba(255,255,255,0.018))] p-4 backdrop-blur-sm sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#f5f5f5]">Workspace readiness</p><p className="mt-1 text-2xl font-bold text-white">{completedActions} of 4</p></div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5f5f5]/30 bg-[#f5f5f5]/10 font-mono text-xs font-bold text-[#ffffff]">{completedActions * 25}%</div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1.5">{actionItems.map((item) => <span key={item.label} className={`h-1.5 rounded-full ${item.complete ? 'bg-[#f5f5f5]' : 'bg-white/10'}`} />)}</div>
            </div>
          </div>
        </div>
      </header>

      <DashboardQuickIndexBar memberCount={members.length} />

      <main className="space-y-12 pt-8 sm:space-y-14 sm:pt-10">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.65fr)]">
          <div className="group relative overflow-hidden rounded-[1.75rem] border border-[#f5f5f5]/25 bg-[linear-gradient(135deg,rgba(245,245,245,0.13),rgba(20,20,20,0.92)_48%,rgba(115,115,115,0.09))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#f5f5f5]/12 blur-[80px]" />
            <div className="pointer-events-none absolute bottom-2 right-8 font-mono text-[110px] font-black leading-none text-white/[0.018]">01</div>
            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.23em] text-[#ffffff]"><Zap className="h-3.5 w-3.5" />Priority action</div>
                  <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">{nextAction.title}</h2>
                  <p className="max-w-2xl text-sm font-light leading-6 text-neutral-400">{nextAction.description}</p>
                </div>
                <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 sm:inline-flex">Stage 01 active</span>
              </div>
              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
                {[
                  ['Next stage', 'Technical quiz'],
                  ['Format', 'Online · 45 min'],
                  ['Eligibility', isPaid ? 'Verified' : 'Pending'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#111111]/90 px-3 py-3 sm:px-4">
                    <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">{label}</span>
                    <strong className="mt-1 block truncate text-[11px] font-semibold text-white/75 sm:text-xs">{value}</strong>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-xs text-neutral-400"><CalendarDays className="h-4 w-4 text-[#f5f5f5]" /><span>Screening window</span><strong className="font-mono text-white">08 JAN 2027</strong></div>
                <Link href={nextAction.href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffffff] px-5 text-xs font-bold text-[#171717] transition-all hover:bg-[#f5f5f5] hover:shadow-[0_0_28px_rgba(245,245,245,0.22)]">{nextAction.cta}<ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-white/[0.08] bg-[#111111] p-5 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#f5f5f5]">Readiness check</p><h2 className="mt-1 text-lg font-bold text-white">Before you compete</h2></div><span className="rounded-full border border-white/[0.07] px-2.5 py-1 font-mono text-[10px] text-neutral-500">{completedActions}/4</span></div>
            <div className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {actionItems.map((item) => (
                <Link key={item.label} href={item.href} className="group flex min-h-12 items-center justify-between gap-3 py-3 text-xs">
                  <span className="flex items-center gap-3"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${item.complete ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-400' : 'border-white/15 text-white/25'}`}>{item.complete ? <Check className="h-3 w-3" /> : <span className="h-1 w-1 rounded-full bg-current" />}</span><span className={item.complete ? 'text-neutral-400' : 'text-neutral-200'}>{item.label}</span></span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-white" />
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section>
          <SectionHeading index="01" eyebrow="Competition telemetry" title="Stage" accent="Roadmap" action={{ href: '/dashboard/stages', label: 'View complete rules' }} />
          <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage, index) => {
              const active = index === 0;
              return (
                <Link key={stage.num} href="/dashboard/stages" className={`group relative min-h-48 overflow-hidden rounded-2xl border p-3.5 transition-all sm:min-h-56 sm:p-5 ${active ? 'border-[#f5f5f5]/40 bg-[#141414] shadow-[0_18px_50px_rgba(0,0,0,0.28)]' : 'border-white/[0.07] bg-white/[0.018] hover:border-white/15 hover:bg-white/[0.03]'}`}>
                  <span className="absolute right-2 top-2 font-mono text-4xl font-black text-white/[0.025] sm:right-3 sm:text-5xl">{stage.num}</span>
                  <div className="relative flex h-full flex-col justify-between">
                    <div><div className="flex items-center justify-between"><span className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-[0.22em] ${active ? 'text-emerald-400' : 'text-[#f5f5f5]'}`}>{active ? 'Active' : `Phase ${stage.num}`}</span>{active && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />}</div><h3 className="mt-4 text-sm font-bold leading-5 text-white sm:mt-5 sm:text-lg">{stage.title}</h3><p className="mt-2 line-clamp-3 text-[10px] font-light leading-4 text-neutral-500 sm:text-xs sm:leading-5">{stage.description}</p></div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[9px] text-neutral-500 sm:mt-6 sm:pt-4 sm:text-[10px]"><span>{stage.date}</span><ArrowUpRight className="h-3.5 w-3.5 transition-colors group-hover:text-[#ffffff]" /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-white/[0.08] sm:rounded-[1.75rem] lg:grid-cols-4">
          {[
            { label: 'Competition track', value: track?.name || 'Open arena', meta: track?.slug?.toUpperCase() || 'SELECT TRACK' },
            { label: 'Squad roster', value: `${members.length} of 6 confirmed`, meta: `${rosterPercent}% CAPACITY` },
            { label: 'Project submission', value: submissionLabel, meta: submission?.title || 'NO PROJECT TITLE' },
            { label: 'Prize pool', value: formatINR(event.prize_pool_inr), meta: `TOP ${event.certificates_top_n} MERIT AWARDS` },
          ].map((metric) => <div key={metric.label} className="min-w-0 min-h-28 bg-[#111111] p-3.5 sm:min-h-32 sm:p-5"><p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#f5f5f5] sm:text-[9px] sm:tracking-[0.22em]">{metric.label}</p><p className="mt-3 truncate text-sm font-bold text-white sm:mt-4 sm:text-lg">{metric.value}</p><p className="mt-1 truncate font-mono text-[8px] uppercase tracking-wider text-neutral-600 sm:text-[9px]">{metric.meta}</p></div>)}
        </section>

        <section>
          <SectionHeading index="02" eyebrow="Workspace modules" title="Build" accent="Operations" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2 lg:grid-cols-6">
            {[
              { href: '/dashboard/submission', icon: Send, title: 'Submission Portal', description: submission ? `Continue ${submission.title || 'your project'} and keep every deliverable current.` : 'Create your project record and add the repository, deployment, deck, and demo.', meta: submissionLabel, span: 'col-span-2 lg:col-span-3' },
              { href: '/dashboard/team', icon: Users, title: 'Squad & Pass', description: 'Review members, invite collaborators, and print the official squad credential.', meta: `${members.length}/6 members`, span: 'col-span-2 lg:col-span-3' },
              { href: '/dashboard/track', icon: Code2, title: 'Track Scope', description: 'Domain boundaries, suggested stacks, and evaluation expectations.', meta: track?.slug?.toUpperCase() || 'OPEN', span: 'lg:col-span-2' },
              { href: '/dashboard/stages', icon: Layers3, title: 'Stage Rubrics', description: 'Timelines, advancement criteria, and technical deliverables.', meta: '4 phases', span: 'lg:col-span-2' },
              { href: '/dashboard/leaderboard', icon: Trophy, title: 'Leaderboard', description: 'National standings become available after screening scores are verified.', meta: 'Rankings', span: 'col-span-2 sm:col-span-1 lg:col-span-2' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`group relative min-h-44 min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] p-4 transition-all hover:-translate-y-0.5 hover:border-[#f5f5f5]/35 hover:bg-[#171717] sm:min-h-48 sm:p-5 ${item.span}`}>
                  <div className="flex h-full flex-col justify-between gap-5 sm:gap-7"><div className="flex min-w-0 items-start justify-between gap-2 sm:gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#f5f5f5]/20 bg-[#f5f5f5]/[0.07] text-[#ffffff] sm:h-10 sm:w-10"><Icon className="h-4 w-4 sm:h-5 sm:w-5" /></span><span className="max-w-[6.5rem] truncate rounded-full border border-white/[0.07] bg-white/[0.025] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-neutral-500 sm:max-w-none sm:px-2.5 sm:text-[9px]">{item.meta}</span></div><div><h3 className="text-sm font-bold text-white transition-colors group-hover:text-[#ffffff] sm:text-base">{item.title}</h3><p className="mt-2 line-clamp-3 max-w-md text-[10px] font-light leading-4 text-neutral-500 sm:text-xs sm:leading-5">{item.description}</p><div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] font-semibold text-[#f5f5f5] sm:mt-4 sm:text-[11px]"><span>Open module</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></div></div></div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(110deg,rgba(163,163,163,0.12),rgba(255,255,255,0.02))] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f5f5f5]/20 bg-[#f5f5f5]/10 text-[#ffffff]">{submissionReady ? <FileCheck2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}</span><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#f5f5f5]">Project record</p><h2 className="mt-1 text-xl font-bold text-white">{submission?.title || 'Your build story starts here'}</h2><p className="mt-1 max-w-2xl text-xs font-light leading-5 text-neutral-400">{submission ? 'Keep the repository, deployment, architecture deck, and team contributions synchronized for jury review.' : 'Open the submission workspace early so your team can shape the problem statement and capture technical decisions as you build.'}</p></div></div>
          <Link href="/dashboard/submission" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#f5f5f5]/35 px-5 text-xs font-bold text-[#ffffff] transition-colors hover:bg-[#f5f5f5]/10 hover:text-white">{submission ? 'Continue project' : 'Create project record'}<ArrowRight className="h-4 w-4" /></Link>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ index, eyebrow, title, accent, action }: { index: string; eyebrow: string; title: string; accent: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5f5f5]">{index} {'//'} {eyebrow}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title} <span className="font-serif font-normal italic text-[#ffffff]">{accent}</span></h2></div>
      {action && <Link href={action.href} className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white">{action.label}<ArrowRight className="h-3.5 w-3.5 text-[#f5f5f5]" /></Link>}
    </div>
  );
}
