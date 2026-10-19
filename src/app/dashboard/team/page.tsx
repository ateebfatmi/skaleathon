import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import Link from 'next/link';
import { Users, Mail, Phone, MapPin, Building, ShieldCheck, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function TeamPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const members = team ? await EventRepository.getTeamMembers(team.id) : [];
  const track = team?.track_id ? await EventRepository.getTrack(team.track_id) : null;

  if (!team) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center space-y-4">
        <Users className="h-10 w-10 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Team Registered</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          You are currently not affiliated with an active team. Please complete team registration to participate.
        </p>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
        >
          Register Team (₹99)
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Header Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
              Official Team Roster
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{team.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Registered ID: <code className="font-mono text-slate-300">{team.id}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                team.status === 'paid'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-yellow-500/40 bg-yellow-950/40 text-yellow-300'
              }`}
            >
              Status: {team.status.toUpperCase()}
            </span>

            {track && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300">
                Track: {track.name}
              </span>
            )}
          </div>
        </div>

        {/* Team Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-400 shrink-0" />
            <span>{team.city || 'City'}, {team.state || 'State'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-cyanAccent-400 shrink-0" />
            <span>{team.college_or_org || 'Independent / Not Specified'}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Registration Fee: ₹99 Verified</span>
          </div>
        </div>

        {team.description && (
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-400 block mb-1">Team Overview:</span>
            {team.description}
          </div>
        )}
      </div>

      {/* Team Members List */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-cyanAccent-400" />
            <span>Roster Members ({members.length} of 6)</span>
          </h2>
          <span className="text-xs text-slate-400">1–6 Members Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="rounded-2xl border border-white/10 bg-[#141414] p-5 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{member.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    member.role === 'leader'
                      ? 'bg-brand-950 text-brand-300 border border-brand-500/30'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {member.role === 'leader' ? 'TEAM LEADER' : 'MEMBER'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
