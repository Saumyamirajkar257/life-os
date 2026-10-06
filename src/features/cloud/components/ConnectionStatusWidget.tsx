/**
 * Connection Status & Latency Monitoring Widget
 */

import React from 'react';
import { Wifi, WifiOff, Activity, Clock, RefreshCw } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { useOfflineMode } from '../hooks/useOfflineMode';

export const ConnectionStatusWidget: React.FC = () => {
  const { isOnline, lastChecked, rttMs } = useConnectionStatus();
  const { pendingQueueCount, clearQueue } = useOfflineMode();

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
          Network Infrastructure Status
        </h3>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border flex items-center gap-1.5 ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <span className="text-slate-400 block mb-1">Latency RTT</span>
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            {rttMs !== undefined ? `${rttMs} ms` : 'Optimal'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <span className="text-slate-400 block mb-1">Pending Offline Actions</span>
          <span className="font-semibold text-slate-200">{pendingQueueCount} queued</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <span className="text-slate-400 block mb-1">Last Connectivity Check</span>
          <span className="font-semibold text-slate-200">
            {new Date(lastChecked).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {pendingQueueCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={clearQueue}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            Clear Offline Action Queue
          </button>
        </div>
      )}
    </div>
  );
};
