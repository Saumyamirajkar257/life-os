/**
 * @file useNotificationStore.ts
 * @description In-memory Zustand store for managing toast notifications queue and auto-dismiss lifecycle.
 * Delegated to Milestone 11 Productivity Framework store.
 * @module AuraCore/Stores/Notification
 */

import { create } from 'zustand';
import { NotificationState, NotificationItem } from '@/types/store.types';
import { APP_CONFIG } from '@/config/app.config';
import { useProductivityStore } from '@/features/productivity/stores/useProductivityStore';

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],

  addNotification: (item) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNotification: NotificationItem = {
      ...item,
      id,
      duration: item.duration ?? APP_CONFIG.defaults.notificationDuration,
      createdAt: Date.now(),
    };

    useProductivityStore.getState().addNotification({
      title: item.title,
      message: item.message || '',
      type: (item.type as any) || 'info',
      priority: 'normal',
      category: 'System',
    });

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 5),
    }));

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, newNotification.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    useProductivityStore.getState().dismissNotification(id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    useProductivityStore.getState().clearAllNotifications();
    set({ notifications: [] });
  },
}));

