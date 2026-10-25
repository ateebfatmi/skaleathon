'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { EventData, EventTrack } from '@/lib/db/types';
import MultiStepRegistration from '@/components/registration/MultiStepRegistration';
import { cyberAudio } from '@/lib/cyber-sound';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: EventTrack[];
  event: EventData;
  selectedTrackId?: string;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  tracks,
  event,
  selectedTrackId,
}: RegistrationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const currentTrack = tracks.find((t) => t.id === selectedTrackId);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-0 backdrop-blur-md animate-in fade-in duration-200 sm:p-5 md:p-6"
    >
      {/* Click outside to dismiss backdrop */}
      <div className="fixed inset-0 bg-transparent" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex h-[100dvh] max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden border-y-0 border-white/15 bg-[#0c0c0c] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.15)] sm:my-auto sm:h-auto sm:max-h-[86vh] sm:rounded-3xl sm:border">
        {/* Ambient background light */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#737373]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#f5f5f5]/15 blur-[90px]" />

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#c19a88] shadow-sm shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c19a88] font-bold">
                  SkaleKraft Presents
                </span>
                {currentTrack && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#f5f5f5]/30 bg-[#f5f5f5]/10 text-[#ffffff] truncate max-w-[150px]">
                    {currentTrack.name}
                  </span>
                )}
              </div>
              <h2 id="registration-modal-title" className="text-sm sm:text-base font-bold text-white truncate">
                Candidate & Team Registration
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 mr-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>₹{event.registration_fee_inr} / Team</span>
            </span>
            <button
              onClick={onClose}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
              aria-label="Close registration window"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Registration Form Area */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
          <MultiStepRegistration
            tracks={tracks}
            event={event}
            initialTrackId={selectedTrackId}
            isModal={true}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
