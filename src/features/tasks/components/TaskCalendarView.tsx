/**
 * @file TaskCalendarView.tsx
 * @description Monthly grid calendar component displaying tasks mapped to due dates.
 * @module Features/Tasks/Components/TaskCalendarView
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { TaskItem } from '../types/task.types';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { PRIORITY_CONFIG } from '../constants/taskConstants';

interface TaskCalendarViewProps {
  tasks: TaskItem[];
}

export const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { openDetailDrawer, openFormModal } = useTaskUIStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  // Generate calendar grid cells
  const gridCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    gridCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    gridCells.push(day);
  }

  const getDayString = (day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  return (
    <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 space-y-4" id="task-calendar-view">
      {/* Calendar Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h2 className="text-base font-bold text-neutral-100 font-mono tracking-wide">{monthName}</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={todayMonth}
            className="px-3 py-1 rounded-lg text-xs font-mono bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={prevMonth}
              className="p-1 text-neutral-400 hover:text-neutral-100 rounded hover:bg-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 text-neutral-400 hover:text-neutral-100 rounded hover:bg-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono text-neutral-500 py-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="uppercase font-semibold tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {gridCells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[100px] bg-neutral-950/30 rounded-xl border border-neutral-900/40 p-2 opacity-30"
              />
            );
          }

          const dateStr = getDayString(day);
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(dateStr));

          return (
            <div
              key={dateStr}
              className={`min-h-[105px] rounded-xl border p-2 flex flex-col justify-between transition-colors ${
                isToday
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-mono font-bold ${
                    isToday ? 'text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full' : 'text-neutral-400'
                  }`}
                >
                  {day}
                </span>

                <button
                  type="button"
                  onClick={() => openFormModal(null, 'Inbox')}
                  className="opacity-0 hover:opacity-100 p-0.5 text-neutral-500 hover:text-emerald-400 rounded"
                  title="Add task on date"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Day Tasks List */}
              <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-none">
                {dayTasks.map((t) => {
                  const pInfo = PRIORITY_CONFIG[t.priority];
                  return (
                    <div
                      key={t.id}
                      onClick={() => openDetailDrawer(t.id)}
                      className={`p-1.5 rounded text-[10px] font-medium truncate cursor-pointer border ${pInfo.bg} ${pInfo.color} ${pInfo.border} hover:brightness-125`}
                    >
                      {t.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
