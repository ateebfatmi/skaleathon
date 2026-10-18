import React from 'react';
import Link from 'next/link';
import { Target, Zap, Globe2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutSection() {
  const highlights = [
    {
      title: 'National Scope, Fully Online',
      desc: 'Participate remotely from anywhere in India. Collaborate asynchronously or in real-time without geographical constraints.',
      icon: Globe2,
    },
    {
      title: 'Real-World Production Standards',
      desc: 'Move beyond pitch decks. We evaluate working prototypes, architecture cleanliness, code quality, and deployed demonstrations.',
      icon: Target,
    },
    {
      title: 'Transparent Evaluation',
      desc: 'Fair, weighted multi-judge evaluation with locked criteria, score-change audit logs, and conflict-of-interest declarations.',
      icon: ShieldCheck,
    },
    {
      title: 'SkaleKraft Internship Gateway',
      desc: 'High-performing candidates from the top 5 teams earn an opportunity to interview for technical internships at SkaleKraft.',
      icon: Zap,
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1 text-xs font-semibold text-brand-300">
              <span>About The Hackathon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              A Platform Engineered for Builders Who Deliver.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              <strong>Skaleathon 2027</strong> is presented by <strong>SkaleKraft</strong> to discover and accelerate India&apos;s most capable software engineers, product architects, and designers.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whether you are architecting agentic AI systems, engineering ultra-resilient web platforms, or crafting seamless mobile interfaces, Skaleathon provides an arena to showcase what you can build under realistic technical constraints.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/rules"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyanAccent-400 hover:text-cyanAccent-300 transition-colors"
              >
                <span>Read the official competition guidelines</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Key Tenets */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#0c111e] p-6 hover:border-brand-500/30 hover:bg-[#0f1526] transition-all"
                >
                  <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-cyanAccent-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
