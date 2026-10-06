/**
 * @file ResetConfirmationModal.tsx
 * @description Confirmation dialog requiring the user to type 'RESET' before purging persistent settings & local storage.
 * @module Features/Settings/Components/Modals/ResetConfirmationModal
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput.trim().toUpperCase() === 'RESET') {
      onConfirmReset();
      setConfirmInput('');
      onClose();
    }
  };

  const isMatches = confirmInput.trim().toUpperCase() === 'RESET';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[var(--color-surface)] border border-rose-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  Confirm Factory Reset
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                  Destructive Action
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono leading-relaxed space-y-1">
            <p className="font-semibold">Warning: This action cannot be undone.</p>
            <p className="text-[11px] text-rose-300/80">
              All custom themes, accent preferences, keyboard shortcut bindings, developer flags, and regional configurations will be permanently restored to factory default settings.
            </p>
          </div>

          <form onSubmit={handleConfirm} className="space-y-4">
            <Input
              label="Type 'RESET' to confirm action"
              placeholder="RESET"
              value={confirmInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmInput(e.target.value)}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!isMatches}
                className="bg-rose-600 hover:bg-rose-500 text-white border-none gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Wipe & Reset System</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
