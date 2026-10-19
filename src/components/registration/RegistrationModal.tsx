'use client';

import React, { useEffect } from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { EventTrack } from '@/lib/db/types';
import MultiStepRegistration from '@/components/registration/MultiStepRegistration';
import { cyberAudio } from '@/lib/cyber-sound';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: EventTrack[];
  selectedTrackId?: string;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  tracks,
  selectedTrackId,
}: RegistrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      cyberAudio.playSuccess();
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTrack = tracks.find((t) => t.id === selectedTrackId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Click outside to dismiss backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] border border-white/15 bg-[#0C0A09] shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_50px_rgba(193,154,136,0.15)] overflow-hidden">
        {/* Ambient background light */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#805948]/25 blur-[100px]" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#c19a88]/15 blur-[100px]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#c19a88] shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c19a88] font-bold">
                  SkaleKraft Presents
                </span>
                {currentTrack && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 text-[#e8c5b4]">
                    {currentTrack.name}
                  </span>
                )}
              </div>
              <h2 id="registration-modal-title" className="text-sm sm:text-base font-bold text-white">
                Skaleathon 2027 — Candidate & Team Registration
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 mr-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>₹99 Flat / Team</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close registration window"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Registration Form Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 custom-scrollbar">
          <MultiStepRegistration
            tracks={tracks}
            initialTrackId={selectedTrackId}
            isModal={true}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
