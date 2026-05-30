import { type Variants } from 'framer-motion';

export const dashboardEntrySequence: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const widgetEntry: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const progressFill: Variants = {
  initial: { scaleX: 0 },
  animate: (custom: number) => ({
    scaleX: custom / 100,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 },
  }),
};

export const counterAnimation: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const circularProgress: Variants = {
  initial: { pathLength: 0 },
  animate: (custom: number) => ({
    pathLength: custom / 100,
    transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 },
  }),
};

export const typewriterContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.03 } },
};

export const typewriterChar: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.01 } },
};

export const barFill: Variants = {
  initial: { scaleY: 0 },
  animate: (custom: { height: number; delay: number }) => ({
    scaleY: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: custom.delay },
  }),
};
