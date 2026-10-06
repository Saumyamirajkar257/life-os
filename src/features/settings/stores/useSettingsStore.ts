/**
 * @file useSettingsStore.ts
 * @description Global Zustand persistent store for Aura Core Settings & Preferences (Milestone 9).
 * Features real-time CSS property injection, theme/accent synchronization, and export/import capabilities.
 * @module Features/Settings/Stores/UseSettingsStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GlobalSettingsState,
  SettingsTab,
  AppearanceSettingsState,
  LocalizationSettingsState,
  ShortcutSettings,
  NotificationSettings,
  PrivacySecuritySettingsState,
  DeveloperSettingsState,
  AccentColorId,
} from '../types';
import {
  ACCENT_COLOR_PRESETS,
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_LOCALIZATION_SETTINGS,
  DEFAULT_SHORTCUT_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_DEVELOPER_SETTINGS,
  DEFAULT_ABOUT_SETTINGS,
  DEFAULT_DATA_MANAGEMENT_STATE,
} from '../constants';
import { useThemeStore } from '@/stores/theme-store';

/**
 * Apply global visual side effects (Accent Color, Reduced Motion, Font Scale, Animation Multipliers)
 */
export function applyGlobalAppearanceSideEffects(appearance: AppearanceSettingsState) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // 1. Accent Color Custom Properties
  const preset = ACCENT_COLOR_PRESETS.find((p) => p.id === appearance.accentColor) || ACCENT_COLOR_PRESETS[0];
  const accentHex = appearance.customAccentHex || preset.hex;
  const hoverHex = preset.hoverHex;
  const mutedRgba = preset.mutedRgba;
  const foregroundHex = preset.foregroundHex;

  root.style.setProperty('--color-accent', accentHex);
  root.style.setProperty('--color-accent-hover', hoverHex);
  root.style.setProperty('--color-accent-muted', mutedRgba);
  root.style.setProperty('--color-accent-foreground', foregroundHex);

  // 2. Reduced Motion & Animation Duration Factors
  const forceDisableAnimations =
    !appearance.animationsEnabled ||
    appearance.animationSpeed === 'off' ||
    appearance.reducedMotion === 'always';

  if (forceDisableAnimations) {
    root.classList.add('reduced-motion');
    root.style.setProperty('--animation-duration-factor', '0');
  } else {
    root.classList.remove('reduced-motion');
    const speedMultiplierMap = {
      slow: '1.5',
      normal: '1.0',
      fast: '0.6',
      off: '0',
    };
    root.style.setProperty(
      '--animation-duration-factor',
      speedMultiplierMap[appearance.animationSpeed] || '1.0'
    );
  }

  // 3. Font Scale Factor
  const fontScaleMap = {
    compact: '0.92',
    normal: '1.0',
    spacious: '1.08',
  };
  root.style.setProperty('--font-scale-factor', fontScaleMap[appearance.fontScale] || '1.0');
}

