/**
 * @file opacity.ts
 * @description Opacity Design Tokens for Aura Core.
 * Defines standard transparency states for overlays, hover feedback, and disabled elements.
 * @module AuraCore/DesignSystem/Tokens/Opacity
 */

export const opacityTokens = {
  transparent: 0,
  subtle: 0.05,
  disabled: 0.38,
  muted: 0.6,
  hover: 0.8,
  active: 0.9,
  modalOverlay: 0.75,
  opaque: 1,
} as const;

export type OpacityTokenKey = keyof typeof opacityTokens;
