/**
 * @file HabitsLayout.tsx
 * @description Header for Habits module with clean summary layout.
 * @module Features/Habits/Layouts/HabitsLayout
 */

import React from 'react';
import { useHabits } from '../hooks/useHabits';

export const HabitsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stats, isSyncedWithFirestore } = useHabits();

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[var(--color-bg)] text-[var(--color-text-primary)]" id="habits-layout-root">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Habits
          </h1>
          {isSyncedWithFirestore && (
            <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500/60 animate-pulse" title="Synced with Cloud" />
          )}
        </div>
      </div>
      
      {/* Subtitle */}
      <p className="text-[var(--color-text-secondary)] text-sm mb-5">
        Build consistency, one day at a time.
      </p>

      {/* Summary Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-medium">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/50">
          <span className="text-white font-semibold">{stats.totalActive}</span> active
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="font-semibold">{stats.completedTodayCount}</span> completed today
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <span className="font-semibold">{stats.consistencyScore}%</span> consistency
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 flex flex-col">{children}</main>
    </div>
  );
};
