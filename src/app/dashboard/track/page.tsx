import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { formatDate } from '@/lib/utils';
import {
  Code2,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck2,
  Cpu,
  Globe,
  Smartphone,
  ShieldCheck,
  Terminal,
  Zap,
  Boxes,
  Compass,
  Database,
  Eye,
  GitBranch,
  Video,
  FileCode,
  Lock,
} from 'lucide-react';

export const revalidate = 0;

interface TrackMeta {
  manifesto: string;
  domains: Array<{
    title: string;
    tag: string;
    description: string;
    icon: any;
  }>;
  suggestedStack: string[];
}

const TRACK_METAS: Record<string, TrackMeta> = {
  'track-ai-ml': {
    manifesto:
      'Harness cutting-edge generative foundation models, agentic reasoning loops, computer vision, and predictive machine learning to solve deep structural friction in modern enterprise and consumer products.',
    domains: [
      {
        title: 'Autonomous Agentic Systems',
        tag: 'Agents & Tool-Use',
        description:
          'Multi-agent coordination, autonomous self-reflection loops, tool-calling pipelines, and autonomous workflow automation.',
        icon: Cpu,
      },
      {
        title: 'Enterprise RAG & Knowledge Graphs',
        tag: 'Retrieval & Context',
        description:
          'High-precision contextual search, hybrid sparse/dense vector indexing, reranking models, and hallucination reduction.',
        icon: Database,
      },
      {
        title: 'Multimodal Vision & Audio',
        tag: 'Sensory Intelligence',
        description:
          'Document OCR parsing, real-time computer vision inference, voice interfaces, and generative media synthesis.',
        icon: Eye,
      },
      {
        title: 'Edge & Embedded Intelligence',
        tag: 'Low-Latency ML',
        description:
          'Quantized on-device models, streaming inference APIs, WASM execution, and microsecond predictive telemetry.',
        icon: Zap,
      },
    ],
    suggestedStack: [
      'Python',
      'PyTorch',
      'FastAPI',
      'LangChain / LlamaIndex',
      'Hugging Face',
      'pgvector',
      'OpenAI / Anthropic APIs',
      'Next.js 14',
      'Tailwind CSS',
    ],
  },
  'track-web-dev': {
    manifesto:
      'Architect resilient, hyper-responsive web applications leveraging edge computing, modern reactive frameworks, sub-second TTFB, and scalable backend infrastructure.',
    domains: [
      {
        title: 'Real-time Collaborative Surfaces',
        tag: 'WebSockets & CRDTs',
        description:
          'Multiplayer live editing, conflict-free replicated data types, optimistic UI state synchronizers, and canvas rendering.',
        icon: Boxes,
      },
      {
        title: 'High-Concurrency Edge Platforms',
        tag: 'Distributed Systems',
        description:
          'Serverless edge functions, global cache invalidation, streaming responses, and resilient micro-architectures.',
        icon: Globe,
      },
      {
        title: 'Transactional FinTech & Commerce',
        tag: 'High Reliability',
        description:
          'Idempotent payment pipelines, double-entry ledgers, fraud detection heuristics, and bank-grade security protocols.',
        icon: ShieldCheck,
      },
      {
        title: 'Developer Tooling & Platform APIs',
        tag: 'DevEx & Infrastructure',
        description:
          'Command-line tooling, SDK generators, webhook delivery networks, and real-time observability telemetry.',
        icon: Terminal,
      },
    ],
    suggestedStack: [
      'TypeScript',
      'Next.js 14 (App Router)',
      'Node.js / Bun',
      'PostgreSQL',
      'Prisma / Drizzle ORM',
      'Redis / Upstash',
      'Tailwind CSS',
      'Vercel / Railway',
      'WebSockets',
    ],
  },
  'track-app-dev': {
    manifesto:
      'Build silky, fluid mobile applications that integrate deeply with hardware sensors, feature offline-first synchronization, and deliver effortless native experiences.',
    domains: [
      {
        title: 'Offline-First Synchronization',
        tag: 'Local-First DB',
        description:
          'Local embedded SQLite / WatermelonDB, zero-latency optimistic interactions, and seamless background cloud reconciliation.',
        icon: Database,
      },
      {
        title: 'Hardware & Sensor Integration',
        tag: 'Device Capabilities',
        description:
          'Camera AR vision, biometric keychain authorization, background geolocation, Bluetooth Low Energy, and haptic feedback.',
        icon: Smartphone,
      },
      {
        title: 'High-Performance 120 FPS UI',
        tag: 'Fluid Motion',
        description:
          'Custom physics-based spring gestures, micro-interactions, dark/light adaptive theming, and optimized render trees.',
        icon: Zap,
      },
      {
        title: 'Cross-Platform Enterprise Suites',
        tag: 'Mobile Security',
        description:
          'Certificate pinning, encrypted on-device vaults, push notification channels, and zero-trust authentication.',
        icon: ShieldCheck,
      },
    ],
    suggestedStack: [
      'React Native / Expo',
      'Flutter',
      'Swift / Kotlin',
      'SQLite / WatermelonDB',
      'TanStack Query',
      'Reanimated 3',
      'Supabase',
      'Tailwind / NativeWind',
    ],
  },
};

