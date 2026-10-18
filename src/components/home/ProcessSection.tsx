'use client';

import React from 'react';
import { UserPlus, Compass, Code2, Send, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Register Team',
      desc: 'Form a squad of 1–6 engineers and complete flat ₹99 team registration.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Select Arena',
      desc: 'Pick AI & ML, Web Architecture, or Mobile Systems and plan your system architecture.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Engineer Solution',
      desc: 'Write clean code, commit frequently with meaningful git history, and build working software.',
      icon: Code2,
    },
    {
      num: '04',
      title: 'Submit Build',
      desc: 'Submit repository link, live deployment URL, walkthrough video, and documentation.',
      icon: Send,
    },
    {
      num: '05',
      title: 'Evaluation',
      desc: 'Domain judges review live code and functionality. Cash prizes and Top 25 certificates awarded.',
      icon: Award,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0B0B0B] border-t border-white/10 relative overflow-hidden">
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
              The Journey
            </p>
            <span className="h-px w-6 bg-[#c19a88]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
            How Skaleathon{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              unfolds
            </span>
            .
          </h2>
          <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
            A frictionless, transparent path from initial enrollment to live national evaluation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-[20px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-6 flex flex-col justify-between hover:border-[#c19a88]/35 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-semibold text-[#c19a88] tracking-[0.2em]">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70 group-hover:text-[#c19a88] transition-colors">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold tracking-wide text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
