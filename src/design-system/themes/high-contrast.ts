/**
 * @file high-contrast.ts
 * @description High Contrast Theme - Ultra accessible high-contrast dark theme with crisp white borders and vivid amber accents.
 * @module AuraCore/DesignSystem/Themes/HighContrast
 */

import { ThemeDefinition } from '@/types/theme';

export const highContrastTheme: ThemeDefinition = {
  id: 'high-contrast',
  name: 'High Contrast',
  description: 'Ultra accessible high-contrast canvas with pure black, stark borders, and vivid amber focus indicators.',
  category: 'dark',
  isDark: true,

  colors: {
    bg: '#000000',
    surface: '#0a0a0a',
    surfaceElevated: '#171717',
    surfaceMuted: '#121212',

    border: '#ffffff',
    borderSubtle: '#d4d4d4',
    borderFocus: '#fbbf24',

    textPrimary: '#ffffff',
    textSecondary: '#e5e5e5',
    textMuted: '#a3a3a3',
    textInverse: '#000000',

    accent: '#fbbf24',
    accentHover: '#f59e0b',
    accentMuted: 'rgba(251, 191, 36, 0.25)',
    accentForeground: '#000000',

    success: '#4ade80',
    successBg: 'rgba(74, 222, 128, 0.2)',
    warning: '#facc15',
    warningBg: 'rgba(250, 204, 21, 0.2)',
    error: '#f87171',
    errorBg: 'rgba(248, 113, 113, 0.2)',
    info: '#38bdf8',
    infoBg: 'rgba(56, 189, 248, 0.2)',

    overlay: 'rgba(0, 0, 0, 0.92)',
    backdropBlur: '4px',

    selectionBg: '#fbbf24',
    selectionText: '#000000',
    focusRing: '#fbbf24',

    scrollbarThumb: '#525252',
    scrollbarTrack: '#000000',
    glassBg: 'rgba(10, 10, 10, 0.95)',
    glassBorder: '#ffffff',
  },

  elevation: {
    shadowLow: '0 0 0 1px #ffffff',
    shadowMedium: '0 0 0 2px #ffffff',
    shadowHigh: '0 0 0 2px #ffffff, 0 8px 16px rgba(0,0,0,0.8)',
    shadowFloating: '0 0 0 2px #fbbf24, 0 12px 24px rgba(0,0,0,0.9)',
    shadowModal: '0 0 0 2px #ffffff, 0 24px 48px rgba(0,0,0,0.95)',
  },
};
