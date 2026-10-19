import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';

export default function RulesPage() {
  return (
    <div className="py-10 sm:py-16 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative w-full space-y-14 pb-24 text-neutral-200">
          {/* Subtle Background Ambient Glows */}
          <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
          <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

          {/* 1. Open Luxury Editorial Hero */}
          <header className="relative pt-1">
            <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
              <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
                PROTOCOL
              </span>
            </div>

            {/* Top Utility & Context Ribbon */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
                </span>
                <span className="text-[#c19a88]">Competition Protocol {'//'} Governance &amp; Eligibility</span>
                <span className="text-white/20">•</span>
                <span className="text-neutral-400">
                  Team Size: <strong className="text-white font-semibold">1 to 6 Members</strong>
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[#e8c5b4] font-semibold">[FLAT ₹99 PASS]</span>
              </div>

              <div className="flex items-center gap-5 text-xs">
                <Link
                  href="/tracks"
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
                >
                  <span>Explore Tracks</span>
                </Link>
                <span className="text-white/15">|</span>
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
                >
                  <span>Register Squad</span>
                  <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Editorial Headline & Manifesto */}
            <div className="relative z-10 max-w-3xl space-y-5 pb-9">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
                Rules &amp;{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Eligibility
                </span>
              </h1>

              <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
                Official governance standards for Skaleathon. Compliance with these engineering, originality, and submission guidelines is required for evaluation and prize conferral.
              </p>
            </div>

            {/* Full-Width 4-Column Editorial Section Index Bar with Transition */}
            <EditorialIndexBar
              layoutIdPrefix="rulesIndex"
              items={[
                { num: '01', label: 'Eligibility & Squads', href: '#eligibility' },
                { num: '02', label: '4 Competition Stages', href: '#stages' },
                { num: '03', label: 'Code & AI Disclosure', href: '#originality' },
                { num: '04', label: 'Mandatory Deliverables', href: '#deliverables' },
              ]}
            />
          </header>

          {/* 2. Section 01: Eligibility & Squad Composition */}
          <section id="eligibility" className="space-y-8 scroll-mt-28">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                01 {'//'} Participant Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Eligibility &amp;{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Squad Formation
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
              <div className="relative pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                    Pillar 01 • Who Can Compete
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Open to Builders Across India
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Participation is open to undergraduate and graduate students, bootcamp learners, and independent software developers across India. Cross-college and cross-organization squads are fully permitted.
                </p>
              </div>

              <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                    Pillar 02 • Squad Size &amp; Registration
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  1 to 6 Engineers • Flat ₹99 Pass
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Squads may consist of 1 to 6 members (solo builders welcome). Each participant may belong to only one squad. A single flat ₹99 registration fee covers the entire squad.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Section 02: The 4 Sequential Competition Stages */}
          <section id="stages" className="space-y-6 pt-10 border-t border-white/[0.08] scroll-mt-28">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                02 {'//'} Tournament Progression
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                The 4 Progressive{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Competition Stages
                </span>
              </h2>
            </div>

            <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
              {[
                {
                  num: '01',
                  title: 'Online Technical Screening Quiz',
                  date: 'Jan 08, 2028',
                  desc: 'Timed 30–45 minute assessment evaluating CS fundamentals, algorithmic reasoning, and track domain aptitude.',
                },
                {
                  num: '02',
                  title: 'Idea & Architecture PPT (PDF)',
                  date: 'Jan 10–14, 2028',
                  desc: 'Shortlisted squads submit a 10-slide PDF deck detailing their self-defined problem statement, architecture diagram, and schema.',
                },
                {
                  num: '03',
                  title: 'Engineering Sprint & Codebase',
                  date: 'Jan 16–25, 2028',
                  desc: 'Squads build and submit a public GitHub repository and live deployed cloud URL (plus an optional 2–3 min demo walkthrough).',
                },
                {
                  num: '04',
                  title: 'Grand Finale Live Jury Defense',
                  date: 'Jan 29–30, 2028',
                  desc: 'Top finalist squads defend their system architecture and live prototype before the SkaleKraft jury panel.',
                },
              ].map((st) => (
                <div
                  key={st.num}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-xs font-bold text-[#c19a88] w-6 shrink-0">
                      {st.num}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm sm:text-base font-bold text-white">{st.title}</h3>
                      <p className="text-xs text-neutral-400 font-light">{st.desc}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#e8c5b4] shrink-0">{st.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Section 03 & 04: Originality & Deliverables */}
          <section id="originality" className="space-y-8 pt-10 border-t border-white/[0.08] scroll-mt-28">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
                03 {'//'} Engineering Integrity
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Code Originality &amp;{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Deliverable Standards
                </span>
              </h2>
            </div>

            <div id="deliverables" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
              <div className="relative pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                    Pillar 01 • Originality &amp; AI Disclosure
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Fresh Sprint Engineering
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Core system logic must be authored during the competition window. Open-source frameworks, UI libraries, and AI coding assistants are permitted with transparent disclosure in your repository README.
                </p>
              </div>

              <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                    Pillar 02 • Mandatory Artifacts
                  </span>
                  <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  PDF Blueprint + GitHub + Live URL
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Stage 02 requires a 10-slide PDF architecture deck. Stage 03 requires a public GitHub repository and a live deployed prototype URL. A 2–3 minute video walkthrough is optional and provides an evaluation advantage.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
