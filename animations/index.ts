import { type Variants, type Transition } from 'framer-motion';

// ── Transitions ──

export const springSmooth: Transition = { type: 'spring', stiffness: 300, damping: 30 };
export const springBouncy: Transition = { type: 'spring', stiffness: 400, damping: 25 };
export const springGentle: Transition = { type: 'spring', stiffness: 200, damping: 20 };
export const easeSmooth: Transition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };

// ── Page Transition ──

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(2px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: -10, filter: 'blur(2px)', transition: { duration: 0.3 } },
};

// ── Fade Variants ──

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: 24 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95 },
};

// ── Stagger ──

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Hover Presets (use with whileHover prop spread) ──

export const hoverScale = {
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export const hoverLift = {
  y: -4,
  scale: 1.01,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

// ── Floating Effect ──

export const floatingEffect: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ── Modal ──

export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: -20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
};

// ── Slide ──

export const slideInLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { x: -20, opacity: 0 },
};

export const slideInRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

// ── Scale In (for cards) ──

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, scale: 0.97 },
};

// ── Glow Pulse (for active indicators) ──

export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 10px rgba(255, 255, 255, 0.05)',
      '0 0 25px rgba(255, 255, 255, 0.15)',
      '0 0 10px rgba(255, 255, 255, 0.05)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ── Count Up (for animated numbers) ──

export const countUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
