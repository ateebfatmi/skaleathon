'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  Github,
  Globe,
  Video,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { JudgingCriterion, Submission } from '@/lib/db/types';

export default function EvaluateProjectPage() {
  const router = useRouter();
  const params = useParams<{ submissionId: string }>();
  const subId = params.submissionId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [criteria, setCriteria] = useState<JudgingCriterion[]>([]);
  const [assignmentId, setAssignmentId] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Scores state: criterionId -> score number
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [conflictDeclared, setConflictDeclared] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/submissions?teamId=${subId}`).then((r) => r.json()),
      fetch('/api/judging/assignments').then((r) => r.json()),
      fetch('/api/judging/criteria').then((r) => r.json()),
    ])
      .then(([subRes, assignRes, critRes]) => {
        if (critRes.criteria) {
          setCriteria(critRes.criteria);
          const initialScores: Record<string, number> = {};
          critRes.criteria.forEach((c: JudgingCriterion) => {
            initialScores[c.id] = Math.round(c.max_score * 0.7); // default sensible midpoint
          });
          setScores(initialScores);
        }

        // Find assignment or submission
        const sub = subRes.submission || assignRes.assignments?.find((a: any) => a.submission_id === subId)?.submission;
        if (sub) {
          setSubmission(sub);
        }

        const assignment = assignRes.assignments?.find((a: any) => a.submission_id === subId || a.submission?.id === subId);
        if (assignment) {
          setAssignmentId(assignment.id);
          if (assignment.scoreSubmission) {
            setIsLocked(assignment.scoreSubmission.is_locked);
            setFeedback(assignment.scoreSubmission.feedback || '');
            setInternalNotes(assignment.scoreSubmission.internal_notes || '');
          }
        } else {
          // Virtual or newly assigned ID
          setAssignmentId(`asgn_virtual_${subId.substring(0, 8)}`);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [subId]);

  const handleScoreChange = (critId: string, val: number) => {
    if (isLocked) return;
    setScores((prev) => ({ ...prev, [critId]: val }));
  };

  // Calculate live weighted score
  const totalWeightedScore = criteria.reduce((sum, crit) => {
    const raw = scores[crit.id] ?? 0;
    return sum + (raw / crit.max_score) * crit.weight_percentage;
  }, 0);

  const handleSaveEvaluation = async (lock: boolean) => {
    if (conflictDeclared) {
      setError('You have declared a conflict of interest for this project. Scores cannot be submitted.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const scoreArray = Object.entries(scores).map(([criterionId, score]) => ({
        criterionId,
        score,
      }));

      const res = await fetch('/api/judging/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignmentId || `asgn_${subId}`,
          scores: scoreArray,
          feedback,
          internalNotes,
          isLocked: lock,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit score');
      }

      setIsLocked(lock);
      setSuccessMsg(data.message);
      if (lock) {
        setTimeout(() => router.push('/judge'), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center text-xs text-neutral-400">
        Loading evaluation matrix...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Submission Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested submission ID could not be retrieved from the database.
        </p>
        <Link href="/judge" className="text-xs font-semibold text-brand-400 hover:underline">
          Return to Judging Panel
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Navigation */}
      <div>
        <Link
          href="/judge"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assigned Evaluations</span>
        </Link>
      </div>

      {/* Alert Notices */}
      {isLocked && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-xs text-emerald-200">
          <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Evaluation Finalized & Locked:</strong> These scores have been submitted permanently to the authoritative tally and can no longer be edited.
          </span>
        </div>
      )}

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

      {/* Project Overview Card (Protected: no participant phone or personal emails) */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
              Track: {submission.track_id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {submission.title}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Submission ID: <code className="font-mono text-neutral-300">{submission.id}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={submission.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Inspect GitHub Repo</span>
            </a>

            {submission.live_demo_url && (
              <a
                href={submission.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyanAccent-600/20 hover:bg-cyanAccent-600/30 text-cyanAccent-300 px-4 py-2 text-xs font-semibold transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}

            {submission.demo_video_url && (
              <a
                href={submission.demo_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-4 py-2 text-xs font-semibold transition-colors"
              >
                <Video className="h-4 w-4" />
                <span>Watch Video</span>
              </a>
            )}
          </div>
        </div>

        {/* Narrative Details */}
        <div className="space-y-4 text-xs leading-relaxed">
          <div>
            <h3 className="font-bold text-neutral-300 uppercase tracking-wider mb-1 text-[11px]">
              Problem Statement:
            </h3>
            <p className="text-neutral-200 bg-[#141414] p-4 rounded-xl border border-white/5">
              {submission.problem_statement}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-300 uppercase tracking-wider mb-1 text-[11px]">
              Solution Architecture & Implementation:
            </h3>
            <p className="text-neutral-200 bg-[#141414] p-4 rounded-xl border border-white/5">
              {submission.solution_overview}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-300 uppercase tracking-wider mb-1 text-[11px]">
              Full Description & Technical Polish:
            </h3>
            <p className="text-neutral-300 bg-[#141414] p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
              {submission.description}
            </p>
          </div>

          {submission.ai_tool_disclosure && (
            <div>
              <h3 className="font-bold text-cyanAccent-400 uppercase tracking-wider mb-1 text-[11px] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Disclosed Generative AI Tool Usage:</span>
              </h3>
              <p className="text-neutral-300 bg-cyanAccent-950/20 p-3 rounded-xl border border-cyanAccent-500/20">
                {submission.ai_tool_disclosure}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scoring Rubric & Evaluation Form */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Multi-Criterion Evaluation Rubric</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Score each criterion from 0 to 10. Weighted calculation is performed continuously.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-right">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Calculated Total</span>
            <span className="text-2xl font-black text-cyanAccent-400 font-mono">
              {totalWeightedScore.toFixed(1)} / 100
            </span>
          </div>
        </div>

        {/* Criteria Sliders / Inputs */}
        <div className="space-y-6">
          {criteria.map((crit) => {
            const currentVal = scores[crit.id] ?? 0;
            return (
              <div
                key={crit.id}
                className="p-5 rounded-2xl border border-white/5 bg-[#141414] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{crit.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{crit.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/30">
                      Weight: {crit.weight_percentage}%
                    </span>
                    <span className="text-base font-black text-white font-mono block mt-1">
                      {currentVal} / {crit.max_score}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <input
                    type="range"
                    min="0"
                    max={crit.max_score}
                    step="0.5"
                    disabled={isLocked}
                    value={currentVal}
                    onChange={(e) => handleScoreChange(crit.id, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-500 disabled:opacity-50"
                  />
                  <input
                    type="number"
                    min="0"
                    max={crit.max_score}
                    step="0.5"
                    disabled={isLocked}
                    value={currentVal}
                    onChange={(e) => handleScoreChange(crit.id, parseFloat(e.target.value) || 0)}
                    className="w-16 rounded-lg border border-white/10 bg-[#0B0B0B] px-2 py-1 text-center font-mono text-xs text-white disabled:opacity-50"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback & Internal Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Constructive Feedback (Visible to Team after Results)
            </label>
            <textarea
              rows={3}
              disabled={isLocked}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Highlight technical strengths and recommendations for scalability..."
              className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Internal Evaluation Notes (Confidential to Committee)
            </label>
            <textarea
              rows={3}
              disabled={isLocked}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Private comments on code originality, repo cleanliness, edge cases..."
              className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Conflict of Interest Declaration */}
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-950/20 flex items-start gap-3">
          <input
            type="checkbox"
            id="conflict"
            disabled={isLocked}
            checked={conflictDeclared}
            onChange={(e) => setConflictDeclared(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 text-yellow-500 focus:ring-yellow-400"
          />
          <label htmlFor="conflict" className="text-xs text-yellow-200 leading-relaxed cursor-pointer">
            <strong>Conflict of Interest Declaration:</strong> Check this box if you have a personal, academic, or professional relationship with any members of this team. If declared, your scores will not be counted in the leaderboard tally.
          </label>
        </div>

        {/* Save & Final Lock Actions */}
        {!isLocked && (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSaveEvaluation(false)}
              className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-xs font-semibold text-neutral-200 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Evaluation Draft'}
            </button>

            <button
              type="button"
              disabled={submitting || conflictDeclared}
              onClick={() => handleSaveEvaluation(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>{submitting ? 'Locking...' : 'Submit & Lock Final Score'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
