import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="py-20 sm:py-28 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-14">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Competition Protocol
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
            Rules &{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              eligibility
            </span>
            .
          </h1>
          <p className="mt-4 text-base text-white/55 leading-relaxed font-light">
            Please read these official rules carefully prior to team registration. Compliance with all requirements is mandatory for evaluation eligibility and certificate conferral.
          </p>
        </div>

        <div className="space-y-6 text-sm text-white/65 leading-relaxed font-light">
          {/* Section 1: Eligibility */}
          <div className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-7 sm:p-8 space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <h2 className="text-base font-semibold tracking-wide text-white flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#c19a88]">01.</span> Eligibility Standards
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>Participation is open across India to undergraduate and graduate students, boot camp graduates, and independent software builders.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>There is no minimum age requirement; participants under 18 must have parental/guardian consent to receive official cash prizes.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>Members of the SkaleKraft core organizing team or judging panels are ineligible to enter the competition as participants.</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Team Formation */}
          <div className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-7 sm:p-8 space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <h2 className="text-base font-semibold tracking-wide text-white flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#c19a88]">02.</span> Team Composition & Registration
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>Teams must have between <strong className="text-white font-medium">1 and 6 members</strong>. Solo developers may register as a 1-person team.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong className="text-white font-medium">No duplicate memberships:</strong> An individual can only belong to one registered team in Skaleathon 2027.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>The registration fee is a flat <strong className="text-white font-medium">₹99 per team</strong>, paid securely via Razorpay to participate in competition stages.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: The 4-Stage Competition Architecture */}
          <div className="rounded-[24px] border border-[#c19a88]/40 bg-[linear-gradient(145deg,rgba(193,154,136,0.06),rgba(14,14,14,0.95))] p-7 sm:p-8 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <h2 className="text-base font-semibold tracking-wide text-white flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#c19a88]">03.</span> The 4 Progressive Competition Stages
            </h2>
            <p className="text-xs text-white/60">
              Skaleathon 2027 operates across four sequential stages designed to rigorously test technical aptitude, system design, software implementation, and live oral defense:
            </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Stage 1 • Quiz</span>
                    <span className="text-[10px] font-mono text-emerald-400/80">Jan 08, 2028</span>
                  </div>
                  <h3 className="text-xs font-bold text-white">Online Technical Screening Quiz</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    A timed technical quiz covering core CS logic, algorithmic reasoning, and domain-specific track fundamentals. High-scoring teams qualify for Stage 2.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c19a88] font-bold uppercase tracking-wider">Stage 2 • PPT</span>
                    <span className="text-[10px] font-mono text-[#c19a88]/80">Jan 10–14, 2028</span>
                  </div>
                  <h3 className="text-xs font-bold text-white">Idea & Architecture PPT</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Shortlisted teams submit a structured slide deck detailing their problem statement, system architecture, database schema, tech stack, and feasibility.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#e8c5b4] font-bold uppercase tracking-wider">Stage 3 • Build</span>
                    <span className="text-[10px] font-mono text-[#e8c5b4]/80">Jan 17–26, 2028</span>
                  </div>
                  <h3 className="text-xs font-bold text-white">Engineering Sprint & Codebase</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    The primary engineering phase. Teams build and submit a public GitHub repository and live deployed URL. A video walkthrough demo is not necessary, but will give your team a distinct evaluation advantage.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Stage 4 • Finale</span>
                    <span className="text-[10px] font-mono text-amber-400/80">Jan 29–30, 2028</span>
                  </div>
                  <h3 className="text-xs font-bold text-white">Grand Finale Live Q&A</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Top finalist teams defend their architecture and code in a live Q&A session with domain judges and SkaleKraft leadership to determine final rankings.
                  </p>
                </div>
              </div>
          </div>

          {/* Section 4: Originality & AI Tool Usage */}
          <div className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-7 sm:p-8 space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <h2 className="text-base font-semibold tracking-wide text-white flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#c19a88]">04.</span> Code Originality & AI Disclosures
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>All core system logic must be original software created for this hackathon. Pre-existing turnkey templates or verbatim clones are strictly disqualified.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span>Public open-source libraries, UI component primitives (Tailwind, Radix, Lucide), and cloud platforms are permitted with proper attribution.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong className="text-white font-medium">AI Disclosure:</strong> Generative AI coding tools (Claude, Cursor, GitHub Copilot) are welcomed; teams must disclose usage in their submission manifesto.</span>
              </li>
            </ul>
          </div>

          {/* Section 5: Submission Requirements */}
          <div className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-7 sm:p-8 space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <h2 className="text-base font-semibold tracking-wide text-white flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#c19a88]">05.</span> Submission Deliverables (Stages 02 & 03)
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong className="text-white font-medium">Stage 02 Architecture PPT:</strong> A structured slide deck (PDF, max 10 slides) submitted directly through the portal outlining system architecture, database schema, and feasibility.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong className="text-white font-medium">Stage 03 Codebase:</strong> A publicly accessible GitHub repository with an informative README, architecture overview, and commit history.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong className="text-white font-medium">Stage 03 Live URL:</strong> A working deployed web URL or mobile application demo link/screencast demonstrating core user flows.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#c19a88] shrink-0 mt-0.5" strokeWidth={2} />
                <span><strong className="text-white font-medium">Video Walkthrough (Optional Advantage):</strong> A 2–3 minute video demonstration is not strictly necessary, but will give your team a strong evaluation advantage during judge scoring.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-8 py-3.5 text-xs font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-105 transition-all"
          >
            <span>Agree & Register Team — ₹99</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
