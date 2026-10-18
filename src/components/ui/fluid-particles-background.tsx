"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface FluidParticlesBackgroundProps {
  children?: React.ReactNode;
  particleCount?: number;
  noiseIntensity?: number;
  particleSize?: { min: number; max: number };
  theme?: "light" | "dark" | "auto";
  className?: string;
}

function createNoise() {
  const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  const p = new Array<number>(512);
  for (let i = 0; i < 256; i += 1) p[256 + i] = p[i] = permutation[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;

    return lerp(
      w,
      lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))),
      lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))),
    );
  };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
}

export function FluidParticlesBackground({
  children,
  particleCount = 120,
  noiseIntensity = 0.003,
  particleSize = { min: 0.5, max: 1.6 },
  theme = "dark",
  className,
}: FluidParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = useMemo(() => createNoise(), []);
  const minSize = particleSize.min;
  const maxSize = particleSize.max;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrame = 0;
    let lastDrawTime = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let isTabVisible = document.visibilityState === "visible";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const shouldAnimate = !reducedMotion;
    const effectiveCount = reducedMotion ? 20 : isMobile ? 35 : Math.min(particleCount, 150);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width || window.innerWidth);
      height = Math.max(1, rect.height || window.innerHeight);
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: effectiveCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 50,
      }));
    };

    const targetInterval = isMobile ? 1000 / 24 : 1000 / 36;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout | number = 0;
    const handleScroll = () => {
      if (!isMobile) return;
      isScrolling = true;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      if (typeof window !== "undefined") {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          isScrolling = false;
          if (isTabVisible && shouldAnimate && !animationFrame) {
            lastDrawTime = performance.now();
            animationFrame = window.requestAnimationFrame(draw);
          }
        }, 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const draw = (timestamp: number) => {
      if (!isTabVisible || (isMobile && isScrolling)) return;

      const elapsed = timestamp - lastDrawTime;
      if (elapsed < targetInterval && lastDrawTime !== 0) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = timestamp - (elapsed % targetInterval);

      // Clear with transparent/dark trail
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.life += shouldAnimate ? 1 : 0;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
        }
        const opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.28;
        
        const direction = isMobile
          ? (Math.sin(particle.x * 0.006 + timestamp * 0.0006) + Math.cos(particle.y * 0.006)) * Math.PI
          : noise(particle.x * noiseIntensity, particle.y * noiseIntensity, timestamp * 0.0001) * Math.PI * 4;

        if (shouldAnimate) {
          particle.x = (particle.x + Math.cos(direction) * 0.9 + width) % width;
          particle.y = (particle.y + Math.sin(direction) * 0.9 + height) % height;
        }

        // SkaleKraft warm copper & terracotta particle color
        ctx.fillStyle = `rgba(211, 165, 143, ${opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (shouldAnimate) animationFrame = window.requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible) {
        lastDrawTime = performance.now();
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resizeCanvas();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (typeof window !== "undefined") window.clearTimeout(scrollTimeout);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [particleCount, noiseIntensity, minSize, maxSize, noise, theme]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden pointer-events-none", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />
      {children && <div className="relative z-10 flex h-full w-full items-center justify-center">{children}</div>}
    </div>
  );
}
