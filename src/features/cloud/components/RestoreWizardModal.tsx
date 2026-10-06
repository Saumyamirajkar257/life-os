/**
 * Point-in-Time Restore Wizard Component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, CheckCircle2, AlertTriangle, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { useBackupStore } from '../stores/useBackupStore';
import { BackupService } from '../services/backupService';

interface RestoreWizardModalProps {
  isOpen: boolean;
  snapshotId: string | null;
  onClose: () => void;
  onConfirmRestore?: (restoreData: Record<string, any>) => void;
}

export const RestoreWizardModal: React.FC<RestoreWizardModalProps> = ({
  isOpen,
  snapshotId,
  onClose,
  onConfirmRestore,
}) => {
  const backups = useBackupStore((s) => s.backups);
  const snapshot = backups.find((b) => b.id === snapshotId);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    snapshot ? snapshot.domainsIncluded : []
  );

  if (!isOpen || !snapshot) return null;

  const preview = BackupService.previewRestore(snapshot, selectedDomains);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleExecuteRestore = () => {
    if (onConfirmRestore) {
      onConfirmRestore(preview.data);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Point-in-Time System Restore</h3>
                <p className="text-xs text-slate-400">
                  Step {step} of 3 — Selective Domain Snapshot Recovery
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

          <div className="p-6 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider block">
                    Selected Snapshot Target
                  </span>
                  <h4 className="text-base font-semibold text-slate-100">{snapshot.name}</h4>
                  <p className="text-xs text-slate-400">
                    Created: {new Date(snapshot.createdAt).toLocaleString()} • {snapshot.itemCount} Total Records
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium text-xs flex items-center gap-2 transition-all"
                  >
                    Configure Selective Domains <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-200">
                  Select Modules & Domains to Restore:
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {snapshot.domainsIncluded.map((dom) => {
                    const isChecked = selectedDomains.includes(dom);
                    const count = Array.isArray(snapshot.data[dom]) ? snapshot.data[dom].length : 0;
                    return (
                      <button
                        key={dom}
                        onClick={() => toggleDomain(dom)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-teal-500/10 border-teal-500/40 text-slate-100'
                            : 'bg-slate-800/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-semibold block capitalize">{dom}</span>
                          <span className="text-[11px] text-slate-400">{count} items</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-teal-500 border-teal-500 text-slate-950'
                              : 'border-slate-700'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={selectedDomains.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    Review & Confirm <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-amber-200">Confirmation Required</span>
                    Restoring this snapshot will merge/overwrite current live state for selected domains ({selectedDomains.join(', ')}).
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Records to Restore:</span>
                    <span className="font-semibold text-teal-400">{preview.totalRecordsToRestore}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleExecuteRestore}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                  >
                    <RotateCcw className="w-4 h-4" /> Execute Snapshot Restore
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
