import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  Send,
  Award,
  Trophy,
  History,
  ArrowLeft,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.role !== 'admin') {
    redirect('/sign-in');
  }

  const adminNav = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Event Config', href: '/admin/config', icon: Settings },
    { name: 'Registrations', href: '/admin/registrations', icon: Users },
    { name: 'Submissions', href: '/admin/submissions', icon: Send },
    { name: 'Judging & Results', href: '/admin/results', icon: Trophy },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-400">
              <Shield className="h-3.5 w-3.5" />
              <span>Restricted Organizer Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Administrator Console</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Authenticated Admin: <strong className="text-slate-200">{session.fullName}</strong> ({session.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Participant Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          {adminNav.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-[#0c1220] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white whitespace-nowrap transition-colors"
              >
                <Icon className="h-4 w-4 text-cyanAccent-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}
