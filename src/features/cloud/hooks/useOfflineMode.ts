/**
 * Custom Hook: Offline Mode & Queue Manager
 */

import { useOfflineStore } from '../stores/useOfflineStore';
import { useConnectionStore } from '../stores/useConnectionStore';

export function useOfflineMode() {
  const connection = useConnectionStore((s) => s.state);
  const { queue, clearQueue } = useOfflineStore();

  return {
    isOffline: !connection.isOnline,
    pendingQueueCount: queue.length,
    queue,
    clearQueue,
    effectiveType: connection.effectiveType,
    latencyMs: connection.roundTripTimeMs,
  };
}
