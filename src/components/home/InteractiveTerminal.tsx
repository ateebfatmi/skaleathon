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
  Copy,
  Check,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';
import type { EventData } from '@/lib/db/types';

type CommandKey = 'prizes' | 'stages' | 'tracks' | 'register' | 'rules' | 'help';

interface CommandHistoryItem {
  id: string;
  command: string;
  timestamp: string;
  output: React.ReactNode;
}

export default function InteractiveTerminal({ event }: { event: EventData }) {
  const [activeTab, setActiveTab] = useState<CommandKey>('prizes');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [commandPromptText, setCommandPromptText] = useState('skaleathon --prizes');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prizePoolFormatted = event.prize_pool_inr.toLocaleString('en-IN');
  const firstPrizeFormatted = (event.first_prize_inr || 20000).toLocaleString('en-IN');
  const secondPrizeFormatted = (event.second_prize_inr || 10000).toLocaleString('en-IN');
  const thirdPrizeFormatted = (event.third_prize_inr || 5000).toLocaleString('en-IN');

  const getOutputForCommand = (cmd: string): React.ReactNode => {
    const clean = cmd.trim().toLowerCase().replace(/^skaleathon\s+/, '').replace(/^--/, '');

    switch (clean) {
      case 'prizes':
      case 'prize':
      case 'bounty':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <span>✔</span>
              <span className="font-bold tracking-wide">STATUS: ₹{prizePoolFormatted} prize grant POOL ALLOCATED</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-2.5 sm:p-3 text-[11px] leading-relaxed">
              <div className="text-[#c19a88] pb-1.5 border-b border-white/10 flex justify-between font-bold">
                <span>PODIUM TIER</span>
                <span>DIRECT prize grant</span>
                <span className="hidden sm:inline">BENEFITS</span>
              </div>
              <div className="divide-y divide-white/[0.06] pt-1">
                <div className="py-1.5 flex justify-between items-center text-white">
                  <span className="text-amber-300 font-bold">🥇 1st Champion</span>
                  <span className="font-bold text-[#ffe5d9]">₹{firstPrizeFormatted}</span>
                  <span className="text-white/60 hidden sm:inline">SkaleKraft Interview Call</span>
                </div>
                <div className="py-1.5 flex justify-between items-center text-white/90">
                  <span className="text-slate-300 font-medium">🥈 2nd Runner-Up</span>
                  <span className="font-bold text-[#e8c5b4]">₹{secondPrizeFormatted}</span>
                  <span className="text-white/60 hidden sm:inline">National Merit Citation</span>
                </div>
                <div className="py-1.5 flex justify-between items-center text-white/80">
                  <span className="text-amber-600 font-medium">🥉 3rd Place</span>
                  <span className="font-bold text-white/90">₹{thirdPrizeFormatted}</span>
                  <span className="text-white/60 hidden sm:inline">National Merit Citation</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/50 pt-1">
              <span>Top {event.certificates_top_n} verified merit certificates • Direct bank disbursals</span>
              <Link href="/prizes" className="text-[#c19a88] hover:text-[#ffe5d9] flex items-center gap-1 transition-colors">
                View prize ledger <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        );

      case 'stages':
      case 'stage':
      case 'schedule':
      case 'roadmap':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-400">
              <div className="flex items-center gap-2">
                <span>✔</span>
                <span className="font-bold tracking-wide">COMPETITION LIFECYCLE (4 PHASES)</span>
              </div>
              <span className="text-[10px] text-white/40">100% VIRTUAL</span>
            </div>

            <div className="space-y-1.5 text-[11px] rounded-lg border border-white/10 bg-black/40 p-3 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold shrink-0">[01]</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-white font-medium">Online Screening Quiz</span>
                  <span className="text-[#c19a88] shrink-0 font-bold">Jan 08, 2027</span>
                </div>
              </div>
              <p className="text-white/45 pl-7 text-[10px]">Timed aptitude & foundational problem solving.</p>

              <div className="h-px bg-white/[0.06] my-1" />

              <div className="flex items-start gap-2.5">
                <span className="text-[#c19a88] font-bold shrink-0">[02]</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-white font-medium">Idea &amp; Architecture PPT</span>
                  <span className="text-[#c19a88] shrink-0 font-bold">Jan 10–14, 2027</span>
                </div>
              </div>
              <p className="text-white/45 pl-7 text-[10px]">PRD, system architecture diagrams & feasibility review.</p>

              <div className="h-px bg-white/[0.06] my-1" />

              <div className="flex items-start gap-2.5">
                <span className="text-[#e8c5b4] font-bold shrink-0">[03]</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-white font-medium">36-Hour Build Sprint</span>
                  <span className="text-[#c19a88] shrink-0 font-bold">Jan 16–25, 2027</span>
                </div>
              </div>
              <p className="text-white/45 pl-7 text-[10px]">Public GitHub commit trail, working prototype & live deployment.</p>

              <div className="h-px bg-white/[0.06] my-1" />

              <div className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold shrink-0">[04]</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-white font-medium">Grand Finale Jury Defense</span>
                  <span className="text-[#c19a88] shrink-0 font-bold">Jan 29–30, 2027</span>
                </div>
              </div>
              <p className="text-white/45 pl-7 text-[10px]">Live Q&amp;A panel defense with engineering leaders.</p>
            </div>
          </div>
        );

      case 'tracks':
      case 'track':
      case 'arenas':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-400">
              <div className="flex items-center gap-2">
                <span>✔</span>
                <span className="font-bold tracking-wide">3 SPECIALIZED ENGINEERING ARENAS</span>
              </div>
              <span className="text-[10px] text-[#c19a88]">OPEN DOMAIN</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/[0.04] p-2.5">
                <div className="text-purple-300 font-bold text-xs">01. AI &amp; ML</div>
                <div className="text-white/50 text-[10px] mt-1">Autonomous Agents, Tool-Calling, RAG, Vision &amp; Neural Reasoning.</div>
              </div>
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/[0.04] p-2.5">
                <div className="text-sky-300 font-bold text-xs">02. Web Development</div>
                <div className="text-white/50 text-[10px] mt-1">Edge Runtimes, Real-time WebSockets, CRDTs &amp; Scalable Infra.</div>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2.5">
                <div className="text-amber-300 font-bold text-xs">03. Mobile App Dev</div>
                <div className="text-white/50 text-[10px] mt-1">Offline-First Local DBs, Device Sensors &amp; Native 120 FPS UI.</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
              <span>Full stack &amp; cloud freedom • Unrestricted problem statements</span>
              <Link href="/tracks" className="text-[#c19a88] hover:text-[#ffe5d9] flex items-center gap-1 transition-colors">
                Explore domains <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        );

      case 'register':
      case 'signup':
      case 'fee':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-400">
              <div className="flex items-center gap-2">
                <span>✔</span>
                <span className="font-bold tracking-wide">REGISTRATION SPECIFICATION</span>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/40 p-3 space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Squad Composition</span>
                <span className="text-white font-bold">{event.min_team_size} to {event.max_team_size} Engineers (Solo welcome)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Registration Fee</span>
                <span className="text-[#ffe5d9] font-bold">₹{event.registration_fee_inr} FLAT PER SQUAD (Not per head)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Eligibility</span>
                <span className="text-white font-medium">Undergrads, postgrads &amp; devs pan-India</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Gateway</span>
                <span className="text-emerald-400">UPI, Cards &amp; NetBanking via Razorpay</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-white/50">Execute command or click:</span>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-[#805948] to-[#c19a88] text-white text-xs font-bold hover:scale-105 transition-all shadow-sm"
              >
                <span>Register Squad (₹99)</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        );

      case 'rules':
        return (
          <div className="space-y-2.5 font-mono text-xs">
            <div className="text-[#ffe5d9] font-bold">CORE INTEGRITY GUIDELINES</div>
            <div className="space-y-1 text-white/70 text-[11px] leading-relaxed">
              <div>• Submissions must be freshly authored during the official hackathon window.</div>
              <div>• Open-source libraries and AI coding assistants are permitted with transparent disclosure.</div>
              <div>• Automated plagiarism checks and git commit trail audits will be conducted by the jury.</div>
            </div>
            <Link href="/rules" className="inline-flex items-center gap-1 text-[#c19a88] hover:text-white pt-1 text-[11px]">
              Read full governance rulebook <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-2.5 font-mono text-xs">
            <div className="text-[#ffe5d9] font-bold">AVAILABLE CLI COMMANDS</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-white/75">
              <div><span className="text-[#c19a88] font-bold">prizes</span> — Total prize grant &amp; awards</div>
              <div><span className="text-[#c19a88] font-bold">stages</span> — 4-stage competition timeline</div>
              <div><span className="text-[#c19a88] font-bold">tracks</span> — AI/ML, Web &amp; Mobile arenas</div>
              <div><span className="text-[#c19a88] font-bold">register</span> — Squad entry details &amp; pass</div>
              <div><span className="text-[#c19a88] font-bold">rules</span> — Competition governance rules</div>
              <div><span className="text-[#c19a88] font-bold">clear</span> — Reset terminal session</div>
            </div>
            <div className="text-white/40 text-[10px] pt-1">
              Tip: Click any command pill above or type directly in the prompt below.
            </div>
          </div>
        );

      case 'whoami':
        return (
          <div className="font-mono text-xs text-[#e8c5b4]">
            guest_engineer@skaleathon: Ready to innovate and scale. Type <span className="text-white font-bold">&apos;register&apos;</span> to claim your pass.
          </div>
        );

      case 'clear':
        return null;

      default:
        return (
          <div className="font-mono text-xs space-y-1">
            <div className="text-amber-400">zsh: command not found: {clean}</div>
            <div className="text-white/50 text-[11px]">
              Available commands: <span className="text-[#c19a88]">prizes</span>, <span className="text-[#c19a88]">stages</span>, <span className="text-[#c19a88]">tracks</span>, <span className="text-[#c19a88]">register</span>, <span className="text-[#c19a88]">rules</span>, <span className="text-[#c19a88]">help</span>.
            </div>
          </div>
        );
    }
  };

  const executeCommand = (cmdKey: CommandKey) => {
    cyberAudio.playBlip(720, 'sine', 0.04, 0.03);
    setActiveTab(cmdKey);

    const fullCmd = `skaleathon --${cmdKey}`;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    setIsTyping(true);
    setCommandPromptText('');

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      setCommandPromptText(fullCmd.slice(0, charIdx));
      if (charIdx >= fullCmd.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;
    setInputVal('');

    const clean = raw.toLowerCase().replace(/^skaleathon\s+/, '').replace(/^--/, '');

    if (clean === 'clear') {
      cyberAudio.playBlip(540, 'sine', 0.04, 0.02);
      setHistory([]);
      return;
    }

    if (['prizes', 'stages', 'tracks', 'register'].includes(clean)) {
      executeCommand(clean as CommandKey);
      return;
    }

    cyberAudio.playSuccess();
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const output = getOutputForCommand(raw);

    setHistory((prev) => [
      ...prev.slice(-4), // keep last 4 outputs for performance
      {
        id: Math.random().toString(36).slice(2, 9),
        command: raw,
        timestamp: now,
        output,
      },
    ]);

    setTimeout(() => {
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      }
    }, 50);
  };

  const copyTerminalOutput = () => {
    const textToCopy = `Skaleathon 2028 | Presented by SkaleKraft
Prize Pool: ₹${prizePoolFormatted} (1st: ₹${firstPrizeFormatted}, 2nd: ₹${secondPrizeFormatted}, 3rd: ₹${thirdPrizeFormatted})
Tracks: AI/ML, Web Development, Mobile App Dev
Entry Fee: ₹${event.registration_fee_inr} per squad (1-6 members)
Official Portal: https://skaleathon.skalekraft.in`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timer = typingTimerRef.current;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const activeContent = getOutputForCommand(activeTab);

  return (
    <div className="relative mx-auto max-w-4xl w-full rounded-2xl border border-white/[0.12] bg-[#0A0A0B]/95 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(193,154,136,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl overflow-hidden text-left transition-all duration-300 hover:border-[#c19a88]/40">
      {/* 1. Authentic macOS Terminal Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#121214]/80">
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights with subtle hover glow */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.6)] cursor-pointer" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.6)] cursor-pointer" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.6)] cursor-pointer" />
          </div>

          <div className="h-3.5 w-px bg-white/10" />

          {/* Terminal Session Identifier */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/50">
            <TerminalIcon className="h-3.5 w-3.5 text-[#c19a88]" />
            <span className="text-white/80 font-medium">skaleathon-cli</span>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-white/40">zsh (v2.8)</span>
          </div>
        </div>

        {/* Right Tools: Copy & Telemetry Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyTerminalOutput}
            className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/[0.05] transition-colors"
            title="Copy CLI spec to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-white/40" />
                <span>Copy</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive CLI Command Palette Switcher */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.06] bg-[#0E0E10] overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest pl-1 pr-2 hidden sm:inline">
          COMMANDS:
        </span>
        {[
          { key: 'prizes' as CommandKey, label: '--prizes', icon: Trophy, note: `₹${prizePoolFormatted}` },
          { key: 'stages' as CommandKey, label: '--stages', icon: Layers, note: '4 Phases' },
          { key: 'tracks' as CommandKey, label: '--tracks', icon: Code2, note: '3 Arenas' },
          { key: 'register' as CommandKey, label: '--register', icon: Sparkles, note: '₹99' },
          { key: 'rules' as CommandKey, label: '--rules', icon: ShieldCheck, note: 'Integrity' },
        ].map((cmd) => {
          const Icon = cmd.icon;
          const isActive = activeTab === cmd.key;
          return (
            <button
              key={cmd.key}
              type="button"
              onClick={() => executeCommand(cmd.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#c19a88]/20 text-[#ffe5d9] border border-[#c19a88]/60 shadow-[0_0_15px_rgba(193,154,136,0.25)]'
                  : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
              }`}
            >
              <Icon className={`h-3 w-3 ${isActive ? 'text-[#ffe5d9]' : 'text-[#c19a88]'}`} />
              <span>{cmd.label}</span>
              <span className="text-[10px] text-white/40 hidden md:inline">({cmd.note})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Terminal Interactive Body */}
      <div
        ref={terminalBodyRef}
        onClick={() => inputRef.current?.focus()}
        className="p-4 sm:p-5 space-y-4 max-h-[380px] overflow-y-auto font-mono text-xs cursor-text bg-[#080809]"
      >
        {/* Custom History (if user typed extra commands) */}
        {history.map((item) => (
          <div key={item.id} className="space-y-2 border-b border-white/[0.06] pb-3.5">
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-[#c19a88] font-bold">visitor@skaleathon</span>
              <span className="text-white/30">:</span>
              <span className="text-[#e8c5b4]/80">~</span>
              <span className="text-[#c19a88] font-bold">$</span>
              <span className="text-white font-medium">{item.command}</span>
              <span className="text-white/20 text-[10px] ml-auto">{item.timestamp}</span>
            </div>
            <div className="pt-1">{item.output}</div>
          </div>
        ))}

        {/* Current Active Command Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[#c19a88] font-bold">visitor@skaleathon</span>
            <span className="text-white/30">:</span>
            <span className="text-[#e8c5b4]/80">~</span>
            <span className="text-[#c19a88] font-bold">$</span>
            <span className="text-white font-medium tracking-wide">
              {commandPromptText}
            </span>
            <span className="inline-block w-2 h-4 bg-[#c19a88] animate-pulse align-middle" />
          </div>

          {/* Active Command Output Area */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0E0E11]/90 p-3.5 sm:p-4 shadow-inner">
            {isTyping ? (
              <div className="flex items-center gap-2 text-xs font-mono text-white/40 h-24">
                <span className="animate-pulse">Loading telemetry stream...</span>
              </div>
            ) : (
              activeContent
            )}
          </div>
        </div>
      </div>

      {/* 4. Interactive Command Line Prompt Form */}
      <form
        onSubmit={handleInputSubmit}
        className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.08] bg-[#0C0C0E]"
      >
        <span className="text-xs text-[#c19a88] font-mono font-bold shrink-0 flex items-center gap-1">
          <span>&gt;</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Try typing 'prizes', 'stages', 'tracks', 'rules', or 'register'..."
          className="w-full bg-transparent text-xs text-white placeholder-white/25 focus:outline-none font-mono"
          aria-label="Terminal command line input"
        />
        <button
          type="submit"
          aria-label="Send command"
          className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 rounded border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-[#c19a88]/40 hover:bg-[#c19a88]/20 transition-all shrink-0 cursor-pointer"
        >
          <span>Run</span>
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}
