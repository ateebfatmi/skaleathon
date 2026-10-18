'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { EventData } from '@/lib/db/types';
import { motion } from 'framer-motion';

interface TimelineProps {
  event: EventData;
}

export default function TimelineSection({ event }: TimelineProps) {
  const milestones = [
    {
      num: '01',
      title: 'Team Registrations Open',
      date: formatDate(event.registration_start_at),
      desc: 'Form teams of 1–6 members and complete payment of ₹99 flat fee.',
    },
    {
      num: '02',
      title: 'Registration Cutoff',
      date: formatDate(event.registration_end_at),
      desc: 'Final deadline to register new teams or alter team member compositions.',
    },
    {
      num: '03',
      title: 'Code & Build Submission Cutoff',
      date: formatDate(event.submission_deadline),
      desc: 'Public GitHub repository, deployed live URL, and architecture walkthrough video finalized.',
    },
    {
      num: '04',
      title: 'Technical Evaluation Window',
      date: event.submission_deadline ? 'Immediately Following Cutoff' : 'To be announced',
      desc: 'Panels score project repositories across innovation, code architecture, and deployment.',
    },
    {
      num: '05',
      title: 'Official Conferral & Leaderboard',
      date: formatDate(event.results_announced_at),
      desc: 'Official leaderboard reveal, cash prize dispersal, and Top 25 certificate generation.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-[#0B0B0B] border-t border-white/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#c19a88]/70" />
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c19a88]/85 font-medium">
              Operational Schedule
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            Event{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              milestones
            </span>
            .
          </h2>
          <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
            Authoritative dates and operational deadlines. No artificial countdown timers.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3.5">
          {milestones.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[20px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] hover:border-[#c19a88]/30 transition-all duration-300 gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-semibold text-[#c19a88] tracking-[0.16em] mt-1 shrink-0">
                  {m.num}
                </span>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white">{m.title}</h3>
                  <p className="text-xs text-white/50 mt-1 font-light">{m.desc}</p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block text-[11px] font-mono tracking-wide px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[#c19a88]">
                  {m.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
