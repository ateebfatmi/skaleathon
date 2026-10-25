import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || (session.role !== 'judge' && session.role !== 'admin')) {
    redirect('/sign-in');
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Award className="h-3.5 w-3.5" />
              <span>Technical Judging Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Evaluation Portal</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Evaluator: <strong className="text-neutral-200">{session.fullName}</strong> ({session.email})
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Participant View</span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
