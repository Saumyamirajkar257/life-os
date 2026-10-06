/**
 * @file useProductivityStore.ts
 * @description Persistent Zustand store for Global Command Palette, Search History, Pinned Actions, and Notification Center.
 * @module Features/Productivity/Stores/UseProductivityStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SystemNotification, RecentSearchEntry } from '../types';

interface ProductivityState {
  // Command Palette Modal State
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Notification Center Drawer State
  isNotificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;
  toggleNotificationCenter: () => void;

  // Notifications Storage & Queue
  notifications: SystemNotification[];
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Recent Searches
  recentSearches: RecentSearchEntry[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (id: string) => void;

  // Pinned Command IDs
  pinnedCommandIds: string[];
  togglePinCommand: (commandId: string) => void;

  // Toast Queue for active popup toasts
  activeToast: SystemNotification | null;
  setActiveToast: (toast: SystemNotification | null) => void;
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Aura Core Initialized',
    message: 'Welcome to Aura Life OS v2.4.0. Module SDK & Productivity framework are online.',
    type: 'info',
    priority: 'normal',
    category: 'System',
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
  },
  {
    id: 'notif-2',
    title: 'Sync Complete',
    message: 'Local workspace state synchronized with Cloud storage.',
    type: 'success',
    priority: 'low',
    category: 'Storage',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: true,
    dismissed: false,
  },
];

export const useProductivityStore = create<ProductivityState>()(
  persist(
    (set, get) => ({
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

      isNotificationCenterOpen: false,
      setNotificationCenterOpen: (open) => set({ isNotificationCenterOpen: open }),
      toggleNotificationCenter: () => set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen })),

      notifications: INITIAL_NOTIFICATIONS,

      addNotification: (newNotifData) => {
        const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const newNotif: SystemNotification = {
          ...newNotifData,
          id,
          timestamp: new Date().toISOString(),
          read: false,
          dismissed: false,
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
          activeToast: newNotif,
        }));

        return id;
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAllNotifications: () => set({ notifications: [] }),

      recentSearches: [
        { id: 's-1', query: 'Tasks', timestamp: new Date().toISOString() },
        { id: 's-2', query: 'Appearance Settings', timestamp: new Date().toISOString() },
      ],

      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        set((state) => {
          const filtered = state.recentSearches.filter((s) => s.query.toLowerCase() !== trimmed.toLowerCase());
          const newEntry: RecentSearchEntry = {
            id: `search-${Date.now()}`,
            query: trimmed,
            timestamp: new Date().toISOString(),
          };
          return {
            recentSearches: [newEntry, ...filtered].slice(0, 8),
          };
        });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      removeRecentSearch: (id) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s.id !== id),
        })),

      pinnedCommandIds: ['cmd-tasks-nav', 'cmd-toggle-theme', 'cmd-ai-prompt'],

      togglePinCommand: (commandId) =>
        set((state) => {
          const exists = state.pinnedCommandIds.includes(commandId);
          return {
            pinnedCommandIds: exists
              ? state.pinnedCommandIds.filter((id) => id !== commandId)
              : [...state.pinnedCommandIds, commandId],
          };
        }),

      activeToast: null,
      setActiveToast: (toast) => set({ activeToast: toast }),
    }),
    {
      name: 'aura-productivity-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        recentSearches: state.recentSearches,
        pinnedCommandIds: state.pinnedCommandIds,
      }),
    }
  )
);
