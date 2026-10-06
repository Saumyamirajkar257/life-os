/**
 * @file spacing.ts
 * @description Spatial grid system, container padding, and border radius tokens.
 * Enforces mathematical padding rules (outer container padding >= inner child spacing).
 * @module AuraCore/Tokens/Spacing
 */

export const SPACING_TOKENS = {
  // Base 4px Spatial Grid Scale
  grid: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    5: '1.25rem', // 20px
    6: '1.5rem',  // 24px
    8: '2rem',    // 32px
    10: '2.5rem', // 40px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
    20: '5rem',   // 80px
  },

  // Container Padding Presets (Minimum outer container padding = 16px / 1rem)
  containers: {
    paddingMin: '1rem',      // 16px
    paddingStandard: '1.5rem',// 24px
    paddingSpacious: '2rem',  // 32px
  },

  // Radii System (Nested radius rule: Inner Radius = Outer Radius - Padding)
  radii: {
    none: '0px',
    xs: '0.25rem',  // 4px
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },
} as const;

export type SpacingTokens = typeof SPACING_TOKENS;
