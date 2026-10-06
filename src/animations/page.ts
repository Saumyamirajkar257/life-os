/**
 * @file page.ts
 * @description Page and route transition variants and container staggering utilities.
 * Ensures smooth, zero-flicker view swapping across views and sub-routes.
 * @module AuraCore/Animations/Page
 */

import { Variants } from 'motion/react';
import { tweenTransitions, springTransitions } from './transitions';

export const pageFadeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: tweenTransitions.exit,
  },
};

export const routeSlideVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: springTransitions.snappy,
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: tweenTransitions.exit,
  },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: tweenTransitions.exit,
  },
};
