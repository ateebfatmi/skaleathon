'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Compass,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Laptop,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { EventData } from '@/lib/db/types';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function HowItWorksSection({ event }: { event: EventData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      step: '01',
      title: 'Assemble Your Squad',
      badge: 'Step 1 • 2 Mins',
      desc: 'Form a team of 1 to 6 members from any college, branch, or company across India. Solo builders are fully welcome too.',
      icon: Users,
      perks: [
        'Flat ₹99 covers entire team (up to 6 members)',
        'Invite teammates anytime before submission',
        'Open to all students & working professionals',
      ],
      tip: 'Don’t have a full team yet? Register solo today and add members later.',
    },
    {
      step: '02',
      title: 'Select Your Arena',
      badge: 'Step 2 • Track Pick',
      desc: 'Choose 1 of 3 exciting domains: AI/ML, Modern Web, or Mobile Apps. You can formulate any problem statement you care about.',
      icon: Compass,
      perks: [
        'AI & Machine Learning (LLMs, Vision, Agents)',
        'Web Engineering (Full-stack, SaaS, Cloud)',
        'App Development (React Native, Flutter, Swift)',
      ],
      tip: 'You have full creative freedom on what you build — open problem statement.',
    },
    {
      step: '03',
      title: 'Build, Submit & Win',
      badge: 'Step 3 • Compete',
      desc: 'Progress through a friendly screening quiz, submit your GitHub repo, and pitch in the live online finale for cash & recognition.',
      icon: Trophy,
      perks: [
        '₹35,000 cash prizes (1st: ₹20K, 2nd: ₹10K, 3rd: ₹5K)',
        `Merit certificates for the Top ${event.certificates_top_n || 25} teams`,
        'SkaleKraft engineering internship interviews',
      ],
      tip: '100% online from home — no travel or physical attendance required.',
    },
  ];

  const quickFaqs = [
    {
      q: 'Is this beginner-friendly or only for experts?',
      a: 'Skaleathon is built for all skill levels! Whether you are a college fresher building your first web app or an experienced developer crafting advanced AI agents, the 4-stage format gives you the structure and mentorship to learn, build, and showcase your work.',
    },
    {
      q: 'Does each member pay ₹99 or is it per team?',
      a: 'The ₹99 fee is a flat rate for the entire squad. Whether your team has 1 person or 6 people, the total fee is only ₹99 total.',
    },
    {
      q: 'Do we have to travel anywhere for the hackathon?',
      a: 'Not at all. Skaleathon is 100% remote and online. All quizzes, presentation submissions, code evaluations, and the finale panel Q&A take place online.',
    },
    {
      q: 'What technologies and frameworks can we use?',
      a: 'Any modern stack you prefer! React, Next.js, Python, Node.js, Flutter, PyTorch, Supabase, Tailwind, Fastify, Docker, or any public open-source libraries.',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 lg:py-24 bg-[#0A0A0A] border-t border-white/[0.08] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-72 w-full max-w-4xl rounded-full bg-[radial-gradient(ellipse_at_top,rgba(193,154,136,0.12),transparent_70%)] blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-3.5 py-1 text-xs font-semibold text-[#e8c5b4] mb-3.5 shadow-sm">
            <Sparkles className="h-3 w-3 text-[#c19a88]" />
            <span>FIRST TIME HERE? // QUICK-START ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How Skaleathon works in{' '}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ffe5d9] via-[#c19a88] to-[#805948]">
              3 simple steps
            </span>
            .
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-white/60 leading-relaxed font-light">
            You don’t need a fully formed startup idea today. Register in 2 minutes, pick your passion track, and build production-ready software with your team.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(193, 154, 136, 0.15)"
                  className="h-full flex flex-col justify-between rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#151413] to-[#0E0D0C] p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#c19a88]/40 hover:-translate-y-1 group"
                >
                  <div className="space-y-4">
                    {/* Top Step Pill & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black tracking-widest text-[#c19a88] uppercase bg-[#c19a88]/10 border border-[#c19a88]/20 px-2.5 py-1 rounded-lg">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/45">
                        {item.badge}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#805948] to-[#c19a88] p-[1px] shrink-0 shadow-md">
                        <div className="h-full w-full rounded-[10px] bg-black/85 flex items-center justify-center text-[#e8c5b4] group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#ffe5d9] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-[13px] text-white/65 leading-relaxed font-light">
                      {item.desc}
                    </p>

                    {/* Bullet Perks */}
                    <ul className="space-y-2 pt-2 border-t border-white/[0.06]">
                      {item.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-neutral-300/85">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro-Tip Box */}
                  <div className="mt-5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[11px] text-[#e8c5b4]/85 leading-relaxed">
                    <strong className="text-white font-medium">Pro-tip: </strong>
                    {item.tip}
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* First-Timer Friendly Callout Strip */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl border border-[#c19a88]/30 bg-gradient-to-r from-[#171412] via-[#1C1613] to-[#171412] shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                New to hackathons? You are in the right place.
              </h4>
              <p className="text-xs text-white/60 font-light mt-0.5">
                Skaleathon is organized with clear evaluation rubrics, flexible deadlines, and structured stages so first-timers can compete confidently alongside seasoned developers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/register"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span>Register Squad (₹99)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/faq"
              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Read FAQs</span>
            </Link>
          </div>
        </div>

        {/* Quick FAQs Accordion */}
        <div className="mt-10 sm:mt-14 max-w-3xl mx-auto space-y-3">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c19a88] font-bold">
              Got Questions?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Top questions first-time visitors ask
            </h3>
          </div>

          <div className="space-y-2.5">
            {quickFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-colors hover:border-[#c19a88]/30"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-white/90 hover:text-white gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#c19a88] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-white/60 font-light leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
