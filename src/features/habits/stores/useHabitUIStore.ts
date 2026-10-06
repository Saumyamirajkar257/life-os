/**
 * @file useHabitUIStore.ts
 * @description Zustand store for Habits Module UI state (active views, search filters, drawers, and form modals).
 * @module Features/Habits/Stores/UseHabitUIStore
 */

import { create } from 'zustand';
import { HabitActiveView } from '../types/habit.types';

export type HabitSortOption = 'streak' | 'name' | 'category' | 'created';

interface HabitUIState {
  activeView: HabitActiveView;
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string | null;
  selectedSort: HabitSortOption;

  // Form Modal
  isFormModalOpen: boolean;
  editingHabitId: string | null;

  // Detail Drawer
  isDetailDrawerOpen: boolean;
  activeDetailHabitId: string | null;

  // Actions
  setActiveView: (view: HabitActiveView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedSort: (sort: HabitSortOption) => void;

  openFormModal: (habitId?: string) => void;
  closeFormModal: () => void;

  openDetailDrawer: (habitId: string) => void;
  closeDetailDrawer: () => void;
}

export const useHabitUIStore = create<HabitUIState>((set) => ({
  activeView: 'today',
  searchQuery: '',
  selectedCategory: 'all',
  selectedTag: null,
  selectedSort: 'streak',

  isFormModalOpen: false,
  editingHabitId: null,

  isDetailDrawerOpen: false,
  activeDetailHabitId: null,

  setActiveView: (view) => set({ activeView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),

  openFormModal: (habitId) => set({ isFormModalOpen: true, editingHabitId: habitId || null }),
  closeFormModal: () => set({ isFormModalOpen: false, editingHabitId: null }),

  openDetailDrawer: (habitId) => set({ isDetailDrawerOpen: true, activeDetailHabitId: habitId }),
  closeDetailDrawer: () => set({ isDetailDrawerOpen: false, activeDetailHabitId: null }),
}));
