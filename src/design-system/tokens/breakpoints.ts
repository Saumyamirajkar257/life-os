/**
 * @file breakpoints.ts
 * @description Desktop-First Breakpoint Tokens for Aura Core.
 * Defines media query target thresholds prioritizing high-density desktop views.
 * @module AuraCore/DesignSystem/Tokens/Breakpoints
 */

export interface BreakpointConfig {
  minWidth: string;
  pixels: number;
}

export const breakpointTokens = {
  mobile: {
    minWidth: '640px',
    pixels: 640,
  },
  tablet: {
    minWidth: '768px',
    pixels: 768,
  },
  laptop: {
    minWidth: '1024px',
    pixels: 1024,
  },
  desktop: {
    minWidth: '1280px',
    pixels: 1280,
  },
  ultraWide: {
    minWidth: '1536px',
    pixels: 1536,
  },
} as const;

export const mediaQueries = {
  mobile: `(max-width: 639px)`,
  tablet: `(min-width: 640px) and (max-width: 767px)`,
  laptop: `(min-width: 768px) and (max-width: 1023px)`,
  desktop: `(min-width: 1024px)`,
  ultraWide: `(min-width: 1536px)`,
} as const;

export type BreakpointTokens = typeof breakpointTokens;
