import React from 'react';
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
    <div className="py-4 sm:py-10 bg-[#0B0B0B] min-h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Neutral ambient light shared with the homepage visual system. */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-full max-w-7xl -translate-x-1/2 rounded-full bg-white/[0.045] blur-[140px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </div>
  );
}
