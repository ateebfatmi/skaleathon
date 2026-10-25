'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import PrintPassModal from '@/components/common/PrintPassModal';
import {
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Users,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Clock,
  Layers,
  FileText,
  Send,
  PlusCircle,
  HelpCircle,
  Printer,
  Download,
} from 'lucide-react';
import { Team, TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';

interface RegisteredTeamViewProps {
  team: Team;
  members: TeamMember[];
  track?: EventTrack;
  paymentOrder?: PaymentOrder | null;
  userName?: string;
  userEmail?: string;
}

export default function RegisteredTeamView({
  team,
  members,
  track,
  paymentOrder,
  userName,
  userEmail,
}: RegisteredTeamViewProps) {
  const [passQrCode, setPassQrCode] = useState<string>('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (team?.id) {
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
    }
  }, [team?.id]);

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

  return (
    <>
      {/* High-Resolution A4 Print Pass */}
      <article className="skaleathon-print-pass" aria-label="Official Skaleathon Registration Receipt">
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
              <strong>Registration Receipt</strong>
              <small>National Engineering Tournament</small>
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
                <strong>{members.length} {members.length === 1 ? 'member' : 'members'} confirmed</strong>
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

      <div className="space-y-8 max-w-4xl mx-auto">
      {/* Official Digital Team Pass Card */}
      <div className="rounded-[28px] border border-[#c19a88]/40 bg-[linear-gradient(145deg,rgba(193,154,136,0.06),rgba(14,14,14,0.98))] p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-[#c19a88]/15 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-72 h-72 bg-[#805948]/15 rounded-full blur-[90px]" />

        {/* Pass Top Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Registration Verified</span>
            </span>
            <span className="text-white/30 text-xs hidden sm:inline">•</span>
            <span className="font-mono text-xs text-white/50 tracking-wider">
              PASS ID: <span className="text-white font-semibold">{team.id}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {track && (
              <span className="rounded-full border border-[#c19a88]/30 bg-[#c19a88]/15 px-3 py-1 text-xs font-medium text-[#e8c5b4]">
                {track.name}
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono font-bold text-white/90">
              ₹{paymentOrder?.amount_inr ?? '—'} Paid
            </span>
          </div>
        </div>

        {/* Team Identity Banner */}
        <div className="py-6 space-y-2 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#c19a88]">
                Registered Team Entry
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                {team.name}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/api/receipt/download?pass=${encodeURIComponent(team.id)}`}
                download={`Skaleathon_Receipt_${team.id}.pdf`}
                className="w-fit inline-flex items-center gap-2 rounded-xl border border-[#c19a88]/30 bg-[#c19a88]/10 hover:bg-[#c19a88]/20 px-3.5 py-2 text-xs font-semibold text-[#e8c5b4] hover:text-white transition-all cursor-pointer shadow-sm shadow-[#805948]/20"
                title="Download official PDF registration receipt"
              >
                <Download className="h-3.5 w-3.5 text-[#e8c5b4]" />
                <span>Download Receipt</span>
              </a>

              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="w-fit inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                title="Print official pass"
              >
                <Printer className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>

          <PrintPassModal
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            teamId={team.id}
            teamName={team.name}
            trackName={track?.name}
            leaderName={leaderMember?.name || userName}
            leaderEmail={leaderMember?.email || userEmail}
            membersCount={members.length}
            paymentRef={paymentOrder?.razorpay_payment_id || 'RZP_SETTLED'}
            qrCode={passQrCode}
          />
          <p className="text-xs text-white/55 font-light">
            {team.college_or_org ? `${team.college_or_org} • ` : ''}
            {team.city ? `${team.city}, ` : ''}
            {team.state || 'India'}
          </p>
        </div>

        {/* Details Grid */}
        <div className="mobile-card-grid grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-2 pb-6 border-b border-white/10 relative z-10 text-xs">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">Team Leader</span>
            <span className="font-semibold text-white block truncate">
              {leaderMember?.name || userName || 'Team Lead'}
            </span>
            <span className="text-white/50 text-[11px] font-mono truncate block">
              {leaderMember?.email || userEmail}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">Roster Size</span>
            <span className="font-semibold text-white block">
              {members.length} {members.length === 1 ? 'Engineer' : 'Engineers'}
            </span>
            <span className="text-[#c19a88] text-[11px] block">
              {6 - members.length > 0 ? `Can add ${6 - members.length} more` : 'Max capacity reached'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">Payment Verification</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>₹{paymentOrder?.amount_inr ?? '—'} Verified Paid</span>
            </span>
            <span className="text-white/40 text-[10px] font-mono truncate block">
              Ref: {paymentOrder?.razorpay_payment_id || 'RZP_CONFIRMED'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider block">Enrollment Date</span>
            <span className="font-semibold text-white block">{formattedDate}</span>
            <span className="text-white/40 text-[10px] block">Official Event Entry</span>
          </div>
        </div>

        {/* Squad Members Roster */}
        <div className="pt-6 space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#c19a88]">
              Confirmed Squad Roster ({members.length}/6)
            </h3>
            <Link
              href="/dashboard/team"
              className="text-xs text-[#c19a88] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Manage Members</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mobile-card-grid grid grid-cols-2 gap-2.5">
            {/* Leader Card */}
            {leaderMember && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#c19a88]/30 bg-[#c19a88]/[0.06]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-[#c19a88]/20 border border-[#c19a88]/40 flex items-center justify-center text-xs font-bold text-[#e8c5b4] shrink-0">
                    {leaderMember.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{leaderMember.name}</p>
                    <p className="text-[10px] text-white/50 font-mono truncate">{leaderMember.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#c19a88]/20 border border-[#c19a88]/40 px-2 py-0.5 text-[10px] font-mono font-bold text-[#e8c5b4] shrink-0">
                  Lead
                </span>
              </div>
            )}

            {/* Other Members */}
            {regularMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-white/80 shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{member.name}</p>
                    <p className="text-[10px] text-white/50 font-mono truncate">{member.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/[0.04] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/50 shrink-0">
                  Member
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Up Next: Stage 1 Milestone Alert */}
        <div className="mt-7 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 sm:p-5 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Up Next: Stage 1 — Online Screening Quiz
              </span>
            </div>
            <p className="text-xs font-semibold text-white">
              Friday, January 8, 2027 • 10:00 AM – 8:00 PM IST
            </p>
            <p className="text-[11px] text-white/60 font-light">
              Timed 45-minute screening assessment covering core CS fundamentals, logic, and {track?.name || 'track'} topics.
            </p>
          </div>
          <Link
            href="/dashboard/stages"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all"
          >
            <span>View Full Roadmap</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-8 py-3.5 text-xs font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Enter Participant Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/dashboard/stages"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 text-xs font-semibold text-white transition-all"
        >
          <Layers className="h-4 w-4 text-[#c19a88]" />
          <span>Competition Stages</span>
        </Link>

        <Link
          href="/dashboard/team"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 text-xs font-semibold text-white transition-all"
        >
          <Users className="h-4 w-4 text-[#c19a88]" />
          <span>Team Workspace</span>
        </Link>
      </div>

      {/* Alternative Action: Register Another Team */}
      <div className="pt-4 text-center border-t border-white/10">
        <p className="text-xs text-white/40">
          Want to register an additional squad?{' '}
          <Link
            href="/register?new=true"
            className="text-[#c19a88] hover:text-white underline font-medium transition-colors"
          >
            Click here to open a new registration form
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
