/**
 * @file midnight.ts
 * @description Midnight Theme - Default premium dark theme with deep navy tones and subtle blue accents.
 * Designed for low eye strain and high readability in dark environments.
 * @module AuraCore/DesignSystem/Themes/Midnight
 */

import { ThemeDefinition } from '@/types/theme';

export const midnightTheme: ThemeDefinition = {
  id: 'midnight',
  name: 'Midnight',
  description: 'Default premium dark theme with deep navy canvas and subtle blue accents.',
  category: 'dark',
  isDark: true,

  colors: {
    // Backgrounds & Surfaces (Monochrome Near-Black Scale)
    bg: '#050505',
    surface: '#0A0A0A',
    surfaceElevated: '#111111',
    surfaceMuted: '#0D0D0D',

    // Borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderFocus: '#ffffff',

    // Typography
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.62)',
    textMuted: 'rgba(255, 255, 255, 0.38)',
    textInverse: '#050505',

    // Accent (Monochrome Pure White / High Contrast)
    accent: '#ffffff',
    accentHover: 'rgba(255, 255, 255, 0.88)',
    accentMuted: 'rgba(255, 255, 255, 0.1)',
    accentForeground: '#050505',

    // Status Colors (Restrained)
    success: '#34d399',
    successBg: 'rgba(52, 211, 153, 0.1)',
    warning: '#fbbf24',
    warningBg: 'rgba(251, 191, 36, 0.1)',
    error: '#f87171',
    errorBg: 'rgba(248, 113, 113, 0.1)',
    info: '#38bdf8',
    infoBg: 'rgba(56, 189, 248, 0.1)',

    // Overlays & Backdrop
    overlay: 'rgba(0, 0, 0, 0.82)',
    backdropBlur: '12px',

    // Selection & Focus Ring
    selectionBg: '#ffffff',
    selectionText: '#050505',
    focusRing: 'rgba(255, 255, 255, 0.25)',

    // Scrollbar & Glass Effects
    scrollbarThumb: '#222222',
    scrollbarTrack: '#050505',
    glassBg: 'rgba(10, 10, 10, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },

  elevation: {
    shadowLow: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
    shadowHigh: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
    shadowFloating: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
  },
};
