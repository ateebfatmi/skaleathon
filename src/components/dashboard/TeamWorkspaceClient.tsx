'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  MapPin,
  Building,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  Layers,
  Send,
  Code2,
  Share2,
  BrainCircuit,
  Globe,
  Smartphone,
} from 'lucide-react';
import { Team, TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';
import { motion } from 'framer-motion';

interface TeamWorkspaceClientProps {
  team: Team;
  members: TeamMember[];
  track?: EventTrack | null;
  paymentOrder?: PaymentOrder | null;
  userName?: string;
  userEmail?: string;
}

export default function TeamWorkspaceClient({
  team,
  members,
  track,
  paymentOrder,
  userName,
  userEmail,
}: TeamWorkspaceClientProps) {
  const [copiedPassId, setCopiedPassId] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const leaderMember = members.find((m) => m.role === 'leader') || members[0];
  const regularMembers = members.filter((m) => m.id !== leaderMember?.id);
  const openSlotsCount = Math.max(0, 6 - members.length);

  const formattedDate = team.created_at
    ? (() => {
        try {
          const d = new Date(team.created_at);
          return isNaN(d.getTime())
            ? 'Active'
            : d.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
        } catch {
          return 'Active';
        }
      })()
    : 'Active';

  const copyToClipboard = (text: string, type: 'pass' | 'invite') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'pass') {
        setCopiedPassId(true);
        setTimeout(() => setCopiedPassId(false), 2000);
      } else {
        setCopiedInvite(true);
        setTimeout(() => setCopiedInvite(false), 2000);
      }
    }
  };

  const shareSquadPass = () => {
    const inviteText = `Join my Skaleathon squad "${team.name}" (${track?.name || 'Technical Arena'}). Official Pass ID: ${team.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `Skaleathon Squad: ${team.name}`,
          text: inviteText,
          url: window.location.href,
        })
        .catch(() => copyToClipboard(inviteText, 'invite'));
    } else {
      copyToClipboard(inviteText, 'invite');
    }
  };

  const getTrackIcon = (trackName?: string) => {
    const lower = (trackName || '').toLowerCase();
    if (lower.includes('ai') || lower.includes('machine') || lower.includes('intelligent')) {
      return BrainCircuit;
    }
    if (lower.includes('mobile') || lower.includes('app') || lower.includes('cross-platform')) {
      return Smartphone;
    }
    return Globe;
  };

  const TrackIcon = getTrackIcon(track?.name);

  return (
    <div className="max-w-4xl mx-auto space-y-5 text-neutral-200">
      {/* Top Utility Ribbon */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span>Official Team Pass • SKALEATHON</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
            title="Print official team credentials"
          >
            <Printer className="h-3 w-3 text-[#c19a88]" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={shareSquadPass}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 hover:bg-[#c19a88]/20 px-3 py-1 text-[11px] font-semibold text-[#e8c5b4] transition-all shadow-sm"
            title="Share squad credentials"
          >
            {copiedInvite ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3 w-3" />
                <span>Share Pass</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Digital Team Pass Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[22px] border border-[#c19a88]/30 bg-[linear-gradient(145deg,rgba(193,154,136,0.06),rgba(14,14,14,0.98))] p-5 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden"
      >
        {/* Subtle radial ambient glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 bg-[#c19a88]/12 rounded-full blur-[80px]" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 w-60 h-60 bg-[#805948]/12 rounded-full blur-[70px]" />

        {/* Top Pass Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08] relative z-10 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: PAID</span>
            </span>

            <button
              onClick={() => copyToClipboard(team.id, 'pass')}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#c19a88]/40 px-2.5 py-0.5 text-[10px] font-mono text-white/60 hover:text-white transition-all"
              title="Click to copy full Pass ID"
            >
              <span>ID:</span>
              <span className="text-white font-semibold">{team.id.slice(0, 12)}...</span>
              {copiedPassId ? (
                <Check className="h-2.5 w-2.5 text-emerald-400" />
              ) : (
                <Copy className="h-2.5 w-2.5 text-neutral-400 group-hover:text-[#c19a88] transition-colors" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {track && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#e8c5b4]">
                <TrackIcon className="h-3 w-3" />
                <span>Track: {track.name}</span>
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono font-bold text-white/80">
              ₹99 Verified
            </span>
          </div>
        </div>

        {/* Team Identity Banner */}
        <div className="py-3.5 space-y-1 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-[0.22em] text-[#c19a88] block">
                Registered Engineering Squad
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                {team.name}
              </h2>
            </div>

            <Link
              href="/dashboard/track"
              className="w-fit inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-neutral-300 hover:text-white transition-all"
            >
              <Code2 className="h-3 w-3 text-[#c19a88]" />
              <span>Track Specs</span>
              <ArrowRight className="h-2.5 w-2.5 text-neutral-500" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-white/55 font-light pt-0.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#c19a88]" />
              <span>{team.city ? `${team.city}, ` : ''}{team.state || 'India'}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Building className="h-3 w-3 text-[#c19a88]" />
              <span>{team.college_or_org || 'Independent Squad'}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#c19a88]" />
              <span>Enrolled: {formattedDate}</span>
            </span>
          </div>
        </div>

        {/* 4 Details Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2.5 pb-3.5 border-b border-white/[0.08] relative z-10 text-xs">
          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40 space-y-0.5">
            <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
              Team Leader
            </span>
            <span className="font-semibold text-white block truncate text-xs">
              {leaderMember?.name || userName || 'Team Lead'}
            </span>
            <span className="text-white/40 text-[10px] font-mono truncate block">
              {leaderMember?.email || userEmail}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40 space-y-0.5">
            <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
              Roster Capacity
            </span>
            <span className="font-semibold text-white block text-xs">
              {members.length} of 6 Engineers
            </span>
            <span className="text-[#c19a88] text-[10px] block font-medium">
              {openSlotsCount > 0 ? `${openSlotsCount} slots open` : 'Squad full (6/6)'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40 space-y-0.5">
            <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
              Payment Verification
            </span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1 text-xs">
              <CheckCircle2 className="h-3 w-3" />
              <span>₹99 Flat Verified</span>
            </span>
            <span className="text-white/40 text-[10px] font-mono truncate block">
              Ref: {paymentOrder?.razorpay_payment_id || 'RZP_AUTOMATED_SETTLED'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40 space-y-0.5">
            <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
              Current Milestone
            </span>
            <span className="font-semibold text-white block text-xs">Stage 1 Screening</span>
            <span className="text-white/40 text-[10px] block">Saturday, Jan 08, 2028</span>
          </div>
        </div>

        {/* Squad Members Roster */}
        <div className="pt-3.5 space-y-2.5 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#c19a88]" />
              <h3 className="text-[11px] uppercase font-bold tracking-[0.16em] text-[#c19a88]">
                Confirmed Squad Roster ({members.length}/6)
              </h3>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              1–6 Members Policy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Leader Card */}
            {leaderMember && (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#c19a88]/30 bg-[#c19a88]/[0.06] relative group hover:border-[#c19a88]/50 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#c19a88]/30 to-[#805948]/30 border border-[#c19a88]/40 flex items-center justify-center text-xs font-bold text-[#f5ded3] shrink-0">
                    {leaderMember.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{leaderMember.name}</p>
                      <span className="rounded-full bg-[#c19a88]/20 border border-[#c19a88]/30 px-1.5 py-0.2 text-[8px] font-mono font-bold text-[#f5ded3] shrink-0 uppercase tracking-wider">
                        Lead
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-white/50 font-mono truncate">
                      <span className="truncate">{leaderMember.email}</span>
                      {leaderMember.phone && <span>• {leaderMember.phone}</span>}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-mono font-bold text-[#c19a88]/70 shrink-0 self-start">
                  #01
                </span>
              </div>
            )}

            {/* Other Members */}
            {regularMembers.map((member, idx) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-white/80 shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-white truncate">{member.name}</p>
                      <span className="rounded-full bg-white/[0.04] border border-white/10 px-1.5 py-0.2 text-[8px] font-mono text-neutral-400 shrink-0 uppercase tracking-wider">
                        Member
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-white/50 font-mono truncate">
                      <span className="truncate">{member.email}</span>
                      {member.phone && <span>• {member.phone}</span>}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-white/30 shrink-0 self-start">
                  #{String(idx + 2).padStart(2, '0')}
                </span>
              </div>
            ))}

            {/* Compact Single Open Slots Card */}
            {openSlotsCount > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.01] hover:border-[#c19a88]/40 transition-all">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-7 w-7 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-[10px] font-mono text-[#c19a88] shrink-0">
                    +{openSlotsCount}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/75">
                      {openSlotsCount} Open Roster {openSlotsCount === 1 ? 'Slot' : 'Slots'}
                    </p>
                    <p className="text-[10px] text-white/40 font-light">
                      Add up to {6 - members.length} more teammates to squad
                    </p>
                  </div>
                </div>

                <button
                  onClick={shareSquadPass}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 text-[10px] font-medium text-[#e8c5b4] transition-all shrink-0"
                >
                  <Share2 className="h-2.5 w-2.5" />
                  <span>Share Pass</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Up Next: Stage 1 Milestone Alert */}
        <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Up Next: Stage 1 — Online Screening Assessment
              </span>
            </div>
            <p className="font-semibold text-white text-xs">
              Saturday, January 8, 2028 • 10:00 AM – 8:00 PM IST
            </p>
            <p className="text-[10px] text-white/50 font-light">
              Timed 45-minute technical evaluation covering core CS fundamentals & {track?.name || 'track'} topics.
            </p>
          </div>
          <Link
            href="/dashboard/stages"
            className="shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/15 hover:bg-emerald-500/25 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 transition-all"
          >
            <span>View All 4 Stages</span>
            <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </motion.div>

      {/* 3. Fast Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Link
          href="/dashboard/stages"
          className="group rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-[#c19a88]/40 hover:bg-[#c19a88]/[0.03] transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-md bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#e8c5b4]">
              <Layers className="h-3 w-3" />
            </div>
            <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
          <h4 className="text-xs font-semibold text-white">Tournament Stages</h4>
          <p className="text-[10px] text-neutral-400 font-light leading-relaxed">
            Review detailed timeline, rubrics, and final schedule.
          </p>
        </Link>

        <Link
          href="/dashboard/submission"
          className="group rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-[#c19a88]/40 hover:bg-[#c19a88]/[0.03] transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-md bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#e8c5b4]">
              <Send className="h-3 w-3" />
            </div>
            <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
          <h4 className="text-xs font-semibold text-white">Deliverables Portal</h4>
          <p className="text-[10px] text-neutral-400 font-light leading-relaxed">
            Upload Stage 2 Architecture PDF and Stage 3 Codebase.
          </p>
        </Link>

        <Link
          href="/dashboard/track"
          className="group rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-[#c19a88]/40 hover:bg-[#c19a88]/[0.03] transition-all space-y-1 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 rounded-md bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#e8c5b4]">
              <Code2 className="h-3 w-3" />
            </div>
            <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
          <h4 className="text-xs font-semibold text-white">Track Specifications</h4>
          <p className="text-[10px] text-neutral-400 font-light leading-relaxed">
            Recommended stack & rubrics for {track?.name || 'your track'}.
          </p>
        </Link>
      </div>
    </div>
  );
}
