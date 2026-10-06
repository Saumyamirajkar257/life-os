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
    // Backgrounds & Surfaces (Deep Navy Scale)
    bg: '#0b1120',
    surface: '#111827',
    surfaceElevated: '#1f2937',
    surfaceMuted: '#162032',

    // Borders
    border: '#1f293d',
    borderSubtle: '#172236',
    borderFocus: '#3b82f6',

    // Typography
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textInverse: '#0b1120',

    // Accent (Subtle Indigo-Blue)
    accent: '#3b82f6',
    accentHover: '#2563eb',
    accentMuted: 'rgba(59, 130, 246, 0.15)',
    accentForeground: '#ffffff',

    // Status Colors
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#f43f5e',
    errorBg: 'rgba(244, 63, 94, 0.12)',
    info: '#0ea5e9',
    infoBg: 'rgba(14, 165, 233, 0.12)',

    // Overlays & Backdrop
    overlay: 'rgba(0, 0, 0, 0.75)',
    backdropBlur: '12px',

    // Selection & Focus Ring
    selectionBg: '#2563eb',
    selectionText: '#ffffff',
    focusRing: '#3b82f6',

    // Scrollbar & Glass Effects
    scrollbarThumb: '#334155',
    scrollbarTrack: '#0b1120',
    glassBg: 'rgba(17, 24, 39, 0.75)',
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
