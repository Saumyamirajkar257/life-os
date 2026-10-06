/**
 * Conflict Detector Engine for Concurrent Local and Remote Modifications
 */

import { SyncConflict } from '../types/cloudTypes';
import { generateUUID } from '../utils/cloudUtils';

export class ConflictDetector {
  /**
   * Evaluates local and remote entity versions to determine if a collision occurred
   */
  public static detectConflict(
    collection: string,
    entityId: string,
    localData: Record<string, any>,
    remoteData: Record<string, any>
  ): SyncConflict | null {
    if (!localData || !remoteData) return null;

    const localTime = new Date(localData.updatedAt || localData.createdAt || 0).getTime();
    const remoteTime = new Date(remoteData.updatedAt || remoteData.createdAt || 0).getTime();

    // Check if both modified within a short window with divergent values
    const hasDivergentFields = Object.keys(localData).some((key) => {
      if (['updatedAt', 'version', 'syncStatus'].includes(key)) return false;
      return JSON.stringify(localData[key]) !== JSON.stringify(remoteData[key]);
    });

    if (hasDivergentFields && Math.abs(localTime - remoteTime) < 300000) {
      // Conflict detected if modified within 5 minutes of each other
      return {
        id: `conflict_${generateUUID()}`,
        collection,
        entityId,
        localData,
        remoteData,
        localTimestamp: localData.updatedAt || new Date().toISOString(),
        remoteTimestamp: remoteData.updatedAt || new Date().toISOString(),
        resolved: false,
      };
    }

    return null;
  }
}
