/**
 * @file useTaskUIStore.ts
 * @description UI State store managing Task view tabs, active filters, selection, modals, drawers, and Pomodoro mode.
 * @module Features/Tasks/Stores/UseTaskUIStore
 */

import { create } from 'zustand';
import {
  TaskViewMode,
  TaskFilterState,
  TaskSortOption,
  TaskSortDirection,
  TaskGroupOption,
  TaskItem,
} from '../types/task.types';

interface TaskUIState {
  activeView: TaskViewMode;
  filters: TaskFilterState;
  sortBy: TaskSortOption;
  sortDirection: TaskSortDirection;
  groupBy: TaskGroupOption;

  // Multi-select state
  selectedTaskIds: string[];

  // Task detail drawer
  activeDetailTaskId: string | null;

  // Task create/edit modal
  isFormModalOpen: boolean;
  editingTask: TaskItem | null;
  formInitialCategory: string;

  // Focus Mode Modal
  isFocusModalOpen: boolean;
  focusedTaskId: string | null;

  // Pomodoro timer state
  isPomodoroActive: boolean;
  pomodoroTimeLeft: number; // in seconds
  pomodoroMode: 'work' | 'shortBreak' | 'longBreak';
  pomodoroSessionsCompleted: number;

  // Setters & Actions
  setActiveView: (view: TaskViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TaskFilterState>) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: TaskSortOption) => void;
  toggleSortDirection: () => void;
  setGroupBy: (groupBy: TaskGroupOption) => void;

  // Selection
  toggleSelectTask: (id: string) => void;
  selectAllTasks: (ids: string[]) => void;
  clearSelection: () => void;

  // Modals & Drawers
  openDetailDrawer: (taskId: string) => void;
  closeDetailDrawer: () => void;
  openFormModal: (editingTask?: TaskItem | null, category?: string) => void;
  closeFormModal: () => void;
  openFocusModal: (taskId?: string) => void;
  closeFocusModal: () => void;
  setFocusedTask: (taskId: string | null) => void;

  // Pomodoro Actions
  setPomodoroActive: (active: boolean) => void;
  setPomodoroTimeLeft: (time: number | ((prev: number) => number)) => void;
  setPomodoroMode: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
  incrementPomodoroSessions: () => void;
}

const INITIAL_FILTERS: TaskFilterState = {
  searchQuery: '',
  status: [],
  priority: [],
  categories: [],
  tags: [],
  isPinnedOnly: false,
  isFavouriteOnly: false,
  hasSubtasksOnly: false,
};

export const useTaskUIStore = create<TaskUIState>((set) => ({
  activeView: 'today',
  filters: INITIAL_FILTERS,
  sortBy: 'dueDate',
  sortDirection: 'asc',
  groupBy: 'none',

  selectedTaskIds: [],
  activeDetailTaskId: null,

  isFormModalOpen: false,
  editingTask: null,
  formInitialCategory: 'Inbox',

  isFocusModalOpen: false,
  focusedTaskId: null,

  isPomodoroActive: false,
  pomodoroTimeLeft: 25 * 60,
  pomodoroMode: 'work',
  pomodoroSessionsCompleted: 0,

  setActiveView: (view) => set({ activeView: view, selectedTaskIds: [] }),

  setSearchQuery: (searchQuery) =>
    set((state) => ({ filters: { ...state.filters, searchQuery } })),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: INITIAL_FILTERS }),

  setSortBy: (sortBy) => set({ sortBy }),

  toggleSortDirection: () =>
    set((state) => ({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' })),

  setGroupBy: (groupBy) => set({ groupBy }),

  toggleSelectTask: (id) =>
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds.includes(id)
        ? state.selectedTaskIds.filter((item) => item !== id)
        : [...state.selectedTaskIds, id],
    })),

  selectAllTasks: (ids) => set({ selectedTaskIds: ids }),

  clearSelection: () => set({ selectedTaskIds: [] }),

  openDetailDrawer: (taskId) => set({ activeDetailTaskId: taskId }),

  closeDetailDrawer: () => set({ activeDetailTaskId: null }),

  openFormModal: (editingTask = null, category = 'Inbox') =>
    set({ isFormModalOpen: true, editingTask, formInitialCategory: category }),

  closeFormModal: () => set({ isFormModalOpen: false, editingTask: null }),

  openFocusModal: (taskId = undefined) =>
    set({ isFocusModalOpen: true, focusedTaskId: taskId || null }),

  closeFocusModal: () => set({ isFocusModalOpen: false, focusedTaskId: null }),

  setFocusedTask: (taskId) => set({ focusedTaskId: taskId }),

  setPomodoroActive: (active) => set({ isPomodoroActive: active }),

  setPomodoroTimeLeft: (time) =>
    set((state) => ({
      pomodoroTimeLeft: typeof time === 'function' ? time(state.pomodoroTimeLeft) : time,
    })),

  setPomodoroMode: (mode) =>
    set({
      pomodoroMode: mode,
      pomodoroTimeLeft: mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60,
    }),

  incrementPomodoroSessions: () =>
    set((state) => ({ pomodoroSessionsCompleted: state.pomodoroSessionsCompleted + 1 })),
}));
