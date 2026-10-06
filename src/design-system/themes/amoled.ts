/**
 * @file amoled.ts
 * @description AMOLED Theme - True pure black (#000000) OLED-optimized theme.
 * Delivers maximum battery efficiency with electric blue accent contrasts.
 * @module AuraCore/DesignSystem/Themes/AMOLED
 */

import { ThemeDefinition } from '@/types/theme';

export const amoledTheme: ThemeDefinition = {
  id: 'amoled',
  name: 'AMOLED',
  description: 'True pure black OLED theme engineered for zero power usage and ultra-crisp electric contrast.',
  category: 'dark',
  isDark: true,

  colors: {
    // Backgrounds & Surfaces (Pure Black)
    bg: '#000000',
    surface: '#08080a',
    surfaceElevated: '#121215',
    surfaceMuted: '#0d0d10',

    // Borders (Sharp High Contrast)
    border: '#1f1f23',
    borderSubtle: '#141417',
    borderFocus: '#0066ff',

    // Typography
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textMuted: '#52525b',
    textInverse: '#000000',

    // Accent (Electric Cyan Blue)
    accent: '#0066ff',
    accentHover: '#0052cc',
    accentMuted: 'rgba(0, 102, 255, 0.2)',
    accentForeground: '#ffffff',

    // Status Colors
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#f43f5e',
    errorBg: 'rgba(244, 63, 94, 0.15)',
    info: '#00d2ff',
    infoBg: 'rgba(0, 210, 255, 0.15)',

    // Overlays & Backdrop
    overlay: 'rgba(0, 0, 0, 0.9)',
    backdropBlur: '8px',

    // Selection & Focus Ring
    selectionBg: '#0066ff',
    selectionText: '#ffffff',
    focusRing: '#0066ff',

    // Scrollbar & Glass Effects
    scrollbarThumb: '#27272a',
    scrollbarTrack: '#000000',
    glassBg: 'rgba(0, 0, 0, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
  },

  elevation: {
    shadowLow: '0 0 0 1px #1f1f23',
    shadowMedium: '0 4px 12px rgba(0, 0, 0, 0.9), 0 0 0 1px #1f1f23',
    shadowHigh: '0 8px 24px rgba(0, 0, 0, 0.95), 0 0 0 1px #27272a',
    shadowFloating: '0 16px 32px rgba(0, 0, 0, 1), 0 0 0 1px #3f3f46',
    shadowModal: '0 24px 48px rgba(0, 0, 0, 1), 0 0 0 1px #3f3f46',
  },
};
