/**
 * @file useAIMemory.ts
 * @description Hook managing Memory Engine operations and filtering.
 * @module AuraAI/Hooks
 */

import { useAIMemoryStore } from '../stores/useAIMemoryStore';

export function useAIMemory() {
  const store = useAIMemoryStore();

  const filteredMemories = store.memories.filter((m) => {
    const matchCat = store.selectedCategory === 'all' || m.category === store.selectedCategory;
    const matchSearch =
      m.key.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
      m.value.toLowerCase().includes(store.searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return {
    ...store,
    memories: filteredMemories,
    totalCount: store.memories.length,
  };
}
