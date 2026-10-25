import React from 'react';
import { cn } from '@/lib/utils';

export type GridFeature = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
  feature: GridFeature;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const pattern = genPattern(feature.title);

  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden bg-[#0b0b0b] p-3.5 transition-colors duration-300 hover:bg-white/[0.035] sm:p-6',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.045] to-white/[0.01] opacity-80 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] transition-opacity duration-300 group-hover:opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={pattern}
            className="absolute inset-0 h-full w-full fill-[#f5f5f5]/10 stroke-white/[0.09] mix-blend-screen"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full min-h-44 flex-col sm:min-h-40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f5f5f5]/20 bg-[#f5f5f5]/10 text-[#ffffff] transition-all duration-300 group-hover:border-[#f5f5f5]/40 group-hover:bg-[#f5f5f5]/15 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] sm:h-10 sm:w-10">
          <feature.icon className="size-4 sm:size-5" strokeWidth={1.4} aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xs font-semibold leading-4 tracking-wide text-white sm:mt-8 sm:text-base">
          {feature.title}
        </h3>
        <p className="mobile-card-copy mt-2 text-[10px] font-light leading-4 text-muted-foreground sm:text-xs sm:leading-relaxed">
          {feature.description}
        </p>
        <span className="mt-auto pt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#c19a88]/75 transition-colors group-hover:text-[#ffffff]">
          Open directory →
        </span>
      </div>
    </div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<'svg'> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([squareX, squareY], index) => (
            <rect
              key={`${squareX}-${squareY}-${index}`}
              strokeWidth="0"
              width={width + 1}
              height={height + 1}
              x={squareX * width}
              y={squareY * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

// A title-derived pattern stays stable across server rendering and hydration.
function genPattern(seed: string, length = 5): number[][] {
  let value = Array.from(seed).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2166136261,
  );

  return Array.from({ length }, () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    const x = (value % 4) + 7;
    value = (value * 1664525 + 1013904223) >>> 0;
    const y = (value % 6) + 1;
    return [x, y];
  });
}
