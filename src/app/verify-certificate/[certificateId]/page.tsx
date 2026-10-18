import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import { ShieldCheck, AlertCircle, Download, CheckCircle2, Terminal, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function VerifyCertificatePage({
  params,
}: {
  params: { certificateId: string };
}) {
  const code = params.certificateId;
  const cert = await EventRepository.getCertificateByCode(code);

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Skaleathon 2027</span>
          </Link>
        </div>

        {!cert ? (
          /* Not Found State */
          <div className="rounded-3xl border border-red-500/30 bg-red-950/20 p-8 sm:p-12 text-center space-y-4">
            <div className="p-4 w-fit mx-auto rounded-2xl bg-red-950/50 border border-red-500/30 text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Certificate Not Found</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              The identifier <code className="text-red-300 font-mono bg-black/40 px-2 py-0.5 rounded">{code}</code> is not registered in the Skaleathon 2027 official credential database.
            </p>
            <p className="text-xs text-slate-400">
              Please ensure the certificate code was copied accurately from the issued credential or scanned correctly.
            </p>
          </div>
        ) : cert.is_revoked ? (
          /* Revoked State */
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-8 sm:p-12 text-center space-y-4">
            <div className="p-4 w-fit mx-auto rounded-2xl bg-yellow-950/50 border border-yellow-500/30 text-yellow-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-yellow-300">Certificate Revoked</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              This credential has been officially marked as revoked by the SkaleKraft Organizing Committee.
            </p>
            {cert.revocation_reason && (
              <p className="text-xs text-yellow-200/80 bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                Reason: {cert.revocation_reason}
              </p>
            )}
          </div>
        ) : (
          /* Valid Verified Certificate */
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0e1628] to-[#0a0e19] p-8 sm:p-12 space-y-8 shadow-2xl shadow-emerald-500/5">
            {/* Verification Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Official Registry Verified
                  </span>
                  <h1 className="text-xl font-bold text-white">Authentic Skaleathon Credential</h1>
                </div>
              </div>

              <div className="font-mono text-xs px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-300">
                Code: {cert.certificate_code}
              </div>
            </div>

            {/* Recipient Details (Data minimization: masked email, no private phone) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase font-semibold">Recipient Name</span>
                <p className="text-base sm:text-lg font-black text-white">{cert.recipient_name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase font-semibold">Team Name</span>
                <p className="text-base sm:text-lg font-bold text-slate-200">{cert.team_name || 'Individual'}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-400 text-xs uppercase font-semibold">Merit Conferral</span>
                <p className="text-base font-bold text-cyanAccent-300">{cert.achievement_text}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase font-semibold">Conferral Date</span>
                <p className="text-slate-200">
                  {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                    dateStyle: 'long',
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs uppercase font-semibold">Issued By</span>
                <p className="text-slate-200">SkaleKraft Organizing Board</p>
              </div>
            </div>

            {/* Download PDF Action */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`/api/certificates/download/${cert.certificate_code}`}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download Official Certificate PDF</span>
              </a>

              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Cryptographically Signed & Timestamped
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
