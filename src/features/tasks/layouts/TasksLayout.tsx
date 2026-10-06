/**
 * @file TasksLayout.tsx
 * @description Master layout wrapper for Tasks Module featuring a clean, productivity-focused header.
 * @module Features/Tasks/Layouts/TasksLayout
 */

import React from 'react';
import { useTasks } from '../hooks/useTasks';

interface TasksLayoutProps {
  children: React.ReactNode;
}

export const TasksLayout: React.FC<TasksLayoutProps> = ({ children }) => {
  const { stats, isSyncedWithFirestore } = useTasks();

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[var(--color-bg)] text-[var(--color-text-primary)]" id="tasks-module-layout">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Tasks
          </h1>
          {isSyncedWithFirestore && (
            <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500/60 animate-pulse" title="Synced with Cloud" />
          )}
        </div>
      </div>
      
      {/* Summary Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-medium">
        {stats.total > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/50">
            <span className="text-white font-semibold">{stats.total}</span> active
          </div>
        )}
        {stats.inboxCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="font-semibold">{stats.inboxCount}</span> today
          </div>
        )}
        {stats.overdueCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="font-semibold">{stats.overdueCount}</span> overdue
          </div>
        )}
        {stats.completedToday > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="font-semibold">{stats.completedToday}</span> completed
          </div>
        )}
      </div>

      {/* Main Content View Container */}
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
};