export const useSettingsStore = create<GlobalSettingsState>()(
  persist(
    (set, get) => ({
      activeTab: 'appearance',
      searchQuery: '',
      isSaving: false,
      lastSavedAt: new Date().toISOString(),

      appearance: DEFAULT_APPEARANCE_SETTINGS,
      localization: DEFAULT_LOCALIZATION_SETTINGS,
      shortcuts: DEFAULT_SHORTCUT_SETTINGS,
      notifications: DEFAULT_NOTIFICATION_SETTINGS,
      privacy: DEFAULT_PRIVACY_SETTINGS,
      developer: DEFAULT_DEVELOPER_SETTINGS,
      about: DEFAULT_ABOUT_SETTINGS,
      data: DEFAULT_DATA_MANAGEMENT_STATE,

      setActiveTab: (tab: SettingsTab) => set({ activeTab: tab }),
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      updateAppearance: (patch: Partial<AppearanceSettingsState>) => {
        const nextAppearance = { ...get().appearance, ...patch };
        set({
          appearance: nextAppearance,
          lastSavedAt: new Date().toISOString(),
        });

        // Sync theme with ThemeStore if themeMode changed
        if (patch.themeMode && patch.themeMode !== useThemeStore.getState().theme) {
          useThemeStore.getState().setTheme(patch.themeMode);
        }

        // Apply global accent & animation CSS custom properties
        applyGlobalAppearanceSideEffects(nextAppearance);
      },

      updateLocalization: (patch: Partial<LocalizationSettingsState>) => {
        set({
          localization: { ...get().localization, ...patch },
          lastSavedAt: new Date().toISOString(),
        });
      },

      updateShortcuts: (patch: Partial<ShortcutSettings>) => {
        set({
          shortcuts: { ...get().shortcuts, ...patch },
          lastSavedAt: new Date().toISOString(),
        });
      },

      updateShortcutKey: (id: string, newKey: string) => {
        const currentShortcuts = get().shortcuts.shortcuts;
        const updated = currentShortcuts.map((s) =>
          s.id === id ? { ...s, currentKey: newKey, isCustom: newKey !== s.defaultKey } : s
        );
        set({
          shortcuts: { ...get().shortcuts, shortcuts: updated },
          lastSavedAt: new Date().toISOString(),
        });
      },

      resetShortcutsToDefault: () => {
        const defaults = DEFAULT_SHORTCUT_SETTINGS.shortcuts;
        set({
          shortcuts: { ...get().shortcuts, shortcuts: defaults },
          lastSavedAt: new Date().toISOString(),
        });
      },

      updateNotifications: (patch: Partial<NotificationSettings>) => {
        set({
          notifications: { ...get().notifications, ...patch },
          lastSavedAt: new Date().toISOString(),
        });
      },

      updatePrivacy: (patch: Partial<PrivacySecuritySettingsState>) => {
        set({
          privacy: { ...get().privacy, ...patch },
          lastSavedAt: new Date().toISOString(),
        });
      },

      revokeSession: (sessionId: string) => {
        const remaining = get().privacy.activeSessions.filter((s) => s.id !== sessionId);
        set({
          privacy: { ...get().privacy, activeSessions: remaining },
          lastSavedAt: new Date().toISOString(),
        });
      },

      updateDeveloper: (patch: Partial<DeveloperSettingsState>) => {
        set({
          developer: { ...get().developer, ...patch },
          lastSavedAt: new Date().toISOString(),
        });
      },

      exportSettingsJSON: () => {
        const state = get();
        const exportPayload = {
          version: '2.4.0',
          exportedAt: new Date().toISOString(),
          settings: {
            appearance: state.appearance,
            localization: state.localization,
            shortcuts: state.shortcuts,
            notifications: state.notifications,
            privacy: state.privacy,
            developer: state.developer,
          },
        };
        return JSON.stringify(exportPayload, null, 2);
      },

      importSettingsJSON: (jsonString: string) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (!parsed.settings) {
            return { success: false, error: 'Invalid settings file structure.' };
          }
          const { appearance, localization, shortcuts, notifications, privacy, developer } =
            parsed.settings;

          set({
            appearance: { ...DEFAULT_APPEARANCE_SETTINGS, ...appearance },
            localization: { ...DEFAULT_LOCALIZATION_SETTINGS, ...localization },
            shortcuts: { ...DEFAULT_SHORTCUT_SETTINGS, ...shortcuts },
            notifications: { ...DEFAULT_NOTIFICATION_SETTINGS, ...notifications },
            privacy: { ...DEFAULT_PRIVACY_SETTINGS, ...privacy },
            developer: { ...DEFAULT_DEVELOPER_SETTINGS, ...developer },
            data: { ...get().data, lastBackupDate: new Date().toISOString().split('T')[0] },
            lastSavedAt: new Date().toISOString(),
          });

          // Sync side effects
          if (appearance) {
            applyGlobalAppearanceSideEffects({ ...DEFAULT_APPEARANCE_SETTINGS, ...appearance });
            if (appearance.themeMode) {
              useThemeStore.getState().setTheme(appearance.themeMode);
            }
          }

          return { success: true };
        } catch (err: any) {
          return { success: false, error: err?.message || 'Failed to parse JSON file.' };
        }
      },

      resetAllSettings: () => {
        set({
          appearance: DEFAULT_APPEARANCE_SETTINGS,
          localization: DEFAULT_LOCALIZATION_SETTINGS,
          shortcuts: DEFAULT_SHORTCUT_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
          privacy: DEFAULT_PRIVACY_SETTINGS,
          developer: DEFAULT_DEVELOPER_SETTINGS,
          lastSavedAt: new Date().toISOString(),
        });

        useThemeStore.getState().setTheme(DEFAULT_APPEARANCE_SETTINGS.themeMode);
        applyGlobalAppearanceSideEffects(DEFAULT_APPEARANCE_SETTINGS);
      },
    }),
    {
      name: 'aura-life-os-settings-v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.appearance) {
          applyGlobalAppearanceSideEffects(state.appearance);
        }
      },
    }
  )
);
