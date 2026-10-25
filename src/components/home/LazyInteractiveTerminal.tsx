'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { EventData } from '@/lib/db/types';

const InteractiveTerminal = dynamic(() => import('./InteractiveTerminal'), {
  ssr: false,
  loading: TerminalPlaceholder,
});

function TerminalPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto min-h-[24rem] w-full max-w-4xl animate-pulse overflow-hidden rounded-[24px] border border-white/10 bg-[#07090E]/95 shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
    >
      <div className="flex h-12 items-center gap-1.5 border-b border-white/[0.08] px-5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]/40" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/40" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]/40" />
      </div>
      <div className="space-y-4 p-6">
        <div className="h-3 w-2/5 rounded bg-white/[0.06]" />
        <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
        <div className="h-24 rounded-xl border border-white/[0.05] bg-white/[0.02]" />
      </div>
    </div>
  );
}

export default function LazyInteractiveTerminal({ event }: { event: EventData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '350px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[24rem]">
      {shouldLoad ? <InteractiveTerminal event={event} /> : <TerminalPlaceholder />}
    </div>
  );
}
