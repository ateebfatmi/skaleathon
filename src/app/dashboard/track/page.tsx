import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import TrackScrollJourney from '@/components/dashboard/TrackScrollJourney';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 0;

interface TrackMeta {
  manifesto: string;
  coreExpectation: string;
  suggestedStack: string[];
}

const TRACK_METAS: Record<string, TrackMeta> = {
  'track-ai-ml': {
    manifesto:
      'Build intelligent systems, generative workflows, predictive models, or autonomous solutions for any industry or real-world problem of your choice. There are no fixed themes—your squad has complete freedom to define your own domain and problem statement.',
    coreExpectation:
      'Your solution can target any sector or user need, provided Artificial Intelligence or Machine Learning forms the core engine of your architecture.',
    suggestedStack: [
      'Python',
      'PyTorch / TensorFlow',
      'FastAPI',
      'LangChain / LlamaIndex',
      'Hugging Face',
      'Vector Databases',
      'LLM / Multimodal APIs',
      'Next.js / React',
      'Any Custom ML Stack',
    ],
  },
  'track-web-dev': {
    manifesto:
      'Architect resilient, modern full-stack web platforms, SaaS products, collaborative tools, or consumer web applications across any domain you choose. There are no fixed themes—formulate your own problem statement and build without boundaries.',
    coreExpectation:
      'Your project can address any industry or creator challenge, provided it is delivered as a cohesive, full-stack web application or browser-based platform.',
    suggestedStack: [
      'TypeScript / JavaScript',
      'Next.js / React / Vue',
      'Node.js / Bun / Go',
      'PostgreSQL / MongoDB',
      'Prisma / Drizzle ORM',
      'Redis / Upstash',
      'Tailwind CSS',
      'Cloud / Edge Hosting',
      'Any Web Stack',
    ],
  },
  'track-app-dev': {
    manifesto:
      'Craft fluid native or cross-platform mobile applications solving any consumer, community, or enterprise problem you care about. There are no predefined themes—your squad is free to invent your own domain and use case.',
    coreExpectation:
      'Your idea can span any vertical or everyday workflow, provided the primary experience is engineered for mobile or portable devices.',
    suggestedStack: [
      'React Native / Expo',
      'Flutter',
      'Swift / Kotlin',
      'SQLite / Realm',
      'Supabase / Firebase',
      'REST / GraphQL APIs',
      'Native Device APIs',
      'Any Mobile Framework',
    ],
  },
};

export default async function DashboardTrackPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const track = team?.track || null;
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
              <span>Register Squad</span>
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
