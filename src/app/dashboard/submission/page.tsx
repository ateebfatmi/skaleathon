'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Github,
  Globe,
  Video,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

export default function SubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [team, setTeam] = useState<any>(null);
  const [tracks, setTracks] = useState<EventTrack[]>([]);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [trackId, setTrackId] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solutionOverview, setSolutionOverview] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [presentationUrl, setPresentationUrl] = useState('');
  const [memberContributions, setMemberContributions] = useState('');
  const [aiToolDisclosure, setAiToolDisclosure] = useState('');
  const [status, setStatus] = useState<string>('draft');
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current submission and event data
    Promise.all([
      fetch('/api/submissions').then((r) => r.json()),
      fetch('/api/event').then((r) => r.json()),
    ])
      .then(([subData, eventData]) => {
        if (eventData.tracks) {
          setTracks(eventData.tracks);
        }

        if (subData.team) {
          setTeam(subData.team);
          setIsPaid(subData.team.status === 'paid');
          setTrackId(subData.team.track_id || eventData.tracks[0]?.id || '');
        }

        if (subData.submission) {
          const s = subData.submission;
          setTitle(s.title || '');
          setTrackId(s.track_id || '');
          setProblemStatement(s.problem_statement || '');
          setSolutionOverview(s.solution_overview || '');
          setDescription(s.description || '');
          setTechStack(s.tech_stack || []);
          setGithubUrl(s.github_url || '');
          setLiveDemoUrl(s.live_demo_url || '');
          setDemoVideoUrl(s.demo_video_url || '');
          setPresentationUrl(s.presentation_url || '');
          setMemberContributions(s.member_contributions || '');
          setAiToolDisclosure(s.ai_tool_disclosure || '');
          setStatus(s.status || 'draft');
          setSubmittedAt(s.submitted_at);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addTechTag = () => {
    if (techStackInput.trim() && !techStack.includes(techStackInput.trim())) {
      setTechStack([...techStack, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const removeTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        title,
        track_id: trackId,
        problem_statement: problemStatement,
        solution_overview: solutionOverview,
        description,
        tech_stack: techStack.length > 0 ? techStack : ['Next.js'],
        github_url: githubUrl,
        live_demo_url: liveDemoUrl || undefined,
        demo_video_url: demoVideoUrl || undefined,
        presentation_url: presentationUrl || undefined,
        member_contributions: memberContributions || undefined,
        ai_tool_disclosure: aiToolDisclosure || undefined,
        isDraft,
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save submission');
      }

      setStatus(data.submission.status);
      setSubmittedAt(data.submission.submitted_at);
      setSuccessMsg(data.message);

      if (!isDraft) {
        router.push('/dashboard/submission/status');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-12 text-center text-xs text-slate-400">
        Loading submission details...
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-8 sm:p-12 text-center space-y-4">
        <Lock className="h-10 w-10 text-yellow-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Verified Registration Fee Required</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          In accordance with competition rules, only teams with confirmed ₹99 registration payment are authorized to submit projects for technical judging.
        </p>
        <button
          onClick={() => router.push('/register')}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
        >
          Complete ₹99 Payment Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
              Technical Deliverable Submission
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Project Submission</h1>
            <p className="text-xs text-slate-400 mt-1">
              Team: <strong className="text-slate-200">{team?.name}</strong> • Current Status:{' '}
              <span
                className={`font-semibold ${
                  status === 'submitted' ? 'text-emerald-400' : 'text-yellow-400'
                }`}
              >
                {status.toUpperCase()}
              </span>
            </p>
          </div>

          {submittedAt && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Last Submitted</span>
              <span className="text-xs font-mono text-slate-300">
                {new Date(submittedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Submission Form */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Omniscience: Autonomous Agentic Security Scanner"
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Competition Track <span className="text-red-400">*</span>
            </label>
            <select
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Core Tech Stack (Press Enter or Add) <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechTag();
                  }
                }}
                placeholder="e.g. Next.js, PyTorch, Supabase"
                className="flex-1 rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addTechTag}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/20 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {techStack.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-cyanAccent-300 font-mono"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTechTag(tag)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Statement & Solution Overview */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Problem Statement <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="What core problem does your project solve? Who is the target user and why is this critical?"
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Solution Overview <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={solutionOverview}
              onChange={(e) => setSolutionOverview(e.target.value)}
              placeholder="Describe your architectural approach and how your system works end-to-end..."
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              In-Depth Project Description & Features <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed feature breakdown, technical challenges overcome, security considerations, and future scalability..."
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Deliverable URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Github className="h-4 w-4" />
              <span>Public GitHub Repository URL <span className="text-red-400">*</span></span>
            </label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/organization/repo"
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-cyanAccent-400" />
              <span>Live Deployed URL <span className="text-slate-400">(Optional)</span></span>
            </label>
            <input
              type="url"
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
              placeholder="https://your-demo.vercel.app"
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-amber-400" />
              <span>Demo Video Walkthrough (2-3 min) <span className="text-slate-400">(Optional)</span></span>
            </label>
            <input
              type="url"
              value={demoVideoUrl}
              onChange={(e) => setDemoVideoUrl(e.target.value)}
              placeholder="https://youtu.be/... or Loom URL"
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-brand-400" />
              <span>Presentation / Slide Deck URL <span className="text-slate-400">(Optional)</span></span>
            </label>
            <input
              type="url"
              value={presentationUrl}
              onChange={(e) => setPresentationUrl(e.target.value)}
              placeholder="https://docs.google.com/presentation/..."
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Disclosures */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Member Contributions Breakdown
            </label>
            <textarea
              rows={2}
              value={memberContributions}
              onChange={(e) => setMemberContributions(e.target.value)}
              placeholder="Briefly state who built what (e.g. John: Backend API & DB, Sarah: Frontend UI)..."
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyanAccent-400" />
              <span>Generative AI Tool Usage Disclosure (Required if used)</span>
            </label>
            <textarea
              rows={2}
              value={aiToolDisclosure}
              onChange={(e) => setAiToolDisclosure(e.target.value)}
              placeholder="Detail any AI tools used (e.g. GitHub Copilot for boilerplate, Claude for prompt design)..."
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Draft Snapshot'}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 transition-all"
          >
            <Send className="h-4 w-4" />
            <span>{saving ? 'Submitting Project...' : 'Submit Project For Evaluation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
