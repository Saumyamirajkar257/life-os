import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AppState } from '@/types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activePage: 'dashboard',
      sidebarExpanded: true,
      commandPaletteOpen: false,
      isMobile: false,
      isTablet: false,
      compactDock: false,
      soundEnabled: true,
      userName: 'Saumya',
      userEmail: 'saumya@lifeos.ai',
      userHandle: '@Sam_257',
      setActivePage: (page) => set({ activePage: page }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setMobile: (mobile) => set({ isMobile: mobile }),
      setTablet: (tablet) => set({ isTablet: tablet }),
      setCompactDock: (compact) => set({ compactDock: compact }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      updateProfile: (name, email, handle) => set({ userName: name, userEmail: email, userHandle: handle }),
    }),
    {
      name: 'life-os-app-settings',
    }
  )
);
