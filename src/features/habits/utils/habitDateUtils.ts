/**
 * @file habitDateUtils.ts
 * @description Date utility helper functions for Habits Module calculations, calendar rendering, and streak math.
 * @module Features/Habits/Utils/HabitDateUtils
 */

import { TimeOfDay } from '../types/habit.types';

/** Get today's date in YYYY-MM-DD format in local timezone */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Get date string offset by N days relative to target date (YYYY-MM-DD) */
export function getDateOffsetString(baseDateStr: string, offsetDays: number): string {
  const d = new Date(baseDateStr + 'T00:00:00');
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Format YYYY-MM-DD into human friendly string (e.g. "Monday, Oct 24") */
export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Check if given YYYY-MM-DD date is today */
export function isDateToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

/** Return array of YYYY-MM-DD dates for the past N days */
export function getPastNDays(days: number, endDateStr?: string): string[] {
  const end = endDateStr || getTodayDateString();
  const list: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    list.push(getDateOffsetString(end, -i));
  }
  return list;
}

/** Determine short day of week code ('mon', 'tue', etc.) from YYYY-MM-DD */
export function getDayOfWeekCode(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const codes = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return codes[d.getDay()];
}

/** Classify current time into morning, afternoon, evening */
export function getCurrentTimeOfDaySlot(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 23) return 'evening';
  return 'anytime';
}

/** Generate days array for a specific month (YYYY-MM) */
export function getMonthDaysGrid(year: number, monthIndex: number): { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0 = Sun
  const totalDays = lastDay.getDate();

  const daysGrid: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

  // Padding preceding month
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const m = monthIndex === 0 ? 12 : monthIndex;
    const y = monthIndex === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    daysGrid.push({ dateStr, dayNumber: dayNum, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const dateStr = `${year}-${m}-${String(day).padStart(2, '0')}`;
    daysGrid.push({ dateStr, dayNumber: day, isCurrentMonth: true });
  }

  // Padding next month to fill grid to multiple of 7
  const remaining = (7 - (daysGrid.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const m = monthIndex === 11 ? 1 : monthIndex + 2;
    const y = monthIndex === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    daysGrid.push({ dateStr, dayNumber: day, isCurrentMonth: false });
  }

  return daysGrid;
}
