'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cyberAudio } from '@/lib/cyber-sound';

export default function AudioToggle() {
  const [audioActive, setAudioActive] = useState(false);

  const toggle = () => {
    const nextState = !audioActive;
    setAudioActive(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) {
      cyberAudio.playSuccess();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center">
      <button
        onClick={toggle}
        className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-mono tracking-wider backdrop-blur-2xl transition-all shadow-xl ${
          audioActive
            ? 'border-[#c19a88] bg-[#07090E]/90 text-[#e8c5b4] shadow-[0_0_20px_rgba(193,154,136,0.3)]'
            : 'border-white/10 bg-[#07090E]/80 text-white/50 hover:border-white/20 hover:text-white'
        }`}
        title="Toggle futuristic HUD interface audio"
        aria-label="Toggle UI Audio"
      >
        {audioActive ? (
          <>
            <Volume2 className="h-3.5 w-3.5 text-[#c19a88] animate-pulse" />
            <span>SFX: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 text-white/40 group-hover:text-white" />
            <span>SFX: MUTED</span>
          </>
        )}
      </button>
    </div>
  );
}
