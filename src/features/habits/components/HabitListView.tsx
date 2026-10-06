/**
 * @file HabitListView.tsx
 * @description List view of habit cards with Today's Progress, Weekly Consistency, and Heatmap.
 * @module Features/Habits/Components/HabitListView
 */

import React, { useMemo } from 'react';
import { Sparkles, Plus, Flame, RefreshCcw, AlertCircle } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { HabitCard } from './HabitCard';
import { useHabitUIStore } from '../stores/useHabitUIStore';
import { getTodayDateString, formatHumanDate } from '../utils/habitDateUtils';
import { HabitHeatMap } from './HabitHeatMap';
import { useHabitAnalytics } from '../analytics/useHabitAnalytics';

export const HabitListView: React.FC = () => {
  const { displayedHabits, logMap, stats } = useHabits();
  const { openFormModal, activeView, setActiveView } = useHabitUIStore();
  const { heatMapData } = useHabitAnalytics();
  const todayStr = getTodayDateString();

  const isTodayView = activeView === 'today';

  const progressPct = stats.totalActive > 0 ? Math.round((stats.completedTodayCount / stats.totalActive) * 100) : 0;

  // Extract last 7 days from heatmap data for the weekly view
  const weeklyData = useMemo(() => {
    return heatMapData.slice(-7);
  }, [heatMapData]);

  if (displayedHabits.length === 0 && !isTodayView) {
    return (
      <div
        className="p-12 rounded-2xl bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-center space-y-4 max-w-md mx-auto my-8"
        id="habit-list-empty-state"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mx-auto mb-2">
          <RefreshCcw className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">BUILD YOUR FIRST ROUTINE</h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Small actions become powerful when repeated.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openFormModal()}
          className="mt-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Habit</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="habit-list-container">
      {/* Today's Progress Section */}
      {isTodayView && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
            Today's Progress
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-white leading-none">{stats.completedTodayCount} <span className="text-[var(--color-text-secondary)] text-xl">/ {stats.totalActive}</span></span>
                <span className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">completed</span>
              </div>
              <div className="h-2.5 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            
            {stats.longestActiveStreak > 0 && (
              <div className="shrink-0 flex flex-col items-center justify-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 min-w-[140px]">
                <Flame className="w-6 h-6 text-orange-400 mb-1 fill-orange-400" />
                <span className="text-lg font-bold text-orange-400 leading-none">{stats.longestActiveStreak} day</span>
                <span className="text-[10px] font-bold uppercase text-orange-400/70 tracking-wider mt-1">Consistency Streak</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Missed Habits Gentle Reminder */}
      {isTodayView && stats.totalActive > 0 && stats.completedTodayCount === 0 && (
        <div className="px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text-secondary)] font-medium">No habits completed yet today. Let's recover your momentum!</span>
          </div>
        </div>
      )}

      {/* Grid of Habits */}
      {displayedHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5" id="habit-list-grid">
          {displayedHabits.map((habit) => {
            const todayLog = logMap.get(`${habit.id}_${todayStr}`);
            return <HabitCard key={habit.id} habit={habit} todayLog={todayLog} />;
          })}
        </div>
      ) : isTodayView ? (
        <div className="p-12 rounded-2xl bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-bold text-white">YOUR DAY IS CLEAR</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">No habits scheduled for today.</p>
          <button
            onClick={() => setActiveView('all')}
            className="mt-2 px-5 py-2.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-text-secondary)] text-white font-medium text-sm transition-colors"
          >
            View All Habits
          </button>
        </div>
      ) : null}

      {/* Weekly Consistency & Heatmap (Secondary to Actions) */}
      {isTodayView && (
        <div className="pt-8 space-y-8">
          {/* Weekly view */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
              This Week's Consistency
            </h3>
            <div className="flex items-center justify-between gap-2 max-w-2xl">
              {weeklyData.map((day, idx) => {
                const dateObj = new Date(day.date);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                
                // Determine icon based on intensity
                const isCompleted = day.count > 0;
                
                return (
                  <div key={day.date} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-medium text-[var(--color-text-secondary)] uppercase">{dayName}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : day.date === todayStr 
                          ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                          : 'border-[var(--color-border)] text-[var(--color-border)]'
                    }`}>
                      {isCompleted ? <Sparkles className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <HabitHeatMap />
        </div>
      )}
    </div>
  );
};
