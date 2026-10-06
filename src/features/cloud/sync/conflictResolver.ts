/**
 * Conflict Resolution Engine
 * Strategies: Last Write Wins, Server Wins, Client Wins, Manual Merge
 */

import { SyncConflict, ConflictResolutionStrategy } from '../types/cloudTypes';

export class ConflictResolver {
  public static resolve(conflict: SyncConflict, strategy: ConflictResolutionStrategy, customMergedData?: Record<string, any>): Record<string, any> {
    switch (strategy) {
      case 'server_wins':
        return { ...conflict.remoteData, syncStatus: 'synced' };

      case 'client_wins':
        return { ...conflict.localData, updatedAt: new Date().toISOString(), syncStatus: 'synced' };

      case 'last_write_wins': {
        const localTime = new Date(conflict.localTimestamp).getTime();
        const remoteTime = new Date(conflict.remoteTimestamp).getTime();
        return localTime >= remoteTime
          ? { ...conflict.localData, syncStatus: 'synced' }
          : { ...conflict.remoteData, syncStatus: 'synced' };
      }

      case 'manual':
        return customMergedData
          ? { ...customMergedData, updatedAt: new Date().toISOString(), syncStatus: 'synced' }
          : { ...conflict.remoteData, syncStatus: 'synced' };

      default:
        return { ...conflict.remoteData, syncStatus: 'synced' };
    }
  }
}
