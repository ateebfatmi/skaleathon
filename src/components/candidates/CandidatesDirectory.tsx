'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  ShieldCheck,
  Bot,
  Globe,
  Smartphone,
  MapPin,
  Building,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Team, TeamMember, EventTrack } from '@/lib/db/types';

interface CandidatesDirectoryProps {
  initialTeams: Array<Team & { members: TeamMember[] }>;
  tracks: EventTrack[];
}

export default function CandidatesDirectory({
  initialTeams,
  tracks,
}: CandidatesDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  const iconMap: Record<string, any> = {
    'track-ai-ml': Bot,
    'track-web-dev': Globe,
    'track-app-dev': Smartphone,
  };

  const trackNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    tracks.forEach((t) => {
      map[t.id] = t.name;
    });
    return map;
  }, [tracks]);

  // Filtered teams list
  const filteredTeams = useMemo(() => {
    return initialTeams.filter((team) => {
      const matchesTrack =
        selectedTrack === 'all' || team.track_id === selectedTrack;

      if (!matchesTrack) return false;

      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase().trim();
      const matchTeamName = team.name.toLowerCase().includes(q);
      const matchCollege = team.college_or_org?.toLowerCase().includes(q);
      const matchCity = team.city?.toLowerCase().includes(q);
      const matchState = team.state?.toLowerCase().includes(q);
      const matchMember = (team.members || []).some((m) =>
        m.name.toLowerCase().includes(q)
      );

      return (
        matchTeamName ||
        matchCollege ||
        matchCity ||
        matchState ||
        matchMember
      );
    });
  }, [initialTeams, searchTerm, selectedTrack]);

  // Aggregate stats
  const totalCandidates = useMemo(() => {
    return initialTeams.reduce(
      (acc, t) => acc + Math.max(1, (t.members || []).length),
      0
    );
  }, [initialTeams]);

  return (
    <div className="space-y-10">
      {/* 1. Metric Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 space-y-1 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
            Registered Teams
          </span>
          <div className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            {initialTeams.length}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Registry</span>
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 space-y-1 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
            Total Candidates
          </span>
          <div className="text-2xl sm:text-3xl font-medium text-[#e8c5b4] tracking-tight">
            {totalCandidates}
          </div>
          <p className="text-[11px] text-white/40 font-mono">
            Across India
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 space-y-1 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
            Competition Arenas
          </span>
          <div className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            3
          </div>
          <p className="text-[11px] text-white/40 font-mono">
            AI/ML, Web, Mobile
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.95))] p-5 space-y-1 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
            Prize Pool
          </span>
          <div className="text-2xl sm:text-3xl font-medium text-[#c19a88] tracking-tight">
            ₹35,000
          </div>
          <p className="text-[11px] text-amber-400/80 font-mono">
            Top 3 + Top 25 Merit
          </p>
        </div>
      </div>

      {/* 2. Interactive Search & Track Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.025),rgba(14,14,14,0.98))] p-4 shadow-xl">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, team name, institution, or city..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#c19a88] focus:ring-1 focus:ring-[#c19a88]/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Track selection pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedTrack('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'all'
                ? 'bg-gradient-to-r from-[#805948] to-[#c19a88] text-white shadow-sm font-semibold'
                : 'border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            All Tracks ({initialTeams.length})
          </button>

          {tracks.map((track) => {
            const count = initialTeams.filter(
              (t) => t.track_id === track.id
            ).length;
            const isSelected = selectedTrack === track.id;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrack(track.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#805948] to-[#c19a88] text-white shadow-sm font-semibold'
                    : 'border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {track.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Candidate / Team Cards Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team, idx) => {
            const Icon = iconMap[team.track_id || ''] || Bot;
            const trackName =
              trackNameMap[team.track_id || ''] || 'General Arena';
            const leaderMember =
              (team.members || []).find((m) => m.role === 'leader') ||
              team.members?.[0];
            const memberCount = Math.max(1, (team.members || []).length);
            const isPaid =
              team.status === 'paid' || (team as any).status === 'confirmed';

            return (
              <div
                key={team.id || idx}
                className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(14,14,14,0.96))] p-6 space-y-4 shadow-lg hover:border-[#c19a88]/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Track Pill & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#e8c5b4]">
                      <Icon className="h-3 w-3 text-[#c19a88]" />
                      <span>{trackName}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{isPaid ? 'Confirmed Entry' : 'Registered'}</span>
                    </span>
                  </div>

                  {/* Team Name */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#c19a88] transition-colors truncate">
                      {team.name}
                    </h3>
                    <p className="text-xs text-white/50 font-light mt-0.5 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#c19a88]" />
                      <span>{memberCount} Candidate{memberCount > 1 ? 's' : ''} Enrolled</span>
                    </p>
                  </div>

                  {/* Institution / Location */}
                  <div className="space-y-1.5 pt-1 text-xs text-white/55 font-light">
                    {team.college_or_org && (
                      <div className="flex items-center gap-2 truncate">
                        <Building className="h-3.5 w-3.5 text-[#c19a88]/70 shrink-0" />
                        <span className="truncate">{team.college_or_org}</span>
                      </div>
                    )}

                    {(team.city || team.state) && (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="h-3.5 w-3.5 text-[#c19a88]/70 shrink-0" />
                        <span className="truncate">
                          {[team.city, team.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Members list preview */}
                  {team.members && team.members.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                        Squad Members:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {team.members.map((member, mIdx) => (
                          <span
                            key={member.id || mIdx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                              member.role === 'leader'
                                ? 'border-[#c19a88]/40 bg-[#c19a88]/15 text-[#e8c5b4] font-semibold'
                                : 'border-white/[0.08] bg-white/[0.02] text-white/60'
                            }`}
                          >
                            {member.name} {member.role === 'leader' ? '★' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 font-mono">
                  <span>Skaleathon 2027</span>
                  <span>Stage 01: Screening</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.02),rgba(14,14,14,0.95))] p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#c19a88] mx-auto">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">
            No registered teams match your search
          </h3>
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            Try adjusting your search keywords or resetting the track filter to view all participating candidates.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedTrack('all');
            }}
            className="inline-block rounded-full bg-white/[0.06] border border-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 4. Bottom Call To Action */}
      <div className="rounded-3xl border border-[#c19a88]/30 bg-[linear-gradient(145deg,rgba(193,154,136,0.08),rgba(14,14,14,0.95))] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c19a88] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join the Competition</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Ready to stand alongside these innovators?
          </h2>
          <p className="text-xs sm:text-sm text-white/55 font-light max-w-xl">
            Form your team of 1–6 members, select your arena, and compete for ₹35,000 in cash prizes and SkaleKraft internship interview opportunities.
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] hover:scale-105 transition-transform shrink-0"
        >
          <span>Register Your Team — ₹99</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
