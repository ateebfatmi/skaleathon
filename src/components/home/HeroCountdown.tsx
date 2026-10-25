'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EventData } from '@/lib/db/types';

const FALLBACK_DEADLINE = '2026-12-31T18:29:59.000Z';

const STAGES = [
  { label: 'Register', date: 'Till 31 Dec' },
  { label: 'Tech Quiz', date: '8 Jan' },
  { label: 'Idea PPT', date: '10–14 Jan' },
  { label: 'Build & Demo', date: '16–25 Jan' },
  { label: 'Grand Finale', date: '29–30 Jan' },
];

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    mins: Math.floor((diff / 60_000) % 60),
    secs: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
}

export default function HeroCountdown({ event }: { event: EventData }) {
  const target = new Date(event.registration_end_at || FALLBACK_DEADLINE).getTime();
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining(target));
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: 'Days', value: time?.days },
    { label: 'Hours', value: time?.hours },
    { label: 'Mins', value: time?.mins },
    { label: 'Secs', value: time?.secs },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl px-4 py-5 sm:px-7 sm:py-6 text-left">
      {/* Countdown row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88]">
            {time?.done ? 'Registrations closed' : 'Registrations close in'}
          </div>
          <div className="mt-1 text-xs text-white/50">
            Secure your squad slot before the deadline.
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {units.map((u, i) => (
            <React.Fragment key={u.label}>
              <div className="min-w-[56px] sm:min-w-[64px] rounded-xl border border-white/[0.08] bg-black/40 px-2 py-2 text-center">
                <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {u.value === undefined ? '--' : String(u.value).padStart(2, '0')}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">{u.label}</div>
              </div>
              {i < units.length - 1 && <span className="text-white/20 font-mono">:</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stage roadmap */}
      <div className="mt-5 pt-5 border-t border-white/[0.06]">
        <ol className="relative grid grid-cols-5 gap-1">
          <div className="absolute left-[10%] right-[10%] top-[7px] h-px bg-gradient-to-r from-[#f5f5f5] via-white/15 to-white/10" aria-hidden="true" />
          {STAGES.map((s, i) => (
            <li key={s.label} className="relative flex flex-col items-center text-center">
              <span
                className={`relative z-10 h-3.5 w-3.5 rounded-full border-2 ${
                  i === 0
                    ? 'border-[#f5f5f5] bg-[#f5f5f5] shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                    : 'border-white/20 bg-[#0B0B0B]'
                }`}
              />
              <span className={`mt-2 text-[10px] sm:text-xs font-medium ${i === 0 ? 'text-white' : 'text-white/60'}`}>
                {s.label}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/35">{s.date}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex justify-center">
          <Link
            href="/rules"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#c19a88] hover:text-white transition-colors"
          >
            Full schedule &amp; rules <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
