/**
 * @file constants.ts
 * @description Default configurations, accent color palettes, language maps, timezones, and shortcuts for Milestone 9 Settings.
 * @module Features/Settings/Constants
 */

import {
  AccentColorPreset,
  KeyboardShortcutItem,
  SupportedLanguage,
  AppearanceSettingsState,
  LocalizationSettingsState,
  ShortcutSettings,
  NotificationSettings,
  PrivacySecuritySettingsState,
  DeveloperSettingsState,
  AboutSettingsState,
  DataManagementState,
} from './types';

export const ACCENT_COLOR_PRESETS: AccentColorPreset[] = [
  {
    id: 'blue',
    name: 'Electric Blue',
    hex: '#3b82f6',
    hoverHex: '#2563eb',
    mutedRgba: 'rgba(59, 130, 246, 0.15)',
    foregroundHex: '#ffffff',
  },
  {
    id: 'violet',
    name: 'Cyber Violet',
    hex: '#8b5cf6',
    hoverHex: '#7c3aed',
    mutedRgba: 'rgba(139, 92, 246, 0.15)',
    foregroundHex: '#ffffff',
  },
  {
    id: 'emerald',
    name: 'Emerald Glow',
    hex: '#10b981',
    hoverHex: '#059669',
    mutedRgba: 'rgba(16, 185, 129, 0.15)',
    foregroundHex: '#ffffff',
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    hex: '#f43f5e',
    hoverHex: '#e11d48',
    mutedRgba: 'rgba(244, 63, 94, 0.15)',
    foregroundHex: '#ffffff',
  },
  {
    id: 'amber',
    name: 'Amber Flame',
    hex: '#f59e0b',
    hoverHex: '#d97706',
    mutedRgba: 'rgba(245, 158, 11, 0.15)',
    foregroundHex: '#ffffff',
  },
  {
    id: 'cyan',
    name: 'Neon Cyan',
    hex: '#06b6d4',
    hoverHex: '#0891b2',
    mutedRgba: 'rgba(6, 182, 212, 0.15)',
    foregroundHex: '#000000',
  },
  {
    id: 'gold',
    name: 'Solar Gold',
    hex: '#eab308',
    hoverHex: '#ca8a04',
    mutedRgba: 'rgba(234, 179, 8, 0.15)',
    foregroundHex: '#000000',
  },
  {
    id: 'silver',
    name: 'Diamond Silver',
    hex: '#94a3b8',
    hoverHex: '#64748b',
    mutedRgba: 'rgba(148, 163, 184, 0.15)',
    foregroundHex: '#0f172a',
  },
];

export const LANGUAGE_OPTIONS: Array<{ value: SupportedLanguage; label: string; nativeName: string }> = [
  { value: 'en-US', label: 'English (US)', nativeName: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)', nativeName: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish', nativeName: 'Español' },
  { value: 'fr-FR', label: 'French', nativeName: 'Français' },
  { value: 'de-DE', label: 'German', nativeName: 'Deutsch' },
  { value: 'ja-JP', label: 'Japanese', nativeName: '日本語' },
  { value: 'zh-CN', label: 'Chinese (Simplified)', nativeName: '简体中文' },
];

