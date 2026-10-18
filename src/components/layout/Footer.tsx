'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const links = [
    { label: 'Tracks', href: '/tracks' },
    { label: 'Prizes', href: '/prizes' },
    { label: 'Rules', href: '/rules' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Verify Certificate', href: '/verify-certificate/SKALE27-PREVIEW' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 border-t border-white/10 bg-[#0B0B0B] px-5 py-12 text-white md:px-10"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-[0.22em] text-white">
            <Image
              src="/images/skalekraft-logo.png"
              alt="SkaleKraft logo"
              width={38}
              height={38}
              className="h-9 w-9 rounded-xl object-cover shadow-[0_0_20px_rgba(128,89,72,0.22)] border border-white/10"
            />
            <span>
              SKALE<span className="text-[#c19a88]">ATHON</span>{' '}
              <span className="text-xs text-white/50 font-normal">2027</span>
            </span>
          </Link>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Presented by <strong className="text-white">SkaleKraft</strong>. A national online hackathon challenging ambitious engineers to Build, Innovate, and Scale. ₹35,000 prize pool • ₹99 entry.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#c19a88]">
            <Globe className="h-3.5 w-3.5" />
            <a
              href="https://skalekraft.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
            >
              skalekraft.in — Software Product Studio
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 md:items-end">
          <div className="flex items-center gap-3">
            <a
              href="mailto:ateeb@skalekraft.in"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition duration-300 hover:border-[#c19a88]/60 hover:bg-[#c19a88]/15 hover:text-white"
              aria-label="Email SkaleKraft"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://skalekraft.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition duration-300 hover:border-[#c19a88]/60 hover:bg-[#c19a88]/15 hover:text-white"
              aria-label="SkaleKraft Studio"
            >
              <Globe className="h-4 w-4" />
            </a>
            <Link
              href="/verify-certificate/SKALE27-PREVIEW"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/70 transition duration-300 hover:border-[#c19a88]/60 hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>Verify Certificate</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/55">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#c19a88]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1400px] border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/35 gap-3">
        <span>© {new Date().getFullYear()} SkaleKraft. All rights reserved.</span>
        <span>Build. Innovate. Scale.</span>
      </div>
    </motion.footer>
  );
}
