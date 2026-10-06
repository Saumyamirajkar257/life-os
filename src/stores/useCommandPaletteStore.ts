/**
 * @file useCommandPaletteStore.ts
 * @description State store for command palette open/close state, active search input, and shortcut triggers.
 * Delegated to Milestone 11 Productivity Framework store.
 * @module AuraCore/Stores/CommandPalette
 */

import { create } from 'zustand';
import { CommandPaletteState } from '@/types/store.types';
import { useProductivityStore } from '@/features/productivity/stores/useProductivityStore';

export const useCommandPaletteStore = create<CommandPaletteState>()((set) => ({
  isOpen: false,
  searchQuery: '',

  openCommandPalette: () => {
    useProductivityStore.getState().setCommandPaletteOpen(true);
    set({ isOpen: true });
  },
  closeCommandPalette: () => {
    useProductivityStore.getState().setCommandPaletteOpen(false);
    set({ isOpen: false, searchQuery: '' });
  },
  toggleCommandPalette: () => {
    const next = !useProductivityStore.getState().isCommandPaletteOpen;
    useProductivityStore.getState().setCommandPaletteOpen(next);
    set({ isOpen: next });
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

