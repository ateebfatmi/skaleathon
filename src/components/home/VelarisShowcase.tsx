'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Velaris from '@/components/ui/velaris';
import { Sparkles, ArrowRight, Palette, Sliders, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const PRESETS = [
  {
    name: 'SkaleKraft Bronze',
    colors: ['#c19a88', '#805948', '#e8c5b4', '#15101a'],
    bg: '#08080C',
  },
  {
    name: 'Aurora Emerald',
    colors: ['#86efac', '#4ade80', '#059669', '#000000'],
    bg: '#040d08',
  },
  {
    name: 'Cyber Indigo',
    colors: ['#818cf8', '#6366f1', '#4338ca', '#090a18'],
    bg: '#050714',
  },
  {
    name: 'Solar Flare',
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#1c1005'],
    bg: '#0d0703',
  },
];

export default function VelarisShowcase() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [speed, setSpeed] = useState(1.8);
  const [grain, setGrain] = useState(0.25);

  const currentPreset = PRESETS[selectedPresetIndex];

  return (
    <section className="py-20 lg:py-28 bg-[#07090E] relative overflow-hidden border-t border-white/[0.06]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 px-3.5 py-1 text-xs font-medium text-[#e8c5b4] mb-4">
            <Cpu className="h-3.5 w-3.5" />
            <span>GPU-Accelerated Shaders</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">
            Living gradients in{' '}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#e8c5b4] via-[#c19a88] to-[#805948] bg-clip-text text-transparent pb-1 inline-block">
              motion
            </span>
            .
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Experience the real-time WebGL simplex-noise shader with organic color blending, vignette illumination, and analog film grain.
          </p>
        </div>

        {/* Velaris Live Interactive Container */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
          <Velaris
            height="540px"
            bg={currentPreset.bg}
            colors={currentPreset.colors}
            speed={speed}
            grain={grain}
            className="w-full"
          >
            {/* Overlay content */}
            <div className="flex h-full w-full flex-col items-center justify-between p-8 sm:p-12 text-center relative z-20">
              
              {/* Top controls: Preset selector */}
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-white/60 uppercase tracking-wider">
                  <Palette className="h-3 w-3 text-[#c19a88]" />
                  <span>Preset:</span>
                </div>
                {PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedPresetIndex(idx)}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                      selectedPresetIndex === idx
                        ? 'bg-white/20 text-white shadow-sm font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Center headline & badge */}
              <div className="my-auto max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium text-white/90 backdrop-blur-md shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#c19a88]" />
                  <span>Powered by WebGL 2.0 & Simplex Noise</span>
                </span>
                <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  High-Performance Visual Engineering
                </h3>
                <p className="text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-xl mx-auto">
                  Built for the ambitious engineers competing in the AI/ML, Web, and Native Mobile arenas of Skaleathon.
                </p>
                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#a37560] to-[#c19a88] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_4px_25px_rgba(128,89,72,0.4)] hover:scale-105 transition-transform"
                  >
                    <span>Register Team</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Bottom live stats & control bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/10 bg-black/40 px-6 py-2.5 text-xs text-white/70 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[11px]">60 FPS GPU Rendered</span>
                </div>
                <div className="h-3 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <Sliders className="h-3 w-3 text-[#c19a88]" />
                  <span className="font-mono text-[11px]">Speed:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-20 accent-[#c19a88] cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-[#e8c5b4]">{speed.toFixed(1)}x</span>
                </div>
                <div className="h-3 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px]">Grain:</span>
                  <input
                    type="range"
                    min="0.0"
                    max="0.8"
                    step="0.05"
                    value={grain}
                    onChange={(e) => setGrain(parseFloat(e.target.value))}
                    className="w-20 accent-[#c19a88] cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-[#e8c5b4]">{grain.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </Velaris>
        </div>

      </div>
    </section>
  );
}
