/**
 * @file AgendaView.tsx
 * @description Chronological list view of scheduled events, tasks, habits, and milestones with date headers.
 * @module Features/Calendar/Components
 */

import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag, CheckSquare, Flame, Flag, Zap } from 'lucide-react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { formatFriendlyDate, getCategoryConfig } from '../utils/calendarUtils';

export const AgendaView: React.FC = () => {
  const { setSelectedEventDetail } = useCalendarUIStore();
  const { events } = useCalendarEvents();

  // Group events by startDate
  const groupedEvents = React.useMemo(() => {
    const map: Record<string, typeof events> = {};
    const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

    sorted.forEach((evt) => {
      if (!map[evt.startDate]) {
        map[evt.startDate] = [];
      }
      map[evt.startDate].push(evt);
    });

    return map;
  }, [events]);

  const dateKeys = Object.keys(groupedEvents).sort();

  if (dateKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center backdrop-blur-md">
        <CalendarIcon className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No events found</h3>
        <p className="text-xs text-slate-500 mt-1">Try clearing filters or creating a new schedule item.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md max-h-[700px] overflow-y-auto">
      {dateKeys.map((dateStr) => {
        const dayEvts = groupedEvents[dateStr];
        return (
          <div key={dateStr} className="flex flex-col gap-3">
            {/* Date Group Header */}
            <div className="sticky top-0 z-10 bg-slate-950/90 border-y border-slate-800/80 py-2 px-3 rounded-lg flex items-center justify-between backdrop-blur-md">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {formatFriendlyDate(dateStr)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {dayEvts.length} {dayEvts.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            {/* Events List */}
            <div className="flex flex-col gap-2.5 pl-2 border-l-2 border-amber-500/20">
              {dayEvts.map((evt) => {
                const catConfig = getCategoryConfig(evt.category);
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventDetail(evt)}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 hover:scale-[1.005] transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: evt.color || catConfig.color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                          {evt.title}
                        </span>
                        {evt.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {evt.isAllDay ? 'All Day' : `${evt.startTime} - ${evt.endTime}`}
                          </span>
                          {evt.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-blue-400" />
                              {evt.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-emerald-400" />
                            {evt.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {evt.priority === 'urgent' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                          URGENT
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {evt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
