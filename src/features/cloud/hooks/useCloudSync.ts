/**
 * Custom Hook: Cloud Synchronization Lifecycle
 */

import { useEffect } from 'react';
import { useSyncStore } from '../stores/useSyncStore';
import { useConnectionStore } from '../stores/useConnectionStore';
import { CLOUD_CONSTANTS } from '../constants/cloudConstants';

export function useCloudSync(getLocalStateSnapshot?: () => Record<string, any>) {
  const { status, lastSyncedAt, triggerSync, isAutoSyncEnabled, conflicts } = useSyncStore();
  const connection = useConnectionStore((s) => s.state);

  useEffect(() => {
    if (!isAutoSyncEnabled || !connection.isOnline || !getLocalStateSnapshot) return;

    // Automatic periodic sync timer
    const timer = setInterval(() => {
      const state = getLocalStateSnapshot();
      triggerSync(state, 'auto');
    }, CLOUD_CONSTANTS.AUTO_SYNC_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isAutoSyncEnabled, connection.isOnline, getLocalStateSnapshot, triggerSync]);

  return {
    syncStatus: status,
    lastSyncedAt,
    isOnline: connection.isOnline,
    conflictsCount: conflicts.length,
    syncNow: (snapshot: Record<string, any>) => triggerSync(snapshot, 'manual'),
  };
}
