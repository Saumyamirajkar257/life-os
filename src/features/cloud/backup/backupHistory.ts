/**
 * Backup History Local Persistence & Storage Management
 */

import { BackupSnapshot } from '../types/cloudTypes';
import { CLOUD_CONSTANTS } from '../constants/cloudConstants';

const STORAGE_KEY = 'aura_cloud_backup_history';

export class BackupHistoryStore {
  public static getHistory(): BackupSnapshot[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as BackupSnapshot[];
    } catch {
      return [];
    }
  }

  public static saveSnapshot(snapshot: BackupSnapshot): BackupSnapshot[] {
    const current = this.getHistory();
    // Prepend new snapshot
    const updated = [snapshot, ...current].slice(0, CLOUD_CONSTANTS.MAX_BACKUP_HISTORY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('[BackupHistory] LocalStorage full, trimming oldest snapshots:', err);
      // Trim to last 5
      const trimmed = updated.slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
    return updated;
  }

  public static deleteSnapshot(snapshotId: string): BackupSnapshot[] {
    const current = this.getHistory();
    const updated = current.filter((s) => s.id !== snapshotId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  public static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
