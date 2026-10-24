import React from 'react';
import Link from 'next/link';
import { EventRepository } from '@/lib/db/repository';
import {
  Users,
  CreditCard,
  Send,
  Award,
  Trophy,
  History,
  TrendingUp,
  Settings,
  ArrowRight,
  Download,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [overview, event, teams, auditLogs] = await Promise.all([
    EventRepository.getAdminOverview(),
    EventRepository.getEvent(),
    EventRepository.listTeams(),
    EventRepository.getAuditLogs(5),
  ]);

  const cards = [
    {
      label: 'Verified Revenue',
      value: formatINR(overview.verifiedRevenueINR),
      sub: `${overview.paidRegistrations} paid team registrations`,
      icon: CreditCard,
      color: 'text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Total Teams Registered',
      value: overview.totalTeams,
      sub: `${overview.pendingPayments} pending payment`,
      icon: Users,
      color: 'text-cyanAccent-400 border-cyanAccent-500/30',
    },
    {
      label: 'Projects Submitted',
      value: overview.submittedProjects,
      sub: `${overview.paidRegistrations - overview.submittedProjects} pending submission`,
      icon: Send,
      color: 'text-brand-400 border-brand-500/30',
    },
    {
      label: 'Judging Progress',
      value: `${overview.judgingProgress}%`,
      sub: 'Multi-criterion evaluations',
      icon: Trophy,
      color: 'text-amber-400 border-amber-500/30',
    },
    {
      label: 'Certificates Issued',
      value: overview.certificatesIssued,
      sub: 'Top 25 finalists registry',
      icon: Award,
      color: 'text-[#c19a88] border-[#c19a88]/30',
    },
    {
      label: 'Event Lifecycle Stage',
      value: event.status.replace(/_/g, ' ').toUpperCase(),
      sub: 'Dynamic system state',
      icon: Settings,
      color: 'text-slate-300 border-white/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="mobile-card-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="mobile-card rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0E0E0E] p-4 sm:p-6 space-y-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {c.label}
                </span>
                <div className={`p-2.5 rounded-xl border bg-white/5 ${c.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {c.value}
                </div>
                <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-6">
        <h3 className="text-sm font-bold text-white mb-4">Command Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/config"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Update Event Config / Status</span>
          </Link>

          <a
            href="/api/admin/registrations?format=csv"
            download
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Registrations (CSV)</span>
          </a>

          <Link
            href="/admin/results"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 px-4 py-2 text-xs font-semibold transition-colors"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Review Leaderboard & Publish</span>
          </Link>

          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 px-4 py-2 text-xs font-semibold transition-colors"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Generate Top 25 Certificates</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity / Audit History */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="h-4 w-4 text-cyanAccent-400" />
            <span>Recent System Audit Actions</span>
          </h3>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-brand-400 hover:underline"
          >
            View Complete Logs
          </Link>
        </div>

        <div className="space-y-3">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400">No actions recorded yet.</p>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-[#141414] text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200 font-mono">{log.action}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-400">Target: {log.target_entity} ({log.target_id || 'Global'})</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
