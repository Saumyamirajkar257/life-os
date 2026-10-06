/**
 * @file index.ts
 * @description Single Barrel Export for all Aura Core Design Tokens.
 * Provides typed access to colors, typography, spacing, radius, elevation,
 * animation, opacity, blur, borders, grid, breakpoints, and z-index.
 * @module AuraCore/DesignSystem/Tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './elevation';
export * from './animation';
export * from './opacity';
export * from './blur';
export * from './borders';
export * from './grid';
export * from './breakpoints';
export * from './z-index';

import { colorTokens } from './colors';
import { typographyTokens } from './typography';
import { spacingTokens } from './spacing';
import { radiusTokens } from './radius';
import { elevationTokens } from './elevation';
import { animationTokens } from './animation';
import { opacityTokens } from './opacity';
import { blurTokens } from './blur';
import { borderTokens } from './borders';
import { gridTokens } from './grid';
import { breakpointTokens } from './breakpoints';
import { zIndexTokens } from './z-index';

export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  elevation: elevationTokens,
  animation: animationTokens,
  opacity: opacityTokens,
  blur: blurTokens,
  borders: borderTokens,
  grid: gridTokens,
  breakpoints: breakpointTokens,
  zIndex: zIndexTokens,
} as const;

export type DesignTokens = typeof designTokens;
