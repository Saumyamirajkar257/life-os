/**
 * @file EventDetailModal.tsx
 * @description Quick popover modal to inspect event properties and execute lifecycle actions.
 * @module Features/Calendar/Components
 */

import React from 'react';
import {
  X,
  Clock,
  MapPin,
  Tag,
  Star,
  Pin,
  Copy,
  Edit2,
  Trash2,
  Archive,
  Calendar as CalendarIcon,
  Bell,
  Repeat,
} from 'lucide-react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarStore } from '../stores/useCalendarStore';
import { getCategoryConfig, formatFriendlyDate } from '../utils/calendarUtils';

export const EventDetailModal: React.FC = () => {
  const { selectedEventDetail, setSelectedEventDetail, openEditModal } = useCalendarUIStore();
  const { deleteEvent, duplicateEvent, toggleFavourite, togglePin, archiveEvent } = useCalendarStore();

  if (!selectedEventDetail) return null;

  const evt = selectedEventDetail;
  const catConfig = getCategoryConfig(evt.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Banner Header */}
        <div
          className="p-5 flex items-start justify-between border-b border-slate-800/80 relative"
          style={{
            background: `linear-gradient(135deg, ${evt.color || '#3B82F6'}20 0%, #0f172a 100%)`,
          }}
        >
          <div className="flex flex-col gap-1.5 pr-6">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 w-fit">
              {evt.category}
            </span>
            <h3 className="text-lg font-bold text-slate-100">{evt.title}</h3>
          </div>

          <button
            onClick={() => setSelectedEventDetail(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Date & Time */}
          <div className="flex items-center gap-2.5 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              {formatFriendlyDate(evt.startDate)}
              {evt.isAllDay ? ' (All Day)' : ` • ${evt.startTime} - ${evt.endTime}`}
            </span>
          </div>

          {/* Location */}
          {evt.location && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>{evt.location}</span>
            </div>
          )}

          {/* Recurrence & Reminder */}
          <div className="flex items-center gap-4 text-slate-400">
            {evt.repeatRule !== 'none' && (
              <span className="flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-purple-400" />
                <span>Repeats {evt.repeatRule}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reminder {evt.reminderMinutes}m before</span>
            </span>
          </div>

          {/* Description */}
          {evt.description && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
              {evt.description}
            </div>
          )}
        </div>

        {/* Action Toolbar Footer */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavourite(evt.id)}
              className={`p-2 rounded-lg border transition ${
                evt.isFavourite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
              title="Favourite"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => togglePin(evt.id)}
              className={`p-2 rounded-lg border transition ${
                evt.isPinned
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
              title="Pin"
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                duplicateEvent(evt.id);
                setSelectedEventDetail(null);
              }}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 transition"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                archiveEvent(evt.id);
                setSelectedEventDetail(null);
              }}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 transition"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                deleteEvent(evt.id);
                setSelectedEventDetail(null);
              }}
              className="p-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                openEditModal(evt);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
