import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyanAccent-400">Legal Policy</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">Privacy Policy</h1>
          <p className="mt-2 text-xs text-slate-400">Effective Date: October 2026 | Version 1.0 — SkaleKraft</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed rounded-2xl border border-white/10 bg-[#0c111e] p-8">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
            <p>
              Skaleathon 2027 operates under a data minimization principle. We collect only the personal information strictly necessary to operate the hackathon, communicate event updates, verify student or professional eligibility, process ₹99 registration fees via Razorpay, and issue verifiable digital certificates.
            </p>
            <p>
              Information collected includes: Team Leader and member full names, email addresses, contact phone numbers, educational institutions or organizations, city/state, GitHub repository links, and payment transaction identifiers. We do NOT store payment card details, UPI PINs, or bank credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Use of Information</h2>
            <p>
              Your information is utilized solely to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Process and confirm your team registration and payment.</li>
              <li>Coordinate project submissions and technical evaluation by assigned judges.</li>
              <li>Verify eligibility for cash prizes, interview pathways, and merit certificates.</li>
              <li>Publish public rankings and verified credentials on the official leaderboard.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Public vs Private Data Protection</h2>
            <p>
              We safeguard participant privacy. Participant phone numbers, email addresses, and private scoring remarks are strictly confidential and will never be published on public leaderboards or sold to external third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Data Retention and Rights</h2>
            <p>
              Participants may request the inspection or deletion of their personal records upon conclusion of the event, subject to regulatory retention obligations for financial and tax audits. Contact contact@skalekraft.in for privacy inquiries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
