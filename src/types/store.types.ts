/**
 * @file store.types.ts
 * @description State interfaces and types for Aura Core Zustand stores.
 * @module AuraCore/Types/Store
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  duration?: number;
  createdAt: number;
}

export interface SidebarState {
  isCollapsed: boolean;
  activeSectionId: string | null;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setActiveSection: (id: string | null) => void;
}

export interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface CommandPaletteState {
  isOpen: boolean;
  searchQuery: string;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  setSearchQuery: (query: string) => void;
}
