'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Globe,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Github,
  LayoutDashboard,
  Shield,
  Award,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPortalPage =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/judge');
  const isRegisterPage = pathname === '/register';

  const competitionLinks = [
    { label: 'Competition Tracks', href: '/tracks' },
    { label: 'Prize Pool & Perks', href: '/prizes' },
    { label: 'Rules & Guidelines', href: '/rules' },
    { label: 'Live Leaderboard', href: '/leaderboard' },
    { label: 'Frequently Asked Questions', href: '/faq' },
  ];

  const portalsLinks = [
    { label: 'Team Registration', href: '/register' },
    { label: 'Participant Dashboard', href: '/dashboard' },
    { label: 'Submit Deliverables', href: '/dashboard/submission' },
    { label: 'Verify Credentials', href: '/verify-certificate/SKALE27-PREVIEW' },
    { label: 'Judge Evaluation Portal', href: '/judge' },
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund & Cancellation', href: '/refund-policy' },
    { label: 'Code of Conduct', href: '/code-of-conduct' },
  ];

  // 1. Sleek Minimal Footer for Auth Pages (/sign-in, /sign-up)
  if (isAuthPage) {
    return (
      <footer className="border-t border-white/[0.06] bg-[#07090E]/95 py-6 text-neutral-400">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© {currentYear} SkaleKraft. All rights reserved.</span>
            <span>•</span>
            <span className="text-neutral-500">Skaleathon 2027</span>
          </div>
          <div className="flex items-center gap-5 text-neutral-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <a
              href="mailto:ateeb@skalekraft.in"
              className="hover:text-[#c19a88] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    );
  }

  // 2. Focused Workspace Footer for Dashboards & Portals (/admin, /dashboard, /judge)
  if (isPortalPage) {
    return (
      <footer className="border-t border-white/[0.08] bg-[#07090E] py-8 text-neutral-400">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-0.5 shadow-sm">
                  <Image
                    src="/images/skalekraft-logo.png"
                    alt="SkaleKraft logo"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <span className="text-sm font-bold tracking-wide text-white">
                  SKALE<span className="skalekraft-gradient-text">ATHON</span> 2027
                </span>
              </Link>
              <span className="text-neutral-600">|</span>
              <span className="text-xs font-mono text-[#c19a88]">
                {pathname.startsWith('/admin')
                  ? 'Administrator Command Center'
                  : pathname.startsWith('/judge')
                  ? 'Judge Evaluation Portal'
                  : 'Participant Workspace'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <Link href="/tracks" className="hover:text-white transition-colors">
                Tracks
              </Link>
              <Link href="/leaderboard" className="hover:text-white transition-colors">
                Leaderboard
              </Link>
              <Link href="/rules" className="hover:text-white transition-colors">
                Rules
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/verify-certificate/SKALE27-PREVIEW" className="hover:text-white transition-colors">
                Verify Credentials
              </Link>
              <a
                href="mailto:ateeb@skalekraft.in"
                className="text-[#c19a88] hover:underline"
              >
                Help Desk
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-neutral-500">
            <span>© {currentYear} SkaleKraft. All rights reserved. Secure Portal.</span>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono">Encrypted Connection • Operational</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // 3. Full Rich Footer for Public & Content Pages (Home, Tracks, Prizes, Rules, Legal, etc.)
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#07090E] text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#805948]/10 via-transparent to-transparent" />

      {/* Pre-Footer Action Banner (Hidden on /register to avoid duplication) */}
      {!isRegisterPage && (
        <div className="border-b border-white/[0.06] bg-white/[0.01]">
          <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#120F0D]/90 via-[#0B0C12]/90 to-[#120F0D]/90 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c19a88]/15 blur-3xl" />
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-3 py-1 text-xs font-medium text-[#e8c5b4]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>National Hackathon 2027</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Ready to Build, Innovate, and Scale?
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                    Join hundreds of forward-thinking engineers across India. Register your team for ₹99 and compete for the ₹35,000 cash pool, top 25 verified credentials, and interview opportunities.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <Link
                    href="/register"
                    className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] hover:scale-[1.03] transition-all"
                  >
                    <span>Register Team — ₹99</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/tracks"
                    className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs sm:text-sm font-medium text-neutral-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white transition-all"
                  >
                    Explore Tracks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Navigation Columns */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand & Studio Information (Spans 2 columns) */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group select-none">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-0.5 shadow-[0_0_20px_rgba(193,154,136,0.2)] transition-all group-hover:scale-105 group-hover:border-[#c19a88]/50">
                <Image
                  src="/images/skalekraft-logo.png"
                  alt="SkaleKraft logo"
                  fill
                  className="object-cover rounded-[10px]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.26em] text-[#c19a88] font-bold leading-none">
                  SkaleKraft Presents
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-black tracking-[0.14em] text-white">
                    SKALE<span className="skalekraft-gradient-text">ATHON</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#e8c5b4]">
                    2027
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
              India’s premier national online technology challenge. Empowering ambitious software engineers to solve real-world industry problems in AI/ML, Web, and Native Mobile applications.
            </p>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registrations Active • Limited Slots</span>
            </div>

            {/* Organizer Attribution & Socials */}
            <div className="pt-2 space-y-3">
              <div className="text-xs text-neutral-400">
                Organized and hosted by{' '}
                <a
                  href="https://skalekraft.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c19a88] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>SkaleKraft Studio</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="mailto:ateeb@skalekraft.in"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-[#c19a88]/50 hover:bg-[#c19a88]/15 hover:text-white transition-all shadow-sm"
                  aria-label="Email SkaleKraft"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://skalekraft.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-[#c19a88]/50 hover:bg-[#c19a88]/15 hover:text-white transition-all shadow-sm"
                  aria-label="SkaleKraft Studio Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/ateebfatmi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-[#c19a88]/50 hover:bg-[#c19a88]/15 hover:text-white transition-all shadow-sm"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Competition */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c19a88]">
              Competition
            </h4>
            <ul className="space-y-2.5 text-sm">
              {competitionLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-150 inline-block font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Portals & Registry */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c19a88]">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              {portalsLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-150 inline-block font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Integrity */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c19a88]">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-150 inline-block font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link
                href="/verify-certificate/SKALE27-PREVIEW"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-neutral-300 hover:border-[#c19a88]/40 hover:text-white transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#c19a88]" />
                <span>Verify Credentials</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Operational Status */}
      <div className="border-t border-white/[0.06] bg-[#05060A]/80 py-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-light">
            <div className="flex flex-wrap items-center gap-2">
              <span>© {currentYear} SkaleKraft. All rights reserved.</span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span>Build. Innovate. Scale.</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono">Systems Operational</span>
              </div>
              <span className="text-neutral-600">•</span>
              <a
                href="https://skalekraft.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-[#c19a88] transition-colors"
              >
                skalekraft.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
