/**
 * @file deep-space.ts
 * @description Deep Space Theme - Minimalist abyssal black theme with icy starlight accents.
 * @module AuraCore/DesignSystem/Themes/DeepSpace
 */

import { ThemeDefinition } from '@/types/theme';

export const deepSpaceTheme: ThemeDefinition = {
  id: 'deep-space',
  name: 'Deep Space',
  description: 'Minimalist abyssal space black canvas paired with icy silver-blue starlight accents.',
  category: 'dark',
  isDark: true,

  colors: {
    bg: '#030712',
    surface: '#0b0f19',
    surfaceElevated: '#111827',
    surfaceMuted: '#070b14',

    border: '#1f2937',
    borderSubtle: '#111827',
    borderFocus: '#60a5fa',

    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#4b5563',
    textInverse: '#030712',

    accent: '#60a5fa',
    accentHover: '#3b82f6',
    accentMuted: 'rgba(96, 165, 250, 0.15)',
    accentForeground: '#030712',

    success: '#34d399',
    successBg: 'rgba(52, 211, 153, 0.15)',
    warning: '#fbbf24',
    warningBg: 'rgba(251, 191, 36, 0.15)',
    error: '#f87171',
    errorBg: 'rgba(248, 113, 113, 0.15)',
    info: '#38bdf8',
    infoBg: 'rgba(56, 189, 248, 0.15)',

    overlay: 'rgba(3, 7, 18, 0.85)',
    backdropBlur: '12px',

    selectionBg: '#3b82f6',
    selectionText: '#ffffff',
    focusRing: '#60a5fa',

    scrollbarThumb: '#1f2937',
    scrollbarTrack: '#030712',
    glassBg: 'rgba(11, 15, 25, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },

  elevation: {
    shadowLow: '0 1px 3px rgba(0, 0, 0, 0.6)',
    shadowMedium: '0 4px 12px rgba(0, 0, 0, 0.7)',
    shadowHigh: '0 10px 24px rgba(0, 0, 0, 0.8)',
    shadowFloating: '0 20px 30px rgba(0, 0, 0, 0.9)',
    shadowModal: '0 25px 60px rgba(0, 0, 0, 0.95)',
  },
};
