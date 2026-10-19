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
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

export default function SubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [track, setTrack] = useState<EventTrack | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(true);

  // Independent window controls for Stage 02 and Stage 03
  // Submissions will open on their respective defined competition dates
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
        // Event lifecycle status activates windows on defined dates
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
          // Check local draft cache
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

  // Handler for Stage 02 PPT Submission (submitted on Stage 02 dates)
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

  // Handler for Stage 03 Prototype & Codebase Submission (submitted on Stage 03 dates)
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
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-16 text-center space-y-3 backdrop-blur-xl">
        <div className="h-8 w-8 mx-auto rounded-full border-2 border-[#c19a88] border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-400 font-mono tracking-wider">Loading submission portal...</p>
      </div>
    );
  }

  // If unpaid, display registration requirement
  if (!isPaid) {
    return (
      <div className="rounded-3xl border border-[#c19a88]/30 bg-gradient-to-b from-[#181310] to-[#0A0A0A] p-8 sm:p-12 text-center space-y-5 shadow-2xl max-w-2xl mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] mx-auto shadow-lg shadow-[#805948]/20">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black text-white">Verified Registration Required</h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            In accordance with Skaleathon 2027 rules, only teams with confirmed ₹99 registration fee are authorized to submit deliverables.
          </p>
        </div>
        <button
          onClick={() => router.push('/register')}
          className="rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
        >
          Complete ₹99 Team Registration
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* 1. Header */}
      <div className="space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#e8c5b4] mb-2">
            <Sparkles className="h-3 w-3 text-[#c19a88]" />
            <span>Independent Stage Deliverables</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submissions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-light leading-relaxed">
            The Idea &amp; Architecture PPT (Stage 02) and the Prototype Links (Stage 03) will be submitted on their respective scheduled dates.
          </p>
        </div>

        {team && (
          <div className="mt-4 sm:mt-0 inline-flex flex-col items-center sm:items-end gap-1 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.02]">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Submitting as</span>
            <span className="text-xs font-bold text-white">{team.name}</span>
            {track && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#e8c5b4]">
                {track.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Timeline Alert Clarifying Separate Dates */}
      <div className="rounded-2xl border border-[#c19a88]/20 bg-[#c19a88]/[0.03] p-4 sm:p-5 flex items-start gap-3.5 backdrop-blur-md">
        <div className="p-2 rounded-xl bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#e8c5b4] shrink-0 mt-0.5">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-bold text-white uppercase font-mono tracking-wider text-[10px]">
            Separate Submission Schedules
          </span>
          <p className="text-neutral-300 leading-relaxed font-light">
            <strong>Stage 02 (PPT Submission)</strong> and <strong>Stage 03 (Project Prototype Submission)</strong> occur on different dates. Each stage has its own independent submission window and submit action below.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: STAGE 02 — ARCHITECTURE PRESENTATION (PDF) */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleStage2Submit}
        className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c19a88]">
                  Stage 02 • Ideation &amp; Blueprint
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-neutral-300">
                  PDF Deck
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                1. Idea &amp; Architecture Presentation (PDF)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {stage2WindowOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium">
                <CheckCircle2 className="h-3 w-3" />
                <span>Window Open</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-mono font-medium">
                <Lock className="h-3 w-3" />
                <span>Stage 02 Opens on Defined Date</span>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Submitted during <strong>Stage 02</strong>. Submit your team&apos;s architectural presentation deck exported as a <strong>PDF (maximum 10 slides)</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
              <span>Problem Statement &amp; Solution Overview</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
              <span>System Architecture &amp; Data Flow Diagram</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
              <span>Database Schema &amp; Key API / AI Integrations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
              <span>Slide Deck Length: Max 10 slides</span>
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-white flex items-center justify-between">
            <span>Presentation PDF Link (Google Drive / Dropbox / Canva)</span>
            <span className="text-[10px] font-mono text-[#c19a88] font-normal">Public View Link</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={presentationUrl}
              disabled={!stage2WindowOpen}
              onChange={(e) => setPresentationUrl(e.target.value)}
              placeholder={
                stage2WindowOpen
                  ? 'https://drive.google.com/file/d/.../view or Dropbox link'
                  : 'Stage 02 PPT link will be accepted on the scheduled Stage 02 date'
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {presentationUrl && stage2WindowOpen && (
              <a
                href={presentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                title="Preview link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-[10px] text-neutral-400">
            Ensure sharing permission is set to <strong>&ldquo;Anyone with link can view&rdquo;</strong> for jury evaluation.
          </p>
        </div>

        {stage2Error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{stage2Error}</span>
          </div>
        )}

        {/* Stage 02 Independent Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          <div className="text-xs text-neutral-400">
            {stage2Success ? (
              <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Stage 02 PPT submitted successfully!
              </span>
            ) : stage2WindowOpen ? (
              <span>Stage 02 portal is active. You can submit or update your PPT link.</span>
            ) : (
              <span className="text-amber-400/90 font-mono text-[11px] inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Stage 02 PPT submission opens on the defined checkpoint date.
              </span>
            )}
          </div>

          {stage2WindowOpen ? (
            <button
              type="submit"
              disabled={stage2Saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{stage2Saving ? 'Submitting PPT...' : 'Submit Stage 02 PPT'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-xs font-semibold text-neutral-400 cursor-not-allowed select-none shadow-inner"
            >
              <Lock className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage 02 Opens on Defined Date</span>
            </button>
          )}
        </div>
      </form>

      {/* ========================================================================= */}
      {/* SECTION 2: STAGE 03 — PROJECT PROTOTYPE & CODEBASE */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleStage3Submit}
        className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c19a88]">
                  Stage 03 • Engineering Sprint
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-neutral-300">
                  Live Prototype &amp; Code
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                2. Project &amp; Prototype Links
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {stage3WindowOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium">
                <CheckCircle2 className="h-3 w-3" />
                <span>Window Open</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-mono font-medium">
                <Lock className="h-3 w-3" />
                <span>Stage 03 Opens on Defined Date</span>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Submitted during <strong>Stage 03</strong> build sprint. Submit your live deployed prototype link, public GitHub repository, and optional demo video.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {/* 1. Working Prototype / Live URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Working Prototype / Live Deployed URL</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-normal">Live Cloud Deployment</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={liveDemoUrl}
                disabled={!stage3WindowOpen}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder={
                  stage3WindowOpen
                    ? 'https://your-app.vercel.app or https://your-demo-url.com'
                    : 'Stage 03 prototype link will be accepted on the scheduled Stage 03 date'
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {liveDemoUrl && stage3WindowOpen && (
                <a
                  href={liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Open live prototype"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-neutral-400">
              Working URLs hosted on Vercel, Netlify, Railway, or AWS receive bonus technical execution marks from judges.
            </p>
          </div>

          {/* 2. Public GitHub Repository */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Public GitHub Repository URL</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 font-normal">Source Code</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={githubUrl}
                disabled={!stage3WindowOpen}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder={
                  stage3WindowOpen
                    ? 'https://github.com/organization-or-user/repository'
                    : 'Stage 03 GitHub link will be accepted on the scheduled Stage 03 date'
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {githubUrl && stage3WindowOpen && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Open repository"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-neutral-400">
              Ensure repository is public with an informative README and clean commit history.
            </p>
          </div>

          {/* 3. Demo Video Link (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>2–3 Min Video Walkthrough (Optional)</span>
              </div>
              <span className="text-[10px] font-mono text-[#c19a88] font-normal">Evaluation Advantage</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={demoVideoUrl}
                disabled={!stage3WindowOpen}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder={
                  stage3WindowOpen
                    ? 'https://youtube.com/watch?v=... or https://loom.com/share/...'
                    : 'Stage 03 video walkthrough link will be accepted on the scheduled Stage 03 date'
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {demoVideoUrl && stage3WindowOpen && (
                <a
                  href={demoVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Open video"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-neutral-400">
              A video walkthrough is not mandatory, but gives your team an evaluation advantage during scoring.
            </p>
          </div>
        </div>

        {stage3Error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{stage3Error}</span>
          </div>
        )}

        {/* Stage 03 Independent Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          <div className="text-xs text-neutral-400">
            {stage3Success ? (
              <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Stage 03 prototype links submitted successfully!
              </span>
            ) : stage3WindowOpen ? (
              <span>Stage 03 portal is active. You can submit or update your prototype links.</span>
            ) : (
              <span className="text-amber-400/90 font-mono text-[11px] inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Stage 03 Prototype submission opens on the defined sprint date.
              </span>
            )}
          </div>

          {stage3WindowOpen ? (
            <button
              type="submit"
              disabled={stage3Saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{stage3Saving ? 'Submitting Links...' : 'Submit Stage 03 Prototype Links'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-xs font-semibold text-neutral-400 cursor-not-allowed select-none shadow-inner"
            >
              <Lock className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Stage 03 Opens on Defined Date</span>
            </button>
          )}
        </div>
      </form>

      {/* 3. Non-Confusing Quick Tips */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 space-y-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <HelpCircle className="h-4 w-4 text-[#c19a88]" />
          <span>Stage Submission Guidelines</span>
        </div>
        <ul className="space-y-1.5 text-[11px] list-disc list-inside">
          <li><strong>Different Deadlines:</strong> Stage 02 (PPT deck) and Stage 03 (working prototype &amp; codebase) are evaluated in sequence on separate dates.</li>
          <li><strong>Independent Submissions:</strong> You do not need to submit both at the same time; each stage submission operates on its own schedule.</li>
          <li><strong>Public Permissions:</strong> Ensure all links (Google Drive, live cloud prototype, GitHub) are set to public view for the judges.</li>
        </ul>
      </div>
    </div>
  );
}
