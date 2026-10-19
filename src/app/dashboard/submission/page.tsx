'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Save,
  Award,
  Layers,
  Code2,
  Check,
  X,
  Play,
  RotateCcw,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

// Popular tech stack recommendations for quick-adding
const POPULAR_TECH_STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'Python',
  'FastAPI',
  'PyTorch',
  'Supabase',
  'PostgreSQL',
  'Tailwind CSS',
  'Docker',
  'OpenAI API',
  'LangChain',
  'Node.js',
  'Flutter',
  'AWS',
];

// Official Evaluation Rubric Criteria
const JUDGING_CRITERIA = [
  {
    name: 'Innovation & Originality',
    weight: '25%',
    description: 'Novelty of approach, uniqueness of solution, and creative problem-solving.',
    tip: 'Highlight what makes your solution distinctly superior to existing tools.',
  },
  {
    name: 'Technical Architecture & Complexity',
    weight: '25%',
    description: 'Clean system design, data flow, scalability, resilience, and engineering rigor.',
    tip: 'Detail database choices, API design, and asynchronous or ML pipelines.',
  },
  {
    name: 'Execution & Working Deliverable',
    weight: '20%',
    description: 'A functioning prototype or codebase free of fatal crashes, with a solid README.',
    tip: 'Ensure the GitHub repository has clear setup instructions and environment variables.',
  },
  {
    name: 'UI/UX & Product Polish',
    weight: '15%',
    description: 'Intuitive user interface, visual aesthetics, accessibility, and delight factor.',
    tip: 'Share screenshot walkthroughs or a deployed live demo URL for maximum score.',
  },
  {
    name: 'Presentation & Video Walkthrough',
    weight: '15%',
    description: 'Clarity of the 2-3 minute demonstration, pitch quality, and articulated value.',
    tip: 'Keep demo video concise: Problem (30s) → Solution Demo (90s) → Future Roadmap (30s).',
  },
];

// Helper to extract embeddable video URL (YouTube or Loom)
function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube match: youtube.com/watch?v=... or youtu.be/... or youtube.com/embed/...
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }

  // Loom match: loom.com/share/... or loom.com/embed/...
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  return null;
}

// Helper to validate and parse GitHub repo
function parseGithubUrl(url: string): { valid: boolean; repoName?: string } {
  if (!url) return { valid: false };
  const trimmed = url.trim();
  const match = trimmed.match(/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/i);
  if (match && match[1]) {
    return { valid: true, repoName: match[1].replace(/\.git$/, '') };
  }
  return { valid: false };
}

