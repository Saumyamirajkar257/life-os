/**
 * Backup Service Façade
 */

import { BackupSnapshot } from '../types/cloudTypes';
import { SnapshotEngine } from '../backup/snapshotEngine';
import { BackupHistoryStore } from '../backup/backupHistory';
import { RestoreEngine, RestorePreview } from '../backup/restoreEngine';

export class BackupService {
  public static createBackup(
    data: Record<string, any>,
    type: 'auto_daily' | 'manual' | 'pre_migration' = 'manual',
    customName?: string,
    domainsIncluded?: string[]
  ): BackupSnapshot {
    const snapshot = SnapshotEngine.createSnapshot(data, type, customName, domainsIncluded);
    BackupHistoryStore.saveSnapshot(snapshot);
    return snapshot;
  }

  public static getBackupHistory(): BackupSnapshot[] {
    return BackupHistoryStore.getHistory();
  }

  public static deleteBackup(snapshotId: string): BackupSnapshot[] {
    return BackupHistoryStore.deleteSnapshot(snapshotId);
  }

  public static previewRestore(snapshot: BackupSnapshot, selectedDomains?: string[]): RestorePreview {
    return RestoreEngine.generateRestorePreview(snapshot, selectedDomains);
  }
}
