'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, CheckCircle2, AlertCircle, Save, Calendar } from 'lucide-react';
import { EventData, EventStatus } from '@/lib/db/types';

export default function AdminConfigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [event, setEvent] = useState<EventData | null>(null);

  // Form states
  const [status, setStatus] = useState<EventStatus>('registration_open');
  const [registrationStart, setRegistrationStart] = useState('');
  const [registrationEnd, setRegistrationEnd] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [resultsAnnouncedAt, setResultsAnnouncedAt] = useState('');
  const [registrationFee, setRegistrationFee] = useState(99);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(6);

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.event) {
          const e = data.event;
          setEvent(e);
          setStatus(e.status);
          setRegistrationStart(e.registration_start_at ? e.registration_start_at.slice(0, 16) : '');
          setRegistrationEnd(e.registration_end_at ? e.registration_end_at.slice(0, 16) : '');
          setSubmissionDeadline(e.submission_deadline ? e.submission_deadline.slice(0, 16) : '');
          setResultsAnnouncedAt(e.results_announced_at ? e.results_announced_at.slice(0, 16) : '');
          setRegistrationFee(e.registration_fee_inr);
          setMinTeamSize(e.min_team_size);
          setMaxTeamSize(e.max_team_size);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const updates = {
        status,
        registration_start_at: registrationStart ? new Date(registrationStart).toISOString() : null,
        registration_end_at: registrationEnd ? new Date(registrationEnd).toISOString() : null,
        submission_deadline: submissionDeadline ? new Date(submissionDeadline).toISOString() : null,
        results_announced_at: resultsAnnouncedAt ? new Date(resultsAnnouncedAt).toISOString() : null,
        registration_fee_inr: registrationFee,
        min_team_size: minTeamSize,
        max_team_size: maxTeamSize,
      };

      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update configuration');
      }

      setSuccessMsg('Event configuration saved successfully and audit-logged.');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-400 p-8 text-center">Loading event configuration...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
            Lifecycle & Operational Settings
          </span>
          <h1 className="text-2xl font-black text-white">Event Configuration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Update hackathon phases, submission cutoffs, and team policies without changing source code.
          </p>
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

      <form onSubmit={handleSave} className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-6">
        {/* Status Dropdown */}
        <div className="p-5 rounded-2xl border border-brand-500/30 bg-brand-950/20 space-y-2">
          <label className="block text-xs font-bold text-white uppercase tracking-wider">
            Current Event Lifecycle Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EventStatus)}
            className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="draft">Draft (Private Testing)</option>
            <option value="upcoming">Upcoming (Dates Announced)</option>
            <option value="registration_open">Registration Open (Accepting Teams & ₹99 Fees)</option>
            <option value="registration_closed">Registration Closed (Roster Frozen)</option>
            <option value="hacking_live">Hacking Live (Building Phase)</option>
            <option value="submission_closed">Submission Closed (Cutoff Enforced)</option>
            <option value="judging">Judging (Evaluation Active)</option>
            <option value="results_announced">Results Announced (Public Leaderboard & Certificates)</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Milestone Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyanAccent-400" />
              <span>Registration Opening Date</span>
            </label>
            <input
              type="datetime-local"
              value={registrationStart}
              onChange={(e) => setRegistrationStart(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyanAccent-400" />
              <span>Registration Deadline</span>
            </label>
            <input
              type="datetime-local"
              value={registrationEnd}
              onChange={(e) => setRegistrationEnd(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Project Submission Deadline</span>
            </label>
            <input
              type="datetime-local"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <span>Results Announcement Date</span>
            </label>
            <input
              type="datetime-local"
              value={resultsAnnouncedAt}
              onChange={(e) => setResultsAnnouncedAt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Fees & Team Size Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Registration Fee (INR)
            </label>
            <input
              type="number"
              min="0"
              value={registrationFee}
              onChange={(e) => setRegistrationFee(parseFloat(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Min Team Size
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={minTeamSize}
              onChange={(e) => setMinTeamSize(parseInt(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Max Team Size
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={maxTeamSize}
              onChange={(e) => setMaxTeamSize(parseInt(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
