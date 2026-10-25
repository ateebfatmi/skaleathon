'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { Component } from '@/components/ui/experience-hero';

export default function DemoOne() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
    });
    let frame = 0;

    const animate = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] selection:bg-white selection:text-black">
      <main className="relative w-full overflow-x-hidden">
        <Component />
        <div className="experience-bento-mask pointer-events-none fixed inset-0 z-[100] opacity-10" />
      </main>
    </div>
  );
}
