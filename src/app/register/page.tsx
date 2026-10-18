import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import MultiStepRegistration from '@/components/registration/MultiStepRegistration';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function RegisterPage() {
  const [event, tracks] = await Promise.all([
    EventRepository.getEvent(),
    EventRepository.getTracks(),
  ]);

  const isClosed = event.status !== 'registration_open';

  return (
    <div className="py-12 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Skaleathon 2027</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanAccent-500/30 bg-cyanAccent-950/30 px-3.5 py-1 text-xs font-semibold text-cyanAccent-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>National Online Registration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Register Your Team
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300">
            Form your team of 1–6 members, select your track, and complete the ₹99 team entry fee to compete for ₹35,000 in prizes and SkaleKraft internship interview opportunities.
          </p>
        </div>

        {isClosed ? (
          <div className="max-w-xl mx-auto rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-yellow-300">Registration is Currently Closed</h2>
            <p className="text-xs text-slate-300">
              The registration portal is currently closed ({event.status.replace(/_/g, ' ')}). Please monitor the announcements on the homepage or reach out to organizers at contact@skalekraft.in.
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-white/10 px-6 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <MultiStepRegistration tracks={tracks} />
        )}
      </div>
    </div>
  );
}
