/**
 * @file task.types.ts
 * @description Master TypeScript interfaces and type definitions for Milestone 12 Tasks Module.
 * @module Features/Tasks/Types
 */

export type TaskStatus = 'inbox' | 'todo' | 'in_progress' | 'done' | 'archived';

export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'weekdays' | 'custom';

export type TaskViewMode =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'archived'
  | 'overdue'
  | 'calendar'
  | 'kanban'
  | 'timeline'
  | 'matrix'
  | 'list';

export type TaskSortOption = 'dueDate' | 'priority' | 'title' | 'createdAt' | 'estimatedDuration' | 'progress';

export type TaskSortDirection = 'asc' | 'desc';

export type TaskGroupOption = 'none' | 'status' | 'priority' | 'category' | 'dueDate';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  dueTime?: string | null;
  reminder?: string | null;
  category: string;
  tags: string[];
  labels: TaskLabel[];
  attachments: TaskAttachment[];
  notes?: string;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  color?: string;
  icon?: string;
  recurrence: TaskRecurrence;
  parentTaskId?: string | null;
  subtasks: TaskSubtask[];
  isPinned: boolean;
  isFavourite: boolean;
}

export interface TaskFilterState {
  searchQuery: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  categories?: string[];
  tags?: string[];
  dateRange?: { start?: string; end?: string };
  isPinnedOnly?: boolean;
  isFavouriteOnly?: boolean;
  hasSubtasksOnly?: boolean;
}

export interface TaskStats {
  total: number;
  completedToday: number;
  overdueCount: number;
  inboxCount: number;
  completionRate: number; // percentage 0-100
  streakDays: number;
  productivityScore: number; // 0-100 score
  totalEstimatedHours: number;
  totalActualHours: number;
}

export interface PomodoroSettings {
  workDuration: number; // default 25 min
  shortBreakDuration: number; // default 5 min
  longBreakDuration: number; // default 15 min
  longBreakInterval: number; // every 4 sessions
  autoStartBreaks: boolean;
}
