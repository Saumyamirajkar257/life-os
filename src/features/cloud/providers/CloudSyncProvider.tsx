/**
 * Aura Cloud & Synchronization Infrastructure Provider
 * Milestone 21
 */

import React, { useEffect } from 'react';
import { useConnectionStore } from '../stores/useConnectionStore';
import { useOfflineStore } from '../stores/useOfflineStore';
import { useSyncStore } from '../stores/useSyncStore';
import { ConnectionMonitor } from '../offline/connectionMonitor';

interface CloudSyncProviderProps {
  children: React.ReactNode;
  getLocalStateSnapshot?: () => Record<string, any>;
}

export const CloudSyncProvider: React.FC<CloudSyncProviderProps> = ({ children, getLocalStateSnapshot }) => {
  const initConnection = useConnectionStore((s) => s.initListener);
  const isOnline = useConnectionStore((s) => s.state.isOnline);
  const { isAutoSyncEnabled, triggerSync } = useSyncStore();
  const refreshQueue = useOfflineStore((s) => s.refreshQueue);

  // 1. Initialize connection monitoring
  useEffect(() => {
    initConnection();
  }, [initConnection]);

  // 2. On network status change to online, trigger immediate queue flush and sync
  useEffect(() => {
    if (isOnline && getLocalStateSnapshot) {
      refreshQueue();
      const state = getLocalStateSnapshot();
      triggerSync(state, 'auto');
    }
  }, [isOnline, getLocalStateSnapshot, refreshQueue, triggerSync]);

  return <>{children}</>;
};
