/**
 * @file variants.ts
 * @description Comprehensive Motion Variant definitions for Aura Core UI components.
 * GPU-accelerated (transform and opacity only), zero layout shift.
 * @module AuraCore/Animations/Variants
 */

import { Variants } from 'motion/react';
import { springTransitions, tweenTransitions } from './transitions';

// ==========================================
// 1. Fade Variants
// ==========================================

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    transition: tweenTransitions.exit,
  },
};

export const fadeOutVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 0,
    transition: tweenTransitions.fast,
  },
};

// ==========================================
// 2. Slide Variants
// ==========================================

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
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

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: tweenTransitions.exit,
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: tweenTransitions.exit,
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    x: 12,
    transition: tweenTransitions.exit,
  },
};

// ==========================================
// 3. Scale & Pop Variants
// ==========================================

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransitions.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: tweenTransitions.exit,
  },
};

export const scalePopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransitions.expressive,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: tweenTransitions.exit,
  },
};

// ==========================================
// 4. Modal & Overlay Variants
// ==========================================

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: tweenTransitions.normal,
  },
  exit: {
    opacity: 0,
    transition: tweenTransitions.exit,
  },
};

export const modalCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransitions.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 4,
    transition: tweenTransitions.exit,
  },
};

// ==========================================
// 5. Drawer Variants
// ==========================================

export const drawerRightVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransitions.gentle,
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: tweenTransitions.exit,
  },
};

export const drawerLeftVariants: Variants = {
  hidden: { opacity: 0, x: '-100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransitions.gentle,
  },
  exit: {
    opacity: 0,
    x: '-100%',
    transition: tweenTransitions.exit,
  },
};

export const drawerBottomVariants: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransitions.gentle,
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: tweenTransitions.exit,
  },
};

// ==========================================
// 6. Tooltip & Popover Variants
// ==========================================

export const tooltipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransitions.tight,
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 2,
    transition: tweenTransitions.fast,
  },
};

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransitions.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -2,
    transition: tweenTransitions.fast,
  },
};

// ==========================================
// 7. Toast Variants
// ==========================================

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransitions.snappy,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: tweenTransitions.exit,
  },
};

// ==========================================
// 8. Skeleton & Loading Variants
// ==========================================

export const skeletonPulseVariants: Variants = {
  hidden: { opacity: 0.4 },
  visible: {
    opacity: 0.8,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 0.9,
      ease: 'easeInOut',
    },
  },
};

export const loadingSpinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 0.8,
      ease: 'linear',
    },
  },
};
