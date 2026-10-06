/**
 * @file taskDateUtils.ts
 * @description Date utility functions for task dates, deadlines, overdue checks, and calendar ranges.
 * @module Features/Tasks/Utils/DateUtils
 */

export function isToday(dateString?: string | null): boolean {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString.startsWith(today);
}

export function isOverdue(dateString?: string | null, status?: string): boolean {
  if (!dateString || status === 'done' || status === 'archived') return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString < today;
}

export function isUpcoming(dateString?: string | null): boolean {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString > today;
}

export function formatDueDateLabel(dateString?: string | null, dueTime?: string | null): string {
  if (!dateString) return 'No due date';

  const date = new Date(dateString + (dateString.includes('T') ? '' : 'T00:00:00'));
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  let dateLabel = '';
  if (isSameDay(date, today)) {
    dateLabel = 'Today';
  } else if (isSameDay(date, tomorrow)) {
    dateLabel = 'Tomorrow';
  } else {
    dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (dueTime) {
    return `${dateLabel} at ${dueTime}`;
  }

  return dateLabel;
}

export function getDaysDifference(dateString: string): number {
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
