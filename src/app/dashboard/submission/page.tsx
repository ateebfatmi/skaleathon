'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Globe,
  Github,
  Video,
  CheckCircle2,
  Lock,
  ExternalLink,
  Save,
  AlertCircle,
  Clock,
  Layers,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';
import { motion } from 'framer-motion';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';

export default function SubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [track, setTrack] = useState<EventTrack | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<'stage2' | 'stage3' | 'guidelines'>('stage2');

  // Independent window controls for Stage 02 and Stage 03
  const [stage2WindowOpen, setStage2WindowOpen] = useState<boolean>(false);
  const [stage3WindowOpen, setStage3WindowOpen] = useState<boolean>(false);

  // Stage 02: Architecture Presentation (PDF) State
  const [presentationUrl, setPresentationUrl] = useState('');
  const [stage2Saving, setStage2Saving] = useState(false);
  const [stage2Success, setStage2Success] = useState(false);
  const [stage2Error, setStage2Error] = useState<string | null>(null);

  // Stage 03: Project Prototype & Codebase State
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [stage3Saving, setStage3Saving] = useState(false);
  const [stage3Success, setStage3Success] = useState(false);
  const [stage3Error, setStage3Error] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/submissions').then((r) => r.json()),
      fetch('/api/event').then((r) => r.json()),
    ])
      .then(([subData, eventData]) => {
        if (subData.eventStatus === 'hacking_live') {
          setStage2WindowOpen(true);
          setStage3WindowOpen(true);
        }

        if (subData.team) {
          setTeam(subData.team);
          setIsPaid(subData.team.status === 'paid' || subData.team.status === 'confirmed');

          if (eventData.tracks && subData.team.track_id) {
            const matchedTrack = eventData.tracks.find((t: EventTrack) => t.id === subData.team.track_id);
            setTrack(matchedTrack || null);
          }
        }

        if (subData.submission) {
          setPresentationUrl(subData.submission.presentation_url || '');
          setLiveDemoUrl(subData.submission.live_demo_url || '');
          setGithubUrl(subData.submission.github_url || '');
          setDemoVideoUrl(subData.submission.demo_video_url || '');
        } else {
          try {
            const saved = localStorage.getItem('skaleathon_submission_draft');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.presentationUrl) setPresentationUrl(parsed.presentationUrl);
              if (parsed.liveDemoUrl) setLiveDemoUrl(parsed.liveDemoUrl);
              if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
              if (parsed.demoVideoUrl) setDemoVideoUrl(parsed.demoVideoUrl);
            }
          } catch {
            // Ignore localStorage errors
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleStage2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stage2WindowOpen) {
      setStage2Error('Stage 02 PPT submission will open on the scheduled competition date.');
      return;
    }

    if (!presentationUrl) {
      setStage2Error('Please enter a valid presentation PDF link.');
      return;
    }

    setStage2Saving(true);
    setStage2Success(false);
    setStage2Error(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${team?.name || 'Squad'} Architecture Deck`,
          track_id: team?.track_id || track?.id || 'track-ai-ml',
          problem_statement: 'Stage 02 Architecture Presentation Blueprint.',
          solution_overview: 'Architecture slide deck deliverable.',
          description: 'Stage 02 PPT deliverable submitted via participant portal.',
          tech_stack: [track?.name || 'Full Stack'],
          presentation_url: presentationUrl,
          isDraft: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit Stage 02 PPT.');

      setStage2Success(true);
      setTimeout(() => setStage2Success(false), 4000);
    } catch (err: any) {
      setStage2Error(err.message || 'Submission failed.');
    } finally {
      setStage2Saving(false);
    }
  };

  const handleStage3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stage3WindowOpen) {
      setStage3Error('Stage 03 Prototype & Codebase submission will open on the scheduled competition date.');
      return;
    }

    if (!githubUrl && !liveDemoUrl) {
      setStage3Error('Please provide at least a GitHub repository or live prototype URL.');
      return;
    }

    setStage3Saving(true);
    setStage3Success(false);
    setStage3Error(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${team?.name || 'Squad'} Project Prototype`,
          track_id: team?.track_id || track?.id || 'track-ai-ml',
          problem_statement: 'Stage 03 Working Project and Prototype deliverables.',
          solution_overview: 'Live prototype URL and GitHub repository.',
          description: 'Stage 03 deliverables submitted via participant portal.',
          tech_stack: [track?.name || 'Full Stack'],
          github_url: githubUrl,
          live_demo_url: liveDemoUrl,
          demo_video_url: demoVideoUrl,
          isDraft: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit Stage 03 deliverables.');

      setStage3Success(true);
      setTimeout(() => setStage3Success(false), 4000);
    } catch (err: any) {
      setStage3Error(err.message || 'Submission failed.');
    } finally {
      setStage3Saving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="h-7 w-7 mx-auto rounded-full border-2 border-[#c19a88] border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-400 font-mono tracking-wider uppercase">
          Loading deliverables portal...
        </p>
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="relative max-w-2xl mx-auto py-16 text-center space-y-5">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#c19a88]/10 blur-[120px]" />
        <div className="relative z-10 flex items-center justify-center text-[#c19a88] mx-auto">
          <Lock className="h-8 w-8" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold block">
            Access Restricted
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Verified Registration Required</h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
            In accordance with Skaleathon rules, only squads with a confirmed ₹99 registration pass are authorized to submit stage deliverables.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <button
            onClick={() => router.push('/register')}
            className="rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-7 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
          >
            Complete ₹99 Team Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-14 pb-24 text-neutral-200">
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
          <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
            DELIVER
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c19a88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c19a88]" />
            </span>
            <span className="text-[#c19a88]">Milestone Artifacts // Deliverables Portal</span>
            {team && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-neutral-400">
                  Squad: <strong className="text-white font-semibold">{team.name}</strong>
                </span>
              </>
            )}
            {track && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-[#e8c5b4] font-semibold">
                  [{track.slug.toUpperCase()}]
                </span>
              </>
            )}
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Overview</span>
            </Link>

            <span className="text-white/15">|</span>

            <Link
              href="/dashboard/stages"
              className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
            >
              <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage Roadmap</span>
              <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Headline & Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-5 pb-9">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            Milestone{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              Deliverables
            </span>
          </h1>

          <p className="border-l-2 border-[#c19a88]/45 pl-4 text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
            Stage 02 (Idea &amp; Architecture PPT) and Stage 03 (Working Prototype &amp; GitHub Repository) occur on separate competition dates. Each phase features its own independent submission window below.
          </p>
        </div>

        {/* Full-Width 4-Column Editorial Section Index Bar with Transition */}
        <EditorialIndexBar
          layoutIdPrefix="submissionIndex"
          activeId={activeSection}
          onSelectItem={(sec) => {
            if (sec.id && sec.id !== 'rubric') {
              setActiveSection(sec.id as 'stage2' | 'stage3' | 'guidelines');
            }
          }}
          items={[
            { id: 'stage2', href: '#stage-02', num: '01', label: 'Stage 02: Architecture PDF' },
            { id: 'stage3', href: '#stage-03', num: '02', label: 'Stage 03: Prototype & Code' },
            { id: 'guidelines', href: '#guidelines', num: '03', label: 'Submission Protocol' },
            { id: 'rubric', href: '/dashboard/track#rubric', num: '04', label: 'Jury Rubric' },
          ]}
        />
      </header>

      {/* 2. Section 01: STAGE 02 — ARCHITECTURE PRESENTATION (PDF) */}
      <form
        id="stage-02"
        onSubmit={handleStage2Submit}
        className="space-y-8 scroll-mt-28"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              01 // Stage 02 Blueprint • Jan 10–14, 2028
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Idea &amp; Architecture{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Presentation (PDF)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {stage2WindowOpen ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>WINDOW OPEN</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400/90">
                <Lock className="h-3.5 w-3.5" />
                <span>OPENS ON STAGE 02 DATE</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
          {/* Pillar 01: Blueprint Specs */}
          <div className="relative pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                Pillar 01 • Required Slide Deck Scope
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              10-Slide System Architecture Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Export your presentation as a PDF (maximum 10 slides) covering your self-defined problem statement, high-level system architecture, database schema, and API/AI integrations.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono text-neutral-300">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                Problem &amp; Domain Fit
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                Architecture Diagram
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                Schema &amp; Data Flow
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
                Max 10 PDF Slides
              </span>
            </div>
          </div>

          {/* Pillar 02: Submission Field */}
          <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                Pillar 02 • PDF Deck URL
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Presentation PDF Link (Google Drive / Dropbox / Canva)</span>
                <span className="text-[10px] font-mono text-[#c19a88] font-normal">Public View</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={presentationUrl}
                  disabled={!stage2WindowOpen}
                  onChange={(e) => setPresentationUrl(e.target.value)}
                  placeholder={
                    stage2WindowOpen
                      ? 'https://drive.google.com/file/d/.../view'
                      : 'Accepted when Stage 02 window opens'
                  }
                  className="w-full border-b border-white/20 bg-transparent py-2.5 pr-8 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#c19a88] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                />
                {presentationUrl && stage2WindowOpen && (
                  <a
                    href={presentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    title="Preview link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 font-light">
                Ensure link sharing permission is set to &ldquo;Anyone with the link can view&rdquo;.
              </p>
            </div>

            {stage2Error && (
              <div className="border-l-2 border-red-400 pl-3 py-1 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>{stage2Error}</span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              {stage2Success ? (
                <span className="text-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Stage 02 PPT submitted!
                </span>
              ) : (
                <span className="text-[11px] font-mono text-neutral-500">
                  {stage2WindowOpen ? 'Ready for submission' : 'Scheduled for Stage 02 window'}
                </span>
              )}

              {stage2WindowOpen ? (
                <button
                  type="submit"
                  disabled={stage2Saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{stage2Saving ? 'Submitting...' : 'Submit Stage 02 PPT'}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Unlocks on Stage 02 Date</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* 3. Section 02: STAGE 03 — PROJECT PROTOTYPE & CODEBASE */}
      <form
        id="stage-03"
        onSubmit={handleStage3Submit}
        className="space-y-8 pt-10 border-t border-white/[0.08] scroll-mt-28"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              02 // Stage 03 Build Sprint • Jan 16–25, 2028
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Working Prototype &amp;{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Codebase Links
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {stage3WindowOpen ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>WINDOW OPEN</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400/90">
                <Lock className="h-3.5 w-3.5" />
                <span>OPENS ON STAGE 03 DATE</span>
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {/* Row 01: Live URL */}
          <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#c19a88]">01</span>
                <Globe className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Live Production Prototype URL</span>
              </div>
              <p className="text-xs text-neutral-400 font-light pl-6">
                Deployed cloud application (Vercel, Railway, Render, AWS, or APK/TestFlight).
              </p>
            </div>
            <div className="md:col-span-7">
              <input
                type="url"
                value={liveDemoUrl}
                disabled={!stage3WindowOpen}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder={
                  stage3WindowOpen
                    ? 'https://your-project.vercel.app'
                    : 'Stage 03 prototype URL will be accepted during the build sprint'
                }
                className="w-full border-b border-white/20 bg-transparent py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#c19a88] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Row 02: GitHub URL */}
          <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#c19a88]">02</span>
                <Github className="h-4 w-4 text-[#c19a88]" />
                <span className="text-sm font-bold text-white">Public GitHub Repository</span>
              </div>
              <p className="text-xs text-neutral-400 font-light pl-6">
                Source code repository with a documented README and clean commit history.
              </p>
            </div>
            <div className="md:col-span-7">
              <input
                type="url"
                value={githubUrl}
                disabled={!stage3WindowOpen}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder={
                  stage3WindowOpen
                    ? 'https://github.com/organization/repository'
                    : 'Stage 03 GitHub URL will be accepted during the build sprint'
                }
                className="w-full border-b border-white/20 bg-transparent py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#c19a88] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Row 03: Demo Video */}
          <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#c19a88]">03</span>
                <Video className="h-4 w-4 text-[#e8c5b4]" />
                <span className="text-sm font-bold text-white">Video Walkthrough (Optional)</span>
              </div>
              <p className="text-xs text-neutral-400 font-light pl-6">
                2–3 minute YouTube or Loom walkthrough demonstrating real-time execution.
              </p>
            </div>
            <div className="md:col-span-7">
              <input
                type="url"
                value={demoVideoUrl}
                disabled={!stage3WindowOpen}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder={
                  stage3WindowOpen
                    ? 'https://youtu.be/... or https://loom.com/share/...'
                    : 'Optional video walkthrough URL accepted during Stage 03'
                }
                className="w-full border-b border-white/20 bg-transparent py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#c19a88] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>
          </div>
        </div>

        {stage3Error && (
          <div className="border-l-2 border-red-400 pl-3 py-1 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span>{stage3Error}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {stage3Success ? (
            <span className="text-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Stage 03 prototype links submitted!
            </span>
          ) : (
            <span className="text-xs text-neutral-400 font-light">
              Both mandatory links (GitHub &amp; Live Prototype) can be updated anytime while the Stage 03 window is active.
            </span>
          )}

          {stage3WindowOpen ? (
            <button
              type="submit"
              disabled={stage3Saving}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{stage3Saving ? 'Submitting...' : 'Submit Stage 03 Deliverables'}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <Clock className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Unlocks on Stage 03 Sprint Date</span>
            </span>
          )}
        </div>
      </form>

      {/* 4. Section 03: Submission Protocol & Guidelines */}
      <section id="guidelines" className="space-y-6 pt-10 border-t border-white/[0.08] scroll-mt-28">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
            03 // Verification Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Submission Protocol &amp;{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              Guidelines
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 border-t border-white/[0.08]">
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
                Independent Windows
              </span>
              <span className="font-mono text-xl font-light text-white/10">01</span>
            </div>
            <h3 className="text-base font-bold text-white">Sequential Checkpoints</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Stage 02 (Architecture PDF) and Stage 03 (Prototype &amp; Codebase) are evaluated in sequence on separate dates. You do not submit both at once.
            </p>
          </div>

          <div className="pt-4 md:border-l md:border-white/[0.08] md:pl-8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#e8c5b4] font-bold">
                Access Permissions
              </span>
              <span className="font-mono text-xl font-light text-white/10">02</span>
            </div>
            <h3 className="text-base font-bold text-white">Public Jury Visibility</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Ensure all links (Google Drive PDF, GitHub repository, and cloud deployment) are publicly accessible without login walls for jury review.
            </p>
          </div>

          <div className="pt-4 md:border-l md:border-white/[0.08] md:pl-8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-400 font-bold">
                Code Authenticity
              </span>
              <span className="font-mono text-xl font-light text-white/10">03</span>
            </div>
            <h3 className="text-base font-bold text-white">Sprint Commit History</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Repositories must maintain a clean commit history authored during the official sprint window along with a clear setup README.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
