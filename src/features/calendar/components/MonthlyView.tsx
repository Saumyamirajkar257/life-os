/**
 * @file MonthlyView.tsx
 * @description Master month matrix calendar view with compact indicators for events and deadlines.
 * @module Features/Calendar/Components
 */

import React from 'react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarStore } from '../stores/useCalendarStore';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { useGoalStore } from '@/features/goals/stores/useGoalStore';
import { getMonthGrid, toIsoDateString, getCategoryConfig } from '../utils/calendarUtils';
import { Plus } from 'lucide-react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthlyView: React.FC = () => {
  const { currentDate, setCurrentDate, setViewMode, openCreateModal } = useCalendarUIStore();
  const events = useCalendarStore(state => state.events);
  const tasks = useTaskStore(state => state.tasks);
  const milestones = useGoalStore(state => state.milestones);

  const [year, month] = currentDate.split('-').map(Number);
  const monthGrid = getMonthGrid(year, month - 1);
  const todayStr = toIsoDateString(new Date());

  const navigateToDay = (dateStr: string) => {
    setCurrentDate(dateStr);
    setViewMode('day');
  };

  return (
    <div className="flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        {DAYS_OF_WEEK.map((dayName) => (
          <div key={dayName} className="p-3 text-center text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {dayName}
          </div>
        ))}
      </div>

      {/* Month Matrix Grid */}
      <div className="grid grid-cols-7 border-l border-t border-[var(--color-border)]/50 bg-[var(--color-surface)]">
        {monthGrid.map((dateObj, i) => {
          const dateStr = toIsoDateString(dateObj);
          const isCurrentMonth = dateObj.getMonth() === month - 1;
          const isToday = dateStr === todayStr;

          // Collect items for this day
          const dayEvents = events.filter((e) => e.status !== 'archived' && e.startDate <= dateStr && e.endDate >= dateStr);
          const dayTasks = tasks.filter((t) => t.status !== 'archived' && t.dueDate === dateStr);
          const dayMilestones = milestones.filter((m) => m.dueDate === dateStr);

          const totalItems = dayEvents.length + dayTasks.length + dayMilestones.length;
          const isBusy = totalItems > 3;

          return (
            <div
              key={`${dateStr}-${i}`}
              className={`min-h-[120px] p-2 flex flex-col border-r border-b border-[var(--color-border)]/50 group transition-colors cursor-pointer hover:bg-[var(--color-surface-elevated)]/30 ${
                !isCurrentMonth ? 'opacity-40 bg-[var(--color-surface-elevated)]' : ''
              }`}
              onClick={() => navigateToDay(dateStr)}
            >
              {/* Date Header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isToday
                      ? 'bg-[var(--color-accent)] text-white shadow-sm shadow-[var(--color-accent)]/30'
                      : 'text-[var(--color-text-secondary)] group-hover:text-white group-hover:bg-[var(--color-surface-elevated)]'
                  }`}
                >
                  {dateObj.getDate()}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCreateModal(dateStr, '09:00');
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-accent)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
                  title="Add Event"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Compact Event Indicators */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 2).map(evt => {
                  const catConfig = getCategoryConfig(evt.category);
                  return (
                    <div key={evt.id} className={`px-1.5 py-0.5 rounded text-[10px] font-bold truncate flex items-center gap-1.5 border ${catConfig.bgClass}`}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: evt.color || catConfig.color }} />
                      <span className="truncate">{evt.title}</span>
                    </div>
                  );
                })}
                {dayTasks.slice(0, 2 - Math.min(dayEvents.length, 2)).map(task => (
                  <div key={task.id} className="px-1.5 py-0.5 rounded text-[10px] font-bold truncate flex items-center gap-1.5 bg-[var(--color-surface-elevated)] border border-purple-500/30 text-white">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-400" />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}

                {totalItems > 2 && (
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] pl-1 mt-0.5">
                    +{totalItems - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
