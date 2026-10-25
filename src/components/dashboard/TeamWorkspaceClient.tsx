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
  Download,
  FileText,
  Loader2,
  MapPin,
  Building,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Layers,
  Send,
  Code2,
} from 'lucide-react';
import { Team, TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';
import { motion } from 'framer-motion';
import { EditorialIndexBar } from '@/components/ui/EditorialIndexBar';
import QRCode from 'qrcode';
import PrintPassModal from '@/components/common/PrintPassModal';

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
  const [passQrCode, setPassQrCode] = useState('');
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [printingPass, setPrintingPass] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const leaderMember = members.find((m) => m.role === 'leader') || members[0];
  const regularMembers = members.filter((m) => m.id !== leaderMember?.id);

  const handleDownloadReceipt = async () => {
    if (downloadingReceipt) return;
    setDownloadingReceipt(true);
    try {
      const { generateReceiptPDF } = await import('@/lib/receipt/generator');
      const pdfBytes = await generateReceiptPDF({
        team,
        members,
        track,
        paymentOrder,
        leaderMember,
      });

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Skaleathon_Receipt_${team.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Client receipt download error, falling back to server route:', err);
      window.location.href = `/api/receipt/download?pass=${encodeURIComponent(team.id)}`;
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const handlePrintPass = () => {
    setPrintingPass(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setPrintingPass(false);
      }, 50);
    });
  };

  useEffect(() => {
    const verificationUrl = `https://skaleathon.skalekraft.in/dashboard/team?pass=${encodeURIComponent(team.id)}`;

    QRCode.toDataURL(verificationUrl, {
      width: 360,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#111111',
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

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPassId(true);
      setTimeout(() => setCopiedPassId(false), 2000);
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
              <strong>Registration Receipt</strong>
              <small>National Hackathon by SkaleKraft</small>
            </div>
          </header>

          <div className="print-pass-body">
            <div className="print-pass-status-row">
              <div className="print-pass-status">
                <span className="print-pass-status-dot" />
                <div>
                  <small>Registration &amp; Payment Status</small>
                  <strong>Verified &amp; Paid ({paymentOrder?.amount_inr ? `₹${Number(paymentOrder.amount_inr).toFixed(2)}` : '₹500.00'})</strong>
                </div>
              </div>
              <div className="print-pass-id">
                <small>Registration Credential ID</small>
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="screen-only-content relative w-full space-y-14 pb-24 text-neutral-200"
      >
      {/* Subtle Background Ambient Glows (Blended into background) */}
      <div className="pointer-events-none absolute -top-20 right-10 h-96 w-96 rounded-full bg-[#f5f5f5]/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-[#737373]/12 blur-[140px]" />

      {/* 1. Open Luxury Editorial Hero */}
      <header className="relative pt-1">
        {/* Faint Oversized Architectural Watermark */}
        <div className="pointer-events-none select-none absolute right-2 top-8 hidden xl:block overflow-hidden">
          <span className="font-mono text-[110px] font-black tracking-tighter text-white/[0.02] leading-none uppercase">
            SQUAD
          </span>
        </div>

        {/* Top Utility & Context Ribbon */}
        <div className="relative z-10 flex flex-col gap-3 border-b border-white/[0.07] pb-4 mb-5 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div className="grid w-full grid-cols-2 gap-2 font-mono text-[9px] uppercase tracking-[0.16em] sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2.5 sm:text-[10px] sm:tracking-[0.25em]">
            <span className="col-span-2 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-[#c19a88] sm:col-auto sm:min-h-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0">
              <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="sm:hidden">Official Squad Pass</span>
              <span className="hidden sm:inline">Official Squad Pass // Active Roster</span>
            </span>
            <span className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-2 text-center font-semibold text-emerald-400 sm:min-h-0 sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0">
              Registration Paid
            </span>
            <span className="hidden text-white/20 sm:inline">•</span>
            <button
              onClick={() => copyToClipboard(team.id)}
              className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2 text-neutral-400 transition-colors hover:text-white sm:min-h-0 sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0"
              title="Click to copy full Pass ID"
            >
              <span>ID:</span>
              <span className="text-[#ffffff] font-semibold">
                [{team.id.toUpperCase()}]
              </span>
              {copiedPassId ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-2.5 w-2.5 text-neutral-500 group-hover:text-[#c19a88] transition-colors" />
              )}
            </button>
          </div>

          {/* Right Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={downloadingReceipt}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#f5f5f5]/30 bg-[#f5f5f5]/10 hover:bg-[#f5f5f5]/20 active:scale-[0.98] px-4 py-2 font-semibold text-[#ffffff] hover:text-white transition-all cursor-pointer shadow-sm shadow-[#737373]/20 disabled:opacity-75"
              title="Download official PDF registration receipt"
            >
              {downloadingReceipt ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ffffff]" />
                  <span>Preparing PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-[#ffffff]" />
                  <span>Download Receipt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editorial Headline & Manifesto */}
        <div className="relative z-10 max-w-3xl space-y-4 pb-6 sm:space-y-5 sm:pb-9">
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.06]">
            Squad{' '}
            <span className="font-serif italic font-normal text-[#ffffff]">
              {team.name}
            </span>
          </h1>

          <div className="border-l-2 border-[#f5f5f5]/45 pl-3.5 space-y-2 sm:pl-4">
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

      {/* 2. Section 01: Squad Telemetry Cards */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              01 // Squad Credentials &amp; Verification
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Enrollment &amp; <span className="text-[#c19a88]">Pass Status</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-400 sm:text-right">
            Official hackathon registration record and active milestone schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Card 01 */}
          <div className="group relative min-h-[300px] overflow-hidden rounded-[28px] border border-[#f5f5f5]/25 bg-[linear-gradient(145deg,#171717_0%,#111111_72%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.42)] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#f5f5f5]/10 blur-3xl" />
            <div className="relative flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#c19a88] font-bold">
                Pillar 01 • Squad Leadership &amp; Pass
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified &amp; Paid</span>
              </span>
            </div>

            <div className="mt-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#f5f5f5]/25 bg-[#f5f5f5]/10 text-[#ffffff]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/35">Authorized squad lead</p>
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Led by {leaderMember?.name || userName || 'Team Lead'}
              </h3>
              <p className="mt-2 max-w-xl text-sm font-normal leading-relaxed text-neutral-400">
                Competition notices and milestone updates are sent to{' '}
                <span className="break-all text-neutral-200">{leaderMember?.email || userEmail}</span>.
              </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-black/20 p-3 font-mono text-[10px] sm:flex sm:gap-8">
              <span className="text-white/35">PAYMENT REF <strong className="mt-1 block text-[#ffffff]">{paymentOrder?.razorpay_payment_id || 'RZP_SETTLED'}</strong></span>
              <span className="text-white/35">ENROLLED <strong className="mt-1 block text-white/75">{formattedDate}</strong></span>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                disabled={downloadingReceipt}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#737373] to-[#f5f5f5] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:from-[#a3a3a3] hover:to-[#d4d4d4] disabled:opacity-75"
              >
                {downloadingReceipt ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Preparing PDF...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-white" />
                    <span>Download Official Receipt (PDF)</span>
                  </>
                )}
              </button>

              <Link
                href={`/dashboard/receipt?pass=${encodeURIComponent(team.id)}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-neutral-200 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
              >
                <FileText className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>View Full Receipt</span>
              </Link>
            </div>
            </div>
          </div>

          {/* Card 02 */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,#171717_0%,#111111_75%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.42)] sm:p-8">
            <span className="pointer-events-none absolute -bottom-8 right-4 font-mono text-[120px] font-black leading-none text-white/[0.025]">01</span>
            <div className="relative flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#ffffff] font-bold">
                  Pillar 02 • Next Active Milestone
                </span>
                <span className="rounded-full border border-[#f5f5f5]/25 bg-[#f5f5f5]/10 px-3 py-1.5 font-mono text-xs font-bold text-[#ffffff]">
                  Stage 01
                </span>
              </div>
              <div className="mt-8 grid grid-cols-[72px_1fr] items-start gap-4">
                <div className="rounded-2xl border border-[#f5f5f5]/25 bg-[#f5f5f5]/10 py-3 text-center">
                  <strong className="block text-2xl font-black leading-none text-white">08</strong>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-[#ffffff]">Jan 2027</span>
                </div>
                <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/35">45-minute online assessment</p>
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Online Technical Screening Quiz
              </h3>
              <p className="mt-2 text-sm font-normal leading-relaxed text-neutral-400">
                CS fundamentals, data structures, algorithms, and {track?.name || 'track'} domain logic.
              </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-white/45">
                <Calendar className="h-4 w-4 text-[#c19a88]" />
                <span>Friday, January 8, 2027</span>
              </div>

            <div className="mt-auto pt-6">
              <Link
                href="/dashboard/stages"
                className="group inline-flex items-center gap-2 text-xs font-bold text-[#ffffff] transition-colors hover:text-white"
              >
                <span>Review preparation &amp; syllabus</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 02: Confirmed Squad Roster Cards */}
      <section id="roster" className="space-y-5 pt-4 scroll-mt-28">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c19a88] font-bold block mb-1">
              02 // Registered Engineers ({members.length} of 6)
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Confirmed Squad <span className="text-[#c19a88]">Roster</span>
            </h2>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/45">
              <span>Squad capacity</span>
              <span className="text-[#ffffff]">{members.length} / 6 confirmed</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#737373] to-[#ffffff]" style={{ width: `${Math.max((members.length / 6) * 100, 8)}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Leader Card */}
          {leaderMember && (
            <div className="rounded-2xl border border-[#f5f5f5]/35 bg-[linear-gradient(135deg,#171717,#111111)] p-5 flex items-center justify-between gap-4 shadow-[0_16px_45px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#737373] to-[#f5f5f5] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                  {leaderMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-bold text-white truncate">
                      {leaderMember.name}
                    </p>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f5f5f5]/20 text-[#ffffff] border border-[#f5f5f5]/40 shrink-0">
                      Team Lead
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono truncate">
                    {leaderMember.email}
                  </p>
                  {leaderMember.phone && (
                    <p className="text-[11px] text-white/50 font-mono">
                      {leaderMember.phone}
                    </p>
                  )}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified</span>
              </span>
            </div>
          )}

          {/* Regular Members */}
          {regularMembers.map((member, idx) => (
            <div key={member.id} className="rounded-2xl border border-white/10 bg-[#141414] p-5 flex items-center justify-between gap-4 hover:border-white/20 transition-all">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-bold text-white truncate">
                      {member.name}
                    </p>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 shrink-0">
                      Member #{idx + 2}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono truncate">
                    {member.email}
                  </p>
                  {member.phone && (
                    <p className="text-[11px] text-white/50 font-mono">
                      {member.phone}
                    </p>
                  )}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirmed</span>
              </span>
            </div>
          ))}
        </div>
      </section>
      </motion.div>
    </>
  );
}
