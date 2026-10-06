/**
 * @file theme-store.ts
 * @description State management store for Aura Core Theme Engine using Zustand and Persist.
 * Supports manual themes (Midnight, Light, AMOLED, Aurora) and OS system preference auto-detection.
 * @module AuraCore/Stores/Theme
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ThemeId, ThemeMode, ThemeStoreState } from '@/types/theme';
import { THEME_CONFIG } from '@/config/themes';

function getSystemResolvedTheme(): ThemeId {
  if (typeof window === 'undefined') return THEME_CONFIG.defaultTheme;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark ? THEME_CONFIG.systemFallbackDark : THEME_CONFIG.systemFallbackLight;
}

export function resolveThemeMode(mode: ThemeMode): ThemeId {
  if (mode === 'system') {
    return getSystemResolvedTheme();
  }
  return mode;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: THEME_CONFIG.defaultTheme,
      resolvedTheme: resolveThemeMode(THEME_CONFIG.defaultTheme),
      autoTheme: false,
      lastUsedTheme: THEME_CONFIG.defaultTheme,

      setTheme: (newThemeMode: ThemeMode) => {
        const resolved = resolveThemeMode(newThemeMode);
        const isSystem = newThemeMode === 'system';
        const updatedLastUsed = !isSystem ? (newThemeMode as ThemeId) : get().lastUsedTheme;

        set({
          theme: newThemeMode,
          resolvedTheme: resolved,
          autoTheme: isSystem,
          lastUsedTheme: updatedLastUsed,
        });
      },

      toggleTheme: () => {
        const currentMode = get().theme;
        const themeSequence: ThemeMode[] = ['midnight', 'light', 'amoled', 'aurora', 'system'];
        const currentIndex = themeSequence.indexOf(currentMode);
        const nextIndex = (currentIndex + 1) % themeSequence.length;
        const nextMode = themeSequence[nextIndex];

        get().setTheme(nextMode);
      },

      setAutoTheme: (enabled: boolean) => {
        if (enabled) {
          get().setTheme('system');
        } else {
          const fallback = get().lastUsedTheme || THEME_CONFIG.defaultTheme;
          get().setTheme(fallback);
        }
      },

      resetToSystem: () => {
        get().setTheme('system');
      },
    }),
    {
      name: THEME_CONFIG.storageKey,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resolvedTheme = resolveThemeMode(state.theme);
        }
      },
    }
  )
);
