import React from 'react';

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyanAccent-400">Legal Agreement</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">Terms & Conditions</h1>
          <p className="mt-2 text-xs text-slate-400">Effective Date: October 2026 | Version 1.0 — SkaleKraft</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed rounded-2xl border border-white/10 bg-[#0c111e] p-8">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing the Skaleathon 2027 platform, registering a team, or completing payment, you agree to be bound by these Terms and Conditions and our Official Competition Rules.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Team Responsibilities</h2>
            <p>
              The Team Leader acts as the official representative for all team members. The Team Leader warrants that all registered members have consented to participation and will adhere to code originality standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Intellectual Property Rights</h2>
            <p>
              Participants retain 100% intellectual property ownership of the software, design, and code they build during Skaleathon 2027. SkaleKraft claims no ownership over your code repository or product. By submitting, teams grant SkaleKraft a non-exclusive license to showcase the project title, team name, and public demonstration video for event promotional purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Internship Opportunity Disclaimer</h2>
            <p>
              Candidates from the top five teams receive an opportunity to interview for internships at SkaleKraft. This is an interview opportunity only and is not a guarantee of an internship or employment. Hiring decisions remain at the sole discretion of SkaleKraft based on performance, technical fit, and background verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of the hackathon shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
