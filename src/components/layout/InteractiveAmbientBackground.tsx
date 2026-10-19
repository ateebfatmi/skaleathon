'use client';

import React, { useRef, useEffect } from 'react';

export default function InteractiveAmbientBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlightRef.current.style.left = `${x}%`;
      spotlightRef.current.style.top = `${y}%`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Dynamic Cursor-Followed Copper Spotlight (Exact SkaleKraft signature) */}
      <div
        ref={spotlightRef}
        style={{ left: '50%', top: '35%', transform: 'translate(-50%, -50%)' }}
        className="pointer-events-none fixed h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle_at_center,rgba(193,154,136,0.16)_0%,rgba(128,89,72,0.05)_45%,transparent_70%)] blur-3xl hidden md:block transition-[left,top] duration-150 ease-out will-change-[left,top]"
      />

      {/* 2. Top & Bottom Ambient Radial Ellipses from SkaleKraft */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-12%,rgba(193,154,136,0.22),transparent_70%),radial-gradient(ellipse_60%_40%_at_50%_115%,rgba(128,89,72,0.12),transparent_70%)]" />

      {/* 3. SkaleKraft 32px Micro Dot Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.025)_1px,transparent_0)] [background-size:32px_32px] opacity-70" />

      {/* 4. Secondary Soft Bronze Glow Anchor */}
      <div className="pointer-events-none absolute top-1/4 right-[10%] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(193,154,136,0.12)_0%,rgba(128,89,72,0.04)_42%,transparent_70%)] blur-3xl" />
    </div>
  );
}
