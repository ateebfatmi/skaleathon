'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  User,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Layers,
  Users,
  Send,
  Code2,
  Trophy,
} from 'lucide-react';
import {
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { EventData } from '@/lib/db/types';
import { formatINR } from '@/lib/utils';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

type NavbarEvent = Pick<EventData, 'registration_fee_inr'> & Partial<Pick<EventData, 'prize_pool_inr'>>;

export default function Navbar({ event }: { event: NavbarEvent }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded: isAuthLoaded, isSignedIn } = useUser();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.25,
  });

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Tracks', href: '/tracks' },
    { name: 'Prizes', href: '/prizes', badge: `₹${Math.round((event.prize_pool_inr || 35000) / 1000)}K` },
    { name: 'Rules', href: '/rules' },
    { name: 'FAQ', href: '/faq' },
  ];

  const dashboardNavLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Stages', href: '/dashboard/stages', icon: Layers },
    { name: 'Track', href: '/dashboard/track', icon: Code2 },
    { name: 'My Team', href: '/dashboard/team', icon: Users },
    { name: 'Submission', href: '/dashboard/submission', icon: Send },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
  ];

  const defaultRegisterButton = (
    <Link
      href="/register"
      className="group relative hidden 2xl:inline-flex items-center gap-2 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#c19a88]/50 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
    >
      <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#805948_0%,#c19a88_50%,#805948_100%)] opacity-70 group-hover:opacity-100 transition-opacity" />
      <span className="relative flex items-center gap-2 rounded-full bg-[#0D0B0A]/95 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition-colors duration-200 group-hover:bg-[#14100E]">
        <Sparkles className="h-3.5 w-3.5 text-[#c19a88] group-hover:rotate-12 transition-transform duration-300" />
        <span>Register Team</span>
        <span className="rounded-full bg-[#c19a88]/20 border border-[#c19a88]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#e8c5b4] shadow-sm">
          {formatINR(event.registration_fee_inr)}
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </span>
    </Link>
  );

  return (
    <>
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] pointer-events-none"
        style={{ scaleX: smoothScrollProgress }}
      />

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-white/[0.08] bg-[#07090E]/90 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'border-b border-white/[0.05] bg-[#07090E]/70 backdrop-blur-xl'
        }`}
      >
        <div className="container mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-8">
          
          {/* Logo & Brand Cluster */}
          <div className="flex min-w-0 items-center gap-3 justify-self-start">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="flex items-center gap-3 group shrink-0 select-none"
            >
              <div
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1c1b1a] shadow-[0_0_20px_rgba(193,154,136,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#c19a88]/50 group-hover:shadow-[0_0_25px_rgba(193,154,136,0.35)]"
                style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
              >
                <Image
                  src="/images/skalekraft-logo.png"
                  alt="SkaleKraft logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                  style={{ width: 40, height: 40, maxWidth: 40, maxHeight: 40 }}
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif italic text-xs sm:text-[13px] tracking-wide text-[#e8c5b4] leading-tight">
                  SkaleKraft presents
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base sm:text-lg font-semibold tracking-[0.22em] sm:tracking-[0.24em] text-white">
                    SKALE<span className="text-[#c19a88]">ATHON</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Navigation Capsule */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            {navLinks.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={item.href === '/' ? handleHomeClick : undefined}
                  className={`relative flex h-8 items-center justify-center rounded-full px-3.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.14] to-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_15px_rgba(193,154,136,0.18)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#c19a88]/25 text-[#ffe5d9] border border-[#c19a88]/40 shadow-[0_0_8px_rgba(193,154,136,0.25)] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden min-w-0 items-center justify-self-end space-x-3 md:flex">
            <ErrorBoundary
              fallback={
                <div className="flex items-center space-x-3">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold tracking-wide text-neutral-200 transition-all hover:border-[#c19a88]/40 hover:bg-white/[0.07] hover:text-white"
                  >
                    <User className="h-3.5 w-3.5 text-[#c19a88]" />
                    <span>Sign In</span>
                  </Link>
                  {defaultRegisterButton}
                </div>
              }
            >
              {mounted && isAuthLoaded ? (
                isSignedIn ? (
                    <div className="flex items-center gap-3">
                      {/* Luxury Account Capsule */}
                      <div className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pr-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:border-[#c19a88]/40 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(193,154,136,0.2)]">
                        {/* Avatar with Copper Ring & Status Indicator */}
                        <div className="relative flex items-center shrink-0">
                          <UserButton
                            appearance={{
                              elements: {
                                avatarBox:
                                  "h-8 w-8 rounded-full ring-2 ring-[#c19a88]/60 transition-all duration-300 hover:ring-[#c19a88] shadow-[0_0_14px_rgba(193,154,136,0.35)] hover:scale-105",
                                userButtonTrigger: "focus:outline-none focus:ring-0",
                                userButtonPopoverCard:
                                  "border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#0F0F0F]/95 rounded-2xl p-1",
                                userButtonPopoverActionButton:
                                  "hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-colors rounded-xl",
                                userButtonPopoverActionButtonText: "text-xs font-medium",
                                userButtonPopoverFooter: "hidden",
                              },
                            }}
                          />
                          <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B0B0B] shadow-[0_0_6px_#10b981]" />
                        </div>

                        {/* User Identity Info */}
                        <div className="flex flex-col text-left select-none">
                          <span className="text-xs font-semibold text-white/90 max-w-[120px] truncate leading-tight">
                            {user?.firstName || user?.fullName || 'Innovator'}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.22em] text-[#c19a88] font-bold leading-none mt-0.5">
                            Participant
                          </span>
                        </div>
                      </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                      <SignInButton mode="modal">
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold tracking-wide text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all hover:border-[#c19a88]/40 hover:bg-white/[0.07] hover:text-white cursor-pointer">
                          <User className="h-3.5 w-3.5 text-[#c19a88]" />
                          <span>Sign In</span>
                        </button>
                      </SignInButton>
                      {defaultRegisterButton}
                    </div>
                )
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold tracking-wide text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all hover:border-[#c19a88]/40 hover:bg-white/[0.07] hover:text-white"
                  >
                    <User className="h-3.5 w-3.5 text-[#c19a88]" />
                    <span>Sign In</span>
                  </Link>
                  {defaultRegisterButton}
                </div>
              )}
            </ErrorBoundary>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300 transition-all hover:border-[#c19a88]/40 hover:text-white active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Dashboard Sub-Navigation Bar */}
        {isDashboard && (
          <div className="border-t border-white/[0.08] bg-[#07090E]/95 backdrop-blur-2xl">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <nav
                aria-label="Dashboard Navigation"
                className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none"
              >
                {dashboardNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      prefetch={true}
                      className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-white/[0.14] to-white/[0.08] text-white border border-[#c19a88]/60 shadow-[0_0_15px_rgba(193,154,136,0.25)] font-bold'
                          : 'text-neutral-300 font-medium hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${
                          isActive ? 'text-[#c19a88]' : 'text-neutral-400'
                        }`}
                      />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-white/10 bg-[#07090E]/98 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-2xl"
            >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,rgba(193,154,136,0.10),transparent_68%)]" />
            <div className="relative space-y-4">
            {isDashboard && (
              <div className="pb-3 border-b border-white/10 space-y-2">
                <div className="px-1 text-[10px] uppercase tracking-[0.2em] text-[#c19a88] font-bold">
                  Dashboard Sections
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {dashboardNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      link.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-white/[0.08] text-[#e8c5b4] font-semibold border border-[#c19a88]/30'
                            : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 ${
                            isActive ? 'text-[#c19a88]' : 'text-neutral-400'
                          }`}
                        />
                        <span className="truncate">{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Explore
                </span>
                <span className="text-[10px] font-mono text-[#c19a88]/70">01 — 06</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link, index) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (link.href === '/' && pathname === '/') {
                        e.preventDefault();
                        scrollToTop();
                      }
                    }}
                    className={`group relative flex min-h-14 items-center justify-between overflow-hidden rounded-xl border px-3.5 py-3 text-sm font-medium transition-all ${
                      active
                        ? 'border-[#c19a88]/40 bg-[linear-gradient(135deg,rgba(193,154,136,0.16),rgba(255,255,255,0.04))] text-[#f3d7ca] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'border-white/[0.07] bg-white/[0.025] text-neutral-400 hover:border-white/15 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#c19a88]/25 text-[#ffe5d9] border border-[#c19a88]/40">
                          {link.badge}
                        </span>
                      )}
                    </span>
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-px bg-gradient-to-r from-transparent via-[#c19a88] to-transparent" />
                    )}
                  </Link>
                );
              })}
              </div>
            </div>

            <div className="space-y-2.5 border-t border-white/10 pt-4">
              <ErrorBoundary
                fallback={
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full block rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] active:scale-[0.99] transition-transform"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Register Team — {formatINR(event.registration_fee_inr)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                }
              >
                {mounted && isAuthLoaded ? (
                  isSignedIn ? (
                    <>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative">
                            <UserButton
                              appearance={{
                                elements: {
                                  avatarBox:
                                    "h-9 w-9 rounded-full ring-2 ring-[#c19a88]/60 shadow-[0_0_12px_rgba(193,154,136,0.3)]",
                                },
                              }}
                            />
                            <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B0B0B]" />
                          </div>
                          <div className="flex min-w-0 flex-col text-left">
                            <span className="truncate text-sm font-semibold text-white">
                              {user?.fullName || user?.firstName || 'Participant'}
                            </span>
                            <span className="max-w-[170px] truncate text-[10px] text-neutral-500">
                              {user?.primaryEmailAddress?.emailAddress || 'Skaleathon Innovator'}
                            </span>
                          </div>
                        </div>
                        <span className="ml-2 shrink-0 rounded-full border border-[#c19a88]/25 bg-[#c19a88]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#c19a88]">
                          Participant
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all active:scale-[0.99] ${
                          isDashboard
                            ? 'bg-[#c19a88]/15 border-[#c19a88]/40 text-[#e8c5b4]'
                            : 'border-[#c19a88]/35 bg-gradient-to-r from-[#805948]/35 to-[#c19a88]/20 text-white hover:border-[#c19a88]/60'
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4 text-[#c19a88]" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full block rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] active:scale-[0.99] transition-transform"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Register Team — {formatINR(event.registration_fee_inr)}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  )
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full block rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] active:scale-[0.99] transition-transform"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Register Team — {formatINR(event.registration_fee_inr)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </ErrorBoundary>
            </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
