/**
 * @file calendar.types.ts
 * @description Master TypeScript definitions for Milestone 15 Calendar & Planner Module in Aura Life OS.
 * @module Features/Calendar/Types
 */

export type CalendarViewMode =
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'agenda'
  | 'timeline'
  | 'planner'
  | 'analytics';

export type EventCategory =
  | 'Work'
  | 'Personal'
  | 'Meeting'
  | 'Deep Work'
  | 'Health & Wellness'
  | 'Learning'
  | 'Social'
  | 'Travel'
  | 'Custom';

export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';

export type EventStatus = 'scheduled' | 'completed' | 'cancelled' | 'archived';

export type RepeatRule = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarEventAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface CalendarEventItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: EventCategory | string;
  color: string;
  icon: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm format, e.g., "09:00"
  endTime: string; // HH:mm format, e.g., "10:30"
  isAllDay: boolean;
  timeZone: string;
  reminderMinutes: number; // e.g. 15 mins before
  repeatRule: RepeatRule;
  notes?: string;
  tags: string[];
  attachments: CalendarEventAttachment[];
  priority: EventPriority;
  status: EventStatus;
  isFavourite: boolean;
  isPinned: boolean;
  linkedTaskId?: string;
  linkedHabitId?: string;
  linkedGoalId?: string;
  linkedMilestoneId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerNote {
  id: string; // Date string YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  notes: string;
  focusScore: number; // 0 - 100
  focusMinutes: number; // e.g. 120 mins
  completedTaskIds: string[];
  completedHabitIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarFilterState {
  searchQuery: string;
  categories: string[];
  priorities: EventPriority[];
  statuses: EventStatus[];
  tags: string[];
  isPinnedOnly: boolean;
  isFavouriteOnly: boolean;
  dateRange: { start: string; end: string } | null;
}

export type UnifiedPlannerItemType = 'event' | 'task' | 'habit' | 'milestone';

export interface UnifiedPlannerItem {
  id: string;
  type: UnifiedPlannerItemType;
  title: string;
  category?: string;
  timeOrStatusStr: string;
  dateStr: string;
  isCompleted: boolean;
  color: string;
  icon: string;
  rawItem: unknown;
}

export interface CalendarAnalyticsSummary {
  totalEventsCount: number;
  completedEventsCount: number;
  totalFocusHours: number;
  categoryTimeAllocation: Record<string, number>; // hours per category
  busiestDayOfWeek: string;
  peakProductivityTime: string;
  dailyScheduleDensity: number; // percentage busy
}
