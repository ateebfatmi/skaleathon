'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Download, ShieldCheck, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { Certificate } from '@/lib/db/types';

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCerts = () => {
    setLoading(true);
    fetch('/api/certificates/verify?code=SKALE27-ALL')
      .catch(() => {})
      .finally(() => {
        // Fetch via repository overview or certificates endpoint
        fetch('/api/admin/overview')
          .then((r) => r.json())
          .then(() => {
            // Load from admin config or direct
          })
          .finally(() => setLoading(false));
      });
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleGenerateTop25 = async () => {
    setGenerating(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/certificates/generate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue certificates');
      setMessage(data.message);
      if (data.certificates) {
        setCerts(data.certificates);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
              National Certificate Registry
            </span>
            <h1 className="text-2xl font-black text-white">Certificate Management</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Issue, inspect, and manage digital PDF certificates for the Top 25 finalist teams.
            </p>
          </div>

          <button
            onClick={handleGenerateTop25}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
          >
            <Award className="h-4 w-4" />
            <span>{generating ? 'Issuing Certificates...' : 'Issue Certificates For Top 25'}</span>
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Certificates Issued List */}
      <div className="rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-base font-bold text-white">
            Issued Certificates Database ({certs.length})
          </h2>
          <span className="text-xs text-neutral-400">
            Automatic QR Generation & PDF Binary Delivery
          </span>
        </div>

        {certs.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
            <p>No certificates issued yet.</p>
            <p className="text-[11px] text-neutral-500">
              * Note: Certificates can only be issued once results have been officially published from the Results Management tab.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {certs.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-[#141414] gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{c.recipient_name}</div>
                  <div className="text-neutral-400">Team: {c.team_name} • {c.achievement_text}</div>
                  <div className="font-mono text-[10px] text-cyanAccent-400 mt-1">Code: {c.certificate_code}</div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`/api/certificates/download/${c.certificate_code}`}
                    download
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </a>

                  <Link
                    href={`/verify-certificate/${c.certificate_code}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyanAccent-400 hover:underline"
                  >
                    <span>Verify</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
