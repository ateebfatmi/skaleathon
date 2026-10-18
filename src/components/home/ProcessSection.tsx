import React from 'react';
import { UserPlus, Compass, Code2, Send, Award } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Register Your Team',
      desc: 'Form a team of 1–6 members and complete registration with a flat ₹99 fee per team.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Select Track & Ideate',
      desc: 'Pick AI/ML, Web Development, or App Development and design your technical approach.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Build the Solution',
      desc: 'Develop your project with clean git commits, reproducible code, and working features.',
      icon: Code2,
    },
    {
      num: '04',
      title: 'Submit Project',
      desc: 'Provide GitHub URL, demo video, tech stack, and documentation before the deadline.',
      icon: Send,
    },
    {
      num: '05',
      title: 'Judging & Conferrals',
      desc: 'Panels evaluate submissions on innovation, code, and impact. Top 25 receive certificates.',
      icon: Award,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#070b14] border-t border-white/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300 mb-4">
            <span>Participation Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How Skaleathon 2027 Works
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            A frictionless, transparent workflow from registration to national results conferral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-white/10 bg-[#0c111e] p-6 flex flex-col justify-between hover:border-brand-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-cyanAccent-400 font-mono tracking-wider">
                      STEP {step.num}
                    </span>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
