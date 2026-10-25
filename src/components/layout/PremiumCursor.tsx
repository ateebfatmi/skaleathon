"use client";

import { useEffect, useRef } from "react";

type CursorMode = "default" | "button" | "card" | "image" | "text";

const defaultColor = "rgba(255,255,255, 0.85)";

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function getMode(target: Element | null): CursorMode {
  if (!target) return "default";
  if (target.closest("button, a, [role='button'], select, summary")) return "button";
  if (target.closest("input, textarea, [contenteditable='true'], p, h1, h2, h3, h4, h5, h6, li, label")) return "text";
  if (target.closest("[data-cursor-image], img, picture")) return "image";
  if (target.closest("[data-cursor-card], article")) return "card";
  return "default";
}

const getSize = (mode: CursorMode) => (mode === "button" ? 42 : mode === "image" ? 36 : mode === "card" ? 30 : mode === "text" ? 18 : 24);

export default function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    const canUseCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canUseCursor || reduceMotion) return;

    let frame = 0;
    let mounted = true;
    let lastButton: HTMLElement | null = null;
    let lastButtonRect: DOMRect | null = null;

    document.documentElement.classList.add("premium-cursor-enabled");
    pointer.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    dot.current = pointer.current;
    ring.current = pointer.current;

    const updateHoverState = (target: Element | null) => {
      const nextMode = getMode(target);
      modeRef.current = nextMode;
      const size = getSize(nextMode);

      if (ringRef.current) {
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.opacity = "1";
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
      }
    };

    updateHoverState(document.elementFromPoint(pointer.current.x, pointer.current.y));

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const mode = getMode(target);
      const button = target?.closest("button, a, [role='button'], select, summary") as HTMLElement | null;

      let x = event.clientX;
      let y = event.clientY;

      if (mode === "button" && button) {
        if (button !== lastButton || !lastButtonRect) {
          lastButton = button;
          lastButtonRect = button.getBoundingClientRect();
        }
        x = lerp(x, lastButtonRect.left + lastButtonRect.width / 2, 0.16);
        y = lerp(y, lastButtonRect.top + lastButtonRect.height / 2, 0.16);
      } else {
        lastButton = null;
        lastButtonRect = null;
      }

      pointer.current = { x, y };
      updateHoverState(target);
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const onPointerLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
      lastButton = null;
      lastButtonRect = null;
    };

    const animate = () => {
      frame = 0;
      if (!mounted) return;

      const mode = modeRef.current;
      const movement =
        Math.abs(dot.current.x - pointer.current.x) +
        Math.abs(dot.current.y - pointer.current.y) +
        Math.abs(ring.current.x - dot.current.x) +
        Math.abs(ring.current.y - dot.current.y);
      dot.current.x = lerp(dot.current.x, pointer.current.x, mode === "text" ? 0.9 : 0.78);
      dot.current.y = lerp(dot.current.y, pointer.current.y, mode === "text" ? 0.9 : 0.78);
      ring.current.x = lerp(ring.current.x, dot.current.x, mode === "text" ? 0.6 : 0.42);
      ring.current.y = lerp(ring.current.y, dot.current.y, mode === "text" ? 0.6 : 0.42);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (movement > 0.08) frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(animate);

    return () => {
      mounted = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.classList.remove("premium-cursor-enabled");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="premium-cursor-ring"
        style={{
          borderColor: defaultColor,
          color: defaultColor,
          height: 24,
          opacity: 0,
          width: 24,
        }}
      />
      <div ref={dotRef} className="premium-cursor-dot" style={{ opacity: 0 }} />
    </>
  );
}
