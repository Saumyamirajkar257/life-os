/**
 * @file presets.ts
 * @description Master preset library consolidating motion engine variants, gestures, and transitions.
 * Fully token-driven with zero-reflow GPU transform performance.
 * @module AuraCore/Animations/Presets
 */

import { Variants } from 'motion/react';
import {
  fadeInVariants,
  fadeOutVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleInVariants,
  scalePopVariants,
  modalBackdropVariants,
  modalCardVariants,
  drawerLeftVariants,
  drawerRightVariants,
  drawerBottomVariants,
  tooltipVariants,
  dropdownVariants,
  toastVariants,
  skeletonPulseVariants,
  loadingSpinnerVariants,
} from './variants';

import {
  buttonGestures,
  cardGestures,
  iconButtonGestures,
  listRowGestures,
  subtleGestures,
  tabPillGestures,
} from './gestures';

import {
  pageFadeVariants,
  routeSlideVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from './page';

import { accordionVariants, sidebarTransition } from './layout';

// Re-export core variant primitives for backward compatibility
export {
  fadeInVariants,
  fadeOutVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleInVariants,
  scalePopVariants,
  modalBackdropVariants,
  modalCardVariants,
  drawerLeftVariants,
  drawerRightVariants,
  drawerBottomVariants,
  tooltipVariants,
  dropdownVariants,
  toastVariants,
  skeletonPulseVariants,
  loadingSpinnerVariants,
};

// Re-export gesture configurations
export {
  buttonGestures,
  cardGestures,
  iconButtonGestures,
  listRowGestures,
  subtleGestures,
  tabPillGestures,
};

// Re-export page and layout transitions
export {
  pageFadeVariants,
  routeSlideVariants,
  staggerContainerVariants,
  staggerItemVariants,
  accordionVariants,
  sidebarTransition,
};

/**
 * Consolidated Motion Presets object for high-level declarative usage.
 */
export const MOTION_PRESETS = {
  fade: {
    in: fadeInVariants,
    out: fadeOutVariants,
  },
  slide: {
    up: slideUpVariants,
    down: slideDownVariants,
    left: slideLeftVariants,
    right: slideRightVariants,
  },
  scale: {
    in: scaleInVariants,
    pop: scalePopVariants,
  },
  overlay: {
    backdrop: modalBackdropVariants,
    card: modalCardVariants,
  },
  drawer: {
    left: drawerLeftVariants,
    right: drawerRightVariants,
    bottom: drawerBottomVariants,
  },
  popover: {
    tooltip: tooltipVariants,
    dropdown: dropdownVariants,
  },
  feedback: {
    toast: toastVariants,
    skeleton: skeletonPulseVariants,
    spinner: loadingSpinnerVariants,
  },
  gestures: {
    button: buttonGestures,
    card: cardGestures,
    icon: iconButtonGestures,
    row: listRowGestures,
    subtle: subtleGestures,
    pill: tabPillGestures,
  },
  navigation: {
    page: pageFadeVariants,
    route: routeSlideVariants,
    staggerContainer: staggerContainerVariants,
    staggerItem: staggerItemVariants,
  },
  layout: {
    accordion: accordionVariants,
    sidebar: sidebarTransition,
  },
} as const;
