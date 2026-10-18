'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Award, Lock, Eye, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { LeaderboardResult } from '@/lib/db/types';

export default function AdminResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [preview, setPreview] = useState<LeaderboardResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchResults = () => {
    setLoading(true);
    fetch('/api/admin/results')
      .then((r) => r.json())
      .then((data) => {
        if (data.preview) setPreview(data.preview);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to officially PUBLISH the leaderboard results to the public?')) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/results', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish results');
      setMessage('Official Leaderboard Published! Public rankings and certificates are now active.');
      fetchResults();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm('Are you sure you want to unpublish the leaderboard and return to judging?')) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/results', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to unpublish');
      setMessage('Leaderboard unpublished. Public page is now hidden.');
      fetchResults();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const isAnyPublished = preview.some((r) => r.is_published);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              National Leaderboard Command
            </span>
            <h1 className="text-2xl font-black text-white">Results & Podium Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              Private preview of weighted judging scores. Verify rankings before officially publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchResults}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Tally</span>
            </button>

            {isAnyPublished ? (
              <button
                onClick={handleUnpublish}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/60 px-5 py-2 text-xs font-bold text-red-200 transition-colors"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Unpublish Results</span>
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={actionLoading || preview.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>{actionLoading ? 'Publishing...' : 'Publish Official Results'}</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0c1220] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-[#080d17] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Private Ranked Leaderboard Preview
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isAnyPublished
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                : 'bg-yellow-950 text-yellow-300 border border-yellow-500/30'
            }`}
          >
            {isAnyPublished ? 'PUBLIC STATUS: LIVE' : 'STATUS: UNPUBLISHED DRAFT'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#0a0f1d] text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Team & Project</th>
                <th className="py-3.5 px-6">Track</th>
                <th className="py-3.5 px-6">Prize / Merit Tier</th>
                <th className="py-3.5 px-6 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Computing weighted scores...
                  </td>
                </tr>
              ) : preview.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No evaluated submissions found to generate rankings.
                  </td>
                </tr>
              ) : (
                preview.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-black text-white text-sm">
                      #{res.rank}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-200">{res.team_name}</div>
                      <div className="text-[11px] text-slate-400">{res.project_title}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">{res.track_id}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          res.rank === 1
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : res.rank === 2
                            ? 'bg-slate-800 text-slate-200 border border-slate-600'
                            : res.rank === 3
                            ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                            : 'bg-brand-950 text-brand-300 border border-brand-500/30'
                        }`}
                      >
                        {res.prize_category ? res.prize_category.replace(/_/g, ' ') : 'Top 25 Finalist'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-cyanAccent-400 text-sm">
                      {res.final_score.toFixed(1)} / 100
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
