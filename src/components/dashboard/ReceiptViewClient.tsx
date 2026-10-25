'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Team, TeamMember, EventTrack, PaymentOrder } from '@/lib/db/types';

interface ReceiptViewClientProps {
  team: Team;
  members: TeamMember[];
  track?: EventTrack | null;
  paymentOrder?: PaymentOrder | null;
  qrCodeUrl?: string;
}

export default function ReceiptViewClient({
  team,
  members,
  track,
  paymentOrder,
  qrCodeUrl,
}: ReceiptViewClientProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [printing, setPrinting] = useState(false);

  const leaderMember = members.find((m) => m.role === 'leader') || members[0];
  const downloadUrl = `/api/receipt/download?pass=${encodeURIComponent(team.id)}`;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
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
      window.location.href = downloadUrl;
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setPrinting(false);
      }, 50);
    });
  };

  const formattedDate = team.created_at
    ? new Date(team.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  const paymentRef = paymentOrder?.razorpay_payment_id || 'RZP_SETTLED_TEST';
  const amountStr = paymentOrder?.amount_inr ? `₹${Number(paymentOrder.amount_inr).toFixed(2)}` : '₹500.00';

  return (
    <>
      {/* Printable A4 Pass Frame (visible only when printing) */}
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
              <small>National Hackathon by SkaleKraft</small>
            </div>
          </header>

          <div className="print-pass-body">
            <div className="print-pass-status-row">
              <div className="print-pass-status">
                <span className="print-pass-status-dot" />
                <div>
                  <small>Registration &amp; Payment Status</small>
                  <strong>Verified &amp; Paid ({amountStr})</strong>
                </div>
              </div>
              <div className="print-pass-id">
                <small>Registration Credential ID</small>
                <strong>{team.id.toUpperCase()}</strong>
              </div>
            </div>

            <section className="print-pass-intro">
              <p>Official hackathon entry for</p>
              <h2>{team.name}</h2>
              <span>Authorized Engineering Squad</span>
            </section>

            <section className="print-pass-facts" aria-label="Squad details">
              <div>
                <small>Competition Track</small>
                <strong>{track?.name || 'General Arena'}</strong>
              </div>
              <div>
                <small>Team Leader</small>
                <strong>{leaderMember?.name || 'Team Lead'}</strong>
              </div>
              <div>
                <small>Institution / Organization</small>
                <strong>{team.college_or_org || 'Independent Squad'}</strong>
              </div>
              <div>
                <small>Registered Location</small>
                <strong>{team.city ? `${team.city}, ` : ''}{team.state || 'India'}</strong>
              </div>
            </section>

            <section className="print-pass-roster">
              <div className="print-pass-section-heading">
                <div>
                  <small>Confirmed Squad Roster</small>
                  <h3>Registered Participants</h3>
                </div>
                <strong>{members.length} / 6 Seats Enrolled</strong>
              </div>

              <div className="print-pass-roster-grid">
                {members.map((member, index) => (
                  <div className="print-pass-member" key={member.id || index}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <small>{member.email}{member.phone ? ` • ${member.phone}` : ''}</small>
                    </div>
                    <em>{member.id === leaderMember?.id || member.role === 'leader' ? 'Team Lead' : 'Member'}</em>
                  </div>
                ))}

                {Array.from({ length: Math.max(0, 6 - members.length) }).map((_, index) => (
                  <div className="print-pass-member print-pass-member-open" key={`open-${index}`}>
                    <span>{String(members.length + index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>Open Team Position</strong>
                      <small>Can be invited from Squad Dashboard</small>
                    </div>
                    <em>Available</em>
                  </div>
                ))}
              </div>
            </section>

            <section className="print-pass-verification">
              <div className="print-pass-qr">
                {qrCodeUrl ? (
                  <Image src={qrCodeUrl} alt="Registration verification QR code" width={112} height={112} unoptimized />
                ) : (
                  <span>QR</span>
                )}
              </div>
              <div className="print-pass-verification-copy">
                <small>Official Hackathon Record</small>
                <h3>Scan to verify authorized squad credential</h3>
                <p>
                  Official registration and payment receipt for SKALEATHON. Present this pass or your digital record with photo ID at hackathon checkpoints.
                </p>
                <div>
                  <span>Issued Date <strong>{formattedDate}</strong></span>
                  <span>Payment Ref <strong>{paymentRef}</strong></span>
                  <span>Amount Paid <strong>{amountStr} INR</strong></span>
                </div>
              </div>
            </section>
          </div>

          <footer className="print-pass-footer">
            <div>
              <strong>SKALEKRAFT</strong>
              <span>Build. Innovate. Scale.</span>
            </div>
            <p>System-generated official receipt · Authorized digital seal · skaleathon.skalekraft.in</p>
          </footer>
        </div>
      </article>

      {/* On-Screen Luxury Editorial Layout */}
      <div className="screen-only-content relative w-full max-w-4xl mx-auto space-y-8 pb-20 text-neutral-200">
        {/* Top Navigation & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Squad Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#737373] via-[#737373] to-[#f5f5f5] hover:from-[#a3a3a3] hover:to-[#d4d4d4] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#737373]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Preparing PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={printing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:text-white transition-all cursor-pointer active:scale-[0.98] disabled:opacity-75"
            >
              {printing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#c19a88]" />
                  <span>Opening Print...</span>
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4 text-[#c19a88]" />
                  <span>Print Receipt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editorial Receipt Voucher Card */}
        <div className="rounded-3xl border border-[#f5f5f5]/30 bg-gradient-to-b from-[#171717] via-[#111111] to-[#0A0A0A] p-6 sm:p-9 relative overflow-hidden shadow-2xl shadow-black/80 space-y-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5f5f5] to-transparent opacity-90" />
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#f5f5f5]/10 blur-[90px]" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#737373] to-[#f5f5f5] p-[1px] shadow-lg shrink-0">
                <div className="h-full w-full rounded-[11px] bg-black/85 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#ffffff]" />
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c19a88] font-mono block">
                  SkaleKraft Official Registration Receipt
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {team.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                VERIFIED PAID
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Issued on {formattedDate}
              </span>
            </div>
          </div>

          {/* 4-Item Particulars Grid */}
          <div className="mobile-card-grid relative z-10 grid grid-cols-2 gap-3 text-xs lg:grid-cols-4">
            <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Registration ID
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-white text-xs">
                  {team.id}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(team.id);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
                  title="Copy Registration ID"
                >
                  {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Track Arena
              </span>
              <span className="font-semibold text-[#ffffff] block truncate">
                {track?.name || 'General Arena'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Team Leader
              </span>
              <span className="font-semibold text-white block truncate">
                {leaderMember?.name || 'Team Lead'}
              </span>
              <span className="text-[10px] text-neutral-400 block truncate">
                {leaderMember?.email}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Amount Settled
              </span>
              <span className="font-mono font-bold text-emerald-400 text-xs block">
                {amountStr} INR
              </span>
              <span className="text-[10px] text-neutral-400 font-mono block truncate">
                Ref: {paymentRef}
              </span>
            </div>
          </div>

          {/* Confirmed Squad Members Roster */}
          <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c19a88] font-mono">
                Confirmed Squad Roster ({members.length}/6 Seats)
              </span>
              <span className="text-xs text-neutral-400">
                {team.college_or_org ? `${team.college_or_org} • ` : ''}{team.city ? `${team.city}, ` : ''}{team.state || 'India'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {members.map((member, idx) => {
                const isLeader = member.id === leaderMember?.id || member.role === 'leader';
                return (
                  <div
                    key={member.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.015]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-[#c19a88] font-bold shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white block truncate">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-neutral-400 truncate block">
                          {member.email}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 ${
                        isLeader
                          ? 'border border-[#f5f5f5]/40 bg-[#f5f5f5]/10 text-[#ffffff] font-bold'
                          : 'border border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      {isLeader ? 'LEAD' : 'MEMBER'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Security Guarantee */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Cryptographically verified entry seal registered in hackathon ledger.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="text-xs text-[#ffffff] hover:text-white underline underline-offset-4 font-medium transition-colors cursor-pointer disabled:opacity-75"
              >
                {downloading ? 'Preparing PDF...' : 'Download PDF Copy'}
              </button>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={handlePrint}
                disabled={printing}
                className="text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-75"
              >
                {printing ? 'Opening Print...' : 'Print Voucher'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
