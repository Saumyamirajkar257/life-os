/**
 * @file theme-provider.tsx
 * @description Theme Provider component that synchronizes store state with CSS variables and HTML document attribute.
 * Listens for OS system theme changes in real time and applies instant, flicker-free CSS variable swaps.
 * @module AuraCore/Providers/ThemeProvider
 */

import React, { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { getThemeById, applyThemeToCssVariables } from '@/design-system/themes';
import { THEME_CONFIG } from '@/config/themes';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, resolvedTheme, setTheme } = useThemeStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply active theme CSS Custom Properties to document root
    const activeThemeDef = getThemeById(resolvedTheme);
    applyThemeToCssVariables(activeThemeDef);

    // Set up media query listener for OS-level theme changes when in 'system' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (useThemeStore.getState().theme === 'system') {
        const newSystemResolved = e.matches
          ? THEME_CONFIG.systemFallbackDark
          : THEME_CONFIG.systemFallbackLight;

        const updatedThemeDef = getThemeById(newSystemResolved);
        applyThemeToCssVariables(updatedThemeDef);
        useThemeStore.setState({ resolvedTheme: newSystemResolved });
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [theme, resolvedTheme, setTheme]);

  return <>{children}</>;
};
