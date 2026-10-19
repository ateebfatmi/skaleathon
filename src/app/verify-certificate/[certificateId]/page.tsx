import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { ShieldCheck, AlertCircle, Download, CheckCircle2, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function VerifyCertificatePage({
  params,
}: {
  params: { certificateId: string };
}) {
  const code = params.certificateId;
  const cert = await EventRepository.getCertificateByCode(code);

  return (
    <div className="py-20 sm:py-28 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-white/50 hover:text-[#c19a88] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Skaleathon 2027</span>
          </Link>
        </div>

        {!cert ? (
          /* Not Found State */
          <div className="rounded-[28px] border border-red-500/30 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.96))] p-8 sm:p-12 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="p-4 w-fit mx-auto rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-medium text-white">Certificate Not Found</h1>
            <p className="text-xs sm:text-sm text-white/55 max-w-md mx-auto leading-relaxed font-light">
              The identifier <code className="text-[#c19a88] font-mono bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded">{code}</code> is not registered in the Skaleathon 2027 official certificate database.
            </p>
            <p className="text-xs text-white/40 font-light">
              Please ensure the certificate code was copied accurately from the certificate or scanned directly from the QR code.
            </p>
          </div>
        ) : cert.is_revoked ? (
          /* Revoked State */
          <div className="rounded-[28px] border border-amber-500/30 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(14,14,14,0.96))] p-8 sm:p-12 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="p-4 w-fit mx-auto rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-medium text-amber-300">Certificate Revoked</h1>
            <p className="text-xs sm:text-sm text-white/55 max-w-md mx-auto leading-relaxed font-light">
              This certificate has been officially marked as revoked by the SkaleKraft Organizing Committee.
            </p>
            {cert.revocation_reason && (
              <p className="text-xs text-amber-200/80 bg-black/40 p-3 rounded-lg border border-amber-500/20 font-light">
                Reason: {cert.revocation_reason}
              </p>
            )}
          </div>
        ) : (
          /* Valid Certificate */
          <div className="rounded-[28px] border border-[#c19a88]/40 bg-[linear-gradient(145deg,rgba(193,154,136,0.06),rgba(14,14,14,0.96))] p-8 sm:p-12 space-y-8 shadow-[0_25px_70px_rgba(128,89,72,0.25)]">
            {/* Verification Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#805948]/20 border border-[#c19a88]/40 text-[#c19a88]">
                  <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c19a88]">
                    Registry Authenticated
                  </span>
                  <h1 className="text-xl font-medium text-white">Authentic SkaleKraft Certificate</h1>
                </div>
              </div>

              <div className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/70">
                Code: {cert.certificate_code}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-white/40 text-xs font-mono uppercase tracking-[0.14em]">Recipient Name</span>
                <p className="text-lg font-medium text-white">{cert.recipient_name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 text-xs font-mono uppercase tracking-[0.14em]">Team Name</span>
                <p className="text-lg font-medium text-white/80">{cert.team_name || 'Individual'}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-white/40 text-xs font-mono uppercase tracking-[0.14em]">Merit Conferral</span>
                <p className="text-base font-serif italic text-[#c19a88]">{cert.achievement_text}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 text-xs font-mono uppercase tracking-[0.14em]">Conferral Date</span>
                <p className="text-white/70 font-light">
                  {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                    dateStyle: 'long',
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 text-xs font-mono uppercase tracking-[0.14em]">Issued By</span>
                <p className="text-white/70 font-light">SkaleKraft</p>
              </div>
            </div>

            {/* Download PDF Action */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`/api/certificates/download/${cert.certificate_code}`}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-7 py-3 text-xs font-semibold tracking-wide text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)] hover:scale-105 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download Official Certificate PDF</span>
              </a>

              <span className="text-[11px] text-white/45 flex items-center gap-1.5 font-light">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c19a88]" strokeWidth={2} />
                Cryptographically Signed & Timestamped
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
