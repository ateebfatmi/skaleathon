'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';

export interface EditorialIndexItem {
  id?: string;
  num: string;
  label: string;
  href: string;
}

interface EditorialIndexBarProps {
  items: EditorialIndexItem[];
  layoutIdPrefix: string;
  columns?: 3 | 4;
  activeId?: string;
  onSelectItem?: (item: EditorialIndexItem) => void;
}

export function EditorialIndexBar({
  items,
  layoutIdPrefix,
  columns = 4,
  activeId,
  onSelectItem,
}: EditorialIndexBarProps) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>(
    activeId || items[0]?.id || items[0]?.num || '01'
  );
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [transitioningItem, setTransitioningItem] = useState<EditorialIndexItem | null>(null);

  useEffect(() => {
    if (activeId) {
      setSelectedKey(activeId);
    }
  }, [activeId]);

  // Prefetch any route links on mount so page redirection after transition is instantaneous
  useEffect(() => {
    items.forEach((item) => {
      if (item.href && !item.href.startsWith('#')) {
        router.prefetch(item.href);
      }
    });
  }, [items, router]);

  const handleClick = (e: React.MouseEvent, item: EditorialIndexItem) => {
    e.preventDefault();
    if (transitioningItem) return;

    const itemKey = item.id || item.num;
    cyberAudio.playSuccess();
    setSelectedKey(itemKey);
    setTransitioningItem(item);
    onSelectItem?.(item);

    const isHashLink = item.href.startsWith('#');

    if (isHashLink) {
      // Play the spring underline slide + shimmer sweep + brief transition indicator before smooth-scrolling to the section
      setTimeout(() => {
        const targetId = item.href.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.replaceState(null, '', item.href);
        }
        setTimeout(() => {
          setTransitioningItem(null);
        }, 260);
      }, 320);
    } else {
      // Play the spring underline slide + shimmer sweep + portal transition veil before navigating to the route
      setTimeout(() => {
        router.push(item.href);
        setTimeout(() => {
          setTransitioningItem(null);
        }, 500);
      }, 400);
    }
  };

  const gridColsClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-4';

  return (
    <>
      <nav
        aria-label="Section Index Navigation"
        className={`relative grid ${gridColsClass} border-t border-b border-white/[0.08] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]`}
      >
        {items.map((item) => {
          const itemKey = item.id || item.num;
          const isActive = selectedKey === itemKey;
          const isTransitioningThis =
            transitioningItem && (transitioningItem.id || transitioningItem.num) === itemKey;
          const isHovered = hoveredKey === itemKey;

          return (
            <button
              key={itemKey}
              type="button"
              onClick={(e) => handleClick(e, item)}
              onMouseEnter={() => {
                setHoveredKey(itemKey);
                cyberAudio.playHover();
              }}
              onMouseLeave={() => setHoveredKey(null)}
              className={`group relative py-3.5 sm:py-4 px-3.5 sm:px-4 flex items-center justify-between text-xs transition-colors duration-300 text-left overflow-hidden cursor-pointer select-none ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {/* Sliding Active Background Glow */}
              {isActive && (
                <motion.div
                  layoutId={`${layoutIdPrefix}-bg`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#805948]/18 via-[#c19a88]/10 to-white/[0.02]"
                />
              )}

              {/* Hover Highlight */}
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
                {isTransitioningThis && (
                  <motion.div
                    initial={{ x: '-100%', opacity: 0.95 }}
                    animate={{ x: '100%', opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#e8c5b4]/35 to-transparent"
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
                <span
                  className={`font-mono text-[10px] font-bold transition-colors duration-300 ${
                    isActive ? 'text-[#e8c5b4]' : 'text-[#c19a88]'
                  }`}
                >
                  {item.num}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                {isTransitioningThis ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#e8c5b4]"
                  >
                    <Loader2 className="h-3.5 w-3.5 text-[#e8c5b4] animate-spin" />
                  </motion.div>
                ) : (
                  <ArrowUpRight
                    className={`h-3.5 w-3.5 shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'text-[#e8c5b4] translate-x-0.5 -translate-y-0.5'
                        : 'text-neutral-600 group-hover:text-[#e8c5b4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                  />
                )}
              </div>

              {/* Sliding Copper Bottom Indicator Line */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutIdPrefix}-underline`}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] shadow-[0_0_12px_rgba(232,197,180,0.5)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Smooth Transition Overlay & Top Laser Progress Bar */}
      <AnimatePresence>
        {transitioningItem && (
          <>
            {/* Top Laser Progress Sweep */}
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-[#805948] via-[#e8c5b4] to-[#c19a88] shadow-[0_0_16px_#e8c5b4]"
            />

            {/* Editorial Transition Pill & Subtle Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center bg-[#0B0B0B]/35 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-full border border-[#c19a88]/40 bg-[#120F0D]/95 px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.75),0_0_25px_rgba(193,154,136,0.2)] backdrop-blur-2xl"
              >
                <span className="font-mono text-[10px] font-bold text-[#c19a88]">
                  {transitioningItem.num}
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-xs font-medium text-white tracking-wide">
                  {transitioningItem.href.startsWith('#') ? 'Focusing' : 'Entering'}{' '}
                  <span className="font-serif italic text-[#e8c5b4]">{transitioningItem.label}</span>
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

export default EditorialIndexBar;

