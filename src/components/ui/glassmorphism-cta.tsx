"use client";

import type { AnchorHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type GlassmorphismCtaProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  spread?: string;
  shimmerColor?: string;
  speed?: string;
};

export default function GlassmorphismCta({
  label = "Register Your Team",
  avatarSrc = "/images/skalekraft-logo.png",
  avatarAlt = "SkaleKraft logo",
  spread = "90deg",
  shimmerColor = "rgba(193, 154, 136, 0.85)",
  speed = "4s",
  className,
  href = "#",
  onClick,
  ...props
}: GlassmorphismCtaProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (href === "#") event.preventDefault();
        onClick?.(event);
      }}
      className={cn(
        "group isolate relative inline-flex cursor-pointer overflow-hidden rounded-full shadow-[0_8px_30px_rgba(128,89,72,0.24)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_8px_rgba(193,154,136,0.28)]",
        className,
      )}
      style={
        {
          "--spread": spread,
          "--shimmer-color": shimmerColor,
          "--radius": "9999px",
          "--speed": speed,
          "--cut": "1px",
          "--bg": "rgba(128, 89, 72, 0.08)",
        } as CSSProperties
      }
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-[-200%] h-[400%] w-[400%] [animation:rotate-gradient_var(--speed)_linear_infinite]">
          <div className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      <div className="absolute rounded-full [background:var(--bg)] [inset:var(--cut)] backdrop-blur" />
      <div
        className="relative z-10 flex w-full items-center gap-2 overflow-hidden px-3.5 py-1.5 text-xs font-semibold text-white sm:w-auto"
        style={{ borderRadius: "9999px" }}
      >
        <div
          className="absolute"
          style={{
            width: "200%",
            height: "200%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.2), rgba(255,255,255,0.2), rgba(255,255,255,0.2), transparent)",
            animation: "borderBeamRotation 4s infinite linear",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute"
          style={{
            inset: "1px",
            background: "rgba(17, 14, 13, 0.92)",
            borderRadius: "9999px",
            backdropFilter: "blur(8px)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={avatarAlt}
          width={24}
          height={24}
          className="relative z-10 h-6 w-6 rounded-full object-cover ring-1 ring-[#c19a88]/40 shadow-[0_0_12px_rgba(193,154,136,0.3)] shrink-0"
          style={{ width: 24, height: 24, maxWidth: 24, maxHeight: 24 }}
        />
        <span className="relative z-10 whitespace-nowrap font-sans">{label}</span>
      </div>
    </a>
  );
}
