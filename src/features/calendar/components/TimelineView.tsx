/**
 * @file TimelineView.tsx
 * @description Horizontal Gantt-style timeline view showing events across multiple days and weeks.
 * @module Features/Calendar/Components
 */

import React from 'react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { getDaysInWeek, toIsoDateString, getCategoryConfig } from '../utils/calendarUtils';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { currentDate, setSelectedEventDetail } = useCalendarUIStore();
  const { events } = useCalendarEvents();

  const weekDays = getDaysInWeek(new Date(currentDate));

  return (
    <div className="flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Horizontal Timeline Header Days */}
      <div className="grid grid-cols-8 bg-slate-950/80 border-b border-slate-800/80 divide-x divide-slate-800/60">
        <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule Bar</div>
        {weekDays.map((day) => {
          const dateStr = toIsoDateString(day);
          return (
            <div key={dateStr} className="p-2.5 text-center flex flex-col items-center justify-center">
              <span className="text-[11px] font-semibold text-slate-400">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-xs font-bold text-slate-200">{day.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* Events Timeline Rows */}
      <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto">
        {events.map((evt) => {
          const catConfig = getCategoryConfig(evt.category);

          return (
            <div key={evt.id} className="grid grid-cols-8 divide-x divide-slate-800/40 min-h-[56px] items-center group hover:bg-slate-800/20 transition">
              {/* Event Title Label */}
              <div
                onClick={() => setSelectedEventDetail(evt)}
                className="p-3 text-xs font-bold text-slate-200 truncate cursor-pointer hover:text-amber-400 flex items-center gap-2"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: evt.color || catConfig.color }}
                />
                <span className="truncate">{evt.title}</span>
              </div>

              {/* Day Timeline Coverage */}
              {weekDays.map((day) => {
                const dateStr = toIsoDateString(day);
                const isActiveOnDay = evt.startDate <= dateStr && evt.endDate >= dateStr;

                return (
                  <div key={dateStr} className="p-1 flex items-center justify-center h-full">
                    {isActiveOnDay && (
                      <div
                        onClick={() => setSelectedEventDetail(evt)}
                        className={`w-full py-2 px-2 rounded-lg border text-center text-[10px] font-bold truncate ${catConfig.bgClass} hover:brightness-125 transition cursor-pointer shadow-sm`}
                      >
                        {evt.isAllDay ? 'All Day' : `${evt.startTime}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
