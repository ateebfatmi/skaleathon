import React from 'react';
import DashboardNav from '@/components/layout/DashboardNav';
import { getCurrentSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyanAccent-400">
              Participant Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Hello, {session.fullName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Role: <span className="text-brand-300 font-semibold">{session.role.replace(/_/g, ' ').toUpperCase()}</span> • {session.email}
            </p>
          </div>
        </div>

        <DashboardNav />

        {children}
      </div>
    </div>
  );
}
