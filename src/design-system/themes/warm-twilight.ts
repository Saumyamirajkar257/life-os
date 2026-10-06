/**
 * @file warm-twilight.ts
 * @description Warm Twilight Theme - Eye-friendly warm dark theme with amber, copper, and rose gold accents.
 * @module AuraCore/DesignSystem/Themes/WarmTwilight
 */

import { ThemeDefinition } from '@/types/theme';

export const warmTwilightTheme: ThemeDefinition = {
  id: 'warm-twilight',
  name: 'Warm Twilight',
  description: 'Soft eye-friendly warm charcoal canvas with copper slate and amber rose gold accents.',
  category: 'dark',
  isDark: true,

  colors: {
    bg: '#141113',
    surface: '#1c181a',
    surfaceElevated: '#282326',
    surfaceMuted: '#171416',

    border: '#362f33',
    borderSubtle: '#262124',
    borderFocus: '#f59e0b',

    textPrimary: '#fbf7f5',
    textSecondary: '#d4c5c8',
    textMuted: '#8c7d81',
    textInverse: '#141113',

    accent: '#f59e0b',
    accentHover: '#d97706',
    accentMuted: 'rgba(245, 158, 11, 0.15)',
    accentForeground: '#141113',

    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#f43f5e',
    errorBg: 'rgba(244, 63, 94, 0.12)',
    info: '#fb923c',
    infoBg: 'rgba(251, 146, 60, 0.12)',

    overlay: 'rgba(20, 17, 19, 0.82)',
    backdropBlur: '12px',

    selectionBg: '#f59e0b',
    selectionText: '#141113',
    focusRing: '#f59e0b',

    scrollbarThumb: '#362f33',
    scrollbarTrack: '#141113',
    glassBg: 'rgba(28, 24, 26, 0.85)',
    glassBorder: 'rgba(245, 158, 11, 0.15)',
  },

  elevation: {
    shadowLow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 8px rgba(0, 0, 0, 0.5)',
    shadowHigh: '0 10px 20px rgba(0, 0, 0, 0.6)',
    shadowFloating: '0 15px 30px rgba(0, 0, 0, 0.7)',
    shadowModal: '0 25px 50px rgba(0, 0, 0, 0.8)',
  },
};
