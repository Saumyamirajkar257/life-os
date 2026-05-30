import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'github' | 'calendar';
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (title: string, description: string, type?: NotificationItem['type']) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 'welcome',
          title: 'Welcome to LIFE OS',
          description: 'Your neural core and custom dashboards are successfully initialized. Tap the bottom left pet to start chatting with your AI coach.',
          timestamp: 'Just now',
          type: 'success',
          read: false,
        },
        {
          id: 'companion-online',
          title: 'AI Companion FA9 Active',
          description: 'FA9 cybernetic system initialized. Spin animations, blinking sequences, and productivity tracking loops are fully loaded.',
          timestamp: '5m ago',
          type: 'info',
          read: false,
        },
        {
          id: 'theme-loaded',
          title: 'Premium Glassmorphic Backdrop Active',
          description: 'Frosted SVG noise filters, hover light glow borders, and mouse-repelling particles are active.',
          timestamp: '1h ago',
          type: 'info',
          read: true,
        }
      ],
      addNotification: (title, description, type = 'info') => {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title,
          description,
          timestamp: 'Just now',
          type,
          read: false,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      clearAll: () => {
        set({ notifications: [] });
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      }
    }),
    {
      name: 'life-os-notifications',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
