/**
 * @file ReleaseNotesModal.tsx
 * @description Modal displaying version changelog and Milestone 9 system updates.
 * @module Features/Settings/Components/Modals/ReleaseNotesModal
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, Shield, Zap, Palette, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Aura Core — Release Notes
                </h3>
                <p className="text-xs font-mono text-[var(--color-text-secondary)]">
                  Milestone 9 System Changelog • v2.4.0
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Changelog Content */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <div className="p-4 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Major Milestone Release
              </span>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Global Settings & Preferences Engine
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Full implementation of Aura Core's global preference management framework, Zustand persistence engine, theme & accent custom property synchronizer, and regional localization suite.
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Key Improvements & Features
              </h5>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <Palette className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Expanded Theme Engine & Accent Palette:</span>
                    <p className="text-[var(--color-text-secondary)]">Added High Contrast, Cyberpunk Neon, Deep Space, and Warm Twilight themes alongside 8 accent presets and custom accent color picker.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Reduced Motion & Performance Controls:</span>
                    <p className="text-[var(--color-text-secondary)]">Instant global control over animation multipliers, system accessibility reduced motion, font scaling, and Developer HUD.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Security & Session Revocation:</span>
                    <p className="text-[var(--color-text-secondary)]">Active user session management, 2FA mock authorization, strict privacy mode, and configurable session timeout limits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Database className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Data Management & Backup Suite:</span>
                    <p className="text-[var(--color-text-secondary)]">Export full JSON snapshots of system state, import configuration files, and execute double-confirmed factory resets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end">
            <Button type="button" variant="primary" onClick={onClose} className="px-6">
              Acknowledge & Dismiss
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
