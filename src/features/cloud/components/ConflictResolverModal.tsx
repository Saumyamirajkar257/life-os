/**
 * Conflict Resolver Modal Component
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Server, Smartphone, Check, X, Sliders } from 'lucide-react';
import { useConflictResolver } from '../hooks/useConflictResolver';

interface ConflictResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConflictResolverModal: React.FC<ConflictResolverModalProps> = ({ isOpen, onClose }) => {
  const { conflicts, resolveConflict } = useConflictResolver();

  if (!isOpen || conflicts.length === 0) return null;

  const currentConflict = conflicts[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Sync Conflict Detected</h3>
                <p className="text-xs text-slate-400">
                  {conflicts.length} Unresolved State Collision(s) — Select master state
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Local Device Version */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase">
                  <Smartphone className="w-4 h-4" /> Local Device Version
                </div>
                <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/60 font-mono">
                  <p>
                    <span className="text-slate-500">ID:</span> {currentConflict.entityId}
                  </p>
                  <p>
                    <span className="text-slate-500">Modified:</span>{' '}
                    {new Date(currentConflict.localTimestamp).toLocaleTimeString()}
                  </p>
                  <pre className="text-[11px] text-teal-300 overflow-x-auto pt-2">
                    {JSON.stringify(currentConflict.localData, null, 2)}
                  </pre>
                </div>
                <button
                  onClick={() => resolveConflict(currentConflict.id, 'client_wins')}
                  className="w-full py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-medium transition-colors"
                >
                  Keep Local Version
                </button>
              </div>

              {/* Cloud Server Version */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase">
                  <Server className="w-4 h-4" /> Cloud Server Version
                </div>
                <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/60 font-mono">
                  <p>
                    <span className="text-slate-500">ID:</span> {currentConflict.entityId}
                  </p>
                  <p>
                    <span className="text-slate-500">Modified:</span>{' '}
                    {new Date(currentConflict.remoteTimestamp).toLocaleTimeString()}
                  </p>
                  <pre className="text-[11px] text-indigo-300 overflow-x-auto pt-2">
                    {JSON.stringify(currentConflict.remoteData, null, 2)}
                  </pre>
                </div>
                <button
                  onClick={() => resolveConflict(currentConflict.id, 'server_wins')}
                  className="w-full py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-medium transition-colors"
                >
                  Keep Server Version
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => resolveConflict(currentConflict.id, 'last_write_wins')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                Auto-Resolve (Last Write Wins)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
