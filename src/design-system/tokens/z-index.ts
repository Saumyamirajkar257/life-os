/**
 * @file z-index.ts
 * @description Layering and Stacking Context Tokens for Aura Core.
 * Eliminates arbitrary z-index values across popovers, modals, tooltips, and toasts.
 * @module AuraCore/DesignSystem/Tokens/ZIndex
 */

export const zIndexTokens = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  popover: 300,
  tooltip: 400,
  overlay: 500,
  modal: 600,
  toast: 700,
  maximum: 9999,
} as const;

export type ZIndexTokenKey = keyof typeof zIndexTokens;
