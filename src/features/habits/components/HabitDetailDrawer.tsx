/**
 * @file HabitDetailDrawer.tsx
 * @description Slide-over detail drawer inspecting single habit statistics, streak history logs, and controls.
 * @module Features/Habits/Components/HabitDetailDrawer
 */

import React from 'react';
import { X, Flame, Sparkles, Edit2, Pause, Play, Archive, Trash2, Calendar, Target, Award } from 'lucide-react';
import { useHabitUIStore } from '../stores/useHabitUIStore';
import { useHabits } from '../hooks/useHabits';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { calculateHabitScore } from '../utils/habitAnalyticsEngine';
import { getPastNDays, formatHumanDate } from '../utils/habitDateUtils';

export const HabitDetailDrawer: React.FC = () => {
  const { isDetailDrawerOpen, closeDetailDrawer, openFormModal } = useHabitUIStore();
  const { activeDetailHabit, logs } = useHabits();
  const { togglePause, toggleArchive, deleteHabit } = useHabitMutations();

  if (!isDetailDrawerOpen || !activeDetailHabit) return null;

  const habitScore = calculateHabitScore(activeDetailHabit, logs);
  const past30Days = getPastNDays(30);

  const habitLogsMap = new Map<string, string>();
  logs
    .filter((l) => l.habitId === activeDetailHabit.id)
    .forEach((l) => habitLogsMap.set(l.date, l.status));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-[var(--color-bg)] border-l border-[var(--color-border)] text-[var(--color-text-primary)] flex flex-col justify-between shadow-2xl"
          id="habit-detail-drawer"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--color-border)]/50">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center text-3xl">
                  {activeDetailHabit.emoji || '✨'}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1 block">
                    {activeDetailHabit.category} {activeDetailHabit.timeOfDay && activeDetailHabit.timeOfDay !== 'anytime' ? `· ${activeDetailHabit.timeOfDay}` : ''}
                  </span>
                  <h2 className="text-xl font-bold text-white leading-tight">{activeDetailHabit.name}</h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDetailDrawer}
                className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
                id="close-habit-drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Body Stats */}
            <div className="space-y-8 text-sm">
              {/* Motivation */}
              {activeDetailHabit.motivationNote && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase text-purple-400 tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Motivation
                  </div>
                  <p className="italic leading-relaxed">"{activeDetailHabit.motivationNote}"</p>
                </div>
              )}

              {/* KPI Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-1">Current Streak</span>
                  <span className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-orange-400" />
                    {activeDetailHabit.currentStreak}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-1">Best Streak</span>
                  <span className="text-2xl font-bold text-emerald-400">{activeDetailHabit.bestStreak}</span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-1">Habit Score</span>
                  <span className="text-2xl font-bold text-purple-400">{habitScore}</span>
                </div>
              </div>

              {/* Description */}
              {activeDetailHabit.description && (
                <div className="space-y-2">
                  <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider">Description</span>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]/50">
                    {activeDetailHabit.description}
                  </p>
                </div>
              )}

              {/* 30-Day Completion History Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Recent History (30 Days)</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  {past30Days.map((day) => {
                    const status = habitLogsMap.get(day);
                    const isCompleted = status === 'completed';
                    const isMissed = status === 'missed';
                    return (
                      <div
                        key={day}
                        className={`aspect-square rounded-sm border ${
                          isCompleted
                            ? 'bg-[var(--color-accent)] border-[var(--color-accent)]/80'
                            : isMissed
                            ? 'bg-rose-500/20 border-rose-500/30'
                            : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)]/50'
                        }`}
                        title={`${formatHumanDate(day)}: ${status || 'Pending'}`}
                      />
                    );
                  })}
                </div>
              </div>
              
              {/* Properties */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2">
                  <Target className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold">Goal</span>
                    <span className="text-white font-medium">{activeDetailHabit.dailyGoal} {activeDetailHabit.dailyGoalUnit || 'times'}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold">Schedule</span>
                    <span className="text-white font-medium capitalize">{activeDetailHabit.frequency.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                closeDetailDrawer();
                openFormModal(activeDetailHabit.id);
              }}
              className="col-span-1 py-2.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-secondary)] hover:text-white flex flex-col items-center gap-1 transition-colors group"
            >
              <Edit2 className="w-4 h-4 group-hover:text-[var(--color-accent)]" />
              <span className="text-[10px] font-bold">Edit</span>
            </button>

            <button
              type="button"
              onClick={() => togglePause(activeDetailHabit.id)}
              className="col-span-1 py-2.5 rounded-lg border border-[var(--color-border)] hover:border-amber-500/50 text-[var(--color-text-secondary)] hover:text-white flex flex-col items-center gap-1 transition-colors group"
            >
              {activeDetailHabit.status === 'paused' ? (
                <>
                  <Play className="w-4 h-4 group-hover:text-amber-400" />
                  <span className="text-[10px] font-bold">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 group-hover:text-amber-400" />
                  <span className="text-[10px] font-bold">Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                toggleArchive(activeDetailHabit.id);
                closeDetailDrawer();
              }}
              className="col-span-1 py-2.5 rounded-lg border border-[var(--color-border)] hover:border-purple-500/50 text-[var(--color-text-secondary)] hover:text-white flex flex-col items-center gap-1 transition-colors group"
            >
              <Archive className="w-4 h-4 group-hover:text-purple-400" />
              <span className="text-[10px] font-bold">
                {activeDetailHabit.status === 'archived' ? 'Unarchive' : 'Archive'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently delete this habit?')) {
                  deleteHabit(activeDetailHabit.id);
                  closeDetailDrawer();
                }
              }}
              className="col-span-1 py-2.5 rounded-lg border border-[var(--color-border)] hover:border-rose-500/50 text-[var(--color-text-secondary)] hover:text-rose-400 flex flex-col items-center gap-1 transition-colors group"
            >
              <Trash2 className="w-4 h-4 group-hover:text-rose-400" />
              <span className="text-[10px] font-bold group-hover:text-rose-400">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
