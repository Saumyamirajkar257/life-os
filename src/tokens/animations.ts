/**
 * @file animations.ts
 * @description Motion duration, easing bezier curves, and physics springs design tokens.
 * @module AuraCore/Tokens/Animations
 */

export const ANIMATION_TOKENS = {
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    deliberate: '500ms',
  },

  easings: {
    // Apple/Linear style crisp deceleration
    decelerate: [0.16, 1, 0.3, 1] as const,
    // Smooth standard transition
    standard: [0.2, 0, 0, 1] as const,
    // Subtle entrance
    entrance: [0, 0, 0.2, 1] as const,
    // Exit
    exit: [0.4, 0, 1, 1] as const,
  },

  springs: {
    snappy: { stiffness: 400, damping: 30 },
    gentle: { stiffness: 200, damping: 20 },
    bouncy: { stiffness: 300, damping: 15 },
  },
} as const;

export type AnimationTokens = typeof ANIMATION_TOKENS;
