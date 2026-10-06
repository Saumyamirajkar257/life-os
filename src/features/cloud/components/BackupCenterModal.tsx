/**
 * Aura Backup Center Modal Component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Plus, Download, Trash2, RotateCcw, ShieldCheck, X, HardDrive, Calendar } from 'lucide-react';
import { useBackupStore } from '../stores/useBackupStore';
import { formatBytes } from '../utils/cloudUtils';

interface BackupCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRestoreWizard?: (snapshotId: string) => void;
  getLocalStateSnapshot?: () => Record<string, any>;
}

export const BackupCenterModal: React.FC<BackupCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenRestoreWizard,
  getLocalStateSnapshot,
}) => {
  const { backups, isBackingUp, createManualBackup, deleteBackup, autoBackupDaily, setAutoBackupDaily } =
    useBackupStore();
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCreateBackup = () => {
    if (getLocalStateSnapshot) {
      const state = getLocalStateSnapshot();
      createManualBackup(state, customName.trim() || undefined);
      setCustomName('');
    }
  };

  const handleDownloadBackup = (snapshot: any) => {
    const jsonStr = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_backup_${snapshot.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Aura Backup & Vault</h3>
                <p className="text-xs text-slate-400">
                  Full system snapshot management, point-in-time recovery & local vaults
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Create Snapshot Banner */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
              <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" /> Create Immediate System Snapshot
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Snapshot name (optional, e.g. Pre-Update Backup)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={handleCreateBackup}
                  disabled={isBackingUp}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-medium text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Database className="w-4 h-4" /> Create Snapshot
                </button>
              </div>
            </div>

            {/* Auto Backup Toggle */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Automatic Daily Vault Backups
                </h4>
                <p className="text-xs text-slate-400">
                  Automatically take daily snapshots of all OS domains
                </p>
              </div>
              <button
                onClick={() => setAutoBackupDaily(!autoBackupDaily)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoBackupDaily ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoBackupDaily ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Backups List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Saved Vault Snapshots ({backups.length})
              </h4>

              {backups.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">No snapshots saved yet.</div>
              ) : (
                <div className="space-y-3">
                  {backups.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-200">{s.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                            {s.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{new Date(s.createdAt).toLocaleString()}</span>
                          <span>• {s.itemCount} records</span>
                          <span>• {formatBytes(s.sizeBytes)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleDownloadBackup(s)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                          title="Download Snapshot"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {onOpenRestoreWizard && (
                          <button
                            onClick={() => onOpenRestoreWizard(s.id)}
                            className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 text-xs flex items-center gap-1 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </button>
                        )}
                        <button
                          onClick={() => deleteBackup(s.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
