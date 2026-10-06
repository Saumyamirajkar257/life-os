/**
 * Synchronization Metrics & System Telemetry
 */

import { SyncHistoryEntry } from '../types/cloudTypes';

export interface SyncAnalyticsReport {
  totalSyncCycles: number;
  successRatePercentage: number;
  avgDurationMs: number;
  totalBytesTransferred: number;
  totalConflictsResolved: number;
}

export class SyncMetrics {
  public static calculateReport(logs: SyncHistoryEntry[]): SyncAnalyticsReport {
    if (!logs || logs.length === 0) {
      return {
        totalSyncCycles: 0,
        successRatePercentage: 100,
        avgDurationMs: 0,
        totalBytesTransferred: 0,
        totalConflictsResolved: 0,
      };
    }

    const totalSyncCycles = logs.length;
    const successful = logs.filter((l) => l.status === 'completed' || l.status === 'partial').length;
    const successRatePercentage = Math.round((successful / totalSyncCycles) * 100);
    const totalDuration = logs.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
    const avgDurationMs = Math.round(totalDuration / totalSyncCycles);
    const totalBytesTransferred = logs.reduce((acc, curr) => acc + (curr.bytesTransferred || 0), 0);
    const totalConflictsResolved = logs.reduce((acc, curr) => acc + (curr.conflictsCount || 0), 0);

    return {
      totalSyncCycles,
      successRatePercentage,
      avgDurationMs,
      totalBytesTransferred,
      totalConflictsResolved,
    };
  }
}
