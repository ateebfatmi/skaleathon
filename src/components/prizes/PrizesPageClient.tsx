'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Briefcase,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Coins,
  Check,
} from 'lucide-react';
import { EventData, EventTrack } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import CertificatePreviewModal from '@/components/home/CertificatePreviewModal';
import RegistrationModal from '@/components/registration/RegistrationModal';

interface PrizesPageClientProps {
  event: EventData;
  tracks: EventTrack[];
}

export default function PrizesPageClient({ event, tracks }: PrizesPageClientProps) {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const prizePoolFormatted = formatINR(event.prize_pool_inr || 35000);
  const firstPrizeFormatted = formatINR(event.first_prize_inr || 20000);
  const secondPrizeFormatted = formatINR(event.second_prize_inr || 10000);
  const thirdPrizeFormatted = formatINR(event.third_prize_inr || 5000);
  const feeFormatted = formatINR(event.registration_fee_inr || 99);

  const podiumPrizes = [
    {
      place: '2nd Place',
      badge: 'FIRST RUNNER-UP',
      amount: secondPrizeFormatted,
      title: 'First Runner-Up Squad',
      desc: 'Conferred to the second-highest scoring squad for standout system architecture, scalability, and live prototype execution.',
      perks: [
        `${secondPrizeFormatted} direct prize transfer (UPI / Bank)`,
        'Official Runner-Up Certificate for every squad member',
        'Direct fast-track technical interview with SkaleKraft',
        'Featured citation in the official SkaleKraft tech report',
      ],
      borderClass: 'border-white/10 hover:border-slate-300/40',
      badgeClass: 'bg-white/10 text-slate-200 border-white/15',
      amountColor: 'text-white',
      cardBg: 'bg-gradient-to-b from-white/[0.04] to-black/60',
      iconColor: 'text-slate-300',
      orderClass: 'order-2 md:order-1',
    },
    {
      place: '1st Place',
      badge: '★ GRAND CHAMPION',
      amount: firstPrizeFormatted,
      title: 'National Champion Squad',
      desc: 'Awarded to the highest-scoring squad overall across all tracks for supreme engineering rigor, originality, and domain impact.',
      perks: [
        `${firstPrizeFormatted} direct prize transfer (UPI / Bank)`,
        'Prestigious National Champion Trophy induction',
        'Winner Merit Certificate for every confirmed squad member',
        'Priority interview gateway for paid engineering & AI roles at SkaleKraft',
        'Dedicated showcase feature across SkaleKraft partner channels',
      ],
      borderClass: 'border-[#c19a88]/60 hover:border-[#e8c5b4] shadow-[0_0_50px_rgba(193,154,136,0.25)]',
      badgeClass: 'bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] text-black font-bold tracking-widest',
      amountColor: 'bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent',
      cardBg: 'bg-gradient-to-b from-[#c19a88]/15 via-[#1a1412] to-black/80',
      iconColor: 'text-[#e8c5b4]',
      isGrand: true,
      orderClass: 'order-1 md:order-2 md:-translate-y-4',
    },
    {
      place: '3rd Place',
      badge: 'SECOND RUNNER-UP',
      amount: thirdPrizeFormatted,
      title: 'Second Runner-Up Squad',
      desc: 'Conferred to the third-highest scoring squad for exceptional creative problem formulation and robust code quality.',
      perks: [
        `${thirdPrizeFormatted} direct prize transfer (UPI / Bank)`,
        'Official Finalist Certificate for every squad member',
        'Direct fast-track technical interview with SkaleKraft',
        'Official inclusion in the national talent directory',
      ],
      borderClass: 'border-white/10 hover:border-[#c19a88]/40',
      badgeClass: 'bg-[#805948]/20 text-[#e8c5b4] border-[#805948]/30',
      amountColor: 'text-white',
      cardBg: 'bg-gradient-to-b from-white/[0.04] to-black/60',
      iconColor: 'text-[#c19a88]',
      orderClass: 'order-3',
    },
  ];

  const faqs = [
    {
      q: 'How and when are the prize grants disbursed?',
      a: 'Prize awards are disbursed directly via UPI or NEFT bank transfer to the winning squad leader within 48 hours following the conclusion and announcement of the Stage 04 Live Defense. Detailed payment receipts and audit records are provided.',
    },
    {
      q: 'Does the nominal fee cover the entire team or per person?',
      a: `The ${feeFormatted} fee is flat per squad and covers your entire team of 1 to ${event.max_team_size} members. There are no per-person fees, hidden charges, or add-ons.`,
    },
    {
      q: 'Do all members in the Top 25 receive certificates?',
      a: `Yes! Every registered and confirmed member of squads ranking within the Top ${event.certificates_top_n} receives an individual, cryptographically verifiable Certificate of Engineering Merit featuring their name, team, track, and unique verification QR code.`,
    },
    {
      q: 'How does the SkaleKraft internship interview gateway work?',
      a: 'During the Stage 03 codebase evaluations and Stage 04 live defenses, SkaleKraft engineering leadership evaluates submissions for standout craft. Top engineers will receive direct invitations for paid software engineering, AI, and full-stack internships.',
    },
  ];

  return (
    <div className="relative w-full space-y-16 pb-24 text-neutral-200">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-full max-w-5xl rounded-full bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(193,154,136,0.18),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute top-96 -left-32 h-80 w-80 rounded-full bg-[#805948]/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[800px] -right-32 h-80 w-80 rounded-full bg-[#c19a88]/12 blur-[140px]" />

      {/* 1. Luxury Editorial Hero Header */}
      <header className="relative pt-1 space-y-4">
        {/* Faint Oversized Architectural Watermark in Top Right */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden lg:block overflow-hidden">
          <span className="font-mono text-[90px] lg:text-[110px] font-black tracking-tighter text-white/[0.03] leading-none uppercase">
            PRIZES
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="mobile-utility-row relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
            </span>
            <span className="text-[#c19a88]">Official Rewards // Guaranteed Grants</span>
            <span className="text-white/20">•</span>
            <span className="text-neutral-400">
              Prize Pool: <strong className="text-white font-semibold">{prizePoolFormatted} Total Cash</strong>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#e8c5b4] font-semibold">[TOP {event.certificates_top_n} CITATIONS]</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/tracks"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium text-[11px]"
            >
              <span>Explore Arenas</span>
            </Link>
            <span className="text-white/15">|</span>
            <Link
              href="/rules"
              className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold text-[11px]"
            >
              <span>Tournament Rules</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Headline & Value Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-3 pb-2">
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.08]">
            Tournament <span className="font-serif italic font-normal text-[#e8c5b4]">Prizes</span> &amp; Honors
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-3 text-xs sm:text-[14px] text-neutral-300/85 leading-relaxed font-light">
            SkaleKraft awards <strong className="text-white font-semibold">{prizePoolFormatted}</strong> in guaranteed direct cash grants to the top 3 podium squads, along with official verifiable merit certificates for the Top {event.certificates_top_n} finalists and fast-track hiring interviews.
          </p>
        </div>

        {/* 3 Quick Value Badges & Actions Strip */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2">
              <Coins className="h-4 w-4 text-[#c19a88]" />
              <span className="font-semibold text-white">{prizePoolFormatted} Cash Pool</span>
              <span className="text-white/40 text-[11px]">(1st, 2nd &amp; 3rd)</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2">
              <Award className="h-4 w-4 text-[#e8c5b4]" />
              <span className="font-semibold text-white">Top {event.certificates_top_n} Certificates</span>
              <span className="text-white/40 text-[11px]">(QR Verifiable)</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2">
              <Briefcase className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-white">SkaleKraft Fast-Track</span>
              <span className="text-white/40 text-[11px]">(Paid Roles)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRegModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Register Squad ({feeFormatted})</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Interactive Podium Cards (1st, 2nd, 3rd) */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold">
            01 // CHAMPIONSHIP PODIUM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            National Cash <span className="text-[#c19a88]">Grants</span>
          </h2>
          <p className="text-xs text-white/50 font-light">
            Guaranteed direct cash grants disbursed following the Stage 04 Live Finale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto pt-2">
          {podiumPrizes.map((p, idx) => (
            <div key={idx} className={`${p.orderClass} flex flex-col`}>
              <SpotlightCard
                enableTilt
                spotlightColor={p.isGrand ? 'rgba(232, 197, 180, 0.22)' : 'rgba(255, 255, 255, 0.08)'}
                className={`h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${p.borderClass} ${p.cardBg}`}
              >
                <div className="space-y-4">
                  {/* Badge & Trophy Header */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider ${p.badgeClass}`}>
                      {p.badge}
                    </span>
                    <div className={`p-2 rounded-xl bg-white/[0.05] border border-white/10 ${p.iconColor}`}>
                      <Trophy className="h-5 w-5" />
                    </div>
                  </div>

                  {/* prize Amount */}
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">
                      Prize Award
                    </span>
                    <div className={`text-3xl sm:text-4xl font-mono font-black tracking-tight mt-1 ${p.amountColor}`}>
                      {p.amount}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-300/80 font-light mt-1.5 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  {/* Perks Checklist */}
                  <div className="pt-3 border-t border-white/[0.08] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] block font-semibold">
                      What&apos;s Included
                    </span>
                    <ul className="space-y-1.5">
                      {p.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-neutral-200 font-light">
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsRegModalOpen(true)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      p.isGrand
                        ? 'bg-gradient-to-r from-[#805948] to-[#c19a88] text-white hover:brightness-110 shadow-md'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10'
                    }`}
                  >
                    <span>Compete for {p.place}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Beyond The Podium: Value for EVERY Squad */}
      <section className="space-y-6 max-w-6xl mx-auto pt-4">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold">
            02 // BEYOND THE PODIUM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Rewards for <span className="text-[#c19a88]">Every Standout Squad</span>
          </h2>
          <p className="text-xs text-white/50 font-light">
            You don&apos;t need to finish 1st to launch your software career and earn verified credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Top 25 Certificates */}
          <SpotlightCard
            spotlightColor="rgba(193,154,136,0.18)"
            className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#c19a88]">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-semibold">
                      Credential Recognition
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Top {event.certificates_top_n} Squads — Official Merit Certificates
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                All confirmed members of the top {event.certificates_top_n} squads earn an authoritative, cryptographically verifiable Certificate of Engineering Merit issued directly by SkaleKraft.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Unique QR Code Verification</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>LinkedIn &amp; Resume Shareable</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Individual name on every pass</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Official SkaleKraft seal</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <CertificatePreviewModal event={event} />
              <span className="text-[11px] font-mono text-neutral-400">
                Top {event.certificates_top_n} Teams Qualify
              </span>
            </div>
          </SpotlightCard>

          {/* Card 2: SkaleKraft Internship Gateway */}
          <SpotlightCard
            spotlightColor="rgba(232, 197, 180, 0.18)"
            className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                      Career Accelerator
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      SkaleKraft Internship &amp; Hiring Fast-Track
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Standout engineers observed during the Stage 03 codebase evaluation and Stage 04 live Q&amp;A defense are shortlisted for direct fast-track technical interviews at SkaleKraft.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Paid Software Engineering Internships</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Direct 1-on-1 Founder &amp; Tech Lead Calls</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Recommendation Letter from Jury</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>High-Performing Squad Incubation</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">
                Direct Interview Shortlist
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Stage 03 &amp; 04 Review
              </span>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 4. Transparent FAQs & Disbursement Clarity */}
      <section className="space-y-6 max-w-4xl mx-auto pt-4">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold">
            03 // TRANSPARENCY &amp; RULES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Prize Disbursement <span className="text-[#c19a88]">FAQ</span>
          </h2>
          <p className="text-xs text-white/50 font-light">
            Clear, honest policies on prize distribution and squad qualification.
          </p>
        </div>

        <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaqIndex === fIdx;
            return (
              <div key={fIdx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(fIdx)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#c19a88] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. High-Impact Closing CTA Banner */}
      <section className="max-w-4xl mx-auto pt-4">
        <div className="relative rounded-3xl border border-[#c19a88]/40 bg-gradient-to-r from-[#1f1715] via-[#161211] to-[#1f1715] p-8 sm:p-10 text-center overflow-hidden shadow-[0_20px_60px_rgba(128,89,72,0.25)]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c19a88]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#805948]/20 blur-3xl" />

          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#e8c5b4] font-bold px-3 py-1 rounded-full bg-[#c19a88]/20 border border-[#c19a88]/40">
              <Zap className="h-3 w-3 text-[#c19a88]" />
              <span>4-Stage National Hackathon</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to claim your spot on the podium?
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Register your squad of 1–{event.max_team_size} engineers for a flat {feeFormatted} fee. Compete across AI/ML, Web, and Mobile arenas.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsRegModalOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Register Squad — {feeFormatted}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/tracks"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 text-sm font-semibold text-neutral-200 hover:text-white transition-all backdrop-blur-xl"
              >
                <span>Browse Problem Arenas</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Registration Modal */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        tracks={tracks}
        event={event}
      />
    </div>
  );
}
