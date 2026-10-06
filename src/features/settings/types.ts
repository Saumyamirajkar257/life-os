/**
 * @file types.ts
 * @description Comprehensive TypeScript types for the global Settings & Preferences framework in Aura Core (Milestone 9).
 * @module Features/Settings/Types
 */

import { ThemeId, ThemeMode } from '@/types/theme';

export type SettingsTab =
  | 'profile'
  | 'appearance'
  | 'personalization'
  | 'notifications'
  | 'ai'
  | 'privacy'
  | 'account';

export type AccentColorId =
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'cyan'
  | 'gold'
  | 'silver';

export interface AccentColorPreset {
  id: AccentColorId;
  name: string;
  hex: string;
  hoverHex: string;
  mutedRgba: string;
  foregroundHex: string;
}

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'off';
export type ReducedMotionPreference = 'system' | 'always' | 'never';
export type FontScaleOption = 'compact' | 'normal' | 'spacious';

export interface AppearanceSettingsState {
  themeMode: ThemeMode;
  resolvedTheme: ThemeId;
  accentColor: AccentColorId;
  customAccentHex?: string;
  animationsEnabled: boolean;
  animationSpeed: AnimationSpeed;
  reducedMotion: ReducedMotionPreference;
  fontScale: FontScaleOption;
}

export type SupportedLanguage =
  | 'en-US'
  | 'en-GB'
  | 'es-ES'
  | 'fr-FR'
  | 'de-DE'
  | 'ja-JP'
  | 'zh-CN';

export type DateFormatOption = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'MMMM D, YYYY';
export type TimeFormatOption = '12h' | '24h';
export type FirstDayOfWeek = 'sunday' | 'monday';

export interface LocalizationSettingsState {
  language: SupportedLanguage;
  timezone: string;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  firstDayOfWeek: FirstDayOfWeek;
  useSystemTimezone: boolean;
}

export interface KeyboardShortcutItem {
  id: string;
  category: 'General' | 'Navigation' | 'Workspaces' | 'System';
  description: string;
  defaultKey: string;
  currentKey: string;
  isCustom?: boolean;
}

export interface ShortcutSettings {
  enabled: boolean;
  shortcuts: KeyboardShortcutItem[];
  quickPaletteShortcut: string;
}

export interface NotificationCategoryPreferences {
  securityAlerts: boolean;
  systemHealth: boolean;
  taskUpdates: boolean;
  announcements: boolean;
}

export interface NotificationSettings {
  masterEnabled: boolean;
  inAppToast: boolean;
  soundEffects: boolean;
  soundVolume: number; // 0 - 100
  emailDigest: 'off' | 'daily' | 'weekly';
  desktopPush: boolean;
  categories: NotificationCategoryPreferences;
}

export interface ActiveUserSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type SessionTimeoutOption = '15m' | '30m' | '1h' | '4h' | '8h' | 'never';

export interface PrivacySecuritySettingsState {
  twoFactorEnabled: boolean;
  sessionTimeout: SessionTimeoutOption;
  telemetryOptIn: boolean;
  crashReportingOptIn: boolean;
  strictPrivacyMode: boolean;
  activeSessions: ActiveUserSession[];
}

export interface DeveloperSettingsState {
  developerModeEnabled: boolean;
  verboseConsoleLogs: boolean;
  apiDebugInspector: boolean;
  networkMockDelayMs: number;
  showPerformanceHud: boolean;
  experimentalModules: boolean;
}

export interface AboutSettingsState {
  version: string;
  buildNumber: string;
  environment: string;
  releaseDate: string;
  license: string;
  architect: string;
}

export interface DataManagementState {
  lastBackupDate: string | null;
  storageUsedBytes: number;
  storageLimitBytes: number;
}

export interface GlobalSettingsState {
  activeTab: SettingsTab;
  searchQuery: string;
  isSaving: boolean;
  lastSavedAt: string | null;

  appearance: AppearanceSettingsState;
  localization: LocalizationSettingsState;
  shortcuts: ShortcutSettings;
  notifications: NotificationSettings;
  privacy: PrivacySecuritySettingsState;
  developer: DeveloperSettingsState;
  about: AboutSettingsState;
  data: DataManagementState;

  // Actions
  setActiveTab: (tab: SettingsTab) => void;
  setSearchQuery: (query: string) => void;
  updateAppearance: (patch: Partial<AppearanceSettingsState>) => void;
  updateLocalization: (patch: Partial<LocalizationSettingsState>) => void;
  updateShortcuts: (patch: Partial<ShortcutSettings>) => void;
  updateShortcutKey: (id: string, newKey: string) => void;
  resetShortcutsToDefault: () => void;
  updateNotifications: (patch: Partial<NotificationSettings>) => void;
  updatePrivacy: (patch: Partial<PrivacySecuritySettingsState>) => void;
  revokeSession: (sessionId: string) => void;
  updateDeveloper: (patch: Partial<DeveloperSettingsState>) => void;
  exportSettingsJSON: () => string;
  importSettingsJSON: (jsonString: string) => { success: boolean; error?: string };
  resetAllSettings: () => void;
}
