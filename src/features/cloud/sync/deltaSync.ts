/**
 * Delta & Incremental Sync Engine
 * Calculates diffs between local state and server snapshots to minimize network payload
 */

import { SyncEntityChange } from '../types/cloudTypes';

export class DeltaSyncEngine {
  /**
   * Generates delta changes for a collection given local state and last sync timestamp
   */
  public static calculateDelta(
    collection: string,
    localItems: Record<string, any>[],
    lastSyncedAt: string
  ): SyncEntityChange[] {
    const changes: SyncEntityChange[] = [];
    const lastSyncTime = new Date(lastSyncedAt || 0).getTime();

    localItems.forEach((item) => {
      const itemTime = new Date(item.updatedAt || item.createdAt || 0).getTime();
      if (itemTime > lastSyncTime) {
        changes.push({
          id: item.id,
          collection,
          action: 'update',
          data: item,
          timestamp: item.updatedAt || new Date().toISOString(),
          version: item.version || 1,
          deviceId: item.deviceId || 'local_device',
        });
      }
    });

    return changes;
  }
}
