/**
 * @file themes.ts
 * @description Theme configuration, system fallbacks, and registry metadata for Aura Core.
 * @module AuraCore/Config/Themes
 */

import { ThemeId, ThemeMode } from '@/types/theme';

export const THEME_CONFIG = {
  defaultTheme: 'midnight' as ThemeId,
  systemFallbackDark: 'midnight' as ThemeId,
  systemFallbackLight: 'light' as ThemeId,
  storageKey: 'aura-life-os-theme-v1',
  cssAttribute: 'data-theme',
  availableThemeIds: [
    'midnight',
    'light',
    'amoled',
    'aurora',
    'high-contrast',
    'cyber',
    'deep-space',
    'warm-twilight',
  ] as const,
} as const;

export type AvailableThemeId = (typeof THEME_CONFIG.availableThemeIds)[number];
