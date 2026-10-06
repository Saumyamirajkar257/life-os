/**
 * Snapshot Generation Engine for Backup System
 */

import { BackupSnapshot } from '../types/cloudTypes';
import { generateUUID, calculateChecksum } from '../utils/cloudUtils';
import { CLOUD_CONSTANTS } from '../constants/cloudConstants';

export class SnapshotEngine {
  public static createSnapshot(
    data: Record<string, any>,
    type: 'auto_daily' | 'manual' | 'pre_migration' = 'manual',
    customName?: string,
    domainsIncluded?: string[]
  ): BackupSnapshot {
    const included = domainsIncluded || Object.keys(data).filter((k) => k !== 'schemaVersion');
    const filteredData: Record<string, any> = {};
    let itemCount = 0;

    included.forEach((dom) => {
      if (data[dom] && Array.isArray(data[dom])) {
        filteredData[dom] = data[dom];
        itemCount += data[dom].length;
      }
    });

    const jsonString = JSON.stringify(filteredData);
    const sizeBytes = new Blob([jsonString]).size;
    const checksum = calculateChecksum(filteredData);
    const dateStr = new Date().toISOString();

    const snapshot: BackupSnapshot = {
      id: `snapshot_${generateUUID()}`,
      name: customName || `Snapshot ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: dateStr,
      sizeBytes,
      version: CLOUD_CONSTANTS.APP_VERSION,
      type,
      domainsIncluded: included,
      itemCount,
      encrypted: false,
      checksum,
      data: filteredData,
    };

    return snapshot;
  }
}
