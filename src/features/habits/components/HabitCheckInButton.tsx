/**
 * @file HabitCheckInButton.tsx
 * @description Interactive check-in button with motion animations, progress counts, and completion checkmarks.
 * @module Features/Habits/Components/HabitCheckInButton
 */

import React from 'react';
import { Check, Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface HabitCheckInButtonProps {
  currentValue: number;
  targetGoal: number;
  unit: string;
  isCompleted: boolean;
  colorHex?: string;
  onCheckIn: () => void;
  onDecrement?: () => void;
  id?: string;
}

export const HabitCheckInButton: React.FC<HabitCheckInButtonProps> = ({
  currentValue,
  targetGoal,
  unit,
  isCompleted,
  colorHex = '#10b981',
  onCheckIn,
  onDecrement,
  id,
}) => {
  const isMultiStep = targetGoal > 1;

  if (isCompleted) {
    return (
      <div className="flex items-center gap-1.5" id={id}>
        <button
          type="button"
          onClick={onCheckIn}
          className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-emerald-500/20 shadow-md shadow-emerald-950/20"
          title="Mark complete / increment"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Done ({currentValue}/{targetGoal})</span>
        </button>

        {isMultiStep && onDecrement && (
          <button
            type="button"
            onClick={onDecrement}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 text-xs font-mono transition-colors"
            title="Decrement count"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" id={id}>
      <button
        type="button"
        onClick={onCheckIn}
        className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all"
      >
        {isMultiStep ? (
          <>
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {currentValue}/{targetGoal} {unit}
            </span>
          </>
        ) : (
          <>
            <div className="w-3.5 h-3.5 rounded-md border border-neutral-600 hover:border-emerald-400" />
            <span>Check In</span>
          </>
        )}
      </button>

      {currentValue > 0 && onDecrement && (
        <button
          type="button"
          onClick={onDecrement}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 text-xs font-mono transition-colors"
          title="Undo count"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
