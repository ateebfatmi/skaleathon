import React from 'react';
import Link from 'next/link';
import FaqSection from '@/components/home/FaqSection';
import { ArrowRight, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { EventRepository } from '@/lib/db/repository';
import { formatINR } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Skaleathon',
  description: 'Answers about Skaleathon registration, teams, tracks, judging, prizes, and certificates.',
};

export default async function FaqPage() {
  const event = await EventRepository.getEvent();

  return (
    <div className="py-10 sm:py-16 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative w-full space-y-12 pb-24 text-neutral-200">
          <h1 className="sr-only">Skaleathon frequently asked questions</h1>
          {/* Subtle Background Ambient Glows */}
          <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />

          {/* Top Utility & Context Ribbon */}
          <header className="relative pt-1">
            <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
              <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
                SUPPORT
              </span>
            </div>

            <div className="mobile-utility-row relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-2 border-b border-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
                </span>
                <span className="text-[#c19a88]">Knowledge Base // Participant FAQ</span>
                <span className="text-white/20">•</span>
                <span className="text-[#e8c5b4] font-semibold">[SKALEATHON]</span>
              </div>

              <div className="flex items-center gap-5 text-xs">
                <Link
                  href="/rules"
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
                >
                  <span>Tournament Rules</span>
                </Link>
                <span className="text-white/15">|</span>
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
                >
                  <span>Register Squad ({formatINR(event.registration_fee_inr)})</span>
                  <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </header>

          <FaqSection event={event} />

          {/* Open Support Footer Strip (No Boxy Card) */}
          <footer className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold block">
                Direct Organizer Line
              </span>
              <h3 className="text-lg font-bold text-white">
                Still have questions regarding registration or deliverables?
              </h3>
            </div>

            <a
              href="mailto:skalekraft@gmail.com"
              className="w-fit inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#e8c5b4] hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4 text-[#c19a88]" />
              <span>skalekraft@gmail.com</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#c19a88]" />
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
