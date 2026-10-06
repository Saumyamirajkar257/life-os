/**
 * @file DailyView.tsx
 * @description 24-hour vertical time grid view for single day scheduling with tasks and events.
 * @module Features/Calendar/Components
 */

import React, { useEffect, useState, useRef } from 'react';
import { Clock, MapPin, Plus, CheckSquare } from 'lucide-react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { get24HourSlots, getCategoryConfig } from '../utils/calendarUtils';
import { usePlanner } from '../hooks/usePlanner';

export const DailyView: React.FC = () => {
  const { currentDate, openCreateModal, setSelectedEventDetail } = useCalendarUIStore();
  
  // Use the planner hook which unifies events, tasks, etc.
  const { items } = usePlanner(currentDate);

  const hours = get24HourSlots();
  const [currentTime, setCurrentTime] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter items that belong on the grid
  const allDayItems = items.filter(i => (i.type === 'event' && (i.rawItem as any).isAllDay) || i.type === 'milestone');
  
  // Timed items: events with startTime or tasks with dueTime
  const timedItems = items.filter(i => {
    if (i.type === 'event' && !(i.rawItem as any).isAllDay) return true;
    if (i.type === 'task' && (i.rawItem as any).dueTime) return true;
    return false;
  });

  const isToday = currentDate === new Date().toISOString().split('T')[0];
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  return (
    <div className="flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm h-full max-h-[800px]">
      
      {/* All-Day Events Banner */}
      {allDayItems.length > 0 && (
        <div className="p-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]/50 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">All Day</span>
          <div className="flex flex-wrap gap-2">
            {allDayItems.map((item) => {
              const bgClass = item.type === 'milestone' 
                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                : 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20 text-[var(--color-accent)]';
              
              return (
                <button
                  key={item.id}
                  onClick={() => item.type === 'event' && setSelectedEventDetail(item.rawItem as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 ${bgClass} hover:opacity-80 transition-opacity`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 24-Hour Time Grid */}
      <div 
        ref={gridRef}
        className="relative overflow-y-auto flex-1 divide-y divide-[var(--color-border)]/50 bg-[var(--color-surface)]"
      >
        {hours.map((slot) => {
          // Items starting in this hour slot
          const slotItems = timedItems.filter((i) => {
            const timeStr = i.type === 'event' ? (i.rawItem as any).startTime : (i.rawItem as any).dueTime;
            if (!timeStr) return false;
            const hour = parseInt(timeStr.split(':')[0], 10);
            return hour === slot.hour;
          });

          const isCurrentHour = isToday && currentHour === slot.hour;

          return (
            <div
              key={slot.hour}
              className="group flex min-h-[72px] relative transition-colors hover:bg-[var(--color-surface-elevated)]/30 cursor-pointer"
              onClick={(e) => {
                // If clicked directly on slot background
                if (e.target === e.currentTarget) {
                  const hourStr = String(slot.hour).padStart(2, '0');
                  openCreateModal(currentDate, `${hourStr}:00`);
                }
              }}
            >
              {/* Hour Label Column */}
              <div className="w-20 p-3 text-right flex flex-col border-r border-[var(--color-border)]/50 select-none flex-shrink-0">
                <span className={`text-xs font-bold uppercase tracking-wider ${isCurrentHour ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {slot.label.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">
                  {slot.label.split(' ')[1]}
                </span>
              </div>

              {/* Hourly Content Area */}
              <div className="flex-1 p-2 relative flex flex-col gap-2">
                {/* Current Time Indicator Line */}
                {isCurrentHour && (
                  <div 
                    className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                    style={{ top: `${(currentMinute / 60) * 100}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] -ml-1 shadow-[0_0_8px_var(--color-accent)]" />
                    <div className="flex-1 border-t-2 border-[var(--color-accent)]/80" />
                    <span className="text-[10px] font-bold text-[var(--color-accent)] ml-2 bg-[var(--color-surface)] px-1 rounded">
                      {String(currentHour).padStart(2, '0')}:{String(currentMinute).padStart(2, '0')}
                    </span>
                  </div>
                )}

                {slotItems.map((item) => {
                  const isTask = item.type === 'task';
                  const catConfig = getCategoryConfig(item.category || 'other');
                  const color = item.color || catConfig.color;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isTask) setSelectedEventDetail(item.rawItem as any);
                      }}
                      className={`p-2.5 rounded-xl border hover:scale-[1.01] transition-transform shadow-sm flex items-start justify-between relative z-20 ${
                        isTask 
                          ? 'bg-[var(--color-surface-elevated)] border-purple-500/30 hover:border-purple-500/50 cursor-default' 
                          : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div
                          className={`w-1 h-full absolute left-0 top-0 bottom-0 rounded-l-xl`}
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex flex-col flex-1 ml-1">
                          <div className="flex items-center gap-2">
                            {isTask && <CheckSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                            <span className="text-sm font-bold text-white line-clamp-1">
                              {item.title}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--color-text-secondary)] font-medium mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.timeOrStatusStr}
                            </span>
                            {!isTask && (item.rawItem as any).location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {(item.rawItem as any).location}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {!isTask && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0">
                            {item.category}
                          </span>
                        )}
                        {isTask && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                            Task
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Hover Quick Add Indicator */}
                <div className="opacity-0 group-hover:opacity-100 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] flex items-center gap-1.5 text-xs font-bold pointer-events-none transition-opacity">
                  <Plus className="w-4 h-4" />
                  <span>Schedule</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
