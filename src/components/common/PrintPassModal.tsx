'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Printer, Download, X, Sparkles, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

interface PrintPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  trackName?: string;
  leaderName?: string;
  leaderEmail?: string;
  membersCount?: number;
  paymentRef?: string;
  qrCode?: string;
}

export default function PrintPassModal({
  isOpen,
  onClose,
  teamId,
  teamName,
  trackName = 'Technical Arena',
  leaderName,
  leaderEmail,
  membersCount = 1,
  paymentRef,
  qrCode,
}: PrintPassModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    onClose();
    // Allow React state update to unmount modal before print dialog opens
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[28px] border border-[#f5f5f5]/35 bg-gradient-to-b from-[#171717] via-[#111111] to-[#0A0A0A] p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5f5f5] to-transparent opacity-90" />

        {/* Ambient radial glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#f5f5f5]/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#737373]/15 blur-[80px]" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#737373] to-[#f5f5f5] p-[1px] shadow-lg shrink-0">
              <div className="h-full w-full rounded-[10px] bg-black/85 flex items-center justify-center">
                <Printer className="h-4 w-4 text-[#ffffff]" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#c19a88] block">
                SkaleKraft Official Credential
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Print Hackathon Pass
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Credential Preview Card */}
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-3.5 relative z-10 shadow-inner">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Authorized Squad
              </p>
              <h3 className="text-base font-bold text-white truncate">
                {teamName}
              </h3>
              <p className="text-xs text-[#ffffff] truncate mt-0.5">
                {trackName}
              </p>
            </div>

            {qrCode ? (
              <div className="h-16 w-16 rounded-lg bg-white p-1 shrink-0 border border-[#f5f5f5]/40 shadow">
                <Image src={qrCode} alt="QR Pass" width={56} height={56} unoptimized />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block">Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 text-xs mt-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Verified &amp; Paid
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block">Format</span>
              <span className="font-semibold text-neutral-200 text-xs block mt-0.5 truncate">
                Single A4 Portrait
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1 pt-1">
            <span>Pass ID: <strong className="text-white">{teamId.toUpperCase()}</strong></span>
            <span>{membersCount} {membersCount === 1 ? 'Innovator' : 'Innovators'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1 relative z-10">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#737373] via-[#f5f5f5] to-[#ffffff] hover:brightness-110 px-6 py-3 text-xs font-bold text-black shadow-lg shadow-[#737373]/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Pass Now</span>
          </button>

          <a
            href={`/api/receipt/download?pass=${encodeURIComponent(teamId)}`}
            download={`Skaleathon_Receipt_${teamId}.pdf`}
            onClick={() => onClose()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#f5f5f5]/30 bg-[#f5f5f5]/10 hover:bg-[#f5f5f5]/20 px-6 py-2.5 text-xs font-semibold text-[#ffffff] hover:text-white transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download High-Resolution PDF</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1 text-center text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
