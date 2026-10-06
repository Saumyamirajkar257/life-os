/**
 * @file layout.ts
 * @description Layout animation configurations for resizable containers, sidebars, and accordions.
 * Leverages Framer Motion automatic layout projection without forcing DOM reflows.
 * @module AuraCore/Animations/Layout
 */

import { Variants, Transition } from 'motion/react';
import { layoutTransitions, springTransitions, tweenTransitions } from './transitions';

export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
    transition: tweenTransitions.fast,
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: tweenTransitions.normal,
  },
};

export const sidebarTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 32,
  mass: 0.8,
};

export const activeTabIndicatorTransition: Transition = springTransitions.snappy;

export const defaultLayoutTransition = layoutTransitions.spring;
