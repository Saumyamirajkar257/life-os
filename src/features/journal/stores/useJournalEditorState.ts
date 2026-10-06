/**
 * @file useJournalEditorState.ts
 * @description Active editor state management, autosave tracking, word count, and reading time computation.
 * @module Features/Journal/Stores
 */

import { create } from 'zustand';
import { AutosaveStatus } from '../types/journal.types';
import { calculateWordCount, calculateReadingTime } from '../utils/journalUtils';

interface JournalEditorState {
  activeItemId: string | null;
  activeItemType: 'journal' | 'note' | null;
  content: string;
  contentJson: string;
  isDirty: boolean;
  wordCount: number;
  readingTimeMinutes: number;
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;

  // Actions
  initializeEditor: (id: string, type: 'journal' | 'note', content: string, contentJson?: string) => void;
  setContent: (content: string, contentJson?: string) => void;
  setAutosaveStatus: (status: AutosaveStatus) => void;
  markSaved: () => void;
  resetEditor: () => void;
}

export const useJournalEditorState = create<JournalEditorState>((set, get) => ({
  activeItemId: null,
  activeItemType: null,
  content: '',
  contentJson: '',
  isDirty: false,
  wordCount: 0,
  readingTimeMinutes: 1,
  autosaveStatus: 'idle',
  lastSavedAt: null,

  initializeEditor: (id, type, content, contentJson = '') => {
    const wordCount = calculateWordCount(content);
    const readingTimeMinutes = calculateReadingTime(wordCount);
    set({
      activeItemId: id,
      activeItemType: type,
      content,
      contentJson,
      isDirty: false,
      wordCount,
      readingTimeMinutes,
      autosaveStatus: 'idle',
      lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  },

  setContent: (content, contentJson = '') => {
    const wordCount = calculateWordCount(content);
    const readingTimeMinutes = calculateReadingTime(wordCount);
    set({
      content,
      contentJson,
      isDirty: true,
      wordCount,
      readingTimeMinutes,
      autosaveStatus: 'saving',
    });
  },

  setAutosaveStatus: (autosaveStatus) => set({ autosaveStatus }),

  markSaved: () =>
    set({
      isDirty: false,
      autosaveStatus: 'saved',
      lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }),

  resetEditor: () =>
    set({
      activeItemId: null,
      activeItemType: null,
      content: '',
      contentJson: '',
      isDirty: false,
      wordCount: 0,
      readingTimeMinutes: 1,
      autosaveStatus: 'idle',
      lastSavedAt: null,
    }),
}));
