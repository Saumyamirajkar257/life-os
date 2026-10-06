/**
 * @file useCalendarUIStore.ts
 * @description State store for UI view controls, filters, search, and active modals in Calendar & Planner.
 * @module Features/Calendar/Stores
 */

import { create } from 'zustand';
import { CalendarViewMode, CalendarFilterState, CalendarEventItem } from '../types/calendar.types';
import { toIsoDateString } from '../utils/calendarUtils';

interface CalendarUIState {
  viewMode: CalendarViewMode;
  currentDate: string; // ISO YYYY-MM-DD
  filterState: CalendarFilterState;
  isEventModalOpen: boolean;
  editingEvent: CalendarEventItem | null;
  selectedEventDetail: CalendarEventItem | null;

  // Actions
  setViewMode: (mode: CalendarViewMode) => void;
  setCurrentDate: (dateStr: string) => void;
  navigateDate: (direction: 'prev' | 'next' | 'today') => void;
  setSearchQuery: (query: string) => void;
  toggleCategoryFilter: (category: string) => void;
  resetFilters: () => void;
  openCreateModal: (defaultDate?: string, defaultTime?: string) => void;
  openEditModal: (event: CalendarEventItem) => void;
  closeEventModal: () => void;
  setSelectedEventDetail: (event: CalendarEventItem | null) => void;
}

const DEFAULT_FILTERS: CalendarFilterState = {
  searchQuery: '',
  categories: [],
  priorities: [],
  statuses: [],
  tags: [],
  isPinnedOnly: false,
  isFavouriteOnly: false,
  dateRange: null,
};

export const useCalendarUIStore = create<CalendarUIState>()((set, get) => ({
  viewMode: 'month',
  currentDate: toIsoDateString(new Date()),
  filterState: DEFAULT_FILTERS,
  isEventModalOpen: false,
  editingEvent: null,
  selectedEventDetail: null,

  setViewMode: (mode) => set({ viewMode: mode }),

  setCurrentDate: (dateStr) => set({ currentDate: dateStr }),

  navigateDate: (direction) => {
    const current = new Date(get().currentDate);
    const mode = get().viewMode;

    if (direction === 'today') {
      set({ currentDate: toIsoDateString(new Date()) });
      return;
    }

    const modifier = direction === 'next' ? 1 : -1;

    if (mode === 'day' || mode === 'planner') {
      current.setDate(current.getDate() + modifier);
    } else if (mode === 'week') {
      current.setDate(current.getDate() + modifier * 7);
    } else if (mode === 'month') {
      current.setMonth(current.getMonth() + modifier);
    } else if (mode === 'year') {
      current.setFullYear(current.getFullYear() + modifier);
    }

    set({ currentDate: toIsoDateString(current) });
  },

  setSearchQuery: (query) =>
    set((state) => ({
      filterState: { ...state.filterState, searchQuery: query },
    })),

  toggleCategoryFilter: (category) =>
    set((state) => {
      const current = state.filterState.categories;
      const exists = current.includes(category);
      const updated = exists ? current.filter((c) => c !== category) : [...current, category];
      return {
        filterState: { ...state.filterState, categories: updated },
      };
    }),

  resetFilters: () => set({ filterState: DEFAULT_FILTERS }),

  openCreateModal: (defaultDate, defaultTime) => {
    const today = get().currentDate;
    set({
      isEventModalOpen: true,
      editingEvent: null,
      selectedEventDetail: null,
    });
  },

  openEditModal: (event) =>
    set({
      isEventModalOpen: true,
      editingEvent: event,
      selectedEventDetail: null,
    }),

  closeEventModal: () =>
    set({
      isEventModalOpen: false,
      editingEvent: null,
    }),

  setSelectedEventDetail: (event) => set({ selectedEventDetail: event }),
}));
