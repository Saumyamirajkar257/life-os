/**
 * Snapshot Restore Engine with Selective Domain Restore support
 */

import { BackupSnapshot } from '../types/cloudTypes';

export interface RestorePreview {
  snapshotId: string;
  createdAt: string;
  domainsToRestore: string[];
  totalRecordsToRestore: number;
  data: Record<string, any>;
}

export class RestoreEngine {
  public static generateRestorePreview(snapshot: BackupSnapshot, selectedDomains?: string[]): RestorePreview {
    const domainsToRestore = selectedDomains || snapshot.domainsIncluded;
    let totalRecordsToRestore = 0;
    const restoreData: Record<string, any> = {};

    domainsToRestore.forEach((dom) => {
      if (snapshot.data[dom]) {
        restoreData[dom] = snapshot.data[dom];
        if (Array.isArray(snapshot.data[dom])) {
          totalRecordsToRestore += snapshot.data[dom].length;
        }
      }
    });

    return {
      snapshotId: snapshot.id,
      createdAt: snapshot.createdAt,
      domainsToRestore,
      totalRecordsToRestore,
      data: restoreData,
    };
  }
}
