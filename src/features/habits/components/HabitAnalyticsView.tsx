/**
 * @file HabitAnalyticsView.tsx
 * @description Master analytics view assembling consistency metrics, heat maps, category performance charts, and motivation badges.
 * @module Features/Habits/Components/HabitAnalyticsView
 */

import React from 'react';
import { BarChart2, Target, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import { useHabitAnalytics } from '../analytics/useHabitAnalytics';
import { useHabits } from '../hooks/useHabits';
import { HabitHeatMap } from './HabitHeatMap';
import { HabitMotivationPanel } from './HabitMotivationPanel';

export const HabitAnalyticsView: React.FC = () => {
  const { categoryBreakdown, consistencyScore } = useHabitAnalytics();
  const { stats } = useHabits();

  return (
    <div className="space-y-6" id="habit-analytics-view">
      {/* Top Stat Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
            <Target className="w-4 h-4 text-purple-400" /> Consistency
          </span>
          <span className="text-3xl font-bold text-white block">{consistencyScore}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
            <Flame className="w-4 h-4 text-orange-400" /> Best Streak
          </span>
          <span className="text-3xl font-bold text-white block">{stats.longestActiveStreak} <span className="text-lg text-[var(--color-text-secondary)]">d</span></span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Today
          </span>
          <span className="text-3xl font-bold text-white block">{stats.todayCompletionRate}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-4 h-4 text-sky-400" /> Total Check-ins
          </span>
          <span className="text-3xl font-bold text-white block">{stats.totalCheckInsLifetime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HabitHeatMap />
          <HabitMotivationPanel />
        </div>

        {/* Category Breakdown Progress */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm h-full">
          <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[var(--color-accent)]" /> Category Performance
          </h3>

          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-medium uppercase tracking-wider text-[11px]">{cat.category}</span>
                  <span className="text-[var(--color-text-secondary)] font-medium text-xs">{cat.completed} / {cat.total} active</span>
                </div>
                <div className="h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${cat.rate}%` }}
                  />
                </div>
              </div>
            ))}
            
            {categoryBreakdown.length === 0 && (
              <div className="text-sm text-[var(--color-text-secondary)] text-center py-6">
                No active habits in any category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
