import React from 'react';

export default function InteractiveAmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Static spotlight avoids a global pointer listener and continuous compositing. */}
      <div
        style={{ left: '50%', top: '35%', transform: 'translate(-50%, -50%)' }}
        className="pointer-events-none fixed h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,rgba(163,163,163,0.04)_45%,transparent_70%)] blur-3xl hidden md:block"
      />

      {/* 2. Top & Bottom Ambient Radial Ellipses from SkaleKraft */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-12%,rgba(255,255,255,0.22),transparent_70%),radial-gradient(ellipse_60%_40%_at_50%_115%,rgba(163,163,163,0.12),transparent_70%)]" />

      {/* 3. SkaleKraft 32px Micro Dot Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.025)_1px,transparent_0)] [background-size:32px_32px] opacity-70" />

      {/* 4. Secondary Soft Bronze Glow Anchor */}
      <div className="pointer-events-none absolute top-1/4 right-[10%] hidden h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(163,163,163,0.04)_42%,transparent_70%)] blur-3xl md:block" />
    </div>
  );
}
