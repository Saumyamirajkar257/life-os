/**
 * @file use-theme.ts
 * @description Public Theme API Hook for Aura Core.
 * Provides components with clean, decoupled theme metadata, active tokens, and theme controls.
 * Components do not need to manage CSS variables directly.
 * @module AuraCore/Hooks/UseTheme
 */

import { useThemeStore } from '@/stores/theme-store';
import { getThemeById, availableThemes } from '@/design-system/themes';
import { PublicThemeAPI } from '@/types/theme';

/**
 * Custom React hook exposing the complete Aura Core Public Theme API.
 */
export function useTheme(): PublicThemeAPI {
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    resetToSystem,
    setAutoTheme,
  } = useThemeStore();

  const currentTheme = getThemeById(resolvedTheme);

  return {
    theme,
    resolvedTheme,
    currentTheme,
    setTheme,
    toggleTheme,
    availableThemes,
    isDarkTheme: currentTheme.isDark,
    isLightTheme: !currentTheme.isDark,
    resetToSystem,
    setAutoTheme,
  };
}
