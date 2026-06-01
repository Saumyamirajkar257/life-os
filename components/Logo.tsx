'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

interface LogoProps {
  showText?: boolean;
  showSubtitle?: boolean;
  size?: number;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function Logo({
  showText = true,
  showSubtitle = false,
  size = 40,
  layout = 'horizontal',
  className,
}: LogoProps) {
  const { theme } = useThemeStore();
  const isWhiteTheme = theme === 'white';

  // Svg colors derived from theme
  const strokeColor = isWhiteTheme ? 'text-black' : 'text-white';
  const dotColorClass = isWhiteTheme ? 'fill-black' : 'fill-white';
  const greyDotColorClass = isWhiteTheme ? 'fill-black/35' : 'fill-white/35';

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors duration-300 shrink-0", strokeColor)}
    >
      {/* Outer Hexagon Cube */}
      <path
        d="M50 15 L80 32.5 L80 67.5 L50 85 L20 67.5 L20 32.5 Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer Cube division lines */}
      <path
        d="M50 50 L50 15 M50 50 L80 67.5 M50 50 L20 67.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Inner Hexagon Cube (Transparent Hypercube style) */}
      <path
        d="M50 34.25 L63.64 42.125 L63.64 57.875 L50 65.75 L36.36 57.875 L36.36 42.125 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.33"
      />
      <path
        d="M50 50 L50 34.25 M50 50 L63.64 57.875 M50 50 L36.36 57.875"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.33"
      />

      {/* Symmetrical Vertices Dots */}
      {/* Center dot */}
      <circle cx="50" cy="50" r="4.5" className={dotColorClass} />
      {/* Top-Left dot */}
      <circle cx="20" cy="32.5" r="3.5" className={greyDotColorClass} />
      {/* Top-Right dot */}
      <circle cx="80" cy="32.5" r="3.5" className={greyDotColorClass} />
      {/* Bottom dot */}
      <circle cx="50" cy="85" r="3.5" className={greyDotColorClass} />
    </svg>
  );

  if (!showText) {
    return svgContent;
  }

  return (
    <div
      className={cn(
        "flex items-center",
        layout === 'vertical' ? "flex-col text-center" : "flex-row gap-3",
        className
      )}
    >
      {svgContent}
      <div className={cn("flex flex-col select-none", layout === 'vertical' ? "mt-4" : "")}>
        <span
          className={cn(
            "font-display font-extrabold tracking-wider leading-none transition-colors duration-300",
            layout === 'vertical' ? "text-3xl" : "text-lg",
            isWhiteTheme ? "text-black" : "text-white"
          )}
        >
          LIFE OS
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "font-mono font-bold tracking-[0.25em] text-[10px] mt-1.5 transition-colors duration-300",
              isWhiteTheme ? "text-black/60" : "text-white/40"
            )}
          >
            COMMAND CENTER
          </span>
        )}
      </div>
    </div>
  );
}