export const TIMEZONE_OPTIONS = [
  { value: 'auto', label: 'Automatic (Detect System Timezone)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'EST / EDT (New York, Miami)' },
  { value: 'America/Los_Angeles', label: 'PST / PDT (Los Angeles, Seattle)' },
  { value: 'Europe/London', label: 'GMT / BST (London, Dublin)' },
  { value: 'Europe/Paris', label: 'CET / CEST (Paris, Berlin, Rome)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo, Osaka)' },
  { value: 'Asia/Kolkata', label: 'IST (New Delhi, Mumbai)' },
  { value: 'Australia/Sydney', label: 'AEST / AEDT (Sydney, Melbourne)' },
];

export const DEFAULT_KEYBOARD_SHORTCUTS: KeyboardShortcutItem[] = [
  { id: 'toggle-palette', category: 'General', description: 'Open Quick Command Palette', defaultKey: '⌘K', currentKey: '⌘K' },
  { id: 'toggle-sidebar', category: 'General', description: 'Toggle Left Sidebar Navigation', defaultKey: '⌘B', currentKey: '⌘B' },
  { id: 'open-settings', category: 'General', description: 'Open System Settings', defaultKey: '⌘,', currentKey: '⌘,' },
  { id: 'nav-dashboard', category: 'Navigation', description: 'Navigate to System Inspector', defaultKey: '⌘1', currentKey: '⌘1' },
  { id: 'nav-architecture', category: 'Navigation', description: 'Navigate to Architecture Tree', defaultKey: '⌘2', currentKey: '⌘2' },
  { id: 'nav-performance', category: 'Navigation', description: 'Navigate to Performance Stacks', defaultKey: '⌘3', currentKey: '⌘3' },
  { id: 'nav-components', category: 'Workspaces', description: 'Navigate to Component Library', defaultKey: '⌘4', currentKey: '⌘4' },
  { id: 'nav-tokens', category: 'Workspaces', description: 'Navigate to Design Tokens', defaultKey: '⌘5', currentKey: '⌘5' },
  { id: 'toggle-theme', category: 'System', description: 'Cycle Active UI Theme', defaultKey: '⌘Shift+T', currentKey: '⌘Shift+T' },
  { id: 'toggle-dev-hud', category: 'System', description: 'Toggle Performance HUD Overlay', defaultKey: '⌘Shift+P', currentKey: '⌘Shift+P' },
];

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettingsState = {
  themeMode: 'midnight',
  resolvedTheme: 'midnight',
  accentColor: 'blue',
  animationsEnabled: true,
  animationSpeed: 'normal',
  reducedMotion: 'system',
  fontScale: 'normal',
};

export const DEFAULT_LOCALIZATION_SETTINGS: LocalizationSettingsState = {
  language: 'en-US',
  timezone: 'auto',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  firstDayOfWeek: 'monday',
  useSystemTimezone: true,
};

export const DEFAULT_SHORTCUT_SETTINGS: ShortcutSettings = {
  enabled: true,
  shortcuts: DEFAULT_KEYBOARD_SHORTCUTS,
  quickPaletteShortcut: '⌘K',
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  masterEnabled: true,
  inAppToast: true,
  soundEffects: true,
  soundVolume: 75,
  emailDigest: 'daily',
  desktopPush: false,
  categories: {
    securityAlerts: true,
    systemHealth: true,
    taskUpdates: true,
    announcements: false,
  },
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySecuritySettingsState = {
  twoFactorEnabled: false,
  sessionTimeout: '1h',
  telemetryOptIn: false,
  crashReportingOptIn: true,
  strictPrivacyMode: false,
  activeSessions: [
    {
      id: 'session-curr-01',
      device: 'MacBook Pro 16" (M3 Max)',
      browser: 'Chrome 127.0 (macOS)',
      ip: '192.168.1.104',
      location: 'San Francisco, CA, USA',
      lastActive: 'Active Now',
      isCurrent: true,
    },
    {
      id: 'session-mob-02',
      device: 'iPhone 15 Pro Max',
      browser: 'Safari iOS 17.5',
      ip: '72.229.28.14',
      location: 'Palo Alto, CA, USA',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
  ],
};

export const DEFAULT_DEVELOPER_SETTINGS: DeveloperSettingsState = {
  developerModeEnabled: false,
  verboseConsoleLogs: false,
  apiDebugInspector: false,
  networkMockDelayMs: 0,
  showPerformanceHud: false,
  experimentalModules: false,
};

export const DEFAULT_ABOUT_SETTINGS: AboutSettingsState = {
  version: 'v2.4.0-M9',
  buildNumber: '#build-8f9a23c',
  environment: 'Cloud Run Production Sandbox',
  releaseDate: 'July 2026',
  license: 'Enterprise Commercial License',
  architect: 'Aura Life OS Core Team',
};

export const DEFAULT_DATA_MANAGEMENT_STATE: DataManagementState = {
  lastBackupDate: new Date().toISOString().split('T')[0],
  storageUsedBytes: 24500000, // ~24.5 MB
  storageLimitBytes: 10737418240, // 10 GB
};
