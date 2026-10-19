'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Sparkles,
  Award,
  Layers,
  Code2,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Github,
  Globe,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

// Flag to control whether the project deliverable submission window is officially open
// Set to false as per organizer requirements during the registration & screening phase
const IS_SUBMISSION_ACTIVE = false;

// Official 4-Stage Hackathon Roadmap
const STAGES_OVERVIEW = [
  {
    step: 'Stage 01',
    title: 'Screening Quiz',
    status: 'Upcoming',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Online timed MCQ screening assessing core CS logic, algorithmic reasoning, and track fundamentals.',
  },
  {
    step: 'Stage 02',
    title: 'Architecture Blueprint',
    status: 'Upcoming',
    statusColor: 'text-[#c19a88] bg-[#c19a88]/10 border-[#c19a88]/30',
    description: 'Structured slide deck outlining system design, data architecture, and AI/API integrations.',
  },
  {
    step: 'Stage 03',
    title: 'Codebase & Demo Submission',
    status: 'Locked • Phase 03',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Public GitHub repo, working live cloud deployment, and 2-3 minute unlisted video walkthrough demonstration.',
  },
  {
    step: 'Stage 04',
    title: 'Grand Finale Live Defense',
    status: 'Top 25 Finalists',
    statusColor: 'text-neutral-400 bg-white/5 border-white/10',
    description: 'Live interactive Q&A before senior tech leaders and venture scouts for the ₹35,000 cash pool.',
  },
];

// Official Evaluation Rubric Criteria (100% Total)
const JUDGING_CRITERIA = [
  {
    name: 'Innovation & Originality',
    weight: '25%',
    description: 'Novelty of approach, uniqueness of solution, and creative problem-solving.',
    tip: 'Highlight what makes your solution distinctly superior to existing tools.',
  },
  {
    name: 'Technical Architecture & Complexity',
    weight: '25%',
    description: 'Clean system design, data flow, scalability, resilience, and engineering rigor.',
    tip: 'Detail database choices, API design, and asynchronous or ML pipelines.',
  },
  {
    name: 'Execution & Working Deliverable',
    weight: '20%',
    description: 'A functioning prototype or codebase free of fatal crashes, with a solid README.',
    tip: 'Ensure the GitHub repository has clear setup instructions and environment variables.',
  },
  {
    name: 'UI/UX & Product Polish',
    weight: '15%',
    description: 'Intuitive user interface, visual aesthetics, accessibility, and delight factor.',
    tip: 'Share screenshot walkthroughs or a deployed live demo URL for maximum score.',
  },
  {
    name: 'Presentation & Video Walkthrough',
    weight: '15%',
    description: 'Clarity of the 2-3 minute demonstration, pitch quality, and articulated value.',
    tip: 'Keep demo video concise: Problem (30s) → Solution Demo (90s) → Future Roadmap (30s).',
  },
];

