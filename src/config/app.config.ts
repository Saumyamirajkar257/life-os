/**
 * @file app.config.ts
 * @description System configuration, application metadata, and core constants.
 * @module AuraCore/Config/App
 */

export const APP_CONFIG = {
  name: 'AURA LIFE OS',
  codeName: 'AuraCore',
  version: '1.0.0-core.1',
  author: 'Aura Life OS Team',
  description: 'A premium desktop-first Life Operating System platform',
  defaults: {
    theme: 'system' as const,
    notificationDuration: 4000,
    sidebarCollapsed: false,
    queryStaleTimeMs: 1000 * 60 * 5, // 5 minutes
    queryGcTimeMs: 1000 * 60 * 30,  // 30 minutes
  },
  storageKeys: {
    theme: 'aura-core-theme-v1',
    sidebar: 'aura-core-sidebar-v1',
    userPreferences: 'aura-core-user-prefs-v1',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
