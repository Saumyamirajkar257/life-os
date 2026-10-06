/**
 * @file calendarSchema.ts
 * @description Validation rules for Calendar Events and Planner Notes.
 * @module Features/Calendar/Validation
 */

import { CalendarEventItem } from '../types/calendar.types';

export interface CalendarValidationError {
  field: string;
  message: string;
}

export function validateEventPayload(event: Partial<CalendarEventItem>): CalendarValidationError[] {
  const errors: CalendarValidationError[] = [];

  if (!event.title || event.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Event title is required.' });
  } else if (event.title.length > 200) {
    errors.push({ field: 'title', message: 'Event title cannot exceed 200 characters.' });
  }

  if (!event.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required.' });
  }

  if (!event.endDate) {
    errors.push({ field: 'endDate', message: 'End date is required.' });
  } else if (event.startDate && event.endDate < event.startDate) {
    errors.push({ field: 'endDate', message: 'End date cannot be earlier than start date.' });
  }

  if (!event.isAllDay) {
    if (!event.startTime) {
      errors.push({ field: 'startTime', message: 'Start time is required for timed events.' });
    }
    if (!event.endTime) {
      errors.push({ field: 'endTime', message: 'End time is required for timed events.' });
    } else if (event.startDate === event.endDate && event.startTime && event.endTime <= event.startTime) {
      errors.push({ field: 'endTime', message: 'End time must be after start time on the same day.' });
    }
  }

  if (event.description && event.description.length > 5000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 5000 characters.' });
  }

  return errors;
}