export default function SubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [team, setTeam] = useState<any>(null);
  const [tracks, setTracks] = useState<EventTrack[]>([]);
  const [isPaid, setIsPaid] = useState<boolean>(true);

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

  // UI enhancement states
  const [showRubric, setShowRubric] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);

  // Fetch initial submission & event data
  useEffect(() => {
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
          setIsPaid(subData.team.status === 'paid' || subData.team.status === 'confirmed');
          setTrackId(subData.team.track_id || eventData.tracks?.[0]?.id || '');
        }

        if (subData.submission) {
          const s = subData.submission;
          setTitle(s.title || '');
          setTrackId(s.track_id || subData.team?.track_id || '');
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
        } else {
          // Check local storage backup if never saved on server
          try {
            const cached = localStorage.getItem('skaleathon_submission_draft');
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed.title) setTitle(parsed.title);
              if (parsed.problemStatement) setProblemStatement(parsed.problemStatement);
              if (parsed.solutionOverview) setSolutionOverview(parsed.solutionOverview);
              if (parsed.description) setDescription(parsed.description);
              if (parsed.techStack?.length) setTechStack(parsed.techStack);
              if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
              if (parsed.liveDemoUrl) setLiveDemoUrl(parsed.liveDemoUrl);
              if (parsed.demoVideoUrl) setDemoVideoUrl(parsed.demoVideoUrl);
              if (parsed.presentationUrl) setPresentationUrl(parsed.presentationUrl);
              if (parsed.memberContributions) setMemberContributions(parsed.memberContributions);
              if (parsed.aiToolDisclosure) setAiToolDisclosure(parsed.aiToolDisclosure);
              setLastAutoSaved('Restored from browser draft');
            }
          } catch (_) {}
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Auto-save draft locally to prevent loss
  useEffect(() => {
    if (!title && !problemStatement && !solutionOverview) return;
    const timeout = setTimeout(() => {
      try {
        const payload = {
          title,
          trackId,
          problemStatement,
          solutionOverview,
          description,
          techStack,
          githubUrl,
          liveDemoUrl,
          demoVideoUrl,
          presentationUrl,
          memberContributions,
          aiToolDisclosure,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('skaleathon_submission_draft', JSON.stringify(payload));
        setLastAutoSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (_) {}
    }, 1500);

    return () => clearTimeout(timeout);
  }, [
    title,
    trackId,
    problemStatement,
    solutionOverview,
    description,
    techStack,
    githubUrl,
    liveDemoUrl,
    demoVideoUrl,
    presentationUrl,
    memberContributions,
    aiToolDisclosure,
  ]);

  // Tech stack tag management
  const addTechTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || techStackInput).trim();
    if (tag && !techStack.includes(tag)) {
      setTechStack([...techStack, tag]);
      if (!tagToAdd) setTechStackInput('');
    }
  };

  const removeTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const togglePopularTech = (tag: string) => {
    if (techStack.includes(tag)) {
      removeTechTag(tag);
    } else {
      addTechTag(tag);
    }
  };

  // Video embed preview
  const embedVideoUrl = useMemo(() => getEmbedVideoUrl(demoVideoUrl), [demoVideoUrl]);
  const parsedGithub = useMemo(() => parseGithubUrl(githubUrl), [githubUrl]);

  // Submission Readiness Score Calculation
  const readiness = useMemo(() => {
    const checks = [
      { id: 'title', label: 'Project Title', valid: title.trim().length >= 3, weight: 15 },
      { id: 'track', label: 'Competition Track', valid: Boolean(trackId), weight: 10 },
      { id: 'tech', label: 'Tech Stack (min 1)', valid: techStack.length >= 1, weight: 10 },
      { id: 'problem', label: 'Problem Statement (≥20 chars)', valid: problemStatement.trim().length >= 20, weight: 15 },
      { id: 'solution', label: 'Solution Architecture (≥30 chars)', valid: solutionOverview.trim().length >= 30, weight: 15 },
      { id: 'desc', label: 'Detailed Features (≥30 chars)', valid: description.trim().length >= 30, weight: 15 },
      { id: 'github', label: 'Valid GitHub Repository', valid: parsedGithub.valid, weight: 20 },
    ];

    const bonusChecks = [
      { id: 'demo', label: 'Live Working Demo', valid: Boolean(liveDemoUrl?.trim()) },
      { id: 'video', label: 'Walkthrough Video', valid: Boolean(demoVideoUrl?.trim()) },
      { id: 'slides', label: 'Slide Deck / PDF', valid: Boolean(presentationUrl?.trim()) },
      { id: 'ai', label: 'AI Tool Disclosure', valid: Boolean(aiToolDisclosure?.trim()) },
    ];

    const earnedWeight = checks.reduce((sum, c) => (c.valid ? sum + c.weight : sum), 0);
    const bonusPoints = bonusChecks.filter((b) => b.valid).length * 5;
    const totalScore = Math.min(100, earnedWeight + bonusPoints);
    const allRequiredMet = checks.every((c) => c.valid);

    return {
      score: totalScore,
      checks,
      bonusChecks,
      allRequiredMet,
    };
  }, [
    title,
    trackId,
    techStack,
    problemStatement,
    solutionOverview,
    description,
    parsedGithub,
    liveDemoUrl,
    demoVideoUrl,
    presentationUrl,
    aiToolDisclosure,
  ]);

  // Handle Save (Draft or Final Submission)
  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    // Client validation for final submission
    if (!isDraft && !readiness.allRequiredMet) {
      setError('Please fulfill all mandatory technical deliverable fields marked with red asterisks (*).');
      setSaving(false);
      setShowConfirmModal(false);
      return;
    }

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
      setSuccessMsg(data.message || (isDraft ? 'Draft snapshot saved.' : 'Project submitted successfully!'));
      setShowConfirmModal(false);

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
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-16 text-center space-y-3 backdrop-blur-xl">
        <div className="h-8 w-8 mx-auto rounded-full border-2 border-[#c19a88] border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-400 font-mono tracking-wider">
          Retrieving project deliverables & repository telemetry...
        </p>
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="rounded-3xl border border-[#c19a88]/30 bg-gradient-to-b from-[#181310] to-[#0A0A0A] p-8 sm:p-12 text-center space-y-5 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/40 text-[#c19a88] mx-auto shadow-lg shadow-[#805948]/20">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88] font-bold">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black text-white">Verified Registration Fee Required</h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            In accordance with Skaleathon 2027 rules, only teams with confirmed ₹99 registration fee are authorized to submit project code and deliverables for judge evaluation.
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
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* 1. Header Card with Live Status & Telemetry */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#120F0D]/90 via-[#0B0C12]/90 to-[#120F0D]/90 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c19a88]/15 blur-3xl" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#e8c5b4]">
                <Sparkles className="h-3 w-3 text-[#c19a88]" />
                <span>Stage 03 • Deliverable Portal</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                  status === 'submitted'
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border border-amber-500/40 bg-amber-500/10 text-amber-300'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === 'submitted' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{status === 'submitted' ? 'Officially Submitted' : 'Draft In Progress'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Project Deliverable Submission
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400">
              Team: <strong className="text-white font-semibold">{team?.name || 'Registered Team'}</strong>
              {lastAutoSaved && (
                <span className="ml-3 text-[11px] font-mono text-neutral-400">
                  • Local draft auto-saved at {lastAutoSaved}
                </span>
              )}
            </p>
          </div>

          {/* Quick Action Cluster in Header */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowRubric(!showRubric)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-neutral-300 hover:border-[#c19a88]/40 hover:text-white transition-colors"
            >
              <Award className="h-4 w-4 text-[#c19a88]" />
              <span>Judging Rubric</span>
              {showRubric ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
            >
              <Save className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Submission Readiness Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-neutral-300 flex items-center gap-2">
              <span>Deliverable Readiness Score</span>
              <span className="text-[11px] font-mono text-[#c19a88]">({readiness.score}%)</span>
            </span>
            <span className="text-[11px] text-neutral-400">
              {readiness.allRequiredMet
                ? 'All mandatory requirements satisfied • Ready to lock'
                : 'Complete all mandatory criteria marked with red asterisk (*)'}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/[0.05]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${readiness.score}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                readiness.score >= 90
                  ? 'bg-gradient-to-r from-[#805948] via-[#c19a88] to-emerald-400'
                  : 'bg-gradient-to-r from-[#805948] to-[#c19a88]'
              }`}
            />
          </div>

          {/* Quick Item Check Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            {readiness.checks.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono ${
                  item.valid
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-white/[0.03] text-neutral-400 border border-white/[0.06]'
                }`}
              >
                {item.valid ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />}
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Collapsible Official Evaluation Rubric */}
        <AnimatePresence>
          {showRubric && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 pt-6 border-t border-white/[0.08] overflow-hidden space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c19a88]">
                    Official Skaleathon Judging Rubric (100% Total)
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Your submission will be evaluated by industry judges according to these 5 weighted criteria:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {JUDGING_CRITERIA.map((crit) => (
                  <div
                    key={crit.name}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{crit.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#c19a88]/15 text-[#e8c5b4] border border-[#c19a88]/30">
                        {crit.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">{crit.description}</p>
                    <div className="text-[10px] text-[#c19a88] pt-1 border-t border-white/[0.04]">
                      <strong>Tip:</strong> {crit.tip}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-950/20 p-4 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Main Submission Form */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E]/90 p-6 sm:p-8 space-y-8 backdrop-blur-xl shadow-2xl">
        
        {/* Section A: Project Core Details */}
        <div className="space-y-5">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c19a88] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span>1. Project Core Identity</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              The overarching identity and competition track for your engineering deliverable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Project Title <span className="text-[#c19a88] font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AgenticGuard: Autonomous Zero-Trust API Vulnerability Scanner"
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Competition Track <span className="text-[#c19a88] font-bold">*</span>
              </label>
              <select
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-xs text-white focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#141414] text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Core Tech Stack <span className="text-[#c19a88] font-bold">*</span>
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
                  placeholder="Type tech and press Enter..."
                  className="flex-1 rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => addTechTag()}
                  className="rounded-xl border border-[#c19a88]/40 bg-[#c19a88]/15 px-4 py-2 text-xs font-semibold text-[#e8c5b4] hover:bg-[#c19a88]/25 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Quick-select pills for tech stack */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] text-neutral-400 block">
              Suggested Technologies (Click to toggle):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TECH_STACK.map((tag) => {
                const isSelected = techStack.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePopularTech(tag)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all ${
                      isSelected
                        ? 'bg-[#c19a88] text-black font-bold shadow-[0_0_10px_rgba(193,154,136,0.3)]'
                        : 'bg-white/[0.04] text-neutral-400 border border-white/[0.07] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>

            {/* Selected Tags Display */}
            {techStack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/[0.05]">
                <span className="text-[11px] text-neutral-400 self-center">Selected Stack:</span>
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-[#c19a88]/40 text-xs font-mono text-[#e8c5b4]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTechTag(tag)}
                      className="text-neutral-400 hover:text-red-400 transition-colors ml-0.5"
                      title="Remove technology"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section B: Problem, Solution & Architecture */}
        <div className="space-y-5 pt-6 border-t border-white/[0.08]">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c19a88] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span>2. Architectural Breakdown & Description</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Clear articulation of the problem, technical architecture, and deep feature breakdown for the judges.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Problem Statement <span className="text-[#c19a88] font-bold">*</span>
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    problemStatement.length >= 20 ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                >
                  {problemStatement.length} / 3,000 chars (min 20)
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What core problem does your project solve? Who experiences this pain point, why have existing solutions failed, and why is solving it critical?"
                className="w-full rounded-xl border border-white/10 bg-[#141414] p-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Solution Architecture & Technical Overview <span className="text-[#c19a88] font-bold">*</span>
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    solutionOverview.length >= 30 ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                >
                  {solutionOverview.length} / 5,000 chars (min 30)
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={solutionOverview}
                onChange={(e) => setSolutionOverview(e.target.value)}
                placeholder="Explain the architectural approach: frontend framework, API layer, database schema, caching/queueing, and third-party integrations..."
                className="w-full rounded-xl border border-white/10 bg-[#141414] p-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  In-Depth Features, Technical Challenges & Scalability <span className="text-[#c19a88] font-bold">*</span>
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    description.length >= 30 ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                >
                  {description.length} / 8,000 chars (min 30)
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Elaborate on the key capabilities implemented during the hackathon, unexpected engineering hurdles overcome, benchmark results, security measures, and potential enterprise applications..."
                className="w-full rounded-xl border border-white/10 bg-[#141414] p-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section C: Technical Deliverables & Live URLs */}
        <div className="space-y-5 pt-6 border-t border-white/[0.08]">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c19a88] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span>3. Deliverable Links & Interactive Artifacts</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Public code repositories and interactive demonstration media.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* GitHub URL with Live Validation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Github className="h-4 w-4 text-[#c19a88]" />
                  <span>Public GitHub Repository <span className="text-[#c19a88] font-bold">*</span></span>
                </label>
                {parsedGithub.valid && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Valid repository
                  </span>
                )}
              </div>
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/organization/project-name"
                className={`w-full rounded-xl border px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all ${
                  parsedGithub.valid
                    ? 'border-emerald-500/40 bg-emerald-950/10 focus:border-emerald-500'
                    : 'border-white/10 bg-[#141414] focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40'
                }`}
              />
              {parsedGithub.valid && (
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#e8c5b4]">{parsedGithub.repoName}</span>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c19a88] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Inspect repo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Live Demo URL with direct tester */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-[#c19a88]" />
                  <span>Live Deployed Web URL <span className="text-neutral-400">(Optional)</span></span>
                </label>
                {liveDemoUrl && (
                  <a
                    href={liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#c19a88] hover:underline flex items-center gap-1"
                  >
                    <span>Test link</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://your-project.vercel.app"
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all"
              />
            </div>

            {/* Demo Video URL with Interactive Embedded Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-[#c19a88]" />
                  <span>2-3 Min Walkthrough Video <span className="text-neutral-400">(Optional)</span></span>
                </label>
                {embedVideoUrl && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Play className="h-2.5 w-2.5" /> Video detected
                  </span>
                )}
              </div>
              <input
                type="url"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder="YouTube or Loom video link (e.g. https://youtu.be/...)"
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all"
              />
            </div>

            {/* Slide Deck URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#c19a88]" />
                  <span>Slide Deck / Presentation URL <span className="text-neutral-400">(Optional)</span></span>
                </label>
                {presentationUrl && (
                  <a
                    href={presentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#c19a88] hover:underline flex items-center gap-1"
                  >
                    <span>Open deck</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={presentationUrl}
                onChange={(e) => setPresentationUrl(e.target.value)}
                placeholder="Google Slides, Canva, or Pitch link"
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Embedded Video Walkthrough Preview Player */}
          {embedVideoUrl && (
            <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Video Preview (Verify your video plays correctly)</span>
                </span>
                <span className="text-[10px] font-mono text-[#c19a88]">Embedded Player</span>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  src={embedVideoUrl}
                  title="Demo Video Walkthrough"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section D: Disclosures & Member Contributions */}
        <div className="space-y-5 pt-6 border-t border-white/[0.08]">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c19a88] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span>4. Team Contributions & Generative AI Disclosures</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Transparency ensures fair judging. Disclosing modern AI assistance (Copilot, Claude, GPT) is welcomed and does not penalize your score.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Member Contributions Breakdown
              </label>
              <textarea
                rows={2}
                value={memberContributions}
                onChange={(e) => setMemberContributions(e.target.value)}
                placeholder="e.g. Alice: System architecture & API, Bob: UI components & Tailwind, Charlie: Database optimization..."
                className="w-full rounded-xl border border-white/10 bg-[#141414] p-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Generative AI Tool Usage Disclosure</span>
              </label>
              <textarea
                rows={2}
                value={aiToolDisclosure}
                onChange={(e) => setAiToolDisclosure(e.target.value)}
                placeholder="Describe which AI models were utilized (e.g. GitHub Copilot for boilerplate, Claude for prompt design, Midjourney for assets)..."
                className="w-full rounded-xl border border-white/10 bg-[#141414] p-3 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/40 focus:outline-none transition-all leading-relaxed"
              />
              {/* Quick AI Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-neutral-400 self-center">Quick inserts:</span>
                {[
                  'GitHub Copilot for boilerplate code',
                  'Claude 3.5 Sonnet for architectural brainstorming',
                  'Custom fine-tuned HuggingFace models',
                  'None — 100% human-crafted',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (!aiToolDisclosure) setAiToolDisclosure(preset);
                      else setAiToolDisclosure(`${aiToolDisclosure}, ${preset}`);
                    }}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-neutral-300 hover:border-[#c19a88]/40 hover:text-white transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#c19a88]" />
            <span>Submissions can be updated anytime before the final deadline.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] px-6 py-3 text-xs font-semibold text-neutral-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>{saving ? 'Saving Draft...' : 'Save Draft Snapshot'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                if (!readiness.allRequiredMet) {
                  setError('Please fill in all mandatory fields before locking final submission.');
                  return;
                }
                setShowConfirmModal(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Submit Project For Evaluation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pre-Flight Submission Review Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E0E0E] p-6 sm:p-8 space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#c19a88]/15 border border-[#c19a88]/30 text-[#c19a88]">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Confirm Deliverable Submission</h3>
                    <p className="text-xs text-neutral-400">Review your key details before logging evaluation receipt.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">Project Title:</span>
                  <span className="font-semibold text-white truncate max-w-[220px]">{title}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">Team Name:</span>
                  <span className="font-semibold text-[#e8c5b4]">{team?.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">Code Repository:</span>
                  <span className="font-mono text-white truncate max-w-[220px]">{parsedGithub.repoName || githubUrl}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">Live Demo:</span>
                  <span className="text-neutral-300">{liveDemoUrl ? 'Included ✓' : 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Video Walkthrough:</span>
                  <span className="text-neutral-300">{demoVideoUrl ? 'Included ✓' : 'Not provided'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#c19a88]/10 border border-[#c19a88]/20 text-[11px] text-[#e8c5b4] leading-relaxed">
                <strong>Notice:</strong> Your deliverable will be queued for technical evaluation. You can return and update your submission anytime prior to the official deadline.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-white/5"
                >
                  Back to Editing
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#805948]/30 hover:scale-105 transition-all"
                >
                  {saving ? 'Transmitting...' : 'Confirm Submission'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
