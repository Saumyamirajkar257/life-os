/**
 * @file animation.ts
 * @description Motion, duration, and easing curve tokens for Aura Core.
 * Compatible with standard CSS transitions and Framer Motion spring presets.
 * @module AuraCore/DesignSystem/Tokens/Animation
 */

export const animationDurations = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
} as const;

export const animationEasings = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const springPresets = {
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  gentleSpring: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 24,
    mass: 1,
  },
  bouncySpring: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
    mass: 0.8,
  },
} as const;

export const animationTokens = {
  duration: animationDurations,
  easing: animationEasings,
  springs: springPresets,
} as const;

export type AnimationTokens = typeof animationTokens;
