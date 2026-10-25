import React from 'react';
import { formatDateOnly, REGISTRATION_DEADLINE } from '@/lib/utils';
import { EventData } from '@/lib/db/types';

interface TimelineProps {
  event: EventData;
}

export default function TimelineSection({ event }: TimelineProps) {
  const milestones = [
    {
      num: '01',
      title: 'Team Enrollment & Verification',
      date: `Closes ${formatDateOnly(event.registration_end_at || REGISTRATION_DEADLINE)}`,
      desc: `Form teams of ${event.min_team_size}–${event.max_team_size} members and complete verification via the ₹${event.registration_fee_inr} flat team fee.`,
      status: 'Active',
    },
    {
      num: '02',
      title: 'Stage 1 — Online Technical Quiz',
      date: '8 Jan 2027',
      desc: 'Screening round: Timed online quiz covering core CS logic and chosen track fundamentals.',
      status: 'Upcoming',
    },
    {
      num: '03',
      title: 'Stage 2 — Idea & Architecture PPT',
      date: '10–14 Jan 2027',
      desc: 'Ideation round: Submit problem statement, architectural diagram, and technical feasibility deck.',
      status: 'Upcoming',
    },
    {
      num: '04',
      title: 'Stage 3 — Project Codebase & Demo',
      date: '16–25 Jan 2027',
      desc: 'Building round: Submit public GitHub repo and live deployed URL (optional video walkthrough).',
      status: 'Upcoming',
    },
    {
      num: '05',
      title: 'Stage 4 — Grand Finale Live Q&A & Results',
      date: '29–30 Jan 2027',
      desc: `Live panel defense for finalist teams, followed by ₹${event.prize_pool_inr.toLocaleString('en-IN')} in prizes, top ${event.certificates_top_n} certificates, and interviews.`,
      status: 'Grand Finale',
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-14 relative bg-[#0B0B0B] border-t border-white/10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-5 bg-[#f5f5f5]/70" />
            <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold">
              OPERATIONAL SCHEDULE
            </p>
            <span className="h-px w-5 bg-[#f5f5f5]/70" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Event <span className="text-[#c19a88]">milestones</span>.
          </h2>
          <p className="mt-1.5 text-xs text-white/50 leading-relaxed font-light">
            Authoritative dates and operational deadlines across all 4 stages.
          </p>
        </div>

        {/* Compact Unified Timeline Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121212]/90 backdrop-blur-xl overflow-hidden divide-y divide-white/[0.06] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 px-4 sm:px-6 hover:bg-white/[0.02] transition-colors gap-2.5 sm:gap-4"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                <span className="font-mono text-[11px] font-bold text-[#c19a88] bg-[#f5f5f5]/10 border border-[#f5f5f5]/25 px-2 py-0.5 rounded shrink-0">
                  {m.num}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-[#ffffff] transition-colors">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/50 font-light mt-0.5 line-clamp-1 sm:line-clamp-none">
                    {m.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 sm:text-right pl-8 sm:pl-0">
                <span className="inline-block text-[11px] font-mono font-medium px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[#ffffff] group-hover:border-[#f5f5f5]/40 transition-colors shadow-sm">
                  {m.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
