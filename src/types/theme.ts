/**
 * @file theme.ts
 * @description Comprehensive TypeScript type definitions for the Aura Core Theme Engine.
 * Supports unlimited themes, 3-layer token mapping, and Z-index/CSS variable integration.
 * @module AuraCore/Types/Theme
 */

export type ThemeId =
  | 'midnight'
  | 'light'
  | 'amoled'
  | 'aurora'
  | 'high-contrast'
  | 'cyber'
  | 'deep-space'
  | 'warm-twilight';

export type ThemeMode = ThemeId | 'system';

export type ThemeCategory = 'dark' | 'light';

export interface ThemeColorTokens {
  // Backgrounds & Surfaces
  bg: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;

  // Borders
  border: string;
  borderSubtle: string;
  borderFocus: string;

  // Typography Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Accent Colors
  accent: string;
  accentHover: string;
  accentMuted: string;
  accentForeground: string;

  // Semantic Status Colors
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;

  // Overlays & Backdrop
  overlay: string;
  backdropBlur: string;

  // Selection & Focus Ring
  selectionBg: string;
  selectionText: string;
  focusRing: string;

  // Scrollbar & Glass Effects
  scrollbarThumb: string;
  scrollbarTrack: string;
  glassBg: string;
  glassBorder: string;
}

export interface ThemeElevationTokens {
  shadowLow: string;
  shadowMedium: string;
  shadowHigh: string;
  shadowFloating: string;
  shadowModal: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  category: ThemeCategory;
  isDark: boolean;
  colors: ThemeColorTokens;
  elevation: ThemeElevationTokens;
}

export interface ThemeStoreState {
  theme: ThemeMode;
  resolvedTheme: ThemeId;
  autoTheme: boolean;
  lastUsedTheme: ThemeId;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setAutoTheme: (enabled: boolean) => void;
  resetToSystem: () => void;
}

export interface PublicThemeAPI {
  theme: ThemeMode;
  resolvedTheme: ThemeId;
  currentTheme: ThemeDefinition;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  availableThemes: ThemeDefinition[];
  isDarkTheme: boolean;
  isLightTheme: boolean;
  resetToSystem: () => void;
  setAutoTheme: (enabled: boolean) => void;
}
