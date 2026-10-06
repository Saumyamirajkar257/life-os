/**
 * @file reduced-motion.ts
 * @description Accessible motion fallbacks for users with prefers-reduced-motion enabled.
 * Converts spatial translate/scale transforms into pure fade transitions.
 * @module AuraCore/Animations/ReducedMotion
 */

import { Variants } from 'motion/react';

export const REDUCED_MOTION_TRANSITION = {
  duration: 0.1,
  ease: 'linear' as const,
};

export const reducedMotionFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: REDUCED_MOTION_TRANSITION,
  },
  exit: {
    opacity: 0,
    transition: REDUCED_MOTION_TRANSITION,
  },
};

/**
 * Transforms any standard motion variant into an accessible reduced-motion variant
 * by stripping away x, y, rotate, and scale transforms while preserving opacity transitions.
 */
export function getReducedMotionVariant(variant: Variants): Variants {
  const sanitizeTarget = (target: any) => {
    if (!target || typeof target !== 'object') return target;
    const { x, y, scale, rotate, skewX, skewY, ...safeProps } = target;
    return {
      ...safeProps,
      transition: REDUCED_MOTION_TRANSITION,
    };
  };

  const reduced: Variants = {};
  for (const key of Object.keys(variant)) {
    reduced[key] = sanitizeTarget(variant[key]);
  }
  return reduced;
}
