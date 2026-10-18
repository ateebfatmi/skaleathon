'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import GlassmorphismCta from '@/components/ui/glassmorphism-cta';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Tracks', href: '/tracks' },
    { name: 'Prizes', href: '/prizes' },
    { name: 'Rules', href: '/rules' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      {/* SkaleKraft top scroll progress indicator */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#805948] via-[#c19a88] to-white pointer-events-none"
        style={{ scaleX }}
      />

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'border-b border-white/10 bg-[#0B0B0B]/95 shadow-[0_14px_45px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'border-b border-white/10 bg-[#0B0B0B]/85 backdrop-blur-xl'
        }`}
      >
        <div className="container mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* SkaleKraft Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-[0_0_20px_rgba(128,89,72,0.25)] border border-white/10 group-hover:scale-105 transition-transform">
              <Image
                src="/images/skalekraft-logo.png"
                alt="SkaleKraft logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#c19a88] font-medium leading-none">
                SkaleKraft Presents
              </span>
              <span className="text-lg font-bold tracking-[0.16em] text-white">
                SKALE<span className="text-[#c19a88]">ATHON</span>{' '}
                <span className="text-xs text-white/50 font-normal">2027</span>
              </span>
            </div>
          </Link>

          {/* Nav Pill Capsule matching SkaleKraft */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
          >
            {navLinks.map((item, index) => {
              const active = pathname === item.href;
              return (
                <div key={item.href} className="flex items-center">
                  {index > 0 && <span className="h-3.5 w-px bg-white/10" />}
                  <Link
                    href={item.href}
                    className={`flex h-8 items-center rounded-full px-3.5 text-xs font-medium tracking-wide transition-all duration-200 ${
                      active
                        ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'
                        : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster with Clerk Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedIn>
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/80 hover:bg-white/[0.08] hover:text-white transition-all shadow-sm"
                >
                  <User className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Dashboard</span>
                </Link>
                <div className="p-0.5 rounded-full ring-1 ring-[#c19a88]/40 shadow-[0_0_15px_rgba(128,89,72,0.25)]">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="text-xs font-medium tracking-wide text-white/70 hover:text-white transition-colors px-3 py-2 cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <GlassmorphismCta
                  href="/register"
                  label="Register Team — ₹99"
                  avatarSrc="/images/skalekraft-logo.png"
                  avatarAlt="SkaleKraft"
                  shimmerColor="rgba(193, 154, 136, 0.85)"
                />
              </div>
            </SignedOut>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:border-white/25 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#0B0B0B]/98 px-5 pt-4 pb-8 space-y-4 backdrop-blur-2xl">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-white/[0.08] text-[#c19a88]'
                      : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <SignedIn>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10">
                  <span className="text-xs text-white/60 font-medium">Signed In Account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-full bg-white/[0.06] border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/[0.1] transition-colors"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block rounded-full border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-white/80 hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_25px_rgba(128,89,72,0.35)]"
                >
                  Register Team — ₹99
                </Link>
              </SignedOut>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
