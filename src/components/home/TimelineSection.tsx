import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { EventData } from '@/lib/db/types';

interface TimelineProps {
  event: EventData;
}

export default function TimelineSection({ event }: TimelineProps) {
  const milestones = [
    {
      title: 'Team Registrations Open',
      date: formatDate(event.registration_start_at),
      desc: 'Form teams of 1–6 members and complete payment of ₹99.',
      status: event.registration_start_at ? 'scheduled' : 'tba',
    },
    {
      title: 'Registration Deadline',
      date: formatDate(event.registration_end_at),
      desc: 'Final cutoff to register or modify team composition.',
      status: event.registration_end_at ? 'scheduled' : 'tba',
    },
    {
      title: 'Project Submission Deadline',
      date: formatDate(event.submission_deadline),
      desc: 'All GitHub repositories, live demo links, and video URLs must be finalized.',
      status: event.submission_deadline ? 'scheduled' : 'tba',
    },
    {
      title: 'Judging & Evaluation Period',
      date: event.submission_deadline ? 'Following Submissions' : 'To be announced',
      desc: 'Specialized evaluation panels score submissions across weighted criteria.',
      status: 'tba',
    },
    {
      title: 'Official Results & Certificate Conferral',
      date: formatDate(event.results_announced_at),
      desc: 'Public leaderboard announcement and Top 25 certificate generation.',
      status: event.results_announced_at ? 'scheduled' : 'tba',
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300 mb-4">
            <Calendar className="h-3.5 w-3.5 text-cyanAccent-400" />
            <span>Event Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Configurable Event Schedule
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Dates and operational deadlines are set authoritatively by organizers. No fabricated timers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-white/10 bg-[#0c111e] hover:border-white/20 transition-all gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyanAccent-400 shrink-0 mt-1 sm:mt-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                    m.date === 'To be announced'
                      ? 'border-yellow-500/30 bg-yellow-950/30 text-yellow-300'
                      : 'border-brand-500/30 bg-brand-950/40 text-brand-300'
                  }`}
                >
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
