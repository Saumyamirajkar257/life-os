/**
 * @file EventModal.tsx
 * @description Form modal for creating and editing Calendar Events with category, recurrence, and time pickers.
 * @module Features/Calendar/Components
 */

import React from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Tag, AlertCircle, Repeat, Bell } from 'lucide-react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarStore } from '../stores/useCalendarStore';
import { EVENT_CATEGORIES, REPEAT_OPTIONS, REMINDER_OPTIONS, EVENT_PRIORITY_CONFIG } from '../constants/calendarConstants';
import { validateEventPayload, CalendarValidationError } from '../validation/calendarSchema';
import { CalendarEventItem, EventCategory, EventPriority, RepeatRule } from '../types/calendar.types';

export const EventModal: React.FC = () => {
  const { isEventModalOpen, editingEvent, closeEventModal, currentDate } = useCalendarUIStore();
  const { createEvent, updateEvent } = useCalendarStore();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<EventCategory>('Work');
  const [color, setColor] = React.useState('#3B82F6');
  const [location, setLocation] = React.useState('');
  const [startDate, setStartDate] = React.useState(currentDate);
  const [endDate, setEndDate] = React.useState(currentDate);
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');
  const [isAllDay, setIsAllDay] = React.useState(false);
  const [priority, setPriority] = React.useState<EventPriority>('medium');
  const [repeatRule, setRepeatRule] = React.useState<RepeatRule>('none');
  const [reminderMinutes, setReminderMinutes] = React.useState(15);
  const [errors, setErrors] = React.useState<CalendarValidationError[]>([]);

  React.useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setCategory((editingEvent.category as EventCategory) || 'Work');
      setColor(editingEvent.color || '#3B82F6');
      setLocation(editingEvent.location || '');
      setStartDate(editingEvent.startDate);
      setEndDate(editingEvent.endDate);
      setStartTime(editingEvent.startTime || '09:00');
      setEndTime(editingEvent.endTime || '10:00');
      setIsAllDay(editingEvent.isAllDay || false);
      setPriority(editingEvent.priority || 'medium');
      setRepeatRule(editingEvent.repeatRule || 'none');
      setReminderMinutes(editingEvent.reminderMinutes || 15);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Work');
      setColor('#3B82F6');
      setLocation('');
      setStartDate(currentDate);
      setEndDate(currentDate);
      setStartTime('09:00');
      setEndTime('10:00');
      setIsAllDay(false);
      setPriority('medium');
      setRepeatRule('none');
      setReminderMinutes(15);
    }
    setErrors([]);
  }, [editingEvent, isEventModalOpen, currentDate]);

  if (!isEventModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<CalendarEventItem> = {
      title,
      description,
      category,
      color,
      icon: 'Calendar',
      location,
      startDate,
      endDate,
      startTime,
      endTime,
      isAllDay,
      timeZone: 'America/Los_Angeles',
      reminderMinutes,
      repeatRule,
      tags: [category.toLowerCase()],
      attachments: [],
      priority,
      status: 'scheduled',
      isFavourite: false,
      isPinned: false,
    };

    const valErrors = validateEventPayload(payload);
    if (valErrors.length > 0) {
      setErrors(valErrors);
      return;
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
    } else {
      createEvent(payload as Omit<CalendarEventItem, 'id' | 'createdAt' | 'updatedAt'>);
    }

    closeEventModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {editingEvent ? 'Edit Event' : 'Schedule New Event'}
            </h3>
          </div>
          <button
            onClick={closeEventModal}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex flex-col gap-4">
          {errors.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-1 text-xs text-rose-400">
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Architecture Review"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EventPriority)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* All Day Checkbox & Date Pickers */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-0"
              />
              <span>All Day Event</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Location / Video Link</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Conference Room A or meet.google.com/..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Recurrence & Reminder */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Repeat</label>
              <select
                value={repeatRule}
                onChange={(e) => setRepeatRule(e.target.value as RepeatRule)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
              >
                {REPEAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Reminder</label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
              >
                {REMINDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Description & Agenda Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add event context or agenda bullets..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={closeEventModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
