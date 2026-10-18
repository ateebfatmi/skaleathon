import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyanAccent-400">Payment Terms</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">Refund & Cancellation Policy</h1>
          <p className="mt-2 text-xs text-slate-400">Effective Date: October 2026 | Version 1.0 — SkaleKraft</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed rounded-2xl border border-white/10 bg-[#0c111e] p-8">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. General Registration Fee Policy</h2>
            <p>
              The Skaleathon 2027 team registration fee of ₹99 is a nominal entry contribution dedicated to covering infrastructure, database services, judging coordination, and certificate verification systems.
            </p>
            <p>
              Once a payment has been successfully verified and team registration is completed, the registration fee is generally non-refundable, as computational resources and administrative seats are committed immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Eligible Refund Circumstances</h2>
            <p>
              Refunds will be processed strictly in the following scenarios:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Duplicate Transaction:</strong> If a team is accidentally charged more than once for the same registration due to a network or gateway glitch, the redundant charge(s) will be refunded in full.</li>
              <li><strong>Event Cancellation:</strong> In the unlikely event that Skaleathon 2027 is cancelled by the organizers prior to the submission phase, 100% of registration fees will be refunded to the original payment source.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Non-Refundable Scenarios</h2>
            <p>
              No refund shall be provided if:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>A team chooses to withdraw or fails to submit their project before the deadline.</li>
              <li>A team is disqualified due to plagiarism, code theft, or violations of the Code of Conduct.</li>
              <li>Members change or drop out of the team after payment confirmation.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Refund Request Procedure</h2>
            <p>
              To request investigation into duplicate charges, the Team Leader must email <strong>contact@skalekraft.in</strong> within 7 days of the transaction, specifying the team name, Order ID, and Razorpay payment reference. Eligible refunds will be credited back via Razorpay to the original source within 5–7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
