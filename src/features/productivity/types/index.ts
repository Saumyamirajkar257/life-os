/**
 * @file index.ts
 * @description TypeScript definitions for Milestone 11 Global Search, Command Palette, and Notification Center.
 * @module Features/Productivity/Types
 */

import React from 'react';

/**
 * Notification Severity Levels
 */
export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'loading';

/**
 * Notification Priority Standard
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

/**
 * Interactive Action Button on Notification Toasts
 */
export interface NotificationActionButton {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Master Notification Item Structure
 */
export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  sourceModuleId?: string;
  actionButtons?: NotificationActionButton[];
  meta?: Record<string, any>;
}

/**
 * Command Palette Category
 */
export type CommandCategory = 'Navigation' | 'Actions' | 'Workspace' | 'System' | 'SDK Modules' | string;

/**
 * Individual Executable Command Item
 */
export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: CommandCategory;
  icon?: React.ReactNode | string;
  shortcut?: string;
  keywords?: string[];
  isPinned?: boolean;
  isRecent?: boolean;
  sourceModuleId?: string;
  action: () => void | Promise<void>;
}

/**
 * Search Result Record
 */
export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon?: React.ReactNode | string;
  type: 'route' | 'command' | 'module' | 'setting' | 'data';
  action: () => void;
  score?: number;
  metadata?: Record<string, any>;
}

/**
 * Search History Record
 */
export interface RecentSearchEntry {
  id: string;
  query: string;
  timestamp: string;
}
