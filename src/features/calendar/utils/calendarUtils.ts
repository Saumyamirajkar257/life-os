/**
 * @file calendarUtils.ts
 * @description Date formatting, grid generators, time slot helpers, and category badge resolution.
 * @module Features/Calendar/Utils
 */

import { EVENT_CATEGORIES, EVENT_PRIORITY_CONFIG, EVENT_STATUS_CONFIG } from '../constants/calendarConstants';
import { EventPriority, EventStatus } from '../types/calendar.types';

export function getCategoryConfig(categoryName: string) {
  const match = EVENT_CATEGORIES.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
  return match || {
    name: categoryName,
    color: '#64748B',
    icon: 'Calendar',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
}

export function getEventPriorityConfig(priority: EventPriority) {
  return EVENT_PRIORITY_CONFIG[priority] || EVENT_PRIORITY_CONFIG.medium;
}

export function getEventStatusConfig(status: EventStatus) {
  return EVENT_STATUS_CONFIG[status] || EVENT_STATUS_CONFIG.scheduled;
}

/**
 * Returns formatted date string YYYY-MM-DD for a given Date object.
 */
export function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD string into friendly label (e.g., "Mon, Jul 28, 2026").
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Generates an array of Date objects for the 7 days of the week containing the base date.
 */
export function getDaysInWeek(baseDate: Date): Date[] {
  const start = new Date(baseDate);
  const dayOfWeek = start.getDay(); // 0 is Sunday
  start.setDate(start.getDate() - dayOfWeek); // Start at Sunday or Monday (Sunday default)

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

/**
 * Generates 35 or 42 grid cells for a month view.
 */
export function getMonthGrid(year: number, month: number): Date[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();

  const startDate = new Date(year, month, 1 - startDay);
  const days: Date[] = [];

  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  // If the last day is still in current month, extend to 42 days (6 rows)
  if (days[34].getMonth() === month && days[34].getDate() < new Date(year, month + 1, 0).getDate()) {
    for (let i = 35; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
  }

  return days;
}

/**
 * Generates hourly slots from 00:00 to 23:00.
 */
export function get24HourSlots(): { hour: number; label: string }[] {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const period = i >= 12 ? 'PM' : 'AM';
    const displayHour = i % 12 === 0 ? 12 : i % 12;
    slots.push({
      hour: i,
      label: `${displayHour}:00 ${period}`,
    });
  }
  return slots;
}

/**
 * Converts HH:mm string to top position percentage for daily/weekly grids.
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function isSameDayStr(dateStr1: string, dateStr2: string): boolean {
  return dateStr1 === dateStr2;
}
