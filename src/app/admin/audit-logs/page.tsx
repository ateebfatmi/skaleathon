import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import { History, Shield, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await EventRepository.getAuditLogs(100);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
            Immutable Audit Trail
          </span>
          <h1 className="text-2xl font-black text-white">Security & Administrative Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit records tracking event configurations, payments, scoring locks, and certificate issuances.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#141414] text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Actor ID</th>
                <th className="py-3.5 px-6">Target Entity</th>
                <th className="py-3.5 px-6">Target ID</th>
                <th className="py-3.5 px-6">Details Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-cyanAccent-300">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-6 text-slate-300">
                      {log.actor_id}
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {log.target_entity}
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {log.target_id || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-[10px] text-slate-400 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
