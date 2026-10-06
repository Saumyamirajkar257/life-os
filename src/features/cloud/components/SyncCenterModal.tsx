/**
 * Aura Sync Center Modal Component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Clock,
  AlertTriangle,
  Database,
  Sliders,
  Check,
  X,
  History,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { useSyncStore } from '../stores/useSyncStore';
import { useConnectionStore } from '../stores/useConnectionStore';
import { ConflictResolutionStrategy } from '../types/cloudTypes';

interface SyncCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  getLocalStateSnapshot?: () => Record<string, any>;
}

export const SyncCenterModal: React.FC<SyncCenterModalProps> = ({ isOpen, onClose, getLocalStateSnapshot }) => {
  const {
    status,
    lastSyncedAt,
    conflictStrategy,
    setConflictStrategy,
    isAutoSyncEnabled,
    setAutoSyncEnabled,
    triggerSync,
    logs,
    clearHistory,
    conflicts,
  } = useSyncStore();

  const isOnline = useConnectionStore((s) => s.state.isOnline);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'history'>('overview');

  if (!isOpen) return null;

  const handleSyncNow = () => {
    if (getLocalStateSnapshot) {
      const state = getLocalStateSnapshot();
      triggerSync(state, 'manual');
    }
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
          {/* Modal Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  Aura Sync Center
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Milestone 21
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time multi-device synchronization & conflict resolution engine
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

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 px-5 gap-6 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'overview' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudCheck className="w-4 h-4" /> Sync Status
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'settings' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-4 h-4" /> Preferences
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'history' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" /> Sync Logs ({logs.length})
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Hero Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                        status === 'syncing'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-spin'
                          : !isOnline
                          ? 'bg-slate-800 border-slate-700 text-slate-400'
                          : status === 'error'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {!isOnline ? <CloudOff className="w-7 h-7" /> : <RefreshCw className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-slate-100">
                          {!isOnline
                            ? 'Offline Mode Active'
                            : status === 'syncing'
                            ? 'Syncing in progress...'
                            : status === 'error'
                            ? 'Sync Issue Detected'
                            : 'All Systems Synchronized'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Last synced:{' '}
                        {lastSyncedAt
                          ? `${new Date(lastSyncedAt).toLocaleDateString()} at ${new Date(
                              lastSyncedAt
                            ).toLocaleTimeString()}`
                          : 'Never'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSyncNow}
                    disabled={status === 'syncing' || !isOnline}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
                  >
                    <RefreshCw className={`w-4 h-4 ${status === 'syncing' ? 'animate-spin' : ''}`} />
                    Sync Now
                  </button>
                </div>

                {/* Unresolved Conflicts Warning */}
                {conflicts.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{conflicts.length} conflicting record state(s) require resolution.</span>
                    </div>
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Sync Strategy</span>
                    <span className="text-sm font-medium text-slate-200 capitalize">
                      {conflictStrategy.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Automatic Background Sync</span>
                    <span className="text-sm font-medium text-slate-200">
                      {isAutoSyncEnabled ? 'Enabled (Every 30s)' : 'Disabled'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Network Connection</span>
                    <span
                      className={`text-sm font-medium flex items-center gap-1.5 ${
                        isOnline ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
                      />
                      {isOnline ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Automatic Sync</h4>
                    <p className="text-xs text-slate-400">
                      Periodically synchronize state changes in the background
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoSyncEnabled(!isAutoSyncEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      isAutoSyncEnabled ? 'bg-teal-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        isAutoSyncEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-medium text-slate-200">Conflict Resolution Strategy</h4>
                  <p className="text-xs text-slate-400">
                    Choose how concurrent writes from multiple devices are resolved automatically
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'last_write_wins', label: 'Last Write Wins', desc: 'Automatic timestamp resolution' },
                      { id: 'server_wins', label: 'Server Wins', desc: 'Always trust cloud state' },
                      { id: 'client_wins', label: 'Client Wins', desc: 'Always keep local device state' },
                      { id: 'manual', label: 'Manual Prompt', desc: 'Prompt modal on conflict' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setConflictStrategy(opt.id as ConflictResolutionStrategy)}
                        className={`p-3 rounded-lg text-left border transition-all ${
                          conflictStrategy === opt.id
                            ? 'bg-teal-500/10 border-teal-500/40 text-slate-100'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-semibold block text-slate-200">{opt.label}</span>
                        <span className="text-[11px] text-slate-400">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recent Sync Cycles ({logs.length})
                  </h4>
                  {logs.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear History
                    </button>
                  )}
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">No sync logs recorded yet.</div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              log.status === 'completed'
                                ? 'bg-emerald-400'
                                : log.status === 'partial'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <div>
                            <span className="text-slate-200 font-medium capitalize">
                              {log.type} Sync
                            </span>
                            <span className="text-slate-500 ml-2">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400">
                          <span>{log.itemsSynced} items</span>
                          <span>{log.durationMs}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
