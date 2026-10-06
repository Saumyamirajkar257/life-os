/**
 * @file LifeScoreOverviewWidget.tsx
 * @description Master Life Score widget presenting overall composite index, status, and delta.
 * @module Features/Analytics/Widgets
 */

import React, { useState } from 'react';
import { useLifeScore } from '../hooks/useLifeScore';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { ArrowUpRight, ArrowDownRight, Info, Activity } from 'lucide-react';

import { SpatialCard } from '@/components/ui/spatial/spatial-card';

export const LifeScoreOverviewWidget: React.FC = () => {
  const { summary } = useLifeScore();
  const { timeRange, setTimeRange } = useAnalyticsStore();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <SpatialCard depth={2} className="w-full p-6 sm:p-8 relative overflow-hidden" gradient>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Life Score</h1>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-300 hover:bg-[var(--color-background)] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-md">
            Your overall picture of how your life is progressing.
          </p>

          {showInfo && (
            <div className="mt-3 p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text-tertiary)] animate-in fade-in slide-in-from-top-2">
              Your Life Score is a composite signal based on your activity across the areas you track in Aura.
            </div>
          )}

          <div className="mt-8 flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
              {summary.overallScore}
            </span>
            <div className="flex flex-col">
              <span className={`flex items-center gap-1 text-sm font-semibold ${summary.netChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.netChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(summary.netChange)} vs previous period
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Last updated today
              </span>
            </div>
          </div>
        </div>

        {/* Right: Period Selector & Visualizer */}
        <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
          {/* Visual Indicator */}
          <div className="hidden md:flex w-16 h-16 rounded-full border-4 border-[var(--color-accent)]/20 items-center justify-center relative self-end">
             <div className="absolute inset-0 rounded-full border-4 border-[var(--color-accent)] border-l-transparent border-b-transparent transform rotate-45" />
             <Activity className="w-6 h-6 text-[var(--color-accent)]" />
          </div>

          <div className="flex items-center gap-1 bg-[var(--color-background)] p-1 rounded-xl border border-[var(--color-border)] w-full md:w-auto overflow-x-auto">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((r) => {
              const labels: Record<string, string> = {
                'daily': 'Today',
                'weekly': '7 Days',
                'monthly': '30 Days',
                'yearly': '1 Year'
              };
              return (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-1 md:flex-none ${
                    timeRange === r
                      ? 'bg-[var(--color-surface-elevated)] text-white shadow-sm border border-[var(--color-border)]'
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] border border-transparent'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </SpatialCard>
  );
};
