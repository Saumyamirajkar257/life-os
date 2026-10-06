/**
 * @file blur.ts
 * @description Backdrop and filter blur design tokens for Aura Core.
 * Used for glassy surfaces, popover backdrops, and modal overlays.
 * @module AuraCore/DesignSystem/Tokens/Blur
 */

export const blurTokens = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '40px',
} as const;

export type BlurTokenKey = keyof typeof blurTokens;
