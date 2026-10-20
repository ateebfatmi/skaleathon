import React from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(193, 154, 136, 0.14)',
  enableTilt: _enableTilt = false,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      data-tilt={_enableTilt || undefined}
      className={cn(
        'group/spotlight relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(12,12,12,0.96))] p-6 sm:p-8 transition-[border-color,transform] duration-300 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {/* Spotlight Radial Gradient Overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(550px circle at 50% 35%, ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      
      {/* Subtle border highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] border border-[#c19a88]/30 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
