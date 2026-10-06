/**
 * Sync Queue & Retry Manager
 */

import { OfflineQueue } from '../offline/offlineQueue';
import { SyncHistoryEntry } from '../types/cloudTypes';
import { generateUUID } from '../utils/cloudUtils';

const HISTORY_KEY = 'aura_sync_history_logs';

export class SyncQueueManager {
  public static getHistory(): SyncHistoryEntry[] {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as SyncHistoryEntry[];
    } catch {
      return [];
    }
  }

  public static addHistoryEntry(entry: Omit<SyncHistoryEntry, 'id'>): SyncHistoryEntry[] {
    const history = this.getHistory();
    const newEntry: SyncHistoryEntry = {
      ...entry,
      id: `log_${generateUUID()}`,
    };
    const updated = [newEntry, ...history].slice(0, 30); // Keep last 30 logs
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  }

  public static clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }
}
