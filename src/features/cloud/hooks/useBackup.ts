/**
 * Custom Hook: Backup & Restore Operations
 */

import { useBackupStore } from '../stores/useBackupStore';

export function useBackup() {
  const { backups, isBackingUp, createManualBackup, deleteBackup, autoBackupDaily, setAutoBackupDaily } = useBackupStore();

  return {
    backups,
    isBackingUp,
    createManualBackup,
    deleteBackup,
    autoBackupDaily,
    setAutoBackupDaily,
  };
}
