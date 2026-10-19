'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  MapPin,
  Building,
  Calendar,
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative max-w-4xl mx-auto space-y-8 pb-12 text-neutral-200"
    >
      {/* Subtle Background Ambient Glows (Blended into background, no container box) */}
      <div className="pointer-events-none absolute -top-12 right-0 h-72 w-72 rounded-full bg-[#c19a88]/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-40 -left-16 h-64 w-64 rounded-full bg-[#805948]/10 blur-[120px]" />

      {/* 1. Open Editorial Header */}
      <header className="relative z-10 border-b border-white/[0.08] pb-6 space-y-4">
        {/* Top Status & Utility Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#c19a88]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>Official Squad Pass • SKALEATHON</span>
            </div>

            <span className="text-white/15">•</span>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span>Status: PAID</span>
              <span className="text-white/30 font-mono font-normal">(₹99 Verified)</span>
            </span>

            <span className="text-white/15">•</span>

            <button
              onClick={() => copyToClipboard(team.id, 'pass')}
              className="group inline-flex items-center gap-1.5 text-[10px] font-mono text-white/50 hover:text-white transition-colors"
              title="Click to copy full Pass ID"
            >
              <span>ID:</span>
              <span className="text-white/80 font-semibold group-hover:text-[#e8c5b4]">
                {team.id.slice(0, 12)}...
              </span>
              {copiedPassId ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-2.5 w-2.5 text-neutral-500 group-hover:text-[#c19a88] transition-colors" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors"
              title="Print official team credentials"
            >
              <Printer className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={shareSquadPass}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e8c5b4] hover:text-white transition-colors"
              title="Share squad credentials"
            >
              {copiedInvite ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Share Pass</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Squad Title & Track Identity */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {team.name}
              </h1>
              {track && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e8c5b4] font-mono">
                  <span className="text-white/20">/</span>
                  <TrackIcon className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>{track.name}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 font-light">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-[#c19a88]" />
                <span>
                  {team.city ? `${team.city}, ` : ''}
                  {team.state || 'India'}
                </span>
              </span>
              <span className="text-white/15">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Building className="h-3 w-3 text-[#c19a88]" />
                <span>{team.college_or_org || 'Independent Squad'}</span>
              </span>
              <span className="text-white/15">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-[#c19a88]" />
                <span>Enrolled {formattedDate}</span>
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/track"
            className="w-fit inline-flex items-center gap-1.5 text-xs font-medium text-[#e8c5b4] hover:text-white transition-colors group"
          >
            <Code2 className="h-3.5 w-3.5 text-[#c19a88]" />
            <span>Track Specifications</span>
            <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      {/* 2. Open Telemetry Strip (No Boxes — Clean Left-Accented Columns) */}
      <section className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-white/[0.08] pb-7">
        <div className="border-l-2 border-[#c19a88]/40 pl-3.5 space-y-0.5">
          <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
            Team Leader
          </span>
          <span className="font-semibold text-white block truncate text-xs sm:text-sm">
            {leaderMember?.name || userName || 'Team Lead'}
          </span>
          <span className="text-white/45 text-[10px] font-mono truncate block">
            {leaderMember?.email || userEmail}
          </span>
        </div>

        <div className="border-l-2 border-white/15 pl-3.5 space-y-0.5">
          <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
            Roster Capacity
          </span>
          <span className="font-semibold text-white block text-xs sm:text-sm">
            {members.length} of 6 Engineers
          </span>
          <span className="text-[#c19a88] text-[10px] block font-medium">
            {openSlotsCount > 0 ? `${openSlotsCount} slots available` : 'Full squad (6/6)'}
          </span>
        </div>

        <div className="border-l-2 border-emerald-500/40 pl-3.5 space-y-0.5">
          <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
            Payment Status
          </span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1 text-xs sm:text-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>₹99 Verified</span>
          </span>
          <span className="text-white/45 text-[10px] font-mono truncate block">
            Ref: {paymentOrder?.razorpay_payment_id || 'RZP_SETTLED'}
          </span>
        </div>

        <div className="border-l-2 border-white/15 pl-3.5 space-y-0.5">
          <span className="text-white/40 text-[9px] uppercase font-mono tracking-wider block">
            Active Milestone
          </span>
          <span className="font-semibold text-white block text-xs sm:text-sm">
            Stage 1 Screening
          </span>
          <span className="text-white/45 text-[10px] block">Sat, Jan 08, 2028</span>
        </div>
      </section>

      {/* 3. Confirmed Squad Roster (Open Blended List — No Cards) */}
      <section className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-[#c19a88]" />
            <h2 className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#c19a88]">
              Confirmed Squad Roster ({members.length}/6)
            </h2>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">1–6 Members Policy</span>
        </div>

        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {/* Leader Row */}
          {leaderMember && (
            <div className="flex items-center justify-between py-3.5 group">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-xs font-mono font-bold text-[#c19a88] w-6 shrink-0">
                  01
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {leaderMember.name}
                    </p>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#e8c5b4]">
                      • Team Lead
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 text-[11px] text-white/45 font-mono truncate">
                    <span className="truncate">{leaderMember.email}</span>
                    {leaderMember.phone && <span>• {leaderMember.phone}</span>}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400/80 shrink-0">
                Verified
              </span>
            </div>
          )}

          {/* Other Members */}
          {regularMembers.map((member, idx) => (
            <div key={member.id} className="flex items-center justify-between py-3.5 group">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-xs font-mono text-white/35 w-6 shrink-0">
                  {String(idx + 2).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                      • Member
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 text-[11px] text-white/45 font-mono truncate">
                    <span className="truncate">{member.email}</span>
                    {member.phone && <span>• {member.phone}</span>}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-white/30 shrink-0">Active</span>
            </div>
          ))}

          {/* Single Blended Open Slots Row */}
          {openSlotsCount > 0 && (
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-xs font-mono text-[#c19a88]/70 w-6 shrink-0">
                  +{openSlotsCount}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/70">
                    {openSlotsCount} Open Roster {openSlotsCount === 1 ? 'Slot' : 'Slots'} Available
                  </p>
                  <p className="text-[11px] text-white/40 font-light">
                    You can invite up to {6 - members.length} additional teammates to this pass
                  </p>
                </div>
              </div>

              <button
                onClick={shareSquadPass}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e8c5b4] hover:text-white transition-colors shrink-0"
              >
                <Share2 className="h-3 w-3 text-[#c19a88]" />
                <span>Invite / Share Pass</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Up Next Milestone (Open Left-Border Callout, No Box) */}
      <section className="relative z-10 border-l-2 border-emerald-400/60 pl-4 py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
              Up Next: Stage 1 — Online Screening Assessment
            </span>
          </div>
          <p className="font-semibold text-white text-xs sm:text-sm">
            Saturday, January 8, 2028 • 10:00 AM – 8:00 PM IST
          </p>
          <p className="text-xs text-white/50 font-light">
            Timed 45-minute technical evaluation covering core CS fundamentals &amp;{' '}
            {track?.name || 'track'} domain logic.
          </p>
        </div>

        <Link
          href="/dashboard/stages"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 group"
        >
          <span>View All 4 Stages</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </section>

      {/* 5. Open Quick-Links Footer Strip (No Boxes) */}
      <footer className="relative z-10 pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/dashboard/stages" className="group block space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
            <Layers className="h-3.5 w-3.5 text-[#c19a88]" />
            <span>Tournament Stages</span>
            <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-[#e8c5b4] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-neutral-500 font-light">
            Review timeline, rubrics &amp; elimination rules.
          </p>
        </Link>

        <Link href="/dashboard/submission" className="group block space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
            <Send className="h-3.5 w-3.5 text-[#c19a88]" />
            <span>Deliverables Portal</span>
            <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-[#e8c5b4] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-neutral-500 font-light">
            Upload Stage 2 Architecture PDF &amp; Stage 3 Codebase.
          </p>
        </Link>

        <Link href="/dashboard/track" className="group block space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-[#e8c5b4] transition-colors">
            <Code2 className="h-3.5 w-3.5 text-[#c19a88]" />
            <span>Track Specifications</span>
            <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-[#e8c5b4] group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-neutral-500 font-light">
            Recommended stack &amp; guidelines for {track?.name || 'your track'}.
          </p>
        </Link>
      </footer>
    </motion.div>
  );
}
