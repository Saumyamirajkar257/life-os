/**
 * @file index.ts
 * @description Theme Registry & CSS Custom Property Engine for Aura Core.
 * Serializes ThemeDefinitions into high-performance CSS variables.
 * @module AuraCore/DesignSystem/Themes
 */

import { ThemeDefinition, ThemeId } from '@/types/theme';
import { midnightTheme } from './midnight';
import { lightTheme } from './light';
import { amoledTheme } from './amoled';
import { auroraTheme } from './aurora';
import { highContrastTheme } from './high-contrast';
import { cyberTheme } from './cyber';
import { deepSpaceTheme } from './deep-space';
import { warmTwilightTheme } from './warm-twilight';

export * from './midnight';
export * from './light';
export * from './amoled';
export * from './aurora';
export * from './high-contrast';
export * from './cyber';
export * from './deep-space';
export * from './warm-twilight';

export const THEMES_MAP: Record<ThemeId, ThemeDefinition> = {
  midnight: midnightTheme,
  light: lightTheme,
  amoled: amoledTheme,
  aurora: auroraTheme,
  'high-contrast': highContrastTheme,
  cyber: cyberTheme,
  'deep-space': deepSpaceTheme,
  'warm-twilight': warmTwilightTheme,
};

export const availableThemes: ThemeDefinition[] = [
  midnightTheme,
  lightTheme,
  amoledTheme,
  auroraTheme,
  highContrastTheme,
  cyberTheme,
  deepSpaceTheme,
  warmTwilightTheme,
];

export function getThemeById(id: ThemeId): ThemeDefinition {
  return THEMES_MAP[id] || midnightTheme;
}

/**
 * High-performance CSS Custom Property injection engine.
 * Applies theme variables directly to documentElement without triggering React component re-renders.
 */
export function applyThemeToCssVariables(theme: ThemeDefinition): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const { colors, elevation } = theme;

  // Set data-theme attribute and dark/light mode class
  root.setAttribute('data-theme', theme.id);

  if (theme.isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  // 1. Color Custom Properties
  root.style.setProperty('--color-bg', colors.bg);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-surface-elevated', colors.surfaceElevated);
  root.style.setProperty('--color-surface-muted', colors.surfaceMuted);

  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-border-subtle', colors.borderSubtle);
  root.style.setProperty('--color-border-focus', colors.borderFocus);

  root.style.setProperty('--color-text-primary', colors.textPrimary);
  root.style.setProperty('--color-text-secondary', colors.textSecondary);
  root.style.setProperty('--color-text-muted', colors.textMuted);
  root.style.setProperty('--color-text-inverse', colors.textInverse);

  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-hover', colors.accentHover);
  root.style.setProperty('--color-accent-muted', colors.accentMuted);
  root.style.setProperty('--color-accent-foreground', colors.accentForeground);

  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-success-bg', colors.successBg);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-warning-bg', colors.warningBg);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-error-bg', colors.errorBg);
  root.style.setProperty('--color-info', colors.info);
  root.style.setProperty('--color-info-bg', colors.infoBg);

  root.style.setProperty('--color-overlay', colors.overlay);
  root.style.setProperty('--color-backdrop-blur', colors.backdropBlur);

  root.style.setProperty('--color-selection-bg', colors.selectionBg);
  root.style.setProperty('--color-selection-text', colors.selectionText);
  root.style.setProperty('--color-focus-ring', colors.focusRing);

  root.style.setProperty('--color-scrollbar-thumb', colors.scrollbarThumb);
  root.style.setProperty('--color-scrollbar-track', colors.scrollbarTrack);
  root.style.setProperty('--color-glass-bg', colors.glassBg);
  root.style.setProperty('--color-glass-border', colors.glassBorder);

  // 2. Elevation Custom Properties
  root.style.setProperty('--shadow-low', elevation.shadowLow);
  root.style.setProperty('--shadow-medium', elevation.shadowMedium);
  root.style.setProperty('--shadow-high', elevation.shadowHigh);
  root.style.setProperty('--shadow-floating', elevation.shadowFloating);
  root.style.setProperty('--shadow-modal', elevation.shadowModal);
}