export default function SubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [tracks, setTracks] = useState<EventTrack[]>([]);
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [showRubric, setShowRubric] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/submissions').then((r) => r.json()),
      fetch('/api/event').then((r) => r.json()),
    ])
      .then(([subData, eventData]) => {
        if (eventData.tracks) {
          setTracks(eventData.tracks);
        }
        if (subData.team) {
          setTeam(subData.team);
          setIsPaid(subData.team.status === 'paid' || subData.team.status === 'confirmed');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-16 text-center space-y-3 backdrop-blur-xl">
        <div className="h-8 w-8 mx-auto rounded-full border-2 border-[#c19a88] border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-400 font-mono tracking-wider">
          Retrieving deliverable window telemetry...
        </p>
      </div>
    );
  }

  // If unpaid, display registration requirement
  if (!isPaid) {
    return (
      <div className="rounded-3xl border border-[#c19a88]/30 bg-gradient-to-b from-[#181310] to-[#0A0A0A] p-8 sm:p-12 text-center space-y-5 shadow-2xl max-w-2xl mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] mx-auto shadow-lg shadow-[#805948]/20">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black text-white">Verified Registration Fee Required</h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            In accordance with Skaleathon 2027 rules, only teams with confirmed ₹99 registration fee are authorized to participate in competition stages.
          </p>
        </div>
        <button
          onClick={() => router.push('/register')}
          className="rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
        >
          Complete ₹99 Team Registration
        </button>
      </div>
    );
  }

  // --- SUBMISSION WINDOW LOCKED STATE ---
  // Renders when submissions are not active yet
  if (!IS_SUBMISSION_ACTIVE) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-16">
        
        {/* Main Locked Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#120F0D]/95 via-[#0B0C12]/95 to-[#120F0D]/95 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-6">
          {/* Ambient Spotlight */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-[#c19a88]/15 blur-3xl" />

          {/* Glowing Lock Badge */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c19a88]/40 bg-[#805948]/20 text-[#e8c5b4] shadow-[0_0_30px_rgba(193,154,136,0.25)]">
            <Lock className="h-8 w-8 text-[#c19a88]" strokeWidth={1.8} />
          </div>

          <div className="space-y-3 relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#e8c5b4]">
              <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage 03 • Deliverable Window Opening Soon</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Project Submissions Unlock in Phase 03
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              The project deliverable submission portal for codebases, live deployment links, and video walkthroughs will officially activate following the completion of <strong>Stage 01 Online Screening Quiz</strong>.
            </p>

            {team && (
              <div className="pt-2 text-xs text-neutral-300">
                Team: <strong className="text-white font-semibold">{team.name}</strong> • Status:{' '}
                <span className="font-mono text-emerald-400 font-bold uppercase">Ready for Sprint</span>
              </div>
            )}
          </div>

          {/* Quick Action Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link
              href="/dashboard/stages"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
            >
              <Layers className="h-4 w-4" />
              <span>Explore 4-Stage Roadmap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/dashboard/track"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 px-6 py-3 text-xs font-semibold text-neutral-200 transition-all"
            >
              <Code2 className="h-4 w-4 text-[#c19a88]" />
              <span>Review Track & Problem Specs</span>
            </Link>

            <Link
              href="/dashboard/team"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 px-6 py-3 text-xs font-semibold text-neutral-200 transition-all"
            >
              <Users className="h-4 w-4 text-[#c19a88]" />
              <span>Manage Team Roster</span>
            </Link>
          </div>
        </div>

        {/* Preparation Checklist: What You Will Need When Window Opens */}
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-5 backdrop-blur-xl shadow-xl">
          <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#c19a88] font-bold">
                Advance Preparation
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Deliverables Required in Stage 03
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Prepare these assets in advance for a frictionless submission
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#c19a88]">
                  <Github className="h-4 w-4" />
                </div>
                <span>1. Public GitHub Repository <span className="text-[#c19a88]">*</span></span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Must contain your complete engineering source code, a comprehensive README with setup instructions, environment variable template, and clear commit history.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#c19a88]">
                  <Globe className="h-4 w-4" />
                </div>
                <span>2. Live Deployed URL (Recommended)</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Host your prototype live on Vercel, Netlify, Railway, or AWS. Working URLs receive bonus technical execution marks during blind judge evaluation.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#c19a88]">
                  <Video className="h-4 w-4" />
                </div>
                <span>3. 2-3 Min Video Walkthrough (Recommended)</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                An unlisted YouTube or Loom walkthrough demonstrating the working product, key architecture, and how it solves the stated industry problem.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#c19a88]">
                  <FileText className="h-4 w-4" />
                </div>
                <span>4. Architectural Breakdown & AI Disclosure</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Written breakdown of problem statement, architectural diagram, member contributions, and transparent disclosure of AI coding assistants utilized.
              </p>
            </div>
          </div>
        </div>

        {/* Competition Milestone Roadmap */}
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-5 backdrop-blur-xl shadow-xl">
          <div className="border-b border-white/[0.08] pb-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#c19a88] font-bold">
              Timeline Progression
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Competition Evaluation Sequence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STAGES_OVERVIEW.map((stage, idx) => (
              <div
                key={stage.step}
                className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#c19a88]">{stage.step}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${stage.statusColor}`}>
                      {stage.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white">{stage.title}</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Judging Rubric Accordion */}
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowRubric(!showRubric)}>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#c19a88] font-bold">
                Jury Standards
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Official Evaluation Rubric (100% Weightage)
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white"
            >
              <span>{showRubric ? 'Hide Rubric' : 'Expand Rubric'}</span>
              {showRubric ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showRubric && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-white/[0.08]"
              >
                {JUDGING_CRITERIA.map((crit) => (
                  <div
                    key={crit.name}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{crit.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#c19a88]/15 text-[#e8c5b4] border border-[#c19a88]/30">
                        {crit.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-light">{crit.description}</p>
                    <div className="text-[10px] text-[#c19a88] pt-1.5 border-t border-white/[0.04]">
                      <strong>Tip:</strong> {crit.tip}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Advice */}
        <div className="text-center text-xs text-neutral-400 space-y-1">
          <p>
            Have questions regarding deliverables or deadlines? Visit our{' '}
            <Link href="/faq" className="text-[#c19a88] hover:underline font-medium">
              FAQ
            </Link>{' '}
            or contact support at{' '}
            <a href="mailto:skalekraft@gmail.com" className="text-[#c19a88] hover:underline font-medium">
              skalekraft@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  // Fallback return (never reached when IS_SUBMISSION_ACTIVE = false)
  return null;
}
