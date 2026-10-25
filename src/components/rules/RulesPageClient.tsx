'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Github,
  Globe,
  Video,
  Layers,
  HelpCircle,
  Award,
  ChevronDown,
  Clock,
  Compass,
  Check,
} from 'lucide-react';
import { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/spotlight-card';

interface RulesPageClientProps {
  event: EventData;
}

export default function RulesPageClient({ event }: RulesPageClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'eligibility' | 'stages' | 'policy' | 'deliverables' | 'judging'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navTabs = [
    { id: 'all', label: 'All Guidelines' },
    { id: 'eligibility', label: 'Eligibility & Squads' },
    { id: 'stages', label: '4 Stages' },
    { id: 'policy', label: 'Allowed vs Prohibited' },
    { id: 'deliverables', label: 'Deliverables' },
    { id: 'judging', label: 'Judging Rubric' },
  ] as const;

  const faqs = [
    {
      q: 'Can teammates belong to different colleges, companies, or cities?',
      a: 'Yes, 100%! Cross-college, cross-organization, and inter-city squads are fully welcomed. Solo participants are also warmly supported.',
    },
    {
      q: 'Is the ₹99 fee charged per member or for the entire team?',
      a: `The ${formatINR(event.registration_fee_inr)} registration fee is a single flat payment for the entire squad (1 to 6 members). There are zero hidden fees or per-head charges.`,
    },
    {
      q: 'Are generative AI tools like GitHub Copilot, Cursor, or ChatGPT allowed?',
      a: 'Yes! We encourage modern engineering productivity tools. All AI tool usage must be openly disclosed in your project README, and your squad must demonstrate architectural comprehension of all submitted code.',
    },
    {
      q: 'Can we build upon a previous hackathon project or pre-existing codebase?',
      a: 'No. Core application code must be authored during the hackathon timeline. You may leverage public open-source libraries, UI kits, templates, and public APIs with proper attribution, but proprietary pre-built projects will be disqualified.',
    },
    {
      q: 'What happens if a team member cannot take the Stage 1 quiz?',
      a: 'The Stage 1 quiz is conducted online. At least one member (preferably the team lead or technical representative) must complete the quiz to qualify the squad for Stage 2.',
    },
    {
      q: 'When and how are the cash prizes distributed?',
      a: `Cash prizes totaling ${formatINR(event.prize_pool_inr)} (1st: ${formatINR(event.first_prize_inr || 20000)}, 2nd: ${formatINR(event.second_prize_inr || 10000)}, 3rd: ${formatINR(event.third_prize_inr || 5000)}) are disbursed directly via bank transfer/UPI to verified team leads within 7 business days following the Stage 4 Grand Finale.`,
    },
  ];

  const stages = [
    {
      number: '01',
      title: 'Online Technical Screening Quiz',
      date: '8 Jan 2027',
      duration: '30–45 mins online',
      badge: 'Screening Round',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      description: 'Timed online multiple-choice evaluation measuring algorithmic logic, CS core fundamentals, and chosen track aptitude.',
      deliverables: ['Timed quiz submission in participant dashboard', 'Qualifying cutoff to advance to Stage 02'],
    },
    {
      number: '02',
      title: 'Idea & Architecture Blueprint Deck',
      date: '10–14 Jan 2027',
      duration: '4-Day Submission Window',
      badge: 'Architecture Phase',
      badgeColor: 'border-[#c19a88]/40 text-[#c19a88] bg-[#c19a88]/10',
      description: 'Shortlisted squads submit a comprehensive 10-slide PDF deck articulating their problem statement, solution design, and database schema.',
      deliverables: ['10-Slide Architecture Blueprint (PDF upload)', 'Tech stack justification & API contracts'],
    },
    {
      number: '03',
      title: 'Engineering Sprint & Prototype Codebase',
      date: '16–25 Jan 2027',
      duration: '9-Day Building Sprint',
      badge: 'Main Hack Sprint',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      description: 'Squads build their full solution, maintaining clean git commit logs. Must deploy a live production-accessible URL.',
      deliverables: ['Public GitHub repository with clean commits & README', 'Live deployed cloud URL (Vercel, Render, AWS, etc.)', 'Optional: 2–3 min Loom/YouTube demo walkthrough video'],
    },
    {
      number: '04',
      title: 'Grand Finale Live Jury Defense',
      date: '29–30 Jan 2027',
      duration: 'Live Online Panel',
      badge: 'Championship Finale',
      badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
      description: 'Top finalist squads pitch their live prototype and defend technical architecture decisions before industry judges.',
      deliverables: ['Live 10-minute system demo + 5-minute Q&A', 'Cash prize awards & Top 25 National Merit Citations'],
    },
  ];

  const rubric = [
    {
      weight: '30%',
      title: 'Technical Architecture & Code Quality',
      desc: 'System modularity, database design, commit history hygiene, error resilience, and security considerations.',
      color: 'from-[#c19a88]/20 to-[#805948]/30',
      border: 'border-[#c19a88]/40',
    },
    {
      weight: '25%',
      title: 'Innovation & Problem Relevance',
      desc: 'Originality of the conceptual approach, practical real-world impact, and viability of solving the chosen problem domain.',
      color: 'from-blue-500/10 to-indigo-500/20',
      border: 'border-blue-500/30',
    },
    {
      weight: '25%',
      title: 'Working Prototype & User Experience',
      desc: 'Polish of the live deployment, mobile responsiveness, intuitive workflow, accessibility, and graceful edge-case handling.',
      color: 'from-emerald-500/10 to-teal-500/20',
      border: 'border-emerald-500/30',
    },
    {
      weight: '20%',
      title: 'Documentation & Presentation Defense',
      desc: 'Clarity of the repository README, architecture diagrams, live demo explanation, and squad confidence during jury Q&A.',
      color: 'from-amber-500/10 to-orange-500/20',
      border: 'border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Header & Hero */}
      <header className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#c19a88]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
            </span>
            <span>Official Tournament Protocol // Governance &amp; Standards</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/tracks"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Explore Tracks
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/faq"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              FAQs
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/register"
              className="font-semibold text-[#e8c5b4] hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <span>Register Squad ({formatINR(event.registration_fee_inr)})</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#c19a88]" />
            </Link>
          </div>
        </div>

        {/* Title & Core Value Proposition */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Rules, Guidelines &amp;{' '}
            <span className="bg-gradient-to-r from-[#ffe5d9] via-[#c19a88] to-[#805948] bg-clip-text text-transparent font-serif italic">
              Integrity Standards
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Everything your team needs to know to compete cleanly, deliver high-impact software, and qualify for the{' '}
            <strong className="text-white font-medium">{formatINR(event.prize_pool_inr)}</strong> cash pool and Top {event.certificates_top_n} National Merit Recognitions.
          </p>
        </div>

        {/* 4 Quick-Facts Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Squad Size</p>
              <p className="text-sm font-bold text-white mt-0.5">{event.min_team_size} to {event.max_team_size} Members</p>
              <p className="text-[11px] text-neutral-400">Solo builders supported</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] shrink-0">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Registration Pass</p>
              <p className="text-sm font-bold text-white mt-0.5">Flat {formatINR(event.registration_fee_inr)} / Team</p>
              <p className="text-[11px] text-neutral-400">Covers all rounds &amp; team</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">AI Coding Tools</p>
              <p className="text-sm font-bold text-white mt-0.5">Fully Permitted</p>
              <p className="text-[11px] text-neutral-400">Copilot / ChatGPT allowed</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] shrink-0">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Tournament Mode</p>
              <p className="text-sm font-bold text-white mt-0.5">100% Online</p>
              <p className="text-[11px] text-neutral-400">Compete from anywhere</p>
            </div>
          </div>
        </div>

        {/* Interactive Sticky / Filter Tab Pills */}
        <div className="sticky top-16 z-30 py-2.5 bg-[#0B0B0B]/90 backdrop-blur-md border-y border-white/[0.07] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#c19a88] text-black font-semibold shadow-[0_0_15px_rgba(193,154,136,0.3)]'
                  : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Section: Eligibility & Squad Formation */}
      {(activeTab === 'all' || activeTab === 'eligibility') && (
        <section className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <h2 className="text-xs font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
              01 // Eligibility &amp; Squad Formation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SpotlightCard className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div className="h-10 w-10 rounded-xl bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Who Can Participate?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                Open to undergraduate &amp; graduate students, polytechnic learners, coding bootcamp attendees, and independent developers across India.
              </p>
              <div className="space-y-1.5 pt-3 border-t border-white/[0.06] text-[11px] text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>College or personal email accepted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>No minimum CGPA requirement</span>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div className="h-10 w-10 rounded-xl bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Squad Composition</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                Teams may consist of {event.min_team_size} to {event.max_team_size} members. Solo engineers are fully welcomed and will be evaluated fairly on the same criteria.
              </p>
              <div className="space-y-1.5 pt-3 border-t border-white/[0.06] text-[11px] text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Cross-college teams permitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Cross-discipline squads permitted</span>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div className="h-10 w-10 rounded-xl bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88] mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Single Membership Rule</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-3">
                Each participant may belong to only one squad. A team leader initiates squad registration and pays the flat {formatINR(event.registration_fee_inr)} fee for everyone.
              </p>
              <div className="space-y-1.5 pt-3 border-t border-white/[0.06] text-[11px] text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Roster finalized prior to Stage 02</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Shared dashboard access for all members</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>
      )}

      {/* 3. Section: The 4 Progressive Competition Stages */}
      {(activeTab === 'all' || activeTab === 'stages') && (
        <section className="space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <h2 className="text-xs font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                02 // The 4 Progressive Tournament Stages
              </h2>
            </div>
            <p className="text-xs text-neutral-400">All stages conducted 100% online through your team dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stages.map((stage) => (
              <div
                key={stage.number}
                className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-[#c19a88]/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[#c19a88] px-2 py-0.5 rounded-md bg-[#c19a88]/10 border border-[#c19a88]/20">
                        Stage {stage.number}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${stage.badgeColor}`}>
                        {stage.badge}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-300 font-semibold">{stage.date}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{stage.title}</h3>
                    <p className="text-xs text-neutral-400 font-light mt-1.5 leading-relaxed">{stage.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Key Deliverable</p>
                  {stage.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Section: Allowed vs Strictly Prohibited (Visual Do's and Don'ts) */}
      {(activeTab === 'all' || activeTab === 'policy') && (
        <section className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <h2 className="text-xs font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
              03 // Code Integrity Policy: Allowed vs. Strictly Prohibited
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Allowed Column */}
            <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-500/15">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-300">Allowed &amp; Encouraged</h3>
                  <p className="text-[11px] text-neutral-400">Standard tools and workflows permitted with integrity</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">AI Assistance (Copilot, Cursor, ChatGPT, Claude)</strong>
                    <span className="text-neutral-400">Permitted for boilerplate, debugging, and ideation. Transparent disclosure in README requested.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Open-Source Libraries &amp; Frameworks</strong>
                    <span className="text-neutral-400">React, Next.js, PyTorch, Tailwind, Supabase, UI kits, and public APIs are fully allowed with attribution.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Cloud Free Tiers &amp; Hosting Platforms</strong>
                    <span className="text-neutral-400">Vercel, Render, Railway, Firebase, AWS Free Tier, Supabase, or Hugging Face Spaces for deployment.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Cross-Institution Squads</strong>
                    <span className="text-neutral-400">Collaborating with friends, alumni, or colleagues across different institutions across India.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibited Column */}
            <div className="p-5 sm:p-6 rounded-2xl border border-rose-500/25 bg-rose-500/[0.02] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-rose-500/15">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-rose-300">Strictly Prohibited (Disqualification)</h3>
                  <p className="text-[11px] text-neutral-400">Violations will result in immediate disqualification</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Pre-Built Codebases &amp; Repurposed Projects</strong>
                    <span className="text-neutral-400">Submitting work authored before the hackathon kickoff is strictly forbidden. Commit logs are audited.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Direct Plagiarism or Cloned Repositories</strong>
                    <span className="text-neutral-400">Forking or copying existing solutions without substantial, novel engineering logic will trigger immediate removal.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Private or Inaccessible GitHub Repos</strong>
                    <span className="text-neutral-400">Repositories must be publicly accessible on GitHub by the Stage 03 deadline for code audit.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block font-medium">Duplicate Squad Memberships</strong>
                    <span className="text-neutral-400">An individual builder registering across multiple teams will have all related teams disqualified.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Section: Mandatory Deliverables Breakdown */}
      {(activeTab === 'all' || activeTab === 'deliverables') && (
        <section className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <h2 className="text-xs font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
              04 // Mandatory Submission Deliverables
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88]">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Stage 02 PDF Blueprint</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Max 10 slides in PDF format outlining problem scope, architectural flow, schema, and API boundaries.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88]">
                <Github className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Public GitHub Repo</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Complete codebase with active commits, clear directory structure, setup instructions, and open license.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88]">
                <Globe className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Live Deployed URL</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                A working, publicly accessible web or API link hosted on any cloud provider where judges can test live features.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#c19a88]/10 border border-[#c19a88]/20 flex items-center justify-center text-[#c19a88]">
                <Video className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">4. Demo Video (Bonus)</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Optional 2–3 minute Loom or unlisted YouTube video walking through the architecture, features, and challenges overcome.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. Section: Official Judging Rubric */}
      {(activeTab === 'all' || activeTab === 'judging') && (
        <section className="space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#c19a88]/70" />
              <h2 className="text-xs font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                05 // Official Evaluation Rubric (100 Points Total)
              </h2>
            </div>
            <p className="text-xs text-neutral-400">Standardized across all AI/ML, Web, and Mobile tracks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rubric.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${item.border} bg-gradient-to-b ${item.color} space-y-3 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">{item.weight}</span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Weightage</span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Section: Rules FAQ Accordion */}
      <section className="space-y-5 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-[#c19a88]/70" />
          <h2 className="text-xs font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
            06 // Common Rules Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] cursor-pointer"
                >
                  <span className="text-sm font-semibold text-white tracking-tight">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#c19a88] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-neutral-300/90 font-light leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Call to Action Footer Strip */}
      <div className="rounded-2xl border border-[#c19a88]/30 bg-gradient-to-r from-[#c19a88]/15 via-black to-[#805948]/15 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold block">
            Ready to Build With Integrity?
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Assemble your squad and claim your pass for flat {formatINR(event.registration_fee_inr)}.
          </h3>
          <p className="text-xs text-neutral-400 font-light">
            One fee covers up to {event.max_team_size} members across all 4 competition rounds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#e8c5b4] to-[#c19a88] text-black font-bold text-xs uppercase tracking-wider text-center shadow-[0_0_25px_rgba(193,154,136,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <span>Register Squad Now</span>
            <ArrowRight className="h-3.5 w-3.5 text-black" />
          </Link>

          <Link
            href="/faq"
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white font-medium text-xs text-center transition-colors"
          >
            Browse Help FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
