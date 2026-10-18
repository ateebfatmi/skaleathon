import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300 mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-cyanAccent-400" />
            <span>Official Competition Guidelines</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Rules & Eligibility
          </h1>
          <p className="mt-4 text-base text-slate-300">
            Please read these official rules carefully before registering your team. Compliance with all rules is mandatory for judging eligibility and prize conferral.
          </p>
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Eligibility */}
          <div className="rounded-2xl border border-white/10 bg-[#0c111e] p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyanAccent-400">1.</span> Eligibility Criteria
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Participation is open across India to undergraduate and graduate students, boot camp graduates, and early-career software developers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>There is no minimum age requirement; however, participants under 18 must have parental/guardian consent to participate and receive prizes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Members of the organizing committee or judging panel are disqualified from entering the competition as participants.</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Team Formation */}
          <div className="rounded-2xl border border-white/10 bg-[#0c111e] p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyanAccent-400">2.</span> Team Composition & Registration
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Teams must have between <strong>1 and 6 members</strong>. Solo developers may register as a 1-person team.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No duplicate memberships:</strong> An individual can only be a member of one registered team during Skaleathon 2027.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>The registration fee is a flat <strong>₹99 per team</strong>, paid online via Razorpay before project submission.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Originality & AI Tool Usage */}
          <div className="rounded-2xl border border-white/10 bg-[#0c111e] p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyanAccent-400">3.</span> Code Originality & AI Disclosures
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>All core application logic must be original work created for this hackathon. Pre-existing full-stack templates or verbatim clones will be disqualified.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Public open-source libraries, UI components (such as Tailwind or shadcn), and cloud services are permitted with proper attribution.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>AI Disclosure:</strong> The use of generative AI (ChatGPT, Claude, GitHub Copilot) is permitted; however, teams must explicitly disclose AI tools used in their submission form.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Submission Requirements */}
          <div className="rounded-2xl border border-white/10 bg-[#0c111e] p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyanAccent-400">4.</span> Project Submission Deliverables
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>A publicly accessible GitHub repository with an informative README, installation guide, and commit history.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>A working deployed web URL or mobile application demo link/screencast.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>A 2-3 minute demonstration video walkthrough (YouTube or Loom unlisted link).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Submissions past the official submission deadline will be automatically rejected by the submission gateway.</span>
              </li>
            </ul>
          </div>

          {/* Section 5: Disqualification */}
          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 space-y-3 text-red-200">
            <h2 className="text-lg font-bold text-red-100 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span>5. Grounds for Disqualification</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Plagiarism, submission of fraudulent repository links, harassment of participants or judges, falsified team credentials, or tampering with evaluation scoring will result in immediate disqualification and revocation of any awarded prizes or certificates.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-500 transition-colors"
          >
            <span>Agree and Register Team — ₹99</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