export default async function DashboardTrackPage() {
  const session = await getCurrentSession();
  const event = await EventRepository.getEvent();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;
  const allTracks = await EventRepository.getTracks();

  const trackMeta = track
    ? TRACK_METAS[track.id] || TRACK_METAS['track-ai-ml']
    : null;

  const accentColor = track?.color_accent || '#c19a88';

  return (
    <div className="space-y-10 text-neutral-200">
      {/* 1. Stylish Editorial Header with Ambient Backlight */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-[#0A0A0A] p-6 sm:p-10 backdrop-blur-2xl">
        {/* Dynamic Glow Orb */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-[120px] opacity-25"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider">
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <span style={{ color: accentColor }}>Competition Arena // Technical Scope</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400">Team: {team ? team.name : 'Unassigned'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {track ? track.name : 'Engineering Track Specifications'}
              </h1>
              {track && (
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                  style={{
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                    backgroundColor: `${accentColor}15`,
                  }}
                >
                  {track.slug.toUpperCase()}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              {trackMeta ? trackMeta.manifesto : track?.description}
            </p>

            {/* Quick Specs Strip */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" style={{ color: accentColor }} />
                <span>
                  Final Submission Deadline:{' '}
                  <span className="text-white font-mono font-medium">
                    {formatDate(event.submission_deadline)}
                  </span>
                </span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  Team Capacity: <span className="text-white font-medium">1 to 6 Members</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard/stages"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B0B0B] bg-gradient-to-r from-[#e8c5b4] to-[#c19a88] hover:opacity-95 transition-opacity shadow-sm"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Stage Roadmap</span>
            </Link>
          </div>
        </div>
      </div>

      {track ? (
        <div className="space-y-10">
          {/* 2. Specialized Problem Domains & Technical Vectors */}
          {trackMeta && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4" style={{ color: accentColor }} />
                  <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Specialized Technical Vectors & Themes
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">
                  Select or formulate your problem statement within these scopes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trackMeta.domains.map((domain, idx) => {
                  const Icon = domain.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent hover:border-white/20 transition-all duration-300 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
                          style={{
                            borderColor: `${accentColor}30`,
                            backgroundColor: `${accentColor}10`,
                            color: accentColor,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            color: accentColor,
                            borderColor: `${accentColor}30`,
                            backgroundColor: `${accentColor}08`,
                          }}
                        >
                          {domain.tag}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-[#e8c5b4] transition-colors">
                        {domain.title}
                      </h3>

                      <p className="text-xs text-neutral-400 leading-relaxed font-light">
                        {domain.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Recommended Tech Toolkit Chips */}
          {trackMeta && (
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.015] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" style={{ color: accentColor }} />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                    Recommended Stacks & Tools
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Free choice of stack — recommendations for optimal velocity
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {trackMeta.suggestedStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 hover:text-white hover:border-white/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. Split Section: Required Deliverables (Left) & Judging Rubric (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-white/[0.08]">
            {/* Left: Required Deliverables (~60%) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4" style={{ color: accentColor }} />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Official Deliverable Guidelines (Stage 03)
                  </h3>
                </div>
                <p className="text-xs text-neutral-500">
                  Deliverables will be submitted via the Project Submission portal during the 10-day build sprint.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Deliverable 1 */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-white font-semibold text-xs">
                      <GitBranch className="h-4 w-4 text-emerald-400" />
                      <span>Public GitHub Repository</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-6.5 leading-relaxed font-light">
                    Clean commit history authored during the competition period. Must include a clear <code className="text-[#e8c5b4] font-mono">README.md</code> with setup instructions, environment variables template, and architectural breakdown.
                  </p>
                </div>

                {/* Deliverable 2 */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-white font-semibold text-xs">
                      <Globe className="h-4 w-4 text-emerald-400" />
                      <span>Live Production Prototype URL</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-6.5 leading-relaxed font-light">
                    Fully functional deployment on cloud hosting (Vercel, Render, Railway, Cloudflare, etc.). Must be accessible by judges with zero login barriers or test credentials clearly provided.
                  </p>
                </div>

                {/* Deliverable 3 */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-white font-semibold text-xs">
                      <Video className="h-4 w-4 text-[#c19a88]" />
                      <span>Video Demonstration Walkthrough</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#c19a88] bg-[#c19a88]/10 px-2 py-0.5 rounded">
                      Optional Advantage
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-6.5 leading-relaxed font-light">
                    A 2 to 3 minute unlisted YouTube or Loom video walkthrough demonstrating real-time user flow and key technical innovations. Not strictly required, but provides a distinct evaluation advantage.
                  </p>
                </div>

                {/* Deliverable 4 */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-white font-semibold text-xs">
                      <FileCode className="h-4 w-4 text-neutral-300" />
                      <span>AI Tool & Model Disclosure</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.05] px-2 py-0.5 rounded">
                      Policy
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-6.5 leading-relaxed font-light">
                    Transparent declaration in your repository README acknowledging any LLMs, starter kits, or third-party APIs used in development.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Judging Evaluation Rubric (~40%) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" style={{ color: accentColor }} />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Jury Evaluation Rubric
                  </h3>
                </div>
                <p className="text-xs text-neutral-500">
                  Weighted scoring applied by judges during Stage 03 and Stage 04 evaluations.
                </p>
              </div>

              <div className="space-y-3">
                {/* 30% Innovation */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Innovation & Originality</span>
                    <span className="font-mono font-bold text-[#e8c5b4]">30%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[30%]" />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Novelty of problem formulation, uniqueness of approach, and distinct edge over existing market solutions.
                  </p>
                </div>

                {/* 30% Technical Execution */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Technical Architecture & Rigor</span>
                    <span className="font-mono font-bold text-[#e8c5b4]">30%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[30%]" />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Code cleanliness, modular software design, performance benchmarks, and robust error resilience.
                  </p>
                </div>

                {/* 20% Scalability */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Real-World Utility & Scalability</span>
                    <span className="font-mono font-bold text-[#e8c5b4]">20%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[20%]" />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Practical viability, market relevance, architectural scalability, and low operational friction.
                  </p>
                </div>

                {/* 20% UX Polish */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">UX & Interface Craft</span>
                    <span className="font-mono font-bold text-[#e8c5b4]">20%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#805948] to-[#c19a88] w-[20%]" />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Visual hierarchy, intuitive ergonomics, responsive layouts, and attention to polish.
                  </p>
                </div>
              </div>

              {/* Submission Portal Notice */}
              <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-2.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-300 font-medium">
                  <Lock className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Submission Portal Activates in Stage 03</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                  Project submission forms unlock during the 10-day build sprint after the Stage 01 screening round.
                </p>
                <Link
                  href="/dashboard/submission"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c19a88] hover:text-[#e8c5b4] transition-colors pt-1"
                >
                  <span>Read advance preparation guidelines</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback if no track assigned */
        <div className="space-y-8">
          <div className="p-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-3">
            <h2 className="text-xl font-bold text-white">No Track Assigned Yet</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              You haven&apos;t registered a team or selected an engineering arena yet. Select your track during team registration.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] to-[#c19a88] px-5 py-2.5 text-xs font-bold text-white shadow-md"
            >
              <span>Register Squad (₹99)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allTracks.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3"
              >
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                  style={{
                    borderColor: `${t.color_accent}40`,
                    backgroundColor: `${t.color_accent}15`,
                    color: t.color_accent,
                  }}
                >
                  {t.slug.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white">{t.name}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-3">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
