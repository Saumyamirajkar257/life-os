/**
 * @file gestures.ts
 * @description Motion gesture configurations (hover, tap, focus) for interactive controls.
 * Guarantees consistent spring physics across buttons, cards, and list rows.
 * @module AuraCore/Animations/Gestures
 */

import { TargetAndTransition } from 'motion/react';
import { springTransitions } from './transitions';

export interface MotionGestureProps {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  whileFocus?: TargetAndTransition;
  transition?: any;
}

export const buttonGestures: MotionGestureProps = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.97, y: 0 },
  transition: springTransitions.snappy,
};

export const cardGestures: MotionGestureProps = {
  whileHover: { y: -3, scale: 1.005 },
  whileTap: { scale: 0.995, y: -1 },
  transition: springTransitions.gentle,
};

export const iconButtonGestures: MotionGestureProps = {
  whileHover: { scale: 1.08 },
  whileTap: { scale: 0.92 },
  transition: springTransitions.tight,
};

export const listRowGestures: MotionGestureProps = {
  whileHover: { x: 3 },
  whileTap: { scale: 0.99 },
  transition: springTransitions.snappy,
};

export const subtleGestures: MotionGestureProps = {
  whileHover: { opacity: 0.88 },
  whileTap: { scale: 0.98 },
  transition: springTransitions.snappy,
};

export const tabPillGestures: MotionGestureProps = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: springTransitions.tight,
};
