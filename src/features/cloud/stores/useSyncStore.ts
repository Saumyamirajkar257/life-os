/**
 * Sync State Store (Zustand)
 */

import { create } from 'zustand';
import { SyncStatus, SyncConflict, SyncHistoryEntry, ConflictResolutionStrategy } from '../types/cloudTypes';
import { SyncEngineService } from '../services/syncEngine';

interface SyncStoreState {
  status: SyncStatus;
  lastSyncedAt: string | null;
  syncMode: 'auto' | 'manual' | 'background' | 'incremental';
  conflictStrategy: ConflictResolutionStrategy;
  conflicts: SyncConflict[];
  logs: SyncHistoryEntry[];
  isAutoSyncEnabled: boolean;
  
  // Actions
  setStatus: (status: SyncStatus) => void;
  setConflictStrategy: (strategy: ConflictResolutionStrategy) => void;
  setAutoSyncEnabled: (enabled: boolean) => void;
  triggerSync: (localState: Record<string, any>, mode?: 'auto' | 'manual' | 'background') => Promise<void>;
  resolveConflict: (conflictId: string, strategy: ConflictResolutionStrategy, mergedData?: Record<string, any>) => void;
  clearHistory: () => void;
}

export const useSyncStore = create<SyncStoreState>((set, get) => ({
  status: 'idle',
  lastSyncedAt: new Date().toISOString(),
  syncMode: 'auto',
  conflictStrategy: 'last_write_wins',
  conflicts: [],
  logs: SyncEngineService.getSyncLogs(),
  isAutoSyncEnabled: true,

  setStatus: (status) => set({ status }),

  setConflictStrategy: (conflictStrategy) => set({ conflictStrategy }),

  setAutoSyncEnabled: (isAutoSyncEnabled) => set({ isAutoSyncEnabled }),

  triggerSync: async (localState, mode = 'manual') => {
    set({ status: 'syncing', syncMode: mode });
    const res = await SyncEngineService.executeSyncCycle(localState, mode, get().conflictStrategy);
    if (res.success) {
      set({
        status: res.conflicts.length > 0 ? 'conflict' : 'success',
        lastSyncedAt: new Date().toISOString(),
        conflicts: res.conflicts,
        logs: SyncEngineService.getSyncLogs(),
      });
      setTimeout(() => set({ status: 'idle' }), 3000);
    } else {
      set({
        status: 'error',
        logs: SyncEngineService.getSyncLogs(),
      });
    }
  },

  resolveConflict: (conflictId, strategy, mergedData) => {
    const updatedConflicts = get().conflicts.filter((c) => c.id !== conflictId);
    set({ conflicts: updatedConflicts, status: updatedConflicts.length > 0 ? 'conflict' : 'idle' });
  },

  clearHistory: () => {
    SyncEngineService.clearSyncLogs();
    set({ logs: [] });
  },
}));
