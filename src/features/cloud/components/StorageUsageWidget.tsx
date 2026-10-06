/**
 * Storage Breakdown Widget Component
 */

import React from 'react';
import { HardDrive, Server, PieChart } from 'lucide-react';
import { useCloudStore } from '../stores/useCloudStore';
import { formatBytes } from '../utils/cloudUtils';

interface StorageUsageWidgetProps {
  getLocalStateSnapshot?: () => Record<string, any>;
}

export const StorageUsageWidget: React.FC<StorageUsageWidgetProps> = ({ getLocalStateSnapshot }) => {
  const { calculateStorageUsage } = useCloudStore();
  const state = getLocalStateSnapshot ? getLocalStateSnapshot() : {};
  const breakdown = calculateStorageUsage(state);

  const percentageUsed = Math.min(100, (breakdown.totalBytesUsed / breakdown.quotaBytes) * 100);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" /> Aura Cloud Vault Storage
          </h3>
          <p className="text-xs text-slate-400">
            {formatBytes(breakdown.totalBytesUsed)} used of {formatBytes(breakdown.quotaBytes)} quota
          </p>
        </div>
        <span className="text-xs text-purple-400 font-semibold">{percentageUsed.toFixed(3)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
        {breakdown.byDomain.map((d) => {
          const widthPct = (d.bytes / breakdown.totalBytesUsed) * 100;
          return (
            <div
              key={d.domain}
              style={{ width: `${Math.max(1, widthPct)}%`, backgroundColor: d.color }}
              className="h-full transition-all"
              title={`${d.label}: ${formatBytes(d.bytes)}`}
            />
          );
        })}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
        {breakdown.byDomain.map((d) => (
          <div key={d.domain} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-300 truncate">{d.label}</span>
            <span className="text-slate-500 text-[10px] ml-auto">{formatBytes(d.bytes)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
