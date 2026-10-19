import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  FileText,
  BrainCircuit,
  Send,
  Video,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardStagesPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;

  const stages = [
    {
      number: '01',
      title: 'Online Technical Quiz',
      category: 'Screening',
      categoryColor: 'border-[#c19a88]/30 bg-[#c19a88]/10 text-[#c19a88]',
      description:
        'A comprehensive online multiple-choice screening assessment evaluating foundational computer science principles, data structures, algorithms, and track-specific problem-solving aptitude.',
      format: 'Timed Online Assessment (30-45 mins)',
      schedule: 'Dates announced via official broadcast',
      weightage: 'Elimination & Seeding Round',
      status: team?.status === 'paid' ? 'Registered' : 'Locked (Payment Required)',
      icon: BrainCircuit,
    },
    {
      number: '02',
      title: 'Idea & Architecture PPT',
      category: 'Blueprint',
      categoryColor: 'border-[#e8c5b4]/30 bg-[#e8c5b4]/10 text-[#e8c5b4]',
      description:
        'Submit a structured pitch deck (max 10 slides) detailing your proposed problem statement, system architecture, database schema, AI/API integrations, and target user persona.',
      format: 'PDF Slide Deck Upload',
      schedule: 'Mid-Hackathon Checkpoint',
      weightage: 'Architectural Feasibility',
      status: team ? 'Eligible' : 'Requires Team',
      icon: FileText,
      actionHref: '/dashboard/submission',
      actionLabel: 'Open Submission Portal',
    },
    {
      number: '03',
      title: 'Codebase & Demo (Build Sprint)',
      category: 'Build Phase',
      categoryColor: 'border-[#c19a88]/40 bg-[#c19a88]/15 text-[#e8c5b4]',
      description:
        'The primary development sprint. Deliver a production-grade codebase in a public GitHub repository and a live deployed URL on cloud hosting. A 2-3 minute video walkthrough is not necessary, but will give your team a distinct evaluation advantage.',
      format: 'GitHub + Live Demo URL (Video Link Optional Advantage)',
      schedule: 'Hard Deadline (See countdown)',
      weightage: 'Primary Evaluation (60% Weight)',
      status: submission?.status === 'submitted' ? 'Submitted' : 'In Progress',
      icon: Send,
      actionHref: '/dashboard/submission',
      actionLabel: submission ? 'View / Edit Submission' : 'Open Submission Portal',
    },
    {
      number: '04',
      title: 'Grand Finale Live Q&A',
      category: 'Grand Finale',
      categoryColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      description:
        'Top finalist teams are invited to present their solution live before an esteemed jury panel composed of SkaleKraft leaders, senior engineers, and industry venture scouts.',
      format: 'Live Video Presentation & Judge Q&A (10 mins)',
      schedule: 'Final Day of Skaleathon',
      weightage: 'Determines ₹35,000 Prize Distribution',
      status: 'Reserved for Top 25 Finalists',
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E0E]/80 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-60 h-60 bg-[#c19a88]/10 rounded-full blur-[100px]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c19a88] font-bold">
                Official Competition Roadmap
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">4-Stage Hackathon Journey</h1>
            <p className="text-xs text-white/50 mt-1 max-w-xl">
              Understand the milestones, requirements, and deliverables for each evaluation round of Skaleathon 2027.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Overview</span>
          </Link>
        </div>
      </div>

      {/* 4 Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.number}
              className="rounded-2xl border border-white/10 bg-[#0E0E0E]/70 p-5 sm:p-6 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
                      <Icon className="h-4 w-4 text-[#c19a88]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#c19a88] font-bold uppercase block leading-none">
                        Stage {st.number}
                      </span>
                      <h2 className="text-sm font-bold text-white mt-0.5">{st.title}</h2>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${st.categoryColor}`}
                  >
                    {st.category}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {st.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-400">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-medium block">
                      Format
                    </span>
                    <span className="text-white font-medium mt-0.5 block truncate">
                      {st.format}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-medium block">
                      Weightage
                    </span>
                    <span className="text-[#e8c5b4] font-medium mt-0.5 block truncate">
                      {st.weightage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  Status: <strong className="text-white font-medium">{st.status}</strong>
                </span>

                {st.actionHref && (
                  <Link
                    href={st.actionHref}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#c19a88] hover:text-[#e8c5b4] transition-colors"
                  >
                    <span>{st.actionLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
