/**
 * @file CloudScreen.tsx
 * @description Cloud & Sync Hub Screen
 * @module Features/Cloud
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cloud,
  CloudLightning,
  RefreshCw,
  Database,
  Download,
  Upload,
  AlertTriangle,
  HardDrive,
  Activity,
  ServerCrash,
  CheckCircle2,
  Settings2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  SyncCenterModal,
  BackupCenterModal,
  RestoreWizardModal,
  ConflictResolverModal,
  DeviceListWidget,
  ConnectionStatusWidget,
  StorageUsageWidget,
} from './components';
import { useSyncStore } from './stores/useSyncStore';
import { useBackupStore } from './stores/useBackupStore';
import { useOfflineMode } from './hooks/useOfflineMode';
import { ImportExportService } from './services/importExportService';

interface CloudScreenProps {
  getLocalStateSnapshot?: () => Record<string, any>;
  onRestoreState?: (state: Record<string, any>) => void;
}

export const CloudScreen: React.FC<CloudScreenProps> = ({ getLocalStateSnapshot, onRestoreState }) => {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [restoreSnapshotId, setRestoreSnapshotId] = useState<string | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { status, conflicts, triggerSync, lastSyncedAt } = useSyncStore();
  const { backups, createManualBackup } = useBackupStore();
  const { isOffline, pendingQueueCount } = useOfflineMode();

  const handleManualSync = () => {
    if (getLocalStateSnapshot) {
      const state = getLocalStateSnapshot();
      triggerSync(state, 'manual');
    }
  };

  const handleExportJSON = () => {
    if (!getLocalStateSnapshot) return;
    const data = getLocalStateSnapshot();
    const result = ImportExportService.exportData(data, {
      format: 'json',
      domains: ['tasks', 'habits', 'goals', 'events', 'journals', 'notes', 'transactions'],
    });

    const blob = new Blob([result.content as string], { type: result.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFromSnapshot = (restoreData: Record<string, any>) => {
    if (onRestoreState) {
      onRestoreState(restoreData);
    }
  };

  const getStatusDisplay = () => {
    if (isOffline) {
      return {
        icon: <CloudLightning className="w-5 h-5 text-slate-400" />,
        text: "Offline",
        color: "text-slate-400",
        bg: "bg-slate-500/10",
        message: "You're offline. Changes will sync when a connection is available.",
        border: "border-slate-500/20"
      };
    }
    if (conflicts.length > 0) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        text: "Needs attention",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        message: "Some changes need your attention before they can sync.",
        border: "border-amber-500/20"
      };
    }
    if (status === 'error') {
      return {
        icon: <ServerCrash className="w-5 h-5 text-rose-400" />,
        text: "Sync Error",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        message: "We encountered a problem while syncing. Try again later.",
        border: "border-rose-500/20"
      };
    }
    if (status === 'syncing') {
      return {
        icon: <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />,
        text: "Syncing...",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        message: "Syncing your changes with the cloud.",
        border: "border-blue-500/20"
      };
    }
    return {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      text: "Synced",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      message: "Your data is safely synced to the cloud.",
      border: "border-emerald-500/20"
    };
  };

  const currentStatus = getStatusDisplay();

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] pb-8">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Cloud & Sync</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage how your Aura data is synchronized and backed up.
          </p>
        </div>

        {/* Status Card */}
        <div className={`p-6 rounded-3xl border ${currentStatus.border} bg-[var(--color-surface)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${currentStatus.bg}`}>
              {currentStatus.icon}
            </div>
            <div>
              <h2 className={`text-lg font-bold ${currentStatus.color}`}>{currentStatus.text}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{currentStatus.message}</p>
              
              {lastSyncedAt && !isOffline && status !== 'syncing' && status !== 'error' && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--color-text-tertiary)]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last synced recently</span>
                </div>
              )}
              {isOffline && pendingQueueCount > 0 && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--color-text-tertiary)]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{pendingQueueCount} changes waiting to sync</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {conflicts.length > 0 && (
              <button
                onClick={() => setIsConflictModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold text-xs transition-colors shadow-sm"
              >
                Resolve Conflicts
              </button>
            )}
            <button
              onClick={handleManualSync}
              disabled={status === 'syncing' || isOffline}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)] font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${status === 'syncing' ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backups Section */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center">
                <Database className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Backups</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Save a copy of your Aura data that you can restore later. You currently have {backups.length} snapshots.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)] text-xs font-semibold transition-colors"
            >
              Manage Backups
            </button>
          </div>

          {/* Import / Export Section */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Data Ownership</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Download your Aura data for your own records, or import compatible data into this workspace.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportJSON}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)] text-xs font-semibold transition-colors"
              >
                Export Data
              </button>
              {/* Import button placeholder - assuming functionality exists in modal or separate route */}
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-white border border-transparent text-xs font-semibold transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Advanced System Information */}
        <div className="pt-8">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors px-2 py-1"
          >
            <Settings2 className="w-4 h-4" />
            {showAdvanced ? 'Hide Advanced Diagnostics' : 'Show Advanced Diagnostics'}
          </button>
          
          {showAdvanced && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <StorageUsageWidget getLocalStateSnapshot={getLocalStateSnapshot} />
              <DeviceListWidget />
              <div className="md:col-span-2">
                 <ConnectionStatusWidget />
              </div>
            </motion.div>
          )}
        </div>

      </div>

      {/* Modals */}
      <SyncCenterModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        getLocalStateSnapshot={getLocalStateSnapshot}
      />

      <BackupCenterModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onOpenRestoreWizard={(id) => setRestoreSnapshotId(id)}
        getLocalStateSnapshot={getLocalStateSnapshot}
      />

      <RestoreWizardModal
        isOpen={restoreSnapshotId !== null}
        snapshotId={restoreSnapshotId}
        onClose={() => setRestoreSnapshotId(null)}
        onConfirmRestore={handleRestoreFromSnapshot}
      />

      <ConflictResolverModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
      />
    </div>
  );
};
