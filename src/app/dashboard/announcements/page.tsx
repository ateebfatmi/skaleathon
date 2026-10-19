import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import {
  Bell,
  Clock,
  ArrowLeft,
  Pin,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const revalidate = 0;

export default async function DashboardAnnouncementsPage() {
  await getCurrentSession();
  const announcements = await EventRepository.getAnnouncements(true);

  // Sort: most recent first
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-60 h-60 bg-[#c19a88]/10 rounded-full blur-[100px]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c19a88] font-bold">
                Official Broadcasts
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Event Announcements</h1>
            <p className="text-xs text-white/50 mt-1 max-w-xl">
              Stay synchronized with live updates, timeline revisions, and official directives from the Skaleathon organizing committee.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Overview</span>
          </Link>
        </div>
      </div>

      {/* Announcements Feed */}
      {sortedAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/60 p-12 text-center space-y-3">
          <Bell className="h-8 w-8 text-white/30 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Announcements Yet</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            The organizing team has not broadcast any public announcements yet. Check back here periodically for updates during the event.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedAnnouncements.map((ann, idx) => {
            const isLatest = idx === 0;
            const categoryBadge =
              ann.category === 'urgent'
                ? { label: 'URGENT', color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' }
                : ann.category === 'timeline'
                ? { label: 'TIMELINE', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' }
                : ann.category === 'results'
                ? { label: 'RESULTS', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' }
                : { label: 'GENERAL', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' };

            return (
              <div
                key={ann.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all relative ${
                  isLatest
                    ? 'border-[#c19a88]/40 bg-[#0c1220] shadow-[0_0_20px_rgba(193,154,136,0.08)]'
                    : 'border-white/10 bg-[#0c1220]/60 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {isLatest && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c19a88]/40 bg-[#c19a88]/15 text-[#e8c5b4]">
                        <Sparkles className="h-2.5 w-2.5 text-[#c19a88]" />
                        <span>LATEST</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${categoryBadge.color}`}
                    >
                      {categoryBadge.label}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-white">{ann.title}</h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(ann.published_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
