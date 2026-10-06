/**
 * @file borders.ts
 * @description Border stroke width, style, and semantic border token presets for Aura Core.
 * @module AuraCore/DesignSystem/Tokens/Borders
 */

export const borderWidthTokens = {
  none: '0px',
  hair: '0.5px',
  thin: '1px',
  medium: '2px',
  thick: '4px',
} as const;

export const borderStyleTokens = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  none: 'none',
} as const;

export const borderPresets = {
  default: `${borderWidthTokens.thin} ${borderStyleTokens.solid} var(--color-border)`,
  subtle: `${borderWidthTokens.thin} ${borderStyleTokens.solid} var(--color-border-subtle)`,
  dashed: `${borderWidthTokens.thin} ${borderStyleTokens.dashed} var(--color-border)`,
  focus: `${borderWidthTokens.medium} ${borderStyleTokens.solid} var(--color-text-primary)`,
} as const;

export const borderTokens = {
  width: borderWidthTokens,
  style: borderStyleTokens,
  presets: borderPresets,
} as const;

export type BorderTokens = typeof borderTokens;
