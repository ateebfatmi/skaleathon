'use client';

import React, { useState } from 'react';
import type { EventData } from '@/lib/db/types';
import { Award, QrCode, ShieldCheck, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';

export default function CertificatePreviewModal({ event }: { event: EventData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('Alex Rivers');
  const [team, setTeam] = useState('NeuralCraft Lab');
  const [track, setTrack] = useState('AI & Machine Learning Track');

  const open = () => {
    setIsOpen(true);
    cyberAudio.playSuccess();
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={open}
        className="group relative inline-flex items-center gap-2 rounded-full border border-[#c19a88]/40 bg-[#c19a88]/10 px-4 py-2 text-xs font-semibold text-[#e8c5b4] hover:bg-[#c19a88]/20 hover:border-[#c19a88] transition-all shadow-sm"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#c19a88] group-hover:rotate-12 transition-transform" />
        <span>Live Certificate Simulator</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-[28px] border border-white/15 bg-[#0D0B0A] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#805948]/30 blur-[90px]" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-[#c19a88]">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Certificate Preview</h3>
                  <p className="text-[11px] text-white/50">Preview official {event.name} top {event.certificates_top_n} certificate</p>
                </div>
              </div>
              <button
                onClick={close}
                className="p-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c19a88]"
                  placeholder="Enter participant name"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono">Team Name</label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c19a88]"
                  placeholder="Enter team name"
                />
              </div>
            </div>

            {/* Live Visual Certificate Card */}
            <div className="relative rounded-2xl border-2 border-[#c19a88]/40 bg-[linear-gradient(145deg,#120e0d,#080707)] p-6 sm:p-8 text-center shadow-inner overflow-hidden">
              <div className="absolute top-3 left-4 font-mono text-[9px] text-[#c19a88] tracking-widest uppercase">
                SKALEKRAFT
              </div>
              <div className="absolute top-3 right-4 flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>OFFICIAL</span>
              </div>

              <div className="mt-4 mb-2">
                <span className="text-[10px] font-mono tracking-[0.24em] text-white/40 uppercase">
                  CERTIFICATE OF MERIT & DISTINCTION
                </span>
                <h4 className="text-xl sm:text-2xl font-bold font-serif italic text-white mt-1">
                  {event.name}
                </h4>
              </div>

              <p className="text-[11px] text-white/60 mb-2 font-light">This officially certifies that</p>

              <div className="text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f2d9ce] to-[#c19a88] bg-clip-text text-transparent my-1">
                {name || 'Participant Name'}
              </div>

              <p className="text-[11px] text-white/60 max-w-md mx-auto leading-relaxed font-light">
                representing team <span className="text-white font-semibold">{team || 'Team Name'}</span>, achieved top honors among the top {event.certificates_top_n} national teams in the <span className="text-[#e8c5b4] font-medium">{track}</span>.
              </p>

              {/* Certificate Bottom Telemetry */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-left">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Certificate ID</div>
                  <div className="text-[10px] font-mono text-[#c19a88] font-bold">SK-MERIT-PREVIEW</div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/80">
                    <QrCode className="h-6 w-6 text-[#c19a88]" />
                  </div>
                  <div className="text-[9px] font-mono text-white/40 leading-tight">
                    <span>Instant URL</span>
                    <br />
                    <span className="text-emerald-400">Scan & Verify</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[11px] text-white/40">
                Official certificates are delivered in high-res vector PDF.
              </span>
              <button
                onClick={close}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
