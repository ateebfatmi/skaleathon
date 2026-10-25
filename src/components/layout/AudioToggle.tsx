'use client';

import React, { useState } from 'react';
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
    <div className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center">
      <button
        onClick={toggle}
        className={`group flex items-center justify-center h-8 w-8 rounded-full border backdrop-blur-xl transition-all shadow-lg ${
          audioActive
            ? 'border-[#f5f5f5]/60 bg-[#111111]/90 text-[#ffffff] shadow-[0_0_15px_rgba(255,255,255,0.25)]'
            : 'border-white/10 bg-[#111111]/70 text-white/40 hover:border-white/25 hover:text-white'
        }`}
        title={audioActive ? 'Mute sound effects' : 'Enable interface audio'}
        aria-label="Toggle UI Audio"
      >
        {audioActive ? (
          <Volume2 className="h-3.5 w-3.5 text-[#c19a88]" />
        ) : (
          <VolumeX className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
