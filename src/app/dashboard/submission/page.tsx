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
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

export default function SubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [track, setTrack] = useState<EventTrack | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(true);

  // Form Fields for the two submissions
  const [presentationUrl, setPresentationUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/submissions').then((r) => r.json()),
      fetch('/api/event').then((r) => r.json()),
    ])
      .then(([subData, eventData]) => {
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
          // Pre-populate with saved draft in localStorage if available
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Store snapshot in localStorage for persistent client recall
      localStorage.setItem(
        'skaleathon_submission_draft',
        JSON.stringify({
          presentationUrl,
          liveDemoUrl,
          githubUrl,
          demoVideoUrl,
          updatedAt: new Date().toISOString(),
        })
      );

      // Attempt to save to API if submission endpoint is active
      try {
        await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${team?.name || 'Squad'} Deliverable`,
            track_id: team?.track_id || track?.id || 'ai-ml',
            problem_statement: 'Participant submission deliverable link repository for Skaleathon 2027.',
            solution_overview: 'Working architecture PPT and prototype links.',
            description: 'Submission links recorded via participant dashboard.',
            tech_stack: [track?.name || 'Full Stack'],
            presentation_url: presentationUrl,
            live_demo_url: liveDemoUrl,
            github_url: githubUrl,
            demoVideoUrl: demoVideoUrl,
            isDraft: true,
          }),
        });
      } catch {
        // Backend API window may be locked; local draft persists safely
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSaving(false);
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
      {/* 1. Sleek, Unconfusing Header */}
      <div className="space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#e8c5b4] mb-2">
            <Sparkles className="h-3 w-3 text-[#c19a88]" />
            <span>Deliverables Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submissions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-light leading-relaxed">
            Submit your Stage 02 Architecture Presentation (PDF) and Stage 03 Working Project & Prototype Links below.
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* SUBMISSION 1: PDF Slide Deck (Stage 02) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] shadow-md">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c19a88]">
                    Stage 02 Deliverable
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-neutral-300">
                    PDF Document
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Idea & Architecture Presentation (PDF)
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Submit your team&apos;s architecture slide deck exported in <strong>PDF format (max 10 slides)</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
                <span>Problem Statement & Proposed Solution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
                <span>System Architecture & Data Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
                <span>Database Schema & API / AI Models</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88] shrink-0" />
                <span>Slide deck limit: Maximum 10 slides</span>
              </div>
            </div>
          </div>

          {/* PDF Link Input Field */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Presentation PDF Link (Google Drive / Dropbox / Canva)</span>
              <span className="text-[10px] font-mono text-[#c19a88] font-normal">Public View Link</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={presentationUrl}
                onChange={(e) => setPresentationUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view or Dropbox link"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors"
              />
              {presentationUrl && (
                <a
                  href={presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-neutral-400">
              Please ensure sharing permissions are set to <strong>&ldquo;Anyone with the link can view&rdquo;</strong> so judges can access the PDF.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBMISSION 2: Project & Prototype Links (Stage 03) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] shadow-md">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c19a88]">
                    Stage 03 Deliverable
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-neutral-300">
                    Prototype & Codebase
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Project & Prototype Links
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Submit your live working software prototype URL, public GitHub repository, and optional video demo link.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* 1. Live Prototype URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Working Prototype / Live URL</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-normal">Live Cloud Deployment</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://your-app.vercel.app or https://your-demo-url.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors"
                />
                {liveDemoUrl && (
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
                  <span className="text-[#c19a88]">*</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 font-normal">Source Code</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/organization-or-user/repository"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors"
                />
                {githubUrl && (
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
                Ensure repository is public with an informative README, architecture overview, and clean commit history.
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
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:bg-white/[0.05] focus:outline-none transition-colors"
                />
                {demoVideoUrl && (
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
                A video walkthrough is not mandatory, but gives your team a distinct evaluation advantage during blind jury scoring.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTION / SAVE BAR */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0E0E0E]/95">
          <div className="text-xs text-neutral-400 text-center sm:text-left">
            {saveSuccess ? (
              <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Submission links saved successfully!
              </span>
            ) : (
              <span>You can update and refine your links anytime before the official round deadline.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Links...' : 'Save Submission Links'}</span>
          </button>
        </div>
      </form>

      {/* 3. Simple, Non-Confusing Quick Tips */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 space-y-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <HelpCircle className="h-4 w-4 text-[#c19a88]" />
          <span>Submission Checklist</span>
        </div>
        <ul className="space-y-1.5 text-[11px] list-disc list-inside">
          <li><strong>PDF Deck:</strong> Maximum 10 slides covering problem statement, system architecture, database schema, and roadmap.</li>
          <li><strong>Prototype Link:</strong> Deployed live demo URL (Vercel, Netlify, Railway, or AWS) accessible without login credentials.</li>
          <li><strong>GitHub Repository:</strong> Public code repository with clear documentation and instructions to run locally.</li>
        </ul>
      </div>
    </div>
  );
}
