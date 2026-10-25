'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { formatDateOnly, REGISTRATION_DEADLINE } from '@/lib/utils';

function LiquidBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame(({ clock, mouse }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.lerp(mouse, 0.05);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.15;
            vec2 m = uMouse * 0.1;
            float color = smoothstep(
              0.0,
              1.0,
              (sin(uv.x * 8.0 + t + m.x * 12.0) + sin(uv.y * 6.0 - t + m.y * 12.0)) * 0.5 + 0.5
            );
            gl_FragColor = vec4(mix(vec3(0.005), vec3(0.05), color), 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Monolith() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[13, 1]} />
        <MeshDistortMaterial
          color="#0a0a0a"
          speed={4}
          distort={0.4}
          roughness={0.05}
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

type ExperienceHeroProps = {
  registrationDeadline?: string | null;
};

export function Component({ registrationDeadline }: ExperienceHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const commandCells = [
    {
      id: '001',
      title: 'REGISTRATION',
      value: `Live (${formatDateOnly(registrationDeadline || REGISTRATION_DEADLINE)})`,
      type: 'progress',
    },
    { id: '002', title: 'EVENT STATS', value: '₹35K Pool', type: 'data' },
    { id: '003', title: 'THE CHALLENGE', value: 'Build to Ship', type: 'text' },
  ] as const;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      if (!reducedMotion) {
        gsap.fromTo(
          revealRef.current,
          { filter: 'blur(30px)', opacity: 0, scale: 1.02 },
          { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 2.2, ease: 'expo.out' }
        );
        gsap.from('.command-cell', {
          x: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 1.5,
          ease: 'power4.out',
          delay: 1,
          clearProps: 'all',
        });
      }
    }, container);

    const handleMouseMove = (event: MouseEvent) => {
      if (!ctaRef.current || reducedMotion) return;
      const rect = ctaRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

      gsap.to(ctaRef.current, {
        x: distance < 150 ? (event.clientX - centerX) * 0.4 : 0,
        y: distance < 150 ? (event.clientY - centerY) * 0.4 : 0,
        duration: distance < 150 ? 0.6 : 0.8,
        ease: distance < 150 ? 'power3.out' : 'elastic.out(1, 0.3)',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      context.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="experience-hero relative flex min-h-[calc(100svh-4rem)] w-full flex-col overflow-hidden bg-[#020202] selection:bg-white selection:text-black md:min-h-screen"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 60], fov: 35 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.4} />
          <spotLight position={[50, 50, 50]} intensity={3} />
          <LiquidBackground />
          <Monolith />
        </Canvas>
      </div>

      <div
        ref={revealRef}
        className="relative z-10 flex min-h-[calc(100svh-4rem)] w-full flex-col items-center gap-6 p-4 pb-8 pt-6 sm:gap-10 sm:p-8 md:min-h-screen md:flex-row md:items-stretch md:p-14 lg:p-20"
      >
        <div className="flex min-w-0 flex-1 flex-col justify-between pb-2 sm:pb-8 md:pb-12">
          <div className="flex items-center gap-3">
            <div className="relative h-2.5 w-2.5 rounded-full bg-white">
              <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-30" />
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#c19a88]">
              SKALEKRAFT // REGISTRATIONS LIVE
            </span>
          </div>

          <div className="max-w-4xl py-12 sm:py-20 md:-translate-y-8 md:py-0 md:pr-12">
            <h1 className="text-[clamp(3.2rem,9.5vw,11.5rem)] font-black uppercase leading-[0.87] tracking-tighter text-white">
              Skale <br /> <span className="experience-text-outline">athon</span>
            </h1>
            <p className="mt-8 max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-white/45 sm:text-[11px] sm:tracking-[0.35em]">
              India&apos;s four-stage online engineering hackathon. Build and ship production-grade
              software across AI/ML, Web, and Mobile arenas.
            </p>
          </div>

          <Link
            ref={ctaRef}
            href="/register"
            className="group flex w-fit items-center gap-6 md:-translate-y-10 lg:-translate-y-20"
          >
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/15 transition-all duration-500 group-hover:bg-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="stroke-white transition-colors duration-500 group-hover:stroke-black"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">
              Register Squad — ₹99
            </span>
          </Link>
        </div>

        <div className="z-20 grid w-full shrink-0 grid-cols-2 gap-3 md:flex md:w-80 md:flex-col md:justify-center md:gap-4 lg:w-96">
          {commandCells.map((item) => (
            <div key={item.id} className={`command-cell experience-glass-panel block p-4 sm:p-7 ${item.id === '001' ? 'col-span-2' : ''}`}>
              <span className="mb-3 block font-mono text-[9px] uppercase tracking-widest text-[#c19a88]/55">
                {item.id} {'//'} {item.title}
              </span>

              {item.type === 'progress' ? (
                <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] text-white/50">
                  <span>
                    {item.value}
                  </span>
                  <div className="h-[2px] w-20 overflow-hidden rounded-full bg-white/5">
                    <div className="experience-loading h-full w-[60%] bg-white" />
                  </div>
                </div>
              ) : item.type === 'data' ? (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex justify-between font-mono text-[10px] text-white/50">
                    <span>Total Prize Pool</span>
                    <span>₹35,000</span>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="flex justify-between font-mono text-[10px] text-white/50">
                    <span>Full Squad Pass</span>
                    <span>₹99</span>
                  </div>
                </div>
              ) : (
                <h2 className="mt-3 text-sm font-medium leading-snug text-white/70">
                  Four competitive stages. Three engineering arenas. One chance to{' '}
                  <span className="italic text-[#ffffff]">build, innovate, and scale</span>.
                </h2>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

