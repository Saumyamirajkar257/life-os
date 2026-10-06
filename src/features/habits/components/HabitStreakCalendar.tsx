/**
 * @file HabitStreakCalendar.tsx
 * @description Calendar month grid highlighting daily habit check-ins and completion trends.
 * @module Features/Habits/Components/HabitStreakCalendar
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getMonthDaysGrid, getTodayDateString } from '../utils/habitDateUtils';
import { useHabits } from '../hooks/useHabits';

export const HabitStreakCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { logs } = useHabits();

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const daysGrid = getMonthDaysGrid(year, monthIndex);
  const todayStr = getTodayDateString();

  // Map logs: dateStr -> total completed count
  const logsCountMap = new Map<string, number>();
  logs.forEach((l) => {
    if (l.status === 'completed') {
      logsCountMap.set(l.date, (logsCountMap.get(l.date) || 0) + 1);
    }
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 font-mono text-xs" id="habit-streak-calendar">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-100">{monthName}</h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase font-bold text-neutral-500">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {daysGrid.map((dayItem) => {
          const completedCount = logsCountMap.get(dayItem.dateStr) || 0;
          const isToday = dayItem.dateStr === todayStr;

          return (
            <div
              key={dayItem.dateStr}
              className={`h-10 rounded-xl border p-1 flex flex-col justify-between transition-all ${
                !dayItem.isCurrentMonth
                  ? 'opacity-30 border-neutral-900 bg-neutral-950/40 text-neutral-600'
                  : isToday
                  ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-400 font-bold shadow-sm'
                  : completedCount > 0
                  ? 'border-emerald-800/40 bg-emerald-950/10 text-neutral-200'
                  : 'border-neutral-800/60 bg-neutral-900/60 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span>{dayItem.dayNumber}</span>
                {completedCount > 0 && (
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                )}
              </div>

              {completedCount > 0 && (
                <div className="text-[9px] text-emerald-400 font-bold truncate">
                  {completedCount} check-in{completedCount > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
