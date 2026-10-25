'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Terminal as TerminalIcon,
  Trophy,
  Layers,
  Code2,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';
import type { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';

type CommandKey = 'prizes' | 'stages' | 'tracks' | 'register';

interface InteractiveTerminalProps {
  event: EventData;
}

export default function InteractiveTerminal({ event }: { event: EventData }) {
  const [activeCmd, setActiveCmd] = useState<CommandKey>('prizes');
  const [typedText, setTypedText] = useState('skaleathon prizes');
  const [isTyping, setIsTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [customView, setCustomView] = useState<{
    cmd: string;
    content: React.ReactNode;
  } | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const commands: {
    key: CommandKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tag: string;
  }[] = [
    { key: 'prizes', label: 'prizes', icon: Trophy, tag: `₹${event.prize_pool_inr.toLocaleString('en-IN')}` },
    { key: 'stages', label: 'stages', icon: Layers, tag: '4 Rounds' },
    { key: 'tracks', label: 'tracks', icon: Code2, tag: '3 Arenas' },
    { key: 'register', label: 'register', icon: Sparkles, tag: `₹${event.registration_fee_inr}` },
  ];

  const runCommand = (cmdKey: CommandKey) => {
    cyberAudio.playBlip(720, 'sine', 0.04, 0.03);
    setCustomView(null);
    setActiveCmd(cmdKey);

    const fullText = `skaleathon ${cmdKey}`;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setIsTyping(true);
    setTypedText('');

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      setTypedText(fullText.slice(0, charIdx));
      if (charIdx >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 22);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputVal.trim().toLowerCase();
    if (!cleaned) return;
    setInputVal('');

    if (cleaned === 'prizes' || cleaned === 'stages' || cleaned === 'tracks' || cleaned === 'register') {
      runCommand(cleaned as CommandKey);
      return;
    }

    cyberAudio.playSuccess();
    setTypedText(`skaleathon ${cleaned}`);

    if (cleaned === 'help') {
      setCustomView({
        cmd: cleaned,
        content: (
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#ffe5d9] font-bold">Available Core Commands:</div>
            <div className="grid grid-cols-2 gap-2 text-white/70">
              <div><span className="text-[#c19a88] font-bold">prizes</span> — Total cash bounty & grants</div>
              <div><span className="text-[#c19a88] font-bold">stages</span> — 4-stage tournament roadmap</div>
              <div><span className="text-[#c19a88] font-bold">tracks</span> — AI/ML, Web & Mobile arenas</div>
              <div><span className="text-[#c19a88] font-bold">register</span> — Squad entry details</div>
            </div>
            <div className="text-white/40 text-[11px] pt-1">
              Click any button above for instant evaluation.
            </div>
          </div>
        ),
      });
      return;
    }

    if (cleaned === 'clear') {
      setCustomView(null);
      runCommand('prizes');
      return;
    }

    if (cleaned === 'rules') {
      setCustomView({
        cmd: cleaned,
        content: (
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#ffe5d9] font-bold">Official Competition Guidelines:</div>
            <div className="space-y-1 text-white/70 text-[11px]">
              <div>• Team size: {event.min_team_size} to {event.max_team_size} members. Solo entries permitted.</div>
              <div>• Screening Quiz (Jan 8) → Architecture PPT (Jan 10–14) → Build (Jan 16–25) → Finale (Jan 29–30).</div>
              <div>• Evaluation based on architecture, code quality, deployment, and live presentation.</div>
            </div>
            <Link href="/rules" className="inline-flex items-center gap-1 text-[#c19a88] hover:text-white pt-1 text-[11px]">
              Review full rulebook <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ),
      });
      return;
    }

    setCustomView({
      cmd: cleaned,
      content: (
        <div className="space-y-1.5 text-xs font-mono">
          <div className="text-amber-400/90 font-medium">Command not recognized: &quot;{cleaned}&quot;</div>
          <div className="text-white/50 text-[11px]">
            Try clicking one of the buttons above or enter: <span className="text-[#c19a88]">prizes</span>, <span className="text-[#c19a88]">stages</span>, <span className="text-[#c19a88]">tracks</span>, or <span className="text-[#c19a88]">register</span>.
          </div>
        </div>
      ),
    });
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative mx-auto max-w-3xl w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0A0909]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl overflow-hidden text-left transition-all duration-300 hover:border-[#c19a88]/30">
      {/* Top Chrome Bar */}
      <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.07] bg-white/[0.015]">
        <div className="flex items-center gap-2">
          {/* macOS Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80 shadow-[0_0_6px_rgba(255,95,86,0.5)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80 shadow-[0_0_6px_rgba(255,189,46,0.5)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80 shadow-[0_0_6px_rgba(39,201,63,0.5)]" />
          </div>
          <div className="h-3.5 w-px bg-white/10 mx-1 hidden sm:block" />
          <span className="font-mono text-[11px] text-white/50 items-center gap-1.5 hidden sm:flex">
            <TerminalIcon className="h-3 w-3 text-[#c19a88]" />
            <span>skaleathon.cli</span>
          </span>
        </div>

        {/* 4 Interactive Command Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {commands.map((c) => {
            const Icon = c.icon;
            const isActive = activeCmd === c.key && !customView;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => runCommand(c.key)}
                className={`group flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c19a88]/30 via-[#805948]/35 to-[#c19a88]/25 text-white font-bold border border-[#c19a88]/70 shadow-[0_0_15px_rgba(193,154,136,0.3)]'
                    : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/[0.08] hover:border-[#c19a88]/40 hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${isActive ? 'text-[#ffe5d9]' : 'text-[#c19a88] group-hover:text-white'}`} />
                <span className="capitalize">{c.label}</span>
                <span className="hidden md:inline text-[9px] opacity-60 ml-0.5">
                  ({c.tag})
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Indicator */}
        <div className="hidden xs:flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">LIVE</span>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Active Command Prompt Line */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#c19a88] font-bold">visitor@skaleathon</span>
          <span className="text-white/30">:</span>
          <span className="text-[#e8c5b4]/80">~</span>
          <span className="text-[#c19a88] font-bold">$</span>
          <span className="text-white font-medium tracking-wide">
            {typedText}
          </span>
          <span className="inline-block w-1.5 h-3.5 bg-[#c19a88] animate-pulse align-middle" />
        </div>

        {/* Output Screen */}
        <div className="min-h-[148px] rounded-xl border border-white/[0.06] bg-black/40 p-3 sm:p-4 backdrop-blur-sm transition-all">
          {customView ? (
            customView.content
          ) : isTyping ? (
            <div className="flex items-center gap-2 text-xs font-mono text-white/40 h-28">
              <span className="animate-pulse">Executing command...</span>
            </div>
          ) : activeCmd === 'prizes' ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#c19a88]/20 text-[#ffe5d9]">
                    <Trophy className="h-3.5 w-3.5 text-[#ffe5d9]" />
                  </span>
                  <span className="text-white font-bold text-xs sm:text-sm tracking-tight">
                    ₹{event.prize_pool_inr.toLocaleString('en-IN')} Total Cash Bounty
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#ffe5d9] bg-[#c19a88]/20 px-2 py-0.5 rounded-full border border-[#c19a88]/40">
                  Direct Bank Disbursal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 sm:p-2.5 rounded-xl border border-[#c19a88]/40 bg-gradient-to-b from-[#c19a88]/15 to-transparent shadow-sm">
                  <div className="text-[9px] sm:text-[10px] text-[#ffe5d9] uppercase tracking-wider font-bold">1ST CHAMPION</div>
                  <div className="text-sm sm:text-base font-black text-white mt-0.5">
                    ₹{(event.first_prize_inr || 20000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-[#c19a88] truncate mt-0.5">+ Interview Call</div>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">2ND RUNNER-UP</div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                    ₹{(event.second_prize_inr || 10000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-white/40 truncate mt-0.5">+ Certificate</div>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">3RD PLACE</div>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                    ₹{(event.third_prize_inr || 5000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-white/40 truncate mt-0.5">+ Certificate</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/50 pt-0.5">
                <span>Top {event.certificates_top_n} teams receive merit certificates</span>
                <Link href="/prizes" className="text-[#c19a88] hover:text-white flex items-center gap-1 font-mono text-[10px] font-medium transition-colors">
                  Details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : activeCmd === 'stages' ? (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs sm:text-sm font-semibold text-white">4 Progressive Tournament Stages</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">100% Online</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <div className="p-2 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] text-emerald-400 font-bold">STAGE 01</div>
                  <div className="text-xs font-semibold text-white mt-0.5">Quiz Screening</div>
                  <div className="text-[10px] text-white/40 mt-1">Jan 8, 2027</div>
                </div>
                <div className="p-2 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] text-[#c19a88] font-bold">STAGE 02</div>
                  <div className="text-xs font-semibold text-white mt-0.5">Architecture PPT</div>
                  <div className="text-[10px] text-white/40 mt-1">Jan 10–14, 2027</div>
                </div>
                <div className="p-2 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] text-[#e8c5b4] font-bold">STAGE 03</div>
                  <div className="text-xs font-semibold text-white mt-0.5">Build Sprint</div>
                  <div className="text-[10px] text-white/40 mt-1">Jan 16–25, 2027</div>
                </div>
                <div className="p-2 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] text-amber-400 font-bold">STAGE 04</div>
                  <div className="text-xs font-semibold text-white mt-0.5">Live Defense</div>
                  <div className="text-[10px] text-white/40 mt-1">Jan 29–30, 2027</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/50 pt-0.5">
                <span>Screening → Blueprint → GitHub Codebase → Live Defense</span>
                <Link href="/rules" className="text-[#c19a88] hover:text-white flex items-center gap-1 font-mono text-[10px] font-medium transition-colors">
                  Full Rules <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : activeCmd === 'tracks' ? (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs sm:text-sm font-semibold text-white">3 Dedicated Technical Arenas</span>
                <span className="text-[10px] font-mono text-[#c19a88] bg-[#c19a88]/10 px-2 py-0.5 rounded-full border border-[#c19a88]/30">Pick 1 Arena</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#a78bfa]">AI & Machine Learning</span>
                    <span className="text-[9px] font-mono text-white/30">01</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Agentic workflows, neural pipelines, autonomous vision & intelligent tools.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#38bdf8]">Web Development</span>
                    <span className="text-[9px] font-mono text-white/30">02</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    High-throughput distributed systems, WebSockets, edge infra & full-stack apps.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#e8c5b4]">App Development</span>
                    <span className="text-[9px] font-mono text-white/30">03</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    Cross-platform mobile apps, on-device ML, rich 60FPS UI & offline sync.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/50 pt-0.5">
                <span>Standardized evaluation rubrics across all technical domains</span>
                <Link href="/tracks" className="text-[#c19a88] hover:text-white flex items-center gap-1 font-mono text-[10px] font-medium transition-colors">
                  Explore Tracks <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">Squad Registration Protocol</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  REGISTRATIONS LIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] text-white/50 uppercase">FLAT SQUAD FEE</div>
                  <div className="text-base font-bold text-[#ffe5d9] mt-0.5">
                    ₹{event.registration_fee_inr} <span className="text-[11px] font-normal text-white/40 font-sans">/ team</span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">One fee covers all members</div>
                </div>

                <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-[9px] text-white/50 uppercase">ROSTER LIMITS</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {event.min_team_size}–{event.max_team_size} <span className="text-[11px] font-normal text-white/40 font-sans">Members</span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">Solo developers welcome</div>
                </div>

                <div className="p-2.5 rounded-xl border border-[#c19a88]/40 bg-gradient-to-br from-[#c19a88]/20 to-black/60 flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] text-[#ffe5d9] font-bold">READY TO BUILD?</div>
                    <div className="text-[11px] text-white/70 mt-0.5 font-sans">Instant dashboard access</div>
                  </div>
                  <Link
                    href="/register"
                    className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#805948] to-[#c19a88] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Register Team</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/40 pt-0.5 font-mono">
                <span>Instant verification via Razorpay UPI & Cards</span>
                <span className="text-[#c19a88]">Direct Entry</span>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Bottom CLI Prompt Input */}
        <form onSubmit={handleInputSubmit} className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
          <span className="text-xs text-[#c19a88] font-mono font-bold shrink-0">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'prizes', 'stages', 'tracks', or 'register'..."
            className="w-full bg-transparent text-xs text-white placeholder-white/25 focus:outline-none font-mono"
            aria-label="Interactive terminal command input"
          />
          <button
            type="submit"
            aria-label="Execute command"
            className="p-1 rounded-md border border-white/10 bg-white/[0.03] text-white/40 hover:text-white hover:border-[#c19a88]/40 hover:bg-[#c19a88]/20 transition-all shrink-0 cursor-pointer"
          >
            <CornerDownLeft className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
