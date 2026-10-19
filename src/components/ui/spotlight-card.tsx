'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { cyberAudio } from '@/lib/cyber-sound';

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
  enableTilt = false,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(1);

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
    }
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    cyberAudio.playHover();
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || undefined,
        transition: 'transform 0.25s ease-out, border-color 0.25s ease',
      }}
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(12,12,12,0.96))] p-6 sm:p-8 transition-colors duration-300',
        className
      )}
      {...props}
    >
      {/* Spotlight Radial Gradient Overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      
      {/* Subtle border highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] border border-transparent transition-opacity duration-300"
        style={{
          opacity,
          borderColor: 'rgba(193, 154, 136, 0.28)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
