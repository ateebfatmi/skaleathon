'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, RotateCcw, CornerDownLeft, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cyberAudio } from '@/lib/cyber-sound';

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  time: string;
}

export default function InteractiveTerminal() {
  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<'cli' | 'telemetry'>('cli');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'skaleathon --version',
      output: (
        <div className="text-neutral-300 space-y-1">
          <div className="text-[#c19a88] font-bold">
            SKALEATHON 2027 ARCHITECTURE KERNEL v2.7.0 [RELEASE]
          </div>
          <div>Organized by <span className="text-white font-medium">SkaleKraft</span> • National Online Hackathon</div>
          <div className="text-white/50 text-[11px]">Type <span className="text-[#e8c5b4] font-mono">help</span> or click quick actions below to explore commands.</div>
        </div>
      ),
      time: '00:01',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const cleaned = cmd.trim().toLowerCase();
    cyberAudio.playSuccess();
    const now = new Date().toLocaleTimeString([], { hour12: false });

    let output: React.ReactNode;

    switch (cleaned) {
      case 'help':
        output = (
          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="text-[#c19a88] font-semibold">Available Command Instructions:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-[#e8c5b4] font-mono font-bold">tracks</span> — Inspect AI/ML, Web & Mobile arenas</div>
              <div><span className="text-[#e8c5b4] font-mono font-bold">prizes</span> — View ₹35,000 cash & interview tiers</div>
              <div><span className="text-[#e8c5b4] font-mono font-bold">register</span> — Fast-track team registration link (₹99)</div>
              <div><span className="text-[#e8c5b4] font-mono font-bold">verify</span> — Test SHA-256 certificate validation</div>
              <div><span className="text-[#e8c5b4] font-mono font-bold">rules</span> — Review team size & submission policies</div>
              <div><span className="text-[#e8c5b4] font-mono font-bold">clear</span> — Reset terminal log buffer</div>
            </div>
          </div>
        );
        break;

      case 'tracks':
        output = (
          <div className="space-y-2 text-xs">
            <div className="text-[#c19a88] font-bold">⚡ Active Competition Tracks:</div>
            <div className="space-y-1 text-neutral-300 text-[11px]">
              <div><span className="text-emerald-400 font-mono font-bold">[01] AI & Machine Learning:</span> Neural agents, LLM pipelines, autonomous computer vision.</div>
              <div><span className="text-cyan-400 font-mono font-bold">[02] Web Architecture:</span> High-throughput distributed services, Next.js, WebSockets, edge infra.</div>
              <div><span className="text-amber-400 font-mono font-bold">[03] Mobile Systems:</span> Cross-platform native apps, on-device ML, offline-first sync.</div>
            </div>
            <div className="pt-1">
              <Link href="/tracks" className="inline-flex items-center gap-1.5 text-[#c19a88] hover:text-white underline text-[11px]">
                Explore full track specs <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        );
        break;

      case 'prizes':
        output = (
          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="text-[#c19a88] font-bold">🏆 Authorized Prize Structure:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg border border-amber-500/20 bg-amber-500/10">
                <span className="text-amber-300 font-bold block">1st Place Champion</span>
                <span className="text-white font-mono text-sm font-bold">₹20,000</span>
                <span className="block text-white/50 text-[10px] mt-0.5">Top Grant + Interviews</span>
              </div>
              <div className="p-2 rounded-lg border border-slate-400/20 bg-slate-400/10">
                <span className="text-slate-200 font-bold block">2nd Place Runner-Up</span>
                <span className="text-white font-mono text-sm font-bold">₹10,000</span>
                <span className="block text-white/50 text-[10px] mt-0.5">Excellence Grant</span>
              </div>
              <div className="p-2 rounded-lg border border-[#c19a88]/20 bg-[#c19a88]/10">
                <span className="text-[#e8c5b4] font-bold block">3rd Place Runner-Up</span>
                <span className="text-white font-mono text-sm font-bold">₹5,000</span>
                <span className="block text-white/50 text-[10px] mt-0.5">Innovation Grant</span>
              </div>
            </div>
            <div className="text-[11px] text-white/60 pt-1">
              • Top 25 Teams: Tamper-evident cryptographic merit credentials with QR authentication.
              <br />• Top 5 Teams: Fast-track interview evaluation for technical internships at SkaleKraft Studio.
            </div>
          </div>
        );
        break;

      case 'register':
        output = (
          <div className="p-3 rounded-xl border border-[#c19a88]/30 bg-[#c19a88]/10 space-y-2 text-xs">
            <div className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#c19a88]" />
              <span>Registration Gateway Initialized</span>
            </div>
            <div className="text-white/70 text-[11px]">
              • Fee: <span className="text-[#e8c5b4] font-mono font-bold">₹99 flat</span> per team (not per member)
              <br />• Team Size: 1 to 6 members
              <br />• Payment: Razorpay Instant UPI, Cards, NetBanking
            </div>
            <div className="pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:scale-105 transition-all"
              >
                Proceed to Secure Registration Page
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        );
        break;

      case 'verify':
        output = (
          <div className="space-y-1.5 text-xs text-neutral-300 font-mono text-[11px]">
            <div className="text-emerald-400">✓ Cryptographic verification engine status: LIVE</div>
            <div className="text-white/60">Sample verification hash query: SK2027-TEST-HASH-99F2A</div>
            <div className="text-white/40">Timestamp: {new Date().toISOString()}</div>
            <div className="text-[#c19a88]">Validation confirmed: Official tamper-proof certificate format ready.</div>
          </div>
        );
        break;

      case 'rules':
        output = (
          <div className="space-y-1 text-xs text-neutral-300 text-[11px]">
            <div className="text-[#c19a88] font-semibold">Official Skaleathon Guidelines:</div>
            <div>• Open across India for undergraduate, postgraduate, and independent developers.</div>
            <div>• Team size: 1–6 members. Teams can compete across any 1 track.</div>
            <div>• GenAI tooling allowed with transparent disclosure in submission README.</div>
            <div>• Final review conducted via verified GitHub repo, demo video, and live deployment.</div>
          </div>
        );
        break;

      case 'clear':
        setLogs([]);
        return;

      default:
        output = (
          <div className="text-red-400 text-xs">
            Unknown instruction &apos;{cmd}&apos;. Type <span className="text-[#e8c5b4] font-bold">help</span> or click the buttons below.
          </div>
        );
        break;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: cmd,
        output,
        time: now,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const quickButtons = ['help', 'tracks', 'prizes', 'register', 'verify', 'rules'];

  return (
    <div className="relative mx-auto max-w-4xl w-full rounded-[24px] border border-white/10 bg-[#07090E]/95 shadow-[0_30px_90px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl overflow-hidden">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]/80 shadow-[0_0_8px_rgba(255,95,86,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/80 shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]/80 shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
          </div>
          <span className="ml-3 font-mono text-[11px] text-white/50 hidden sm:inline-block">
            skaleathon-cli ~ interactive sandbox
          </span>
        </div>

        {/* Telemetry Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('cli');
              cyberAudio.playHover();
            }}
            className={`px-3 py-1 rounded-md text-[10px] font-mono font-medium tracking-wider transition-all ${
              activeTab === 'cli'
                ? 'bg-[#c19a88]/20 text-[#e8c5b4] border border-[#c19a88]/30 shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => {
              setActiveTab('telemetry');
              cyberAudio.playHover();
            }}
            className={`px-3 py-1 rounded-md text-[10px] font-mono font-medium tracking-wider transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#c19a88]/20 text-[#e8c5b4] border border-[#c19a88]/30 shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            TELEMETRY
          </button>
        </div>
      </div>

      {activeTab === 'cli' ? (
        <div className="p-4 sm:p-6 space-y-4 font-mono">
          {/* Scrollable logs area */}
          <div className="max-h-72 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar text-xs">
            {logs.map((log) => (
              <div key={log.id} className="space-y-1.5">
                <div className="flex items-center gap-2 text-white/40 text-[11px]">
                  <span className="text-[#c19a88]">guest@skaleathon</span>
                  <span>:</span>
                  <span className="text-white/30">~</span>
                  <span className="text-[#c19a88]">$</span>
                  <span className="text-white font-semibold">{log.command}</span>
                  <span className="ml-auto text-[10px] text-white/20">{log.time}</span>
                </div>
                <div className="pl-4 border-l border-white/10">{log.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick-action pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
            <span className="text-[10px] text-white/30 uppercase tracking-widest mr-1">Quick:</span>
            {quickButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleCommand(btn)}
                className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-[#e8c5b4] hover:bg-[#c19a88]/20 hover:border-[#c19a88]/40 hover:text-white transition-all flex items-center gap-1"
              >
                <Play className="h-2.5 w-2.5 opacity-60" />
                <span>{btn}</span>
              </button>
            ))}
            <button
              onClick={() => handleCommand('clear')}
              className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-white/40 hover:text-white transition-colors ml-auto flex items-center gap-1"
              title="Clear terminal"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>clear</span>
            </button>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-[#c19a88] shrink-0 font-bold">
              <span>$</span>
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type command ('help', 'tracks', 'register') and press Enter..."
              className="w-full bg-transparent text-xs text-white placeholder-white/25 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-[#c19a88]/20 transition-all shrink-0"
            >
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Telemetry Status Grid */
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-1">
            <div className="flex items-center justify-between text-white/50 text-[10px]">
              <span>NODE STATUS</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-white font-bold text-sm">ONLINE • ACTIVE</div>
            <p className="text-white/40 text-[10px]">National registration pipeline enabled</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-1">
            <div className="text-white/50 text-[10px]">TOTAL PRIZE ALLOCATION</div>
            <div className="text-[#c19a88] font-bold text-sm">₹35,000 INR</div>
            <p className="text-white/40 text-[10px]">1st: ₹20k | 2nd: ₹10k | 3rd: ₹5k</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-1">
            <div className="text-white/50 text-[10px]">ENTRY STIPULATION</div>
            <div className="text-white font-bold text-sm">₹99 FLAT / TEAM</div>
            <p className="text-white/40 text-[10px]">1 to 6 members inclusive</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-1">
            <div className="text-white/50 text-[10px]">CRYPTOGRAPHIC VERIFICATION</div>
            <div className="text-emerald-400 font-bold text-sm">SHA-256 + QR REGISTRY</div>
            <p className="text-white/40 text-[10px]">Top 25 tamper-evident certificates</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-1">
            <div className="text-white/50 text-[10px]">CAREER ACCELERATION</div>
            <div className="text-[#e8c5b4] font-bold text-sm">TOP 5 INTERVIEWS</div>
            <p className="text-white/40 text-[10px]">SkaleKraft engineering studio gateway</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-1">
            <div className="text-white/50 text-[10px]">ORGANIZER ECOSYSTEM</div>
            <div className="text-white font-bold text-sm">SKALEKRAFT STUDIO</div>
            <p className="text-white/40 text-[10px]">Official portal: skalekraft.in</p>
          </div>
        </div>
      )}
    </div>
  );
}
