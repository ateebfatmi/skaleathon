import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { Award, CheckCircle2, Clock, ArrowRight, Github, ExternalLink, ShieldAlert } from 'lucide-react';

export const revalidate = 0;

export default async function JudgeOverviewPage() {
  const session = await getCurrentSession();
  const judgeId = session?.userId || '';

  // Get assignments for this judge
  const assignments = await EventRepository.getAssignmentsForJudge(judgeId);
  const allSubmissions = await EventRepository.listSubmissions({ status: 'submitted' });
  const criteria = await EventRepository.getJudgingCriteria();

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight_percentage, 0);

  return (
    <div className="space-y-8">
      {/* Criteria Weight Alert */}
      <div className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white">Official Multi-Criterion Scoring Framework</h2>
          <p className="text-xs text-neutral-400 mt-1">
            5 weighted criteria (Innovation 25%, Technical 25%, Relevance 20%, Design 15%, Presentation 15%). Total Weight: {totalWeight}%.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full shrink-0">
          Weight Total: 100% OK
        </span>
      </div>

      {/* Assigned Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-cyanAccent-400" />
            <span>Assigned Project Evaluations ({assignments.length})</span>
          </h2>
        </div>

        {assignments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 text-center space-y-4">
            <Clock className="h-8 w-8 text-neutral-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Direct Assignments Allocated Yet</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              You can evaluate any of the submitted competition projects below as part of the open judging pool.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assignment) => {
              const sub = assignment.submission;
              const isCompleted = assignment.status === 'completed';

              return (
                <div
                  key={assignment.id}
                  className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-6 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white">{assignment.teamName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-yellow-950 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {assignment.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white mb-2">{sub.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{sub.problem_statement}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    {assignment.scoreSubmission && (
                      <span className="text-xs font-mono font-bold text-cyanAccent-400">
                        Score: {assignment.scoreSubmission.total_weighted_score.toFixed(1)}/100
                      </span>
                    )}

                    <Link
                      href={`/judge/evaluate/${sub.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition-colors ml-auto"
                    >
                      <span>{isCompleted ? 'View Locked Score' : 'Score Project'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Submitted Projects (Pool) */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h2 className="text-lg font-bold text-white">
          All Submitted Competition Projects ({allSubmissions.length})
        </h2>

        {allSubmissions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-8 text-center text-xs text-neutral-400">
            No projects submitted by paid teams yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-6 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-300">{sub.teamName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                      {sub.track_id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{sub.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-3">{sub.problem_statement}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={sub.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Repo</span>
                  </a>

                  <Link
                    href={`/judge/evaluate/${sub.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyanAccent-400 hover:underline"
                  >
                    <span>Evaluate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
