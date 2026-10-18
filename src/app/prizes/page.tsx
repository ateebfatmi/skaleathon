import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { Trophy, Award, Briefcase, Info, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export const revalidate = 0;

export default async function PrizesPage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/30 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-4">
            <Trophy className="h-3.5 w-3.5" />
            <span>Official Rewards</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Prizes & Recognitions
          </h1>
          <p className="mt-4 text-base text-slate-300">
            SkaleKraft has allocated an official prize pool of {formatINR(event.prize_pool_inr || 35000)} alongside national merit certificates and technical internship interview pathways.
          </p>
        </div>

        {/* Podium Cash Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* 1st Place */}
          <div className="rounded-3xl border border-amber-500/50 bg-gradient-to-b from-[#182035] to-[#0c111e] p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-md">
                  Grand Champion
                </span>
                <Trophy className="h-7 w-7 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-200">First Prize</h2>
              <div className="text-4xl sm:text-5xl font-black text-white my-3 tracking-tight">
                {formatINR(event.first_prize_inr || 20000)}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Awarded to the overall top-ranked team across all tracks for demonstrating supreme technical implementation, originality, and impact.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-amber-300 font-semibold">
              Cash Prize + Winner Certificate + SkaleKraft Interview Opportunity
            </div>
          </div>

          {/* 2nd Place */}
          <div className="rounded-3xl border border-slate-500/30 bg-[#0c111e] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800/80 border border-slate-500/30 px-3 py-1 rounded-md">
                  First Runner-Up
                </span>
                <Award className="h-7 w-7 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-200">Second Prize</h2>
              <div className="text-4xl font-black text-white my-3 tracking-tight">
                {formatINR(event.second_prize_inr || 10000)}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Conferred to the second-highest scoring team for outstanding engineering rigor and product execution.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-300 font-semibold">
              Cash Prize + Merit Certificate + SkaleKraft Interview Opportunity
            </div>
          </div>

          {/* 3rd Place */}
          <div className="rounded-3xl border border-orange-500/30 bg-[#0c111e] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-300 bg-orange-950/80 border border-orange-500/30 px-3 py-1 rounded-md">
                  Second Runner-Up
                </span>
                <Award className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-200">Third Prize</h2>
              <div className="text-4xl font-black text-white my-3 tracking-tight">
                {formatINR(event.third_prize_inr || 5000)}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Conferred to the third-highest scoring team for high-quality prototype delivery and problem solving.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-orange-300 font-semibold">
              Cash Prize + Merit Certificate + SkaleKraft Interview Opportunity
            </div>
          </div>
        </div>

        {/* Certificates & Internship Opportunity Deep-Dive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top 25 Certificates */}
          <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyanAccent-500/10 border border-cyanAccent-500/20 text-cyanAccent-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Top 25 Teams Certificate Conferral</h3>
                <span className="text-xs text-cyanAccent-300">Merit Recognized Nationally</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every eligible member of the top 25 teams on the official finalized leaderboard will be issued an individual verified PDF certificate with an immutable verification QR code.
            </p>
            <p className="text-xs text-slate-400">
              Certificates can be shared on LinkedIn, added to professional resumes, and verified instantaneously by third-party recruiters on our public registry.
            </p>
          </div>

          {/* SkaleKraft Internship Opportunity */}
          <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Top 5 Teams: SkaleKraft Internship Pathway</h3>
                <span className="text-xs text-brand-300">Fast-Track Technical Evaluation</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Candidates from the top five teams receive an opportunity to interview for internships at SkaleKraft.
            </p>
            <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Official Notice:</strong> Candidates from the top five teams receive an opportunity to interview for internships at SkaleKraft. This is not a guarantee of an internship or employment.
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition-all"
          >
            <span>Register Your Team Now — ₹99</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
