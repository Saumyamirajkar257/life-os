/**
 * Backup State Store (Zustand)
 */

import { create } from 'zustand';
import { BackupSnapshot } from '../types/cloudTypes';
import { BackupService } from '../services/backupService';

interface BackupStoreState {
  backups: BackupSnapshot[];
  isBackingUp: boolean;
  isRestoring: boolean;
  autoBackupDaily: boolean;

  // Actions
  setAutoBackupDaily: (enabled: boolean) => void;
  createManualBackup: (data: Record<string, any>, name?: string, domains?: string[]) => BackupSnapshot;
  deleteBackup: (snapshotId: string) => void;
  refreshBackups: () => void;
}

export const useBackupStore = create<BackupStoreState>((set) => ({
  backups: BackupService.getBackupHistory(),
  isBackingUp: false,
  isRestoring: false,
  autoBackupDaily: true,

  setAutoBackupDaily: (autoBackupDaily) => set({ autoBackupDaily }),

  createManualBackup: (data, name, domains) => {
    set({ isBackingUp: true });
    const snapshot = BackupService.createBackup(data, 'manual', name, domains);
    set({ backups: BackupService.getBackupHistory(), isBackingUp: false });
    return snapshot;
  },

  deleteBackup: (snapshotId) => {
    const updated = BackupService.deleteBackup(snapshotId);
    set({ backups: updated });
  },

  refreshBackups: () => {
    set({ backups: BackupService.getBackupHistory() });
  },
}));
