'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Download, CreditCard, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetch('/api/admin/registrations')
      .then((r) => r.json())
      .then((data) => {
        if (data.teams) setTeams(data.teams);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.college_or_org?.toLowerCase().includes(search.toLowerCase()) ||
      t.city?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
              Team Roster Registry
            </span>
            <h1 className="text-2xl font-black text-white">Registration Management</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Search, filter, inspect team rosters, and export authoritative registration records.
            </p>
          </div>

          <a
            href="/api/admin/registrations?format=csv"
            download
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-bold text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Roster CSV</span>
          </a>
        </div>

        {/* Filter Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by team name, college, or city..."
              className="w-full rounded-xl border border-white/10 bg-[#141414] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Payment States</option>
            <option value="paid">Verified Paid</option>
            <option value="registered">Registered (Pending)</option>
            <option value="disqualified">Disqualified</option>
          </select>
        </div>
      </div>

      {/* Teams Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#141414] text-neutral-400 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Team Name</th>
                <th className="py-3.5 px-6">Track</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Members</th>
                <th className="py-3.5 px-6">Payment Status</th>
                <th className="py-3.5 px-6">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Loading registrations...
                  </td>
                </tr>
              ) : filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No teams found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      <div>{team.name}</div>
                      <span className="font-mono text-[10px] text-neutral-400">{team.id}</span>
                    </td>
                    <td className="py-4 px-6 text-neutral-300 font-mono text-[11px]">
                      {team.track_id || 'Unassigned'}
                    </td>
                    <td className="py-4 px-6 text-neutral-300">
                      {team.city ? `${team.city}, ${team.state}` : '—'}
                    </td>
                    <td className="py-4 px-6 text-neutral-200">
                      {team.members ? `${team.members.length} Member(s)` : '1 Member'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          team.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-yellow-950 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {team.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      {new Date(team.created_at).toLocaleDateString()}
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
