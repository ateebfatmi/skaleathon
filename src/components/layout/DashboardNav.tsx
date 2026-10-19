'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Send, Award, Bell, Code2, Layers } from 'lucide-react';

import { motion } from 'framer-motion';

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Stages', href: '/dashboard/stages', icon: Layers },
    { name: 'My Team', href: '/dashboard/team', icon: Users },
    { name: 'Project Submission', href: '/dashboard/submission', icon: Send },
    { name: 'Track & Specs', href: '/dashboard/track', icon: Code2 },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Bell },
    { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
  ];

  return (
    <div className="flex items-center space-x-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
              isActive
                ? 'text-white font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {isActive ? (
              <motion.div
                layoutId="active-dashboard-indicator"
                className="absolute inset-0 rounded-full bg-white/[0.12] border border-[#c19a88]/40 shadow-[0_0_12px_rgba(193,154,136,0.2)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            ) : (
              <div className="absolute inset-0 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#c19a88]' : 'text-white/40'}`} />
              <span>{link.name}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

