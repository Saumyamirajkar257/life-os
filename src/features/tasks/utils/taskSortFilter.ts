/**
 * @file taskSortFilter.ts
 * @description Pure utility functions for filtering, searching, sorting, grouping tasks, and calculating stats.
 * @module Features/Tasks/Utils/SortFilter
 */

import {
  TaskItem,
  TaskFilterState,
  TaskSortOption,
  TaskSortDirection,
  TaskGroupOption,
  TaskViewMode,
  TaskStats,
} from '../types/task.types';
import { isToday, isOverdue, isUpcoming } from './taskDateUtils';
import { PRIORITY_CONFIG } from '../constants/taskConstants';

export function filterTasksByView(tasks: TaskItem[], view: TaskViewMode): TaskItem[] {
  switch (view) {
    case 'inbox':
      return tasks.filter((t) => t.status === 'inbox');
    case 'today':
      return tasks.filter((t) => t.status !== 'archived' && isToday(t.dueDate));
    case 'upcoming':
      return tasks.filter((t) => t.status !== 'archived' && t.status !== 'done' && isUpcoming(t.dueDate));
    case 'completed':
      return tasks.filter((t) => t.status === 'done');
    case 'archived':
      return tasks.filter((t) => t.status === 'archived');
    case 'overdue':
      return tasks.filter((t) => isOverdue(t.dueDate, t.status));
    case 'kanban':
    case 'calendar':
    case 'timeline':
    case 'list':
    default:
      return tasks.filter((t) => t.status !== 'archived');
  }
}

export function filterTasksByQueryAndState(tasks: TaskItem[], filters: TaskFilterState): TaskItem[] {
  return tasks.filter((task) => {
    // Search query match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description?.toLowerCase().includes(q);
      const categoryMatch = task.category.toLowerCase().includes(q);
      const tagMatch = task.tags.some((t) => t.toLowerCase().includes(q));
      const subtaskMatch = task.subtasks.some((st) => st.title.toLowerCase().includes(q));

      if (!titleMatch && !descMatch && !categoryMatch && !tagMatch && !subtaskMatch) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false;
    }

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(task.category)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) => task.tags.includes(tag));
      if (!hasTag) return false;
    }

    // Pinned / Favourite filters
    if (filters.isPinnedOnly && !task.isPinned) return false;
    if (filters.isFavouriteOnly && !task.isFavourite) return false;
    if (filters.hasSubtasksOnly && task.subtasks.length === 0) return false;

    return true;
  });
}

export function sortTasks(
  tasks: TaskItem[],
  sortBy: TaskSortOption = 'dueDate',
  direction: TaskSortDirection = 'asc'
): TaskItem[] {
  const sorted = [...tasks].sort((a, b) => {
    // Pinned items always float to top unless explicitly sorting
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    let comparison = 0;
    switch (sortBy) {
      case 'priority': {
        const weightA = PRIORITY_CONFIG[a.priority]?.weight || 0;
        const weightB = PRIORITY_CONFIG[b.priority]?.weight || 0;
        comparison = weightB - weightA;
        break;
      }
      case 'dueDate': {
        const dateA = a.dueDate || '9999-12-31';
        const dateB = b.dueDate || '9999-12-31';
        comparison = dateA.localeCompare(dateB);
        break;
      }
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = b.createdAt.localeCompare(a.createdAt);
        break;
      case 'estimatedDuration':
        comparison = (b.estimatedDuration || 0) - (a.estimatedDuration || 0);
        break;
      case 'progress':
        comparison = b.progress - a.progress;
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

export function groupTasks(
  tasks: TaskItem[],
  groupBy: TaskGroupOption
): Record<string, TaskItem[]> {
  if (groupBy === 'none') return { All: tasks };

  const groups: Record<string, TaskItem[]> = {};

  tasks.forEach((task) => {
    let key = 'Other';
    if (groupBy === 'status') key = task.status.toUpperCase();
    else if (groupBy === 'priority') key = task.priority.toUpperCase();
    else if (groupBy === 'category') key = task.category || 'Uncategorized';
    else if (groupBy === 'dueDate') {
      if (!task.dueDate) key = 'No Due Date';
      else if (isToday(task.dueDate)) key = 'Today';
      else if (isOverdue(task.dueDate, task.status)) key = 'Overdue';
      else key = 'Later';
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
  });

  return groups;
}

export function computeTaskStats(tasks: TaskItem[]): TaskStats {
  const total = tasks.filter((t) => t.status !== 'archived').length;
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const completedToday = doneTasks.filter((t) => isToday(t.completedAt)).length;
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const inboxCount = tasks.filter((t) => t.status === 'inbox').length;

  const completionRate = total > 0 ? Math.round((doneTasks.length / total) * 100) : 0;

  const totalEstimatedHours = Number(
    (tasks.reduce((sum, t) => sum + (t.estimatedDuration || 0), 0) / 60).toFixed(1)
  );
  const totalActualHours = Number(
    (tasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0) / 60).toFixed(1)
  );

  // Compute placeholder productivity score (0 - 100)
  const productivityScore = Math.min(
    100,
    Math.round(completionRate * 0.6 + completedToday * 10 + (totalActualHours > 0 ? 15 : 5))
  );

  return {
    total,
    completedToday,
    overdueCount,
    inboxCount,
    completionRate,
    streakDays: completedToday > 0 ? 5 : 4, // Streak indicator
    productivityScore,
    totalEstimatedHours,
    totalActualHours,
  };
}
