'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Mail,
  ArrowUpRight,
  Instagram,
  Linkedin,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPortalPage =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/judge');
  const portalsLinks = [
    { label: 'Submit Deliverables', href: '/dashboard/submission' },
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
            <span className="text-neutral-500">Skaleathon</span>
          </div>
          <div className="flex items-center gap-5 text-neutral-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <a
              href="mailto:skalekraft@gmail.com"
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
                <div
                  className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#1c1b1a] shadow-sm"
                  style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
                >
                  <Image
                    src="/images/skalekraft-logo.png"
                    alt="SkaleKraft logo"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                    style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32 }}
                  />
                </div>
                <span className="text-sm font-semibold tracking-[0.22em] text-white">
                  SKALE<span className="text-[#c19a88]">ATHON</span>
                </span>
              </Link>
              <span className="text-neutral-600">|</span>
              <span className="text-xs font-mono text-[#c19a88]">
                {pathname.startsWith('/admin')
                  ? 'Administrator Command Center'
                  : pathname.startsWith('/judge')
                  ? 'Judge Evaluation Portal'
                  : 'National Online Hackathon'}
              </span>
            </div>

            <div className="flex items-center text-xs">
              <a
                href="mailto:skalekraft@gmail.com"
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

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c19a88]">
                Organizer
              </h4>
              <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-neutral-400">
                Skaleathon is organized and hosted by{' '}
                <a
                  href="https://skalekraft.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c19a88] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>SkaleKraft</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                .
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://instagram.com/skalekraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-[#c19a88]/50 hover:bg-[#c19a88]/15 hover:text-white transition-all shadow-sm"
                  aria-label="SkaleKraft on Instagram"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/company/skalekraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-[#c19a88]/50 hover:bg-[#c19a88]/15 hover:text-white transition-all shadow-sm"
                  aria-label="SkaleKraft on LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="mailto:skalekraft@gmail.com"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-[#c19a88]/50 hover:bg-[#c19a88]/15 hover:text-white transition-all shadow-sm"
                  aria-label="Email SkaleKraft"
                  title="Email SkaleKraft"
                >
                  <Mail className="h-4 w-4" />
                </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c19a88]">
              Participant Tools
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

          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06] bg-[#05060A]/80 py-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-light">
            <div className="flex flex-wrap items-center gap-2">
              <span>© {currentYear} SkaleKraft. All rights reserved.</span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span>Build. Innovate. Scale.</span>
            </div>

            <div className="flex items-center">
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
