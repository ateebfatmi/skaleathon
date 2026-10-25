'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Trophy, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';

export default function ExploreSection() {
  const cards = [
    {
      title: 'Competition Tracks',
      description: 'Explore dedicated problem domains across AI/ML, Web Development, and Mobile Engineering.',
      href: '/tracks',
      icon: Bot,
    },
    {
      title: 'Prizes & Citations',
      description: 'Review the ₹35,000 prize pool, placement breakdown, winner perks, and interview opportunities.',
      href: '/prizes',
      icon: Trophy,
    },
    {
      title: 'Official Rules',
      description: 'Understand team eligibility, submission requirements, original-code standards, and evaluation rubrics.',
      href: '/rules',
      icon: ShieldCheck,
    },
    {
      title: 'Participant FAQ',
      description: 'Find clear answers about squad sizes, flat ₹99 pricing, deadlines, participation, and the online format.',
      href: '/faq',
      icon: HelpCircle,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedContainer className="mx-auto mb-10 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-px w-6 bg-[#f5f5f5]/70" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#c19a88] font-mono font-semibold">
              Competition Directory
            </p>
            <span className="h-px w-6 bg-[#f5f5f5]/70" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dive deeper into the <span className="text-[#c19a88]">hackathon details</span>.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/55 font-light">
            Dedicated portals for track requirements, bounty breakdowns, official rules, and support.
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.18}
          className="grid grid-cols-2 overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.08] lg:grid-cols-4"
        >
          {cards.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={`Open ${item.title}`}
              className="group min-w-0 border-b border-r border-dashed border-white/15 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f5f5f5] [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
            >
              <FeatureCard feature={item} />
            </Link>
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
}

type AnimatedContainerProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.08, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', y: 10, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
