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
    <div className="py-14 sm:py-20 bg-[#0B0B0B] min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#805948]/10 rounded-full blur-[160px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="h-px w-5 bg-[#c19a88]/70" />
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#c19a88]/85 font-medium">
                Participant Workspace
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium text-white">
              Hello, {session.fullName}
            </h1>
            <p className="text-xs text-white/45 mt-1 font-light">
              Role: <span className="text-[#c19a88] font-mono font-medium">{session.role.replace(/_/g, ' ').toUpperCase()}</span> • {session.email}
            </p>
          </div>
        </div>

        <DashboardNav />

        {children}
      </div>
    </div>
  );
}
