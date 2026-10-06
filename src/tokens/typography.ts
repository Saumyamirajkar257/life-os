/**
 * @file typography.ts
 * @description Typographic scale, font family, line height, and font weight design tokens.
 * Configured with Geist Sans display/sans pairing and Inter fallback.
 * @module AuraCore/Tokens/Typography
 */

export const TYPOGRAPHY_TOKENS = {
  fontFamilies: {
    sans: 'Geist, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
    display: 'Geist, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", sans-serif',
    mono: '"Geist Mono", "SF Mono", JetBrains Mono, Menlo, Monaco, Consolas, monospace',
  },

  fontSizes: {
    xs: { size: '0.75rem', lineHeight: '1rem', letterSpacing: '0.01em' },     // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0em' },    // 14px
    base: { size: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.011em' },  // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem', letterSpacing: '-0.014em' },// 18px
    xl: { size: '1.25rem', lineHeight: '1.875rem', letterSpacing: '-0.017em' },// 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem', letterSpacing: '-0.02em' },   // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem', letterSpacing: '-0.022em' },// 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem', letterSpacing: '-0.025em' }, // 36px
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export type TypographyTokens = typeof TYPOGRAPHY_TOKENS;
