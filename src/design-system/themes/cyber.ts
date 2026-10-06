/**
 * @file cyber.ts
 * @description Cyberpunk Neon Theme - Vibrant cyber aesthetic with neon cyan and electric magenta accents over deep violet charcoal.
 * @module AuraCore/DesignSystem/Themes/Cyber
 */

import { ThemeDefinition } from '@/types/theme';

export const cyberTheme: ThemeDefinition = {
  id: 'cyber',
  name: 'Cyberpunk Neon',
  description: 'Vibrant futuristic aesthetic with electric cyan and neon magenta over deep violet dark canvas.',
  category: 'dark',
  isDark: true,

  colors: {
    bg: '#090814',
    surface: '#110e24',
    surfaceElevated: '#1a1636',
    surfaceMuted: '#14102c',

    border: '#2e265c',
    borderSubtle: '#221c45',
    borderFocus: '#06b6d4',

    textPrimary: '#f8fafc',
    textSecondary: '#c084fc',
    textMuted: '#7e22ce',
    textInverse: '#090814',

    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentMuted: 'rgba(6, 182, 212, 0.2)',
    accentForeground: '#090814',

    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#ec4899',
    errorBg: 'rgba(236, 72, 153, 0.2)',
    info: '#3b82f6',
    infoBg: 'rgba(59, 130, 246, 0.15)',

    overlay: 'rgba(9, 8, 20, 0.85)',
    backdropBlur: '16px',

    selectionBg: '#ec4899',
    selectionText: '#ffffff',
    focusRing: '#06b6d4',

    scrollbarThumb: '#3b0764',
    scrollbarTrack: '#090814',
    glassBg: 'rgba(17, 14, 36, 0.8)',
    glassBorder: 'rgba(192, 132, 252, 0.2)',
  },

  elevation: {
    shadowLow: '0 2px 8px rgba(6, 182, 212, 0.15)',
    shadowMedium: '0 4px 14px rgba(6, 182, 212, 0.25)',
    shadowHigh: '0 10px 25px rgba(236, 72, 153, 0.3)',
    shadowFloating: '0 15px 35px rgba(6, 182, 212, 0.35)',
    shadowModal: '0 25px 60px rgba(6, 182, 212, 0.45)',
  },
};
