/**
 * Top Bar Cloud & Sync Status Banner / Pill Indicator
 */

import React from 'react';
import { CloudCheck, RefreshCw, CloudOff, AlertTriangle } from 'lucide-react';
import { useSyncStore } from '../stores/useSyncStore';
import { useConnectionStore } from '../stores/useConnectionStore';

interface CloudStatusBannerProps {
  onOpenSyncCenter: () => void;
  onOpenConflictResolver?: () => void;
}

export const CloudStatusBanner: React.FC<CloudStatusBannerProps> = ({ onOpenSyncCenter, onOpenConflictResolver }) => {
  const status = useSyncStore((s) => s.status);
  const conflicts = useSyncStore((s) => s.conflicts);
  const isOnline = useConnectionStore((s) => s.state.isOnline);

  if (conflicts.length > 0) {
    return (
      <button
        onClick={onOpenConflictResolver || onOpenSyncCenter}
        className="px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-all animate-pulse"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>{conflicts.length} Sync Conflict(s)</span>
      </button>
    );
  }

  if (!isOnline) {
    return (
      <button
        onClick={onOpenSyncCenter}
        className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
      >
        <CloudOff className="w-3.5 h-3.5" />
        <span>Offline Mode</span>
      </button>
    );
  }

  if (status === 'syncing') {
    return (
      <button
        onClick={onOpenSyncCenter}
        className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
        <span>Syncing Cloud...</span>
      </button>
    );
  }

  return (
    <button
      onClick={onOpenSyncCenter}
      className="px-3 py-1 rounded-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-medium flex items-center gap-1.5 transition-all"
    >
      <CloudCheck className="w-3.5 h-3.5 text-teal-400" />
      <span>Aura Cloud Synced</span>
    </button>
  );
};
