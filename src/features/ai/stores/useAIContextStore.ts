/**
 * @file useAIContextStore.ts
 * @description Zustand state management for AI Context Inspector & System Snapshot.
 * @module AuraAI/Stores
 */

import { create } from 'zustand';
import { AIContextSnapshot } from '../types';
import { ContextGatherer } from '../context/contextGatherer';

interface AIContextState {
  currentSnapshot: AIContextSnapshot;
  autoRefreshEnabled: boolean;
  refreshSnapshot: (screen?: string) => AIContextSnapshot;
  setAutoRefresh: (enabled: boolean) => void;
}

export const useAIContextStore = create<AIContextState>((set) => ({
  currentSnapshot: ContextGatherer.gatherSnapshot(),
  autoRefreshEnabled: true,

  refreshSnapshot: (screen) => {
    const snap = ContextGatherer.gatherSnapshot(screen);
    set({ currentSnapshot: snap });
    return snap;
  },

  setAutoRefresh: (autoRefreshEnabled) => set({ autoRefreshEnabled }),
}));
