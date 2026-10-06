/**
 * @file transitions.ts
 * @description Centralized transition definitions for Aura Core Motion Engine.
 * Driven by design tokens from ANIMATION_TOKENS.
 * @module AuraCore/Animations/Transitions
 */

import { Transition } from 'motion/react';
import { ANIMATION_TOKENS } from '@/tokens/animations';

export const springTransitions = {
  snappy: {
    type: 'spring',
    stiffness: ANIMATION_TOKENS.springs.snappy.stiffness,
    damping: ANIMATION_TOKENS.springs.snappy.damping,
    mass: 0.8,
  } as Transition,

  gentle: {
    type: 'spring',
    stiffness: ANIMATION_TOKENS.springs.gentle.stiffness,
    damping: ANIMATION_TOKENS.springs.gentle.damping,
    mass: 1,
  } as Transition,

  bouncy: {
    type: 'spring',
    stiffness: ANIMATION_TOKENS.springs.bouncy.stiffness,
    damping: ANIMATION_TOKENS.springs.bouncy.damping,
    mass: 0.9,
  } as Transition,

  expressive: {
    type: 'spring',
    stiffness: 350,
    damping: 25,
    mass: 1,
  } as Transition,

  tight: {
    type: 'spring',
    stiffness: 500,
    damping: 38,
    mass: 0.6,
  } as Transition,
} as const;

export const tweenTransitions = {
  fast: {
    type: 'tween',
    duration: 0.15,
    ease: ANIMATION_TOKENS.easings.decelerate,
  } as Transition,

  normal: {
    type: 'tween',
    duration: 0.25,
    ease: ANIMATION_TOKENS.easings.decelerate,
  } as Transition,

  slow: {
    type: 'tween',
    duration: 0.35,
    ease: ANIMATION_TOKENS.easings.standard,
  } as Transition,

  deliberate: {
    type: 'tween',
    duration: 0.5,
    ease: ANIMATION_TOKENS.easings.standard,
  } as Transition,

  exit: {
    type: 'tween',
    duration: 0.15,
    ease: ANIMATION_TOKENS.easings.exit,
  } as Transition,

  entrance: {
    type: 'tween',
    duration: 0.25,
    ease: ANIMATION_TOKENS.easings.entrance,
  } as Transition,
} as const;

export const layoutTransitions = {
  spring: {
    type: 'spring',
    stiffness: 350,
    damping: 32,
    mass: 0.9,
  } as Transition,

  smooth: {
    type: 'tween',
    duration: 0.25,
    ease: ANIMATION_TOKENS.easings.decelerate,
  } as Transition,
} as const;
