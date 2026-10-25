'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';

interface QuickIndexItem {
  href: string;
  num: string;
  label: string;
}

interface DashboardQuickIndexBarProps {
  memberCount: number;
}

export default function DashboardQuickIndexBar({ memberCount }: DashboardQuickIndexBarProps) {
  const router = useRouter();
  const [selectedNum, setSelectedNum] = useState<string>('01');
  const [hoveredNum, setHoveredNum] = useState<string | null>(null);
  const [navigatingItem, setNavigatingItem] = useState<QuickIndexItem | null>(null);

  const items: QuickIndexItem[] = [
    { href: '/dashboard/stages', num: '01', label: 'Stages Roadmap' },
    { href: '/dashboard/track', num: '02', label: 'Track & Scope' },
    { href: '/dashboard/team', num: '03', label: `Squad Roster (${memberCount}/6)` },
    { href: '/dashboard/submission', num: '04', label: 'Deliverables Portal' },
  ];

  const handleItemClick = (e: React.MouseEvent, item: QuickIndexItem) => {
    e.preventDefault();
    if (navigatingItem) return;

    cyberAudio.playSuccess();
    setSelectedNum(item.num);
    setNavigatingItem(item);
    router.push(item.href);
  };

  return (
    <>
      <nav
        aria-label="Workspace Quick Index"
        className="relative grid grid-cols-2 gap-2 border-y border-white/[0.08] py-2 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/[0.06] sm:py-0"
      >
        {items.map((item) => {
          const isActive = selectedNum === item.num;
          const isNavigatingThis = navigatingItem?.num === item.num;
          const isHovered = hoveredNum === item.num;

          return (
            <button
              key={item.num}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => handleItemClick(e, item)}
              onMouseEnter={() => {
                setHoveredNum(item.num);
                cyberAudio.playHover();
              }}
              onMouseLeave={() => setHoveredNum(null)}
              className={`group relative flex min-h-16 min-w-0 cursor-pointer select-none items-center justify-between overflow-hidden rounded-xl border border-white/[0.07] px-3 py-3 text-left text-[11px] transition-colors duration-300 sm:min-h-12 sm:rounded-none sm:border-0 sm:px-4 sm:py-4 sm:text-xs ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {/* Sliding Active Background Glow */}
              {isActive && (
                <motion.div
                  layoutId="dashboardQuickIndexBg"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#737373]/18 via-[#f5f5f5]/10 to-white/[0.02]"
                />
              )}

              {/* Hover Subtle Highlight */}
              {isHovered && !isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 bg-white/[0.025]"
                />
              )}

              {/* Click Shimmer Sweep Animation */}
              <AnimatePresence>
                {isNavigatingThis && (
                  <motion.div
                    initial={{ x: '-100%', opacity: 0.9 }}
                    animate={{ x: '100%', opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/30 to-transparent"
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
                <span
                  className={`font-mono text-[10px] font-bold transition-colors duration-300 ${
                    isActive ? 'text-[#ffffff]' : 'text-[#c19a88]'
                  }`}
                >
                  {item.num}
                </span>
                <span className="leading-4 sm:whitespace-nowrap">{item.label}</span>
              </div>

              <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                {isNavigatingThis ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#ffffff]"
                  >
                    <span className="hidden lg:inline uppercase tracking-wider text-[9px]">
                      Opening
                    </span>
                    <Loader2 className="h-3.5 w-3.5 text-[#ffffff] animate-spin" />
                  </motion.div>
                ) : (
                  <ArrowUpRight
                    className={`hidden h-3.5 w-3.5 shrink-0 transition-all duration-300 sm:block ${
                      isActive
                        ? 'text-[#ffffff] translate-x-0.5 -translate-y-0.5'
                        : 'text-neutral-600 group-hover:text-[#ffffff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                  />
                )}
              </div>

              {/* Sliding Copper Bottom Indicator Line */}
              {isActive && (
                <motion.span
                  layoutId="dashboardQuickIndexUnderline"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#737373] via-[#f5f5f5] to-[#ffffff] shadow-[0_0_12px_rgba(229,229,229,0.5)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Smooth Page Transition Veil & Top Progress Sweep */}
      <AnimatePresence>
        {navigatingItem && (
          <>
            {/* Top Laser Progress Bar */}
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-[#737373] via-[#ffffff] to-[#f5f5f5] shadow-[0_0_16px_#ffffff]"
            />

            {/* Subtle Editorial Transition Pill & Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center bg-[#0B0B0B]/45 backdrop-blur-[3px]"
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-full border border-[#f5f5f5]/40 bg-[#111111]/95 px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.75),0_0_25px_rgba(255,255,255,0.2)] backdrop-blur-2xl"
              >
                <span className="font-mono text-[10px] font-bold text-[#c19a88]">
                  {navigatingItem.num}
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-xs font-medium text-white tracking-wide">
                  Entering <span className="font-serif italic text-[#ffffff]">{navigatingItem.label}</span>
                </span>
                <Loader2 className="h-3.5 w-3.5 text-[#c19a88] animate-spin ml-1" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
