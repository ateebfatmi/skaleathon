'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Send, Award, FileCheck } from 'lucide-react';

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Team', href: '/dashboard/team', icon: Users },
    { name: 'Project Submission', href: '/dashboard/submission', icon: Send },
    { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
  ];

  return (
    <div className="flex items-center space-x-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
