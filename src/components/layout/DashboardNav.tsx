'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Send, Award } from 'lucide-react';

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Team', href: '/dashboard/team', icon: Users },
    { name: 'Project Submission', href: '/dashboard/submission', icon: Send },
    { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
  ];

  return (
    <div className="flex items-center space-x-2 border-b border-white/10 pb-5 mb-8 overflow-x-auto">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-white/[0.12] text-white border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'
                : 'border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.07] hover:text-white'
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#c19a88]' : 'text-white/40'}`} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
