/**
 * @file useSidebarStore.ts
 * @description Zustand store for desktop sidebar navigation collapse state and active section tracking.
 * @module AuraCore/Stores/Sidebar
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SidebarState } from '@/types/store.types';
import { APP_CONFIG } from '@/config/app.config';

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: APP_CONFIG.defaults.sidebarCollapsed,
      activeSectionId: 'analytics',

      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
      setActiveSection: (id: string | null) => set({ activeSectionId: id }),
    }),
    {
      name: APP_CONFIG.storageKeys.sidebar,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
