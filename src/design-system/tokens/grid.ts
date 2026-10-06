/**
 * @file grid.ts
 * @description Layout grid, column count, gutter, margin, and container max-width tokens for Aura Core.
 * @module AuraCore/DesignSystem/Tokens/Grid
 */

export const gridTokens = {
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  gutters: {
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },
  margins: {
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '2.5rem', // 40px
  },
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },
} as const;

export type GridTokens = typeof gridTokens;
