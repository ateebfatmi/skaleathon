'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  ArrowLeft,
  ArrowUpRight,
  Layers,
  Send,
  Code2,
  Share2,
} from 'lucide-react';
import { Team, TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';
import { motion } from 'framer-motion';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';
import QRCode from 'qrcode';

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
  const [passQrCode, setPassQrCode] = useState('');

  const leaderMember = members.find((m) => m.role === 'leader') || members[0];
  const regularMembers = members.filter((m) => m.id !== leaderMember?.id);
  const openSlotsCount = Math.max(0, 6 - members.length);

  useEffect(() => {
    const verificationUrl = `https://skaleathon.skalekraft.in/dashboard/team?pass=${encodeURIComponent(team.id)}`;

    QRCode.toDataURL(verificationUrl, {
      width: 360,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#171310',
        light: '#ffffff',
      },
    })
      .then(setPassQrCode)
      .catch(() => setPassQrCode(''));
  }, [team.id]);

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

  return (
    <>
      <article className="skaleathon-print-pass" aria-label="Official Skaleathon squad pass">
        <div className="print-pass-frame">
          <header className="print-pass-header">
            <div className="print-pass-brand">
              <Image
                src="/images/skalekraft-logo.png"
                alt="SkaleKraft"
                width={68}
                height={68}
                className="print-pass-logo"
                priority
              />
              <div>
                <p>SkaleKraft presents</p>
                <h1>SKALE<span>ATHON</span></h1>
              </div>
            </div>
            <div className="print-pass-document-label">
              <span>Official document</span>
              <strong>Squad Credential</strong>
              <small>2027 National Engineering Tournament</small>
            </div>
          </header>

          <div className="print-pass-body">
            <div className="print-pass-status-row">
              <div className="print-pass-status">
                <span className="print-pass-status-dot" />
                <div>
                  <small>Registration status</small>
                  <strong>Verified &amp; Paid</strong>
                </div>
              </div>
              <div className="print-pass-id">
                <small>Credential ID</small>
                <strong>{team.id.toUpperCase()}</strong>
              </div>
            </div>

            <section className="print-pass-intro">
              <p>Authorized competition entry for</p>
              <h2>{team.name}</h2>
              <span>Engineering Squad</span>
            </section>

            <section className="print-pass-facts" aria-label="Squad details">
              <div>
                <small>Competition track</small>
                <strong>{track?.name || 'Technical Arena'}</strong>
              </div>
              <div>
                <small>Team lead</small>
                <strong>{leaderMember?.name || userName || 'Team Lead'}</strong>
              </div>
              <div>
                <small>Institution / organization</small>
                <strong>{team.college_or_org || 'Independent Squad'}</strong>
              </div>
              <div>
                <small>Registered location</small>
                <strong>{team.city ? `${team.city}, ` : ''}{team.state || 'India'}</strong>
              </div>
            </section>

            <section className="print-pass-roster">
              <div className="print-pass-section-heading">
                <div>
                  <small>Authorized participants</small>
                  <h3>Confirmed Squad Roster</h3>
                </div>
                <strong>{members.length} / 6 seats confirmed</strong>
              </div>

              <div className="print-pass-roster-grid">
                {members.map((member, index) => (
                  <div className="print-pass-member" key={member.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <small>{member.email}</small>
                    </div>
                    <em>{member.id === leaderMember?.id ? 'Team Lead' : 'Member'}</em>
                  </div>
                ))}
                {Array.from({ length: openSlotsCount }).map((_, index) => (
                  <div className="print-pass-member print-pass-member-open" key={`open-${index}`}>
                    <span>{String(members.length + index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>Open team position</strong>
                      <small>Not yet assigned</small>
                    </div>
                    <em>Available</em>
                  </div>
                ))}
              </div>
            </section>

            <section className="print-pass-verification">
              <div className="print-pass-qr">
                {passQrCode ? (
                  <Image src={passQrCode} alt="Squad pass verification QR code" width={112} height={112} unoptimized />
                ) : (
                  <span>QR</span>
                )}
              </div>
              <div className="print-pass-verification-copy">
                <small>Digital squad record</small>
                <h3>Scan to open the secure participant record</h3>
                <p>
                  Authorized users can sign in to review the current squad record. Present this pass
                  with a valid photo ID when requested by the organizer.
                </p>
                <div>
                  <span>Enrollment date <strong>{formattedDate}</strong></span>
                  <span>Payment reference <strong>{paymentOrder?.razorpay_payment_id || 'RZP_SETTLED'}</strong></span>
                </div>
              </div>
            </section>
          </div>

          <footer className="print-pass-footer">
            <div>
              <strong>SKALEKRAFT</strong>
              <span>Build. Innovate. Scale.</span>
            </div>
            <p>System-generated credential · No signature required · skaleathon.skalekraft.in</p>
          </footer>
        </div>
      </article>

      <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full space-y-14 pb-24 text-neutral-200"
    >
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#c19a88]/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#805948]/12 blur-[140px]" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
          <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
            SQUAD
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="mobile-utility-row relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-7 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#c19a88]">Official Squad Pass // Active Roster</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 font-semibold">STATUS: REGISTRATION PAID</span>
            <span className="text-white/20">•</span>
            <button
              onClick={() => copyToClipboard(team.id, 'pass')}
              className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
              title="Click to copy full Pass ID"
            >
              <span>ID:</span>
              <span className="text-[#e8c5b4] font-semibold">
                [{team.id.slice(0, 10).toUpperCase()}]
              </span>
              {copiedPassId ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-2.5 w-2.5 text-neutral-500 group-hover:text-[#c19a88] transition-colors" />
              )}
            </button>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-5 text-xs">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-medium"
              title="Print official team credentials"
            >
              <Printer className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Print Pass</span>
            </button>

            <span className="text-white/15">|</span>

            <button
              onClick={shareSquadPass}
              className="group inline-flex items-center gap-1.5 text-[#e8c5b4] hover:text-white transition-colors font-semibold"
              title="Share squad credentials"
            >
              {copiedInvite ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Pass!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Share Squad Pass</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editorial Headline & Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-5 pb-9">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            Squad{' '}
            <span className="font-serif italic font-normal text-[#e8c5b4]">
              {team.name}
            </span>
          </h1>

          <div className="border-l-2 border-[#c19a88]/45 pl-4 space-y-2">
            <p className="text-sm sm:text-[15px] text-neutral-300/90 leading-relaxed font-light">
              Verified engineering squad competing in{' '}
              <strong className="text-white font-medium">{track ? track.name : 'Skaleathon'}</strong>. Your team credential covers 1 to 6 members under a single flat registration pass.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45 font-mono">
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
        </div>

        {/* Full-Width 4-Column Editorial Section Index Bar with Transition */}
        <EditorialIndexBar
          layoutIdPrefix="teamWorkspaceIndex"
          items={[
            { href: '#roster', num: '01', label: `Confirmed Roster (${members.length}/6)` },
            { href: '/dashboard/track', num: '02', label: track ? track.name : 'Track Specs' },
            { href: '/dashboard/stages', num: '03', label: 'Stage 01 Screening' },
            { href: '/dashboard/submission', num: '04', label: 'Deliverables Portal' },
          ]}
        />
      </header>

      {/* 2. Section 01: Squad Telemetry Pillars */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              01 // Squad Credentials &amp; Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enrollment &amp;{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Pass Telemetry
              </span>
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-light max-w-xs">
            Official tournament registration record and active milestone schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2 border-t border-white/[0.08]">
          {/* Pillar 01 */}
          <div className="relative pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                Pillar 01 • Squad Leadership &amp; Payment
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">01</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Led by {leaderMember?.name || userName || 'Team Lead'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Primary correspondence and stage updates are dispatched to{' '}
              <span className="text-white font-mono text-xs">{leaderMember?.email || userEmail}</span>. The flat team registration is verified (Ref:{' '}
              <span className="font-mono text-[#e8c5b4]">
                {paymentOrder?.razorpay_payment_id || 'RZP_SETTLED'}
              </span>
              ).
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="relative pt-4 md:border-l md:border-white/[0.08] md:pl-8 lg:pl-12 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#e8c5b4] font-bold">
                Pillar 02 • Up Next: Stage 01 Screening
              </span>
              <span className="font-mono text-2xl font-light text-white/10 select-none">02</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Saturday, January 8, 2027 • 10:00 AM IST
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Timed 45-minute online technical screening assessment evaluating core CS fundamentals and{' '}
              {track?.name || 'track'} domain logic.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section 02: Confirmed Squad Roster Ledger */}
      <section id="roster" className="space-y-5 pt-10 border-t border-white/[0.08] scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              02 // Registered Engineers ({members.length} of 6)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Confirmed Squad{' '}
              <span className="font-serif italic font-normal text-[#e8c5b4]">
                Roster
              </span>
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            1 to 6 Members Policy
          </span>
        </div>

        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {/* Leader Row */}
          {leaderMember && (
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-mono font-bold text-[#c19a88] w-6 shrink-0">
                  01
                </span>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm sm:text-base font-bold text-white truncate">
                      {leaderMember.name}
                    </p>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#e8c5b4]">
                      • Team Lead
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-white/45 font-mono truncate">
                    <span className="truncate">{leaderMember.email}</span>
                    {leaderMember.phone && <span>• {leaderMember.phone}</span>}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified</span>
              </span>
            </div>
          )}

          {/* Other Members */}
          {regularMembers.map((member, idx) => (
            <div key={member.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-mono text-white/35 w-6 shrink-0">
                  {String(idx + 2).padStart(2, '0')}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm sm:text-base font-semibold text-white truncate">
                      {member.name}
                    </p>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      • Member
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-white/45 font-mono truncate">
                    <span className="truncate">{member.email}</span>
                    {member.phone && <span>• {member.phone}</span>}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-white/40 shrink-0">Active</span>
            </div>
          ))}

          {/* Single Compact Open Slots Row */}
          {openSlotsCount > 0 && (
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-mono font-bold text-[#c19a88] w-6 shrink-0">
                  +{openSlotsCount}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white/80">
                    {openSlotsCount} Open Roster {openSlotsCount === 1 ? 'Slot' : 'Slots'} Available
                  </p>
                  <p className="text-xs text-neutral-400 font-light">
                    Invite up to {6 - members.length} additional teammates to join this squad pass
                  </p>
                </div>
              </div>

              <button
                onClick={shareSquadPass}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8c5b4] hover:text-white transition-colors shrink-0"
              >
                <Share2 className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Invite / Share Pass</span>
                <ArrowRight className="h-3 w-3 text-[#c19a88] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>
      </motion.div>
    </>
  );
}
