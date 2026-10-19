import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import TrackScrollJourney from '@/components/dashboard/TrackScrollJourney';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 0;

interface TrackMeta {
  manifesto: string;
  domains: Array<{
    title: string;
    tag: string;
    description: string;
    iconKey: string;
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
        iconKey: 'cpu',
      },
      {
        title: 'Enterprise RAG & Knowledge Graphs',
        tag: 'Retrieval & Context',
        description:
          'High-precision contextual search, hybrid sparse/dense vector indexing, reranking models, and hallucination reduction.',
        iconKey: 'database',
      },
      {
        title: 'Multimodal Vision & Audio',
        tag: 'Sensory Intelligence',
        description:
          'Document OCR parsing, real-time computer vision inference, voice interfaces, and generative media synthesis.',
        iconKey: 'eye',
      },
      {
        title: 'Edge & Embedded Intelligence',
        tag: 'Low-Latency ML',
        description:
          'Quantized on-device models, streaming inference APIs, WASM execution, and microsecond predictive telemetry.',
        iconKey: 'zap',
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
        iconKey: 'boxes',
      },
      {
        title: 'High-Concurrency Edge Platforms',
        tag: 'Distributed Systems',
        description:
          'Serverless edge functions, global cache invalidation, streaming responses, and resilient micro-architectures.',
        iconKey: 'globe',
      },
      {
        title: 'Transactional FinTech & Commerce',
        tag: 'High Reliability',
        description:
          'Idempotent payment pipelines, double-entry ledgers, fraud detection heuristics, and bank-grade security protocols.',
        iconKey: 'shield',
      },
      {
        title: 'Developer Tooling & Platform APIs',
        tag: 'DevEx & Infrastructure',
        description:
          'Command-line tooling, SDK generators, webhook delivery networks, and real-time observability telemetry.',
        iconKey: 'terminal',
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
        iconKey: 'database',
      },
      {
        title: 'Hardware & Sensor Integration',
        tag: 'Device Capabilities',
        description:
          'Camera AR vision, biometric keychain authorization, background geolocation, Bluetooth Low Energy, and haptic feedback.',
        iconKey: 'smartphone',
      },
      {
        title: 'High-Performance 120 FPS UI',
        tag: 'Fluid Motion',
        description:
          'Custom physics-based spring gestures, micro-interactions, dark/light adaptive theming, and optimized render trees.',
        iconKey: 'zap',
      },
      {
        title: 'Cross-Platform Enterprise Suites',
        tag: 'Mobile Security',
        description:
          'Certificate pinning, encrypted on-device vaults, push notification channels, and zero-trust authentication.',
        iconKey: 'shield',
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
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;
  const allTracks = await EventRepository.getTracks();

  const trackMeta = track
    ? TRACK_METAS[track.id] || TRACK_METAS['track-ai-ml']
    : null;

  // Ensure we strictly use the luxury SkaleKraft copper/champagne palette and avoid odd purple colors
  const rawColor = track?.color_accent;
  const isOddColor =
    !rawColor ||
    rawColor.toLowerCase().startsWith('#8b') ||
    rawColor.toLowerCase().startsWith('#63') ||
    rawColor.toLowerCase().includes('purple');
  const accentColor = isOddColor ? '#c19a88' : rawColor;

  if (!track) {
    return (
      <div className="space-y-12 pb-20 text-neutral-200">
        <div className="relative border-b border-white/[0.08] pb-8 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block">
                Engineering Arenas
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Select Your{' '}
                <span className="font-serif italic font-normal text-[#e8c5b4]">
                  Competition Track
                </span>
              </h1>
              <p className="text-sm text-neutral-400 font-light max-w-xl">
                You haven&apos;t enrolled in an engineering arena yet. Register your squad to lock in your competition track.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/20 transition-all hover:scale-105 shrink-0"
            >
              <span>Register Squad (₹99)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Open Scroll Stream of Tracks */}
        <div className="space-y-12">
          {allTracks.map((t, idx) => (
            <div
              key={t.id}
              className="pl-6 border-l-2 space-y-2"
              style={{ borderColor: `${t.color_accent || '#c19a88'}50` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${t.color_accent}40`,
                    backgroundColor: `${t.color_accent}15`,
                    color: t.color_accent,
                  }}
                >
                  {t.slug.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-neutral-500">Track 0{idx + 1}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{t.name}</h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-2xl">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Serializable props
  const serializableTrack = {
    id: track.id,
    name: track.name,
    slug: track.slug,
    description: track.description,
    color_accent: track.color_accent,
  };

  const serializableTeam = team ? { name: team.name } : null;

  return (
    <TrackScrollJourney
      track={serializableTrack}
      team={serializableTeam}
      trackMeta={trackMeta}
      accentColor={accentColor}
    />
  );
}
