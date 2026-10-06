/**
 * @file radius.ts
 * @description Corner Radius Design Tokens for Aura Core.
 * Ensures consistent corner curvature adhering to mathematical radius laws.
 * @module AuraCore/DesignSystem/Tokens/Radius
 */

export const radiusTokens = {
  none: '0px',
  xs: '0.125rem', // 2px
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  pill: '9999px',
  full: '50%',
} as const;

export type RadiusTokenKey = keyof typeof radiusTokens;
