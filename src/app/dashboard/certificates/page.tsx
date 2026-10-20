import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import { Award, Download, ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';

export const revalidate = 0;

export default async function CertificatesDashboardPage() {
  const session = await getCurrentSession();
  const event = await EventRepository.getEvent();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const certificates = team ? await EventRepository.getCertificatesByTeam(team.id) : [];

  const resultsAnnounced = event.status === 'results_announced';

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Official Certificates
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Certificates of Merit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Conferred to eligible members of the Top 25 finalist teams upon finalized results publication.
          </p>
        </div>
      </div>

      {!resultsAnnounced ? (
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center space-y-4">
          <Award className="h-10 w-10 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Evaluation In Progress</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Certificates are issued immediately after the organizing committee reviews and publishes final leaderboard scores. Check back once results are officially released.
          </p>
          <Link
            href="/dashboard/leaderboard"
            className="inline-block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-xs font-semibold text-slate-300 transition-colors"
          >
            Check Leaderboard Status
          </Link>
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-12 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Certificates Issued For This Team</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Merit certificates are reserved for teams finishing within the configured national merit rankings. We sincerely thank your team for your dedication, innovative work, and participation in Skaleathon.
          </p>
          <Link
            href="/dashboard/leaderboard"
            className="inline-block rounded-xl bg-[#805948] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#9c6d58] transition-colors"
          >
            View Final Results
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0e1628] to-[#0a0e19] p-6 space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                    {cert.certificate_type.replace(/_/g, ' ')}
                  </span>
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>

                <h3 className="text-lg font-bold text-white">{cert.recipient_name}</h3>
                <p className="text-xs font-medium text-cyanAccent-300 mt-0.5">{cert.achievement_text}</p>
                <div className="mt-3 text-[11px] font-mono text-slate-400">
                  Certificate ID: {cert.certificate_code}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`/api/certificates/download/${cert.certificate_code}`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </a>

                <Link
                  href={`/verify-certificate/${cert.certificate_code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyanAccent-400 hover:underline"
                >
                  <span>Public Verification</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
