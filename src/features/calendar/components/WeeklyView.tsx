/**
 * @file WeeklyView.tsx
 * @description 7-day calendar column view with hourly rows, events, and scheduled tasks.
 * @module Features/Calendar/Components
 */

import React from 'react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarStore } from '../stores/useCalendarStore';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { getDaysInWeek, toIsoDateString, get24HourSlots, getCategoryConfig } from '../utils/calendarUtils';
import { CheckSquare } from 'lucide-react';

export const WeeklyView: React.FC = () => {
  const { currentDate, setSelectedEventDetail, openCreateModal } = useCalendarUIStore();
  const events = useCalendarStore(state => state.events);
  const tasks = useTaskStore(state => state.tasks);

  const weekDays = getDaysInWeek(new Date(currentDate));
  const todayStr = toIsoDateString(new Date());
  const hours = get24HourSlots();

  return (
    <div className="flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm h-full max-h-[800px]">
      {/* Week Column Header */}
      <div className="grid grid-cols-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] divide-x divide-[var(--color-border)]/50">
        <div className="p-3 text-center text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-center">Time</div>
        {weekDays.map((day) => {
          const dateStr = toIsoDateString(day);
          const isToday = dateStr === todayStr;
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = day.getDate();

          return (
            <div
              key={dateStr}
              className={`p-3 text-center flex flex-col items-center justify-center transition-colors ${
                isToday ? 'bg-[var(--color-accent)]/10' : ''
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>{dayName}</span>
              <span
                className={`mt-1 w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                  isToday
                    ? 'bg-[var(--color-accent)] text-white shadow-sm shadow-[var(--color-accent)]/30'
                    : 'text-white'
                }`}
              >
                {dayNum}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hourly Grid Rows */}
      <div className="overflow-y-auto flex-1 divide-y divide-[var(--color-border)]/50 bg-[var(--color-surface)]">
        {hours.map((slot) => (
          <div key={slot.hour} className="grid grid-cols-8 divide-x divide-[var(--color-border)]/50 min-h-[60px] group">
            {/* Time Slot Label */}
            <div className="p-2 text-right text-[10px] font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)]/30 select-none">
              {slot.label.split(' ')[0]}
            </div>

            {/* 7 Day Slots */}
            {weekDays.map((day) => {
              const dateStr = toIsoDateString(day);

              // Events
              const slotEvents = events.filter((e) => {
                if (e.status === 'archived') return false;
                if (e.startDate > dateStr || e.endDate < dateStr) return false;
                if (e.isAllDay) return slot.hour === 0; // Show all-day events in the 12AM slot
                const hour = parseInt(e.startTime.split(':')[0], 10);
                return hour === slot.hour;
              });

              // Tasks
              const slotTasks = tasks.filter((t) => {
                if (t.status === 'archived') return false;
                if (t.dueDate !== dateStr) return false;
                if (!t.dueTime) return false;
                const hour = parseInt(t.dueTime.split(':')[0], 10);
                return hour === slot.hour;
              });

              const totalItems = slotEvents.length + slotTasks.length;
              const isOverloaded = totalItems > 3;

              return (
                <div
                  key={dateStr}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      const hourStr = String(slot.hour).padStart(2, '0');
                      openCreateModal(dateStr, `${hourStr}:00`);
                    }
                  }}
                  className="p-1 relative hover:bg-[var(--color-surface-elevated)]/50 transition-colors cursor-pointer flex flex-col gap-1 overflow-hidden"
                >
                  {isOverloaded ? (
                    <div className="flex flex-col items-center justify-center h-full text-[10px] font-bold text-[var(--color-text-secondary)]">
                      <span className="bg-[var(--color-surface-elevated)] px-2 py-1 rounded-md border border-[var(--color-border)]">
                        {totalItems} items
                      </span>
                    </div>
                  ) : (
                    <>
                      {slotEvents.map((evt) => {
                        const catConfig = getCategoryConfig(evt.category);
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventDetail(evt);
                            }}
                            className="p-1.5 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-text-secondary)] text-left text-[10px] font-bold truncate transition-colors cursor-pointer flex items-center gap-1.5"
                            title={`${evt.title} (${evt.startTime} - ${evt.endTime})`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: evt.color || catConfig.color }}
                            />
                            <span className="truncate text-white">{evt.title}</span>
                          </div>
                        );
                      })}
                      {slotTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-1.5 rounded bg-[var(--color-surface-elevated)] border border-purple-500/30 text-left text-[10px] font-bold truncate transition-colors cursor-default flex items-center gap-1.5"
                          title={`${task.title} (Due: ${task.dueTime})`}
                        >
                          <CheckSquare className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate text-white">{task.title}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
