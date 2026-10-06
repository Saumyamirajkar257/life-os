/**
 * @file spacing.ts
 * @description 4px Base Grid Spacing Scale for Aura Core.
 * Provides strictly calculated rem/px values to eliminate arbitrary layout magic numbers.
 * @module AuraCore/DesignSystem/Tokens/Spacing
 */

export interface SpacingToken {
  px: number;
  rem: string;
}

export const baseGridUnit = 4; // 4px

export const spacingTokens = {
  0: { px: 0, rem: '0rem' },
  2: { px: 2, rem: '0.125rem' },
  4: { px: 4, rem: '0.25rem' },
  8: { px: 8, rem: '0.5rem' },
  12: { px: 12, rem: '0.75rem' },
  16: { px: 16, rem: '1rem' },
  20: { px: 20, rem: '1.25rem' },
  24: { px: 24, rem: '1.5rem' },
  32: { px: 32, rem: '2rem' },
  40: { px: 40, rem: '2.5rem' },
  48: { px: 48, rem: '3rem' },
  56: { px: 56, rem: '3.5rem' },
  64: { px: 64, rem: '4rem' },
  80: { px: 80, rem: '5rem' },
  96: { px: 96, rem: '6rem' },
  128: { px: 128, rem: '8rem' },
} as const;

export type SpacingScaleKey = keyof typeof spacingTokens;
