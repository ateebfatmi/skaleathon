import React from 'react';
import { ExternalLink, Terminal, ShieldCheck, Sparkles } from 'lucide-react';

export default function OrganizerSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#070b14] border-t border-white/5 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c1220] via-[#0f172a] to-[#0c1220] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1 text-xs font-semibold text-brand-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Organizer Spotlight</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Presented by SkaleKraft
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              <strong>SkaleKraft</strong> is a premier technology and digital engineering firm empowering businesses to build, innovate, and scale. Skaleathon 2027 reflects our deep commitment to mentoring and identifying top-tier Indian engineering talent.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <a
                href="https://skalekraft.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-slate-900 shadow-md hover:bg-slate-100 transition-colors"
              >
                <span>Visit SkaleKraft Agency</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Autonomous & Separate Event Repository</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
