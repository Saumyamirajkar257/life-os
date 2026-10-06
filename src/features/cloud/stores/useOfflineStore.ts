/**
 * Offline State Store (Zustand)
 */

import { create } from 'zustand';
import { OfflineQueueItem } from '../types/cloudTypes';
import { OfflineStorageService } from '../services/offlineStorage';

interface OfflineStoreState {
  isOffline: boolean;
  queue: OfflineQueueItem[];
  
  // Actions
  setIsOffline: (isOffline: boolean) => void;
  enqueueAction: (collection: string, entityId: string, action: 'create' | 'update' | 'delete', payload: Record<string, any>) => void;
  clearQueue: () => void;
  refreshQueue: () => void;
}

export const useOfflineStore = create<OfflineStoreState>((set) => ({
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  queue: OfflineStorageService.getOfflineQueue(),

  setIsOffline: (isOffline) => set({ isOffline }),

  enqueueAction: (collection, entityId, action, payload) => {
    OfflineStorageService.enqueueOfflineAction(collection, entityId, action, payload);
    set({ queue: OfflineStorageService.getOfflineQueue() });
  },

  clearQueue: () => {
    OfflineStorageService.clearOfflineQueue();
    set({ queue: [] });
  },

  refreshQueue: () => {
    set({ queue: OfflineStorageService.getOfflineQueue() });
  },
}));
