/**
 * @file aurora.ts
 * @description Aurora Theme - Deep dark aesthetic inspired by polar aurora borealis glows.
 * Features cosmic violet canvas with bioluminescent teal and purple accents.
 * @module AuraCore/DesignSystem/Themes/Aurora
 */

import { ThemeDefinition } from '@/types/theme';

export const auroraTheme: ThemeDefinition = {
  id: 'aurora',
  name: 'Aurora',
  description: 'Deep cosmic violet canvas illuminated with subtle polar aurora gradients and teal-purple accents.',
  category: 'dark',
  isDark: true,

  colors: {
    // Backgrounds & Surfaces (Deep Cosmic Violet)
    bg: '#0d0b18',
    surface: '#13112c',
    surfaceElevated: '#1e1a3a',
    surfaceMuted: '#171433',

    // Borders
    border: '#28234e',
    borderSubtle: '#1d193d',
    borderFocus: '#a855f7',

    // Typography
    textPrimary: '#f5f3ff',
    textSecondary: '#a78bfa',
    textMuted: '#6b7280',
    textInverse: '#0d0b18',

    // Accent (Aurora Violet / Cyan Glow)
    accent: '#a855f7',
    accentHover: '#9333ea',
    accentMuted: 'rgba(168, 85, 247, 0.18)',
    accentForeground: '#ffffff',

    // Status Colors
    success: '#22c55e',
    successBg: 'rgba(34, 197, 94, 0.12)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#f43f5e',
    errorBg: 'rgba(244, 63, 94, 0.12)',
    info: '#14b8a6',
    infoBg: 'rgba(20, 184, 166, 0.12)',

    // Overlays & Backdrop
    overlay: 'rgba(13, 11, 24, 0.82)',
    backdropBlur: '16px',

    // Selection & Focus Ring
    selectionBg: '#9333ea',
    selectionText: '#ffffff',
    focusRing: '#a855f7',

    // Scrollbar & Glass Effects
    scrollbarThumb: '#3b3366',
    scrollbarTrack: '#0d0b18',
    glassBg: 'rgba(19, 17, 44, 0.78)',
    glassBorder: 'rgba(168, 85, 247, 0.15)',
  },

  elevation: {
    shadowLow: '0 2px 4px 0 rgba(13, 11, 24, 0.5)',
    shadowMedium: '0 6px 12px -2px rgba(13, 11, 24, 0.6), 0 0 15px rgba(168, 85, 247, 0.08)',
    shadowHigh: '0 12px 24px -4px rgba(13, 11, 24, 0.75), 0 0 25px rgba(20, 184, 166, 0.12)',
    shadowFloating: '0 20px 32px -6px rgba(13, 11, 24, 0.85), 0 0 35px rgba(168, 85, 247, 0.18)',
    shadowModal: '0 28px 56px -12px rgba(0, 0, 0, 0.95), 0 0 50px rgba(168, 85, 247, 0.25)',
  },
};
