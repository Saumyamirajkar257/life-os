/**
 * @file goalFormatters.ts
 * @description Date formatting, text truncations, and visual badge style mappers for Goals & Projects.
 * @module Features/Goals/Utils
 */

import { GOAL_CATEGORIES, GOAL_PRIORITY_CONFIG, GOAL_STATUS_CONFIG, PROJECT_STATUS_CONFIG } from '../constants/goalConstants';
import { GoalPriority, GoalStatus, ProjectStatus } from '../types/goal.types';

export function getCategoryConfig(categoryName: string) {
  const match = GOAL_CATEGORIES.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
  return match || {
    name: categoryName,
    color: '#64748B',
    icon: 'Compass',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
}

export function getPriorityConfig(priority: GoalPriority) {
  return GOAL_PRIORITY_CONFIG[priority] || GOAL_PRIORITY_CONFIG.medium;
}

export function getGoalStatusConfig(status: GoalStatus) {
  return GOAL_STATUS_CONFIG[status] || GOAL_STATUS_CONFIG.not_started;
}

export function getProjectStatusConfig(status: ProjectStatus) {
  return PROJECT_STATUS_CONFIG[status] || PROJECT_STATUS_CONFIG.planning;
}

export function formatDateString(dateStr?: string | null): string {
  if (!dateStr) return 'No target date';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function getDaysLeftBadge(targetDateStr?: string | null): { label: string; isOverdue: boolean; classNames: string } {
  if (!targetDateStr) return { label: 'Undated', isOverdue: false, classNames: 'text-slate-400 bg-slate-500/10' };

  const target = new Date(targetDateStr).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)}d overdue`,
      isOverdue: true,
      classNames: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      isOverdue: false,
      classNames: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
    };
  } else if (diffDays <= 7) {
    return {
      label: `${diffDays}d left`,
      isOverdue: false,
      classNames: 'text-amber-300 bg-amber-500/10 border border-amber-500/20',
    };
  } else {
    return {
      label: `${diffDays}d left`,
      isOverdue: false,
      classNames: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
    };
  }
}
