import React from 'react';
import { EventRepository } from '@/lib/db/repository';
import { Send, Github, Globe, Video, ExternalLink } from 'lucide-react';

export const revalidate = 0;

export default async function AdminSubmissionsPage() {
  const submissions = await EventRepository.listSubmissions();

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
            Project Deliverable Review
          </span>
          <h1 className="text-2xl font-black text-white">Project Submissions ({submissions.length})</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit submitted repositories, live demos, and AI disclosures across all competition tracks.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#141414] text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Project Title & Team</th>
                <th className="py-3.5 px-6">Track</th>
                <th className="py-3.5 px-6">Deliverables</th>
                <th className="py-3.5 px-6">Tech Stack</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No project submissions recorded yet.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{sub.title}</div>
                      <div className="text-[11px] text-slate-400">Team: {sub.teamName}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">{sub.track_id}</td>
                    <td className="py-4 px-6 space-y-1">
                      <a
                        href={sub.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyanAccent-400 hover:underline flex items-center gap-1"
                      >
                        <Github className="h-3 w-3" />
                        <span>GitHub Repo</span>
                      </a>
                      {sub.live_demo_url && (
                        <a
                          href={sub.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          <span>Demo</span>
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {sub.tech_stack.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                      {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Draft'}
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
