/**
 * @file useAIMemoryStore.ts
 * @description Zustand state management for AI Memories & Fact Recall.
 * @module AuraAI/Stores
 */

import { create } from 'zustand';
import { AIMemoryItem, MemoryCategory, MemoryImportance } from '../types';
import { MemoryEngine } from '../memory/memoryEngine';

interface AIMemoryState {
  memories: AIMemoryItem[];
  searchQuery: string;
  selectedCategory: MemoryCategory | 'all';

  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: MemoryCategory | 'all') => void;
  addMemory: (category: MemoryCategory, key: string, value: string, importance?: MemoryImportance) => void;
  updateMemory: (id: string, updates: Partial<AIMemoryItem>) => void;
  deleteMemory: (id: string) => void;
  refreshMemories: () => void;
}

export const useAIMemoryStore = create<AIMemoryState>((set) => ({
  memories: MemoryEngine.getMemories(),
  searchQuery: '',
  selectedCategory: 'all',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  addMemory: (category, key, value, importance = 'medium') => {
    MemoryEngine.addMemory(category, key, value, importance);
    set({ memories: [...MemoryEngine.getMemories()] });
  },

  updateMemory: (id, updates) => {
    MemoryEngine.updateMemory(id, updates);
    set({ memories: [...MemoryEngine.getMemories()] });
  },

  deleteMemory: (id) => {
    MemoryEngine.deleteMemory(id);
    set({ memories: [...MemoryEngine.getMemories()] });
  },

  refreshMemories: () => {
    set({ memories: [...MemoryEngine.getMemories()] });
  },
}));
