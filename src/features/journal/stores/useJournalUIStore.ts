/**
 * @file useJournalUIStore.ts
 * @description UI State management for Journal, Notes & Second Brain module in Aura Life OS.
 * @module Features/Journal/Stores
 */

import { create } from 'zustand';
import { ViewMode, JournalSearchFilters } from '../types/journal.types';

interface JournalUIState {
  viewMode: ViewMode;
  searchFilters: JournalSearchFilters;
  activeFolderId: string | null;
  selectedTag: string | null;
  smartCollection: string | null; // e.g., 'all' | 'favorites' | 'recent' | 'pinned' | 'archived' | 'locked'
  selectedEntryId: string | null;
  selectedEntryType: 'journal' | 'note' | null;
  isDetailModalOpen: boolean;
  isVoiceRecorderOpen: boolean;
  isExportModalOpen: boolean;
  isLockPromptOpen: boolean;
  targetLockedItemId: string | null;
  unlockedItemIds: Record<string, boolean>; // Cache unlocked items during active session
  masterPin: string;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<JournalSearchFilters>) => void;
  resetFilters: () => void;
  setActiveFolder: (folderId: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setSmartCollection: (collection: string | null) => void;
  openEntryDetail: (id: string, type: 'journal' | 'note') => void;
  closeEntryDetail: () => void;
  openVoiceRecorder: () => void;
  closeVoiceRecorder: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  promptLock: (itemId: string) => void;
  closeLockPrompt: () => void;
  unlockItem: (itemId: string) => void;
  setMasterPin: (pin: string) => void;
}

const INITIAL_FILTERS: JournalSearchFilters = {
  query: '',
  selectedTags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

export const useJournalUIStore = create<JournalUIState>((set) => ({
  viewMode: 'journal',
  searchFilters: INITIAL_FILTERS,
  activeFolderId: null,
  selectedTag: null,
  smartCollection: 'all',
  selectedEntryId: null,
  selectedEntryType: null,
  isDetailModalOpen: false,
  isVoiceRecorderOpen: false,
  isExportModalOpen: false,
  isLockPromptOpen: false,
  targetLockedItemId: null,
  unlockedItemIds: {},
  masterPin: '1234',

  setViewMode: (viewMode) => set({ viewMode }),

  setSearchQuery: (query) =>
    set((state) => ({ searchFilters: { ...state.searchFilters, query } })),

  setSearchFilters: (filters) =>
    set((state) => ({ searchFilters: { ...state.searchFilters, ...filters } })),

  resetFilters: () => set({ searchFilters: INITIAL_FILTERS, selectedTag: null }),

  setActiveFolder: (activeFolderId) =>
    set({ activeFolderId, smartCollection: null, selectedTag: null }),

  setSelectedTag: (selectedTag) =>
    set({ selectedTag, smartCollection: null, activeFolderId: null }),

  setSmartCollection: (smartCollection) =>
    set({ smartCollection, activeFolderId: null, selectedTag: null }),

  openEntryDetail: (id, type) =>
    set({ selectedEntryId: id, selectedEntryType: type, isDetailModalOpen: true }),

  closeEntryDetail: () =>
    set({ isDetailModalOpen: false, selectedEntryId: null, selectedEntryType: null }),

  openVoiceRecorder: () => set({ isVoiceRecorderOpen: true }),
  closeVoiceRecorder: () => set({ isVoiceRecorderOpen: false }),

  openExportModal: () => set({ isExportModalOpen: true }),
  closeExportModal: () => set({ isExportModalOpen: false }),

  promptLock: (itemId) => set({ isLockPromptOpen: true, targetLockedItemId: itemId }),
  closeLockPrompt: () => set({ isLockPromptOpen: false, targetLockedItemId: null }),

  unlockItem: (itemId) =>
    set((state) => ({
      unlockedItemIds: { ...state.unlockedItemIds, [itemId]: true },
      isLockPromptOpen: false,
      targetLockedItemId: null,
    })),

  setMasterPin: (masterPin) => set({ masterPin }),
}));
