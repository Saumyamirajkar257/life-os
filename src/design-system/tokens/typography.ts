/**
 * @file typography.ts
 * @description Typographic scale and font family tokens for Aura Core.
 * Follows a high-precision typographic hierarchy with Geist / Inter font stacks.
 * @module AuraCore/DesignSystem/Tokens/Typography
 */

export interface TypographyToken {
  fontSize: string;
  fontWeight: number | string;
  lineHeight: string;
  letterSpacing: string;
  fontFamily: string;
}

export const fontFamilies = {
  sans: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typographyTokens: Record<string, TypographyToken> = {
  displayXl: {
    fontSize: '3.5rem', // 56px
    fontWeight: fontWeights.light,
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    fontFamily: fontFamilies.sans,
  },
  displayL: {
    fontSize: '2.75rem', // 44px
    fontWeight: fontWeights.light,
    lineHeight: '1.15',
    letterSpacing: '-0.025em',
    fontFamily: fontFamilies.sans,
  },
  displayM: {
    fontSize: '2.25rem', // 36px
    fontWeight: fontWeights.light,
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    fontFamily: fontFamilies.sans,
  },
  h1: {
    fontSize: '2rem', // 32px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.25',
    letterSpacing: '-0.02em',
    fontFamily: fontFamilies.sans,
  },
  h2: {
    fontSize: '1.5rem', // 24px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.3',
    letterSpacing: '-0.015em',
    fontFamily: fontFamilies.sans,
  },
  h3: {
    fontSize: '1.25rem', // 20px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.35',
    letterSpacing: '-0.01em',
    fontFamily: fontFamilies.sans,
  },
  h4: {
    fontSize: '1.125rem', // 18px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '-0.005em',
    fontFamily: fontFamilies.sans,
  },
  title: {
    fontSize: '1rem', // 16px
    fontWeight: fontWeights.medium,
    lineHeight: '1.5',
    letterSpacing: '0em',
    fontFamily: fontFamilies.sans,
  },
  subtitle: {
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeights.medium,
    lineHeight: '1.5',
    letterSpacing: '0.01em',
    fontFamily: fontFamilies.sans,
  },
  bodyLarge: {
    fontSize: '1.125rem', // 18px
    fontWeight: fontWeights.regular,
    lineHeight: '1.6',
    letterSpacing: '0em',
    fontFamily: fontFamilies.sans,
  },
  body: {
    fontSize: '1rem', // 16px
    fontWeight: fontWeights.regular,
    lineHeight: '1.5',
    letterSpacing: '0em',
    fontFamily: fontFamilies.sans,
  },
  bodySmall: {
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeights.regular,
    lineHeight: '1.5',
    letterSpacing: '0em',
    fontFamily: fontFamilies.sans,
  },
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: fontWeights.regular,
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontFamily: fontFamilies.sans,
  },
  label: {
    fontSize: '0.6875rem', // 11px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '0.05em',
    fontFamily: fontFamilies.sans,
  },
  tiny: {
    fontSize: '0.625rem', // 10px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.3',
    letterSpacing: '0.08em',
    fontFamily: fontFamilies.sans,
  },
} as const;

export type TypographyTokens = typeof typographyTokens;
