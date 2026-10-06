/**
 * @file HabitCard.tsx
 * @description Card component for habit items with progress bars, streak badges, and quick check-in actions.
 * @module Features/Habits/Components/HabitCard
 */

import React from 'react';
import { HabitItem, HabitLog } from '../types/habit.types';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { useHabitUIStore } from '../stores/useHabitUIStore';
import { Flame, Check, Plus, Minus } from 'lucide-react';
import { getTodayDateString } from '../utils/habitDateUtils';

interface HabitCardProps {
  habit: HabitItem;
  todayLog?: HabitLog;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, todayLog }) => {
  const { checkIn, decrement } = useHabitMutations();
  const { openDetailDrawer } = useHabitUIStore();
  const currentValue = todayLog?.value || 0;
  const targetGoal = habit.dailyGoal || 1;
  const isCompletedToday = todayLog?.status === 'completed' || currentValue >= targetGoal;
  const isMultiStep = targetGoal > 1;

  // Streak logic (basic visualization)
  const currentStreak = habit.currentStreak || 0;
  
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    checkIn(habit.id);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrement(habit.id);
  };

  return (
    <div
      onClick={() => openDetailDrawer(habit.id)}
      className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isCompletedToday
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-elevated)]'
      }`}
    >
      {/* Background Progress Bar (if multi-step and partially completed) */}
      {isMultiStep && !isCompletedToday && currentValue > 0 && (
        <div 
          className="absolute inset-0 bg-[var(--color-accent)]/5 transition-all duration-500 ease-out z-0" 
          style={{ width: `${Math.min(100, (currentValue / targetGoal) * 100)}%` }} 
        />
      )}

      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Header: Icon, Category, Streak */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${
              isCompletedToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--color-surface-elevated)]'
            }`}>
              {habit.emoji || '✨'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {habit.category} {habit.timeOfDay && habit.timeOfDay !== 'anytime' ? `· ${habit.timeOfDay}` : ''}
                </span>
              </div>
              <h3 className={`text-base font-semibold transition-colors ${isCompletedToday ? 'text-emerald-400' : 'text-white'}`}>
                {habit.name}
              </h3>
            </div>
          </div>
          
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              {currentStreak}
            </div>
          )}
        </div>

        {/* Description */}
        {habit.description && (
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
            {habit.description}
          </p>
        )}

        {/* Footer: Progress & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-[var(--color-border)]/50">
          <div className="text-sm font-medium text-[var(--color-text-secondary)]">
            {isMultiStep ? (
              <span className={isCompletedToday ? 'text-emerald-400' : ''}>
                {currentValue} / {targetGoal} {habit.dailyGoalUnit || 'times'}
              </span>
            ) : (
              <span>{isCompletedToday ? 'Completed' : 'Pending'}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isMultiStep && currentValue > 0 && !isCompletedToday && (
              <button 
                onClick={handleDecrement}
                className="w-8 h-8 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] hover:text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={handleComplete}
              className={`px-4 py-1.5 rounded flex items-center gap-2 font-medium text-sm transition-all ${
                isCompletedToday
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white'
              }`}
            >
              {isCompletedToday ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> Done
                </>
              ) : isMultiStep ? (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" /> Add {habit.dailyGoalUnit ? `1 ${habit.dailyGoalUnit}` : ''}
                </>
              ) : (
                'Complete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
