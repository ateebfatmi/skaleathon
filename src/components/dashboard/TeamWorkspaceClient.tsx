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
  Sparkles,
  Layers,
  Send,
  Code2,
  Share2,
  BrainCircuit,
  Globe,
  Smartphone,
  Shield,
  Award,
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
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const leaderMember = members.find((m) => m.role === 'leader') || members[0];
  const regularMembers = members.filter((m) => m.id !== leaderMember?.id);

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

  const copyToClipboard = (text: string, type: 'pass' | 'invite' | 'email', emailVal?: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'pass') {
        setCopiedPassId(true);
        setTimeout(() => setCopiedPassId(false), 2200);
      } else if (type === 'invite') {
        setCopiedInvite(true);
        setTimeout(() => setCopiedInvite(false), 2200);
      } else if (type === 'email' && emailVal) {
        setCopiedEmail(emailVal);
        setTimeout(() => setCopiedEmail(null), 2000);
      }
    }
  };

  const shareSquadPass = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `Skaleathon Squad: ${team.name}`,
          text: `We are competing in Skaleathon under Team ${team.name} (${track?.name || 'Technical Track'}). Official Pass ID: ${team.id}`,
          url: window.location.href,
        })
        .catch(() => {
          copyToClipboard(
            `Skaleathon Squad: ${team.name} | Pass ID: ${team.id} | Track: ${track?.name || 'General'}`,
            'invite'
          );
        });
    } else {
      copyToClipboard(
        `Skaleathon Squad: ${team.name} | Pass ID: ${team.id} | Track: ${track?.name || 'General'}`,
        'invite'
      );
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
    <div className="space-y-10 text-neutral-200">
      {/* 1. Page Header & Live Status */}
      <div className="space-y-4 pb-8 border-b border-white/[0.08] relative">
        <div className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full bg-[#c19a88]/10 blur-[100px]" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Roster Management // Team Command Center</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
              title="Print official team credentials"
            >
              <Printer className="h-3.5 w-3.5 text-[#c19a88]" />
              <span className="hidden sm:inline">Print Pass</span>
            </button>

            <button
              onClick={shareSquadPass}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 hover:bg-[#c19a88]/20 px-3.5 py-1.5 text-xs font-semibold text-[#e8c5b4] transition-all shadow-sm"
              title="Share squad credentials"
            >
              {copiedInvite ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Pass Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Pass</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            Team{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block pr-3 sm:pr-4">
              Workspace
            </span>
            .
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-light leading-relaxed">
            Manage your official competition squad roster, view verified credentials, copy team pass identification, and track tournament deliverables.
          </p>
        </div>
      </div>

      {/* 2. Master Digital Team Pass Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[28px] border border-[#c19a88]/35 bg-[linear-gradient(145deg,rgba(193,154,136,0.07),rgba(14,14,14,0.98))] p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden"
      >
        {/* Subtle radial ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-[#c19a88]/15 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-72 h-72 bg-[#805948]/15 rounded-full blur-[90px]" />

        {/* Top Pass Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Registration Verified</span>
            </span>

            <span className="text-white/30 text-xs hidden sm:inline">•</span>

            <button
              onClick={() => copyToClipboard(team.id, 'pass')}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#c19a88]/40 px-3 py-1 text-xs font-mono text-white/60 hover:text-white transition-all"
              title="Click to copy full Pass ID"
            >
              <span>PASS ID:</span>
              <span className="text-white font-semibold">{team.id.slice(0, 14)}...</span>
              {copiedPassId ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 text-neutral-400 group-hover:text-[#c19a88] transition-colors" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {track && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/15 px-3 py-1 text-xs font-medium text-[#e8c5b4]">
                <TrackIcon className="h-3.5 w-3.5" />
                <span>{track.name}</span>
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono font-bold text-white/90">
              ₹99 Paid
            </span>
          </div>
        </div>

        {/* Team Identity Banner */}
        <div className="py-7 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#c19a88]">
                Registered Engineering Squad
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
                {team.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/track"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white transition-all"
              >
                <Code2 className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Track Specs</span>
                <ArrowRight className="h-3 w-3 text-neutral-500" />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60 font-light pt-1">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>{team.city ? `${team.city}, ` : ''}{team.state || 'India'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>{team.college_or_org || 'Independent Squad'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Enrolled: {formattedDate}</span>
            </span>
          </div>
        </div>

        {/* 4 Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3 pb-6 border-b border-white/10 relative z-10 text-xs">
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider block">
              Team Leader
            </span>
            <span className="font-semibold text-white block truncate text-sm">
              {leaderMember?.name || userName || 'Team Lead'}
            </span>
            <span className="text-white/50 text-[11px] font-mono truncate block">
              {leaderMember?.email || userEmail}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider block">
              Roster Capacity
            </span>
            <span className="font-semibold text-white block text-sm">
              {members.length} of 6 Engineers
            </span>
            <span className="text-[#c19a88] text-[11px] block font-medium">
              {6 - members.length > 0 ? `${6 - members.length} more slots eligible` : 'Full squad roster (6/6)'}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider block">
              Payment Verification
            </span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>₹99 Flat Verified</span>
            </span>
            <span className="text-white/40 text-[10px] font-mono truncate block">
              Ref: {paymentOrder?.razorpay_payment_id || 'RZP_AUTOMATED_SETTLED'}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider block">
              Current Milestone
            </span>
            <span className="font-semibold text-white block text-sm">Stage 1 Screening</span>
            <span className="text-white/40 text-[10px] block">Saturday, Jan 08, 2028</span>
          </div>
        </div>

        {/* Squad Members Roster */}
        <div className="pt-7 space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#c19a88]" />
              <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#c19a88]">
                Confirmed Squad Roster ({members.length}/6)
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              Policy: 1 to 6 engineers per registered team
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Leader Card */}
            {leaderMember && (
              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#c19a88]/35 bg-[#c19a88]/[0.08] relative group hover:border-[#c19a88]/60 transition-all shadow-sm">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#c19a88]/30 to-[#805948]/30 border border-[#c19a88]/50 flex items-center justify-center text-sm font-bold text-[#f5ded3] shrink-0 shadow-inner">
                    {leaderMember.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{leaderMember.name}</p>
                      <span className="rounded-full bg-[#c19a88]/25 border border-[#c19a88]/40 px-2 py-0.5 text-[9px] font-mono font-bold text-[#f5ded3] shrink-0 uppercase tracking-wider">
                        Lead
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/55 font-mono">
                      <span className="inline-flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 text-neutral-400" />
                        <span className="truncate">{leaderMember.email}</span>
                      </span>

                      {leaderMember.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          <span>{leaderMember.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono font-bold text-[#c19a88]/70 shrink-0 self-start pt-1">
                  #01
                </div>
              </div>
            )}

            {/* Other Members */}
            {regularMembers.map((member, idx) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all relative group shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white/80 shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                      <span className="rounded-full bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[9px] font-mono font-medium text-neutral-400 shrink-0 uppercase tracking-wider">
                        Engineer
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/55 font-mono">
                      <span className="inline-flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 text-neutral-400" />
                        <span className="truncate">{member.email}</span>
                      </span>

                      {member.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          <span>{member.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono font-bold text-white/30 shrink-0 self-start pt-1">
                  #{String(idx + 2).padStart(2, '0')}
                </div>
              </div>
            ))}

            {/* Open Slots if squad has fewer than 6 members */}
            {Array.from({ length: Math.max(0, 6 - members.length) }).map((_, i) => (
              <div
                key={`empty-slot-${i}`}
                className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] hover:border-[#c19a88]/40 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-xs font-mono text-white/30 shrink-0">
                    +{members.length + i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/60">Open Roster Slot</p>
                    <p className="text-[11px] text-white/35 font-light">
                      Can include up to 6 engineers per team
                    </p>
                  </div>
                </div>

                <button
                  onClick={shareSquadPass}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-[#e8c5b4] transition-all shrink-0"
                >
                  <Share2 className="h-3 w-3" />
                  <span>Share Pass</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Up Next: Stage 1 Milestone Alert */}
        <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 sm:p-5 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Up Next: Stage 1 — Online Screening Assessment
              </span>
            </div>
            <p className="text-xs font-semibold text-white">
              Saturday, January 8, 2028 • 10:00 AM – 8:00 PM IST
            </p>
            <p className="text-[11px] text-white/60 font-light">
              Timed 45-minute technical evaluation covering core CS fundamentals, algorithms, and {track?.name || 'track'} topics.
            </p>
          </div>
          <Link
            href="/dashboard/stages"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all"
          >
            <span>View All 4 Stages</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </motion.div>

      {/* 3. Fast Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/stages"
          className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#c19a88]/40 hover:bg-[#c19a88]/[0.03] transition-all space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#e8c5b4]">
              <Layers className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-white">Tournament Stages</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Review detailed timeline, stage rubrics, scoring weights, and grand finale schedule.
          </p>
        </Link>

        <Link
          href="/dashboard/submission"
          className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#c19a88]/40 hover:bg-[#c19a88]/[0.03] transition-all space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#e8c5b4]">
              <Send className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-white">Deliverables Portal</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Upload Stage 2 Architecture PDF and Stage 3 deployed URLs & GitHub repositories.
          </p>
        </Link>

        <Link
          href="/dashboard/track"
          className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#c19a88]/40 hover:bg-[#c19a88]/[0.03] transition-all space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-[#c19a88]/15 border border-[#c19a88]/30 flex items-center justify-center text-[#e8c5b4]">
              <Code2 className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-white">Track Specifications</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Read specific engineering criteria and recommended tech stack for {track?.name || 'your track'}.
          </p>
        </Link>
      </div>
    </div>
  );
}
