'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, User, ArrowRight, Sparkles } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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

  const navLinks = [
    { name: 'Tracks', href: '/tracks' },
    { name: 'Prizes', href: '/prizes' },
    { name: 'Rules', href: '/rules' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'FAQ', href: '/faq' },
  ];

  const defaultRegisterButton = (
    <Link
      href="/register"
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#c19a88]/50 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
    >
      <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#805948_0%,#c19a88_50%,#805948_100%)] opacity-70 group-hover:opacity-100 transition-opacity" />
      <span className="relative flex items-center gap-2 rounded-full bg-[#0D0B0A]/95 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition-colors duration-200 group-hover:bg-[#14100E]">
        <Sparkles className="h-3.5 w-3.5 text-[#c19a88] group-hover:rotate-12 transition-transform duration-300" />
        <span>Register Team</span>
        <span className="rounded-full bg-[#c19a88]/20 border border-[#c19a88]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#e8c5b4] shadow-sm">
          ₹99
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
        style={{ scaleX }}
      />

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-white/[0.08] bg-[#07090E]/90 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'border-b border-white/[0.05] bg-[#07090E]/70 backdrop-blur-xl'
        }`}
      >
        <div className="container mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Brand Cluster */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
            <div
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-0.5 shadow-[0_0_20px_rgba(193,154,136,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#c19a88]/50 group-hover:shadow-[0_0_25px_rgba(193,154,136,0.35)]"
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            >
              <Image
                src="/images/skalekraft-logo.png"
                alt="SkaleKraft logo"
                width={40}
                height={40}
                className="h-full w-full object-cover rounded-[10px]"
                style={{ width: 40, height: 40, maxWidth: 40, maxHeight: 40 }}
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.26em] text-[#c19a88] font-bold leading-none">
                SkaleKraft Presents
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base sm:text-lg font-black tracking-[0.14em] text-white">
                  SKALE<span className="skalekraft-gradient-text">ATHON</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#e8c5b4] shadow-sm">
                  2027
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Capsule */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-8 items-center rounded-full px-4 text-xs font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_15px_rgba(193,154,136,0.15)] font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88] shadow-[0_0_8px_#c19a88] mr-2 inline-block animate-pulse" />
                  )}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center space-x-3">
            <ErrorBoundary
              fallback={
                <div className="flex items-center space-x-3">
                  <Link
                    href="/sign-in"
                    className="text-xs font-medium tracking-wide text-neutral-400 hover:text-white transition-colors px-3.5 py-2 rounded-full hover:bg-white/[0.04]"
                  >
                    Sign In
                  </Link>
                  {defaultRegisterButton}
                </div>
              }
            >
              {mounted ? (
                <>
                  <SignedIn>
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/dashboard"
                        className="group flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-neutral-300 hover:border-[#c19a88]/40 hover:bg-white/[0.07] hover:text-white transition-all shadow-sm"
                      >
                        <User className="h-3.5 w-3.5 text-[#c19a88] group-hover:scale-110 transition-transform" />
                        <span>Dashboard</span>
                      </Link>
                      <div className="p-0.5 rounded-full ring-1 ring-[#c19a88]/50 shadow-[0_0_15px_rgba(193,154,136,0.25)] hover:ring-[#c19a88] transition-all">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </div>
                  </SignedIn>
                  
                  <SignedOut>
                    <div className="flex items-center space-x-3">
                      <SignInButton mode="modal">
                        <button className="text-xs font-medium tracking-wide text-neutral-400 hover:text-white transition-colors px-3.5 py-2 rounded-full hover:bg-white/[0.04] cursor-pointer">
                          Sign In
                        </button>
                      </SignInButton>
                      {defaultRegisterButton}
                    </div>
                  </SignedOut>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/sign-in"
                    className="text-xs font-medium tracking-wide text-neutral-400 hover:text-white transition-colors px-3.5 py-2 rounded-full hover:bg-white/[0.04]"
                  >
                    Sign In
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
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#07090E]/98 px-5 pt-3 pb-8 space-y-4 backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? 'bg-white/[0.08] text-[#e8c5b4] font-semibold border border-[#c19a88]/30'
                        : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-[#c19a88]" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
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
                      <span>Register Team — ₹99</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                }
              >
                {mounted ? (
                  <>
                    <SignedIn>
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-xs text-neutral-400 font-medium">Signed In Account</span>
                        <UserButton afterSignOutUrl="/" />
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/[0.1] transition-colors"
                      >
                        Go to Dashboard
                      </Link>
                    </SignedIn>

                    <SignedOut>
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
                        <span>Register Team — ₹99</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </SignedOut>
                  </>
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
                      <span>Register Team — ₹99</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
