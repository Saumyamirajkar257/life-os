/**
 * @file light.ts
 * @description Light Theme - Premium warm white interface with soft shadows and refined borders.
 * Highly accessible with crisp typographic contrast.
 * @module AuraCore/DesignSystem/Themes/Light
 */

import { ThemeDefinition } from '@/types/theme';

export const lightTheme: ThemeDefinition = {
  id: 'light',
  name: 'Light',
  description: 'Premium warm white interface with soft shadows, minimal borders, and high legibility.',
  category: 'light',
  isDark: false,

  colors: {
    // Backgrounds & Surfaces
    bg: '#fdfdfd',
    surface: '#ffffff',
    surfaceElevated: '#f9f9f9',
    surfaceMuted: '#f4f4f5',

    // Borders
    border: '#eeeeee',
    borderSubtle: '#f5f5f5',
    borderFocus: '#111111',

    // Typography
    textPrimary: '#111111',
    textSecondary: '#666666',
    textMuted: '#999999',
    textInverse: '#ffffff',

    // Accent (Monochrome / Dark Slate)
    accent: '#111111',
    accentHover: '#333333',
    accentMuted: 'rgba(17, 17, 17, 0.08)',
    accentForeground: '#ffffff',

    // Status Colors
    success: '#059669',
    successBg: '#ecfdf5',
    warning: '#d97706',
    warningBg: '#fffbeb',
    error: '#e11d48',
    errorBg: '#fff1f2',
    info: '#0284c7',
    infoBg: '#f0f9ff',

    // Overlays & Backdrop
    overlay: 'rgba(0, 0, 0, 0.4)',
    backdropBlur: '12px',

    // Selection & Focus Ring
    selectionBg: '#111111',
    selectionText: '#ffffff',
    focusRing: '#111111',

    // Scrollbar & Glass Effects
    scrollbarThumb: '#cccccc',
    scrollbarTrack: '#fdfdfd',
    glassBg: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(0, 0, 0, 0.06)',
  },

  elevation: {
    shadowLow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    shadowHigh: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    shadowFloating: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
};
