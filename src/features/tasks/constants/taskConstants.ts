/**
 * @file taskConstants.ts
 * @description Constant definitions, initial fallback tasks, categories, and priority weights.
 * @module Features/Tasks/Constants
 */

import { TaskItem, TaskPriority, TaskStatus, TaskViewMode } from '../types/task.types';

export const TASK_CATEGORIES = [
  'Inbox',
  'Personal',
  'Work & Engineering',
  'Health & Fitness',
  'Finance',
  'Learning & Growth',
] as const;

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bg: string; border: string; weight: number }
> = {
  urgent: {
    label: 'Urgent',
    color: 'text-rose-400',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30',
    weight: 4,
  },
  high: {
    label: 'High',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    weight: 3,
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    weight: 2,
  },
  low: {
    label: 'Low',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    weight: 1,
  },
  none: {
    label: 'None',
    color: 'text-neutral-400',
    bg: 'bg-neutral-800/50',
    border: 'border-neutral-700/50',
    weight: 0,
  },
};

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  inbox: {
    label: 'Inbox',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
  },
  todo: {
    label: 'To Do',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
  },
  done: {
    label: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
  },
  archived: {
    label: 'Archived',
    color: 'text-neutral-400',
    bg: 'bg-neutral-800/60',
    border: 'border-neutral-700/60',
  },
};

export const TASK_VIEW_TABS: { id: TaskViewMode; label: string; icon: string }[] = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox' },
  { id: 'today', label: 'Today', icon: 'Sun' },
  { id: 'upcoming', label: 'Upcoming', icon: 'CalendarDays' },
  { id: 'list', label: 'List View', icon: 'ListFilter' },
  { id: 'kanban', label: 'Kanban Board', icon: 'Kanban' },
  { id: 'matrix', label: 'Matrix', icon: 'Grid2x2' },
  { id: 'calendar', label: 'Calendar View', icon: 'Calendar' },
  { id: 'timeline', label: 'Timeline View', icon: 'Clock' },
  { id: 'completed', label: 'Completed', icon: 'CheckCheck' },
  { id: 'overdue', label: 'Overdue', icon: 'AlertCircle' },
  { id: 'archived', label: 'Archived', icon: 'Archive' },
];

export const INITIAL_DEMO_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    userId: 'default-user',
    title: 'Review Aura Life OS Architecture & Module SDK',
    description: 'Ensure all composite components, design tokens, and state managers align with Milestone 12.',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '14:00',
    reminder: new Date(Date.now() + 3600000).toISOString(),
    category: 'Work & Engineering',
    tags: ['AuraCore', 'SDK', 'Architecture'],
    labels: [
      { id: 'lbl-1', name: 'Core OS', color: '#10b981' },
      { id: 'lbl-2', name: 'Urgent', color: '#f43f5e' },
    ],
    attachments: [],
    notes: 'Verify state store hydration and Firestore converters.',
    estimatedDuration: 60,
    actualDuration: 25,
    progress: 50,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    recurrence: 'none',
    subtasks: [
      { id: 'st-1', title: 'Audit Zustand server store', completed: true },
      { id: 'st-2', title: 'Verify TanStack Query optimistic updates', completed: false },
      { id: 'st-3', title: 'Check WCAG AA contrast on dark badges', completed: false },
    ],
    isPinned: true,
    isFavourite: true,
  },
  {
    id: 'task-2',
    userId: 'default-user',
    title: 'Configure Daily Deep Work & Pomodoro Session',
    description: 'Schedule 2 hours of uninterruptible execution focus using Focus Mode.',
    status: 'todo',
    priority: 'urgent',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '16:00',
    reminder: null,
    category: 'Personal',
    tags: ['Productivity', 'Focus', 'Habit'],
    labels: [{ id: 'lbl-3', name: 'Mindset', color: '#8b5cf6' }],
    attachments: [],
    notes: 'Use ambient binaural beats during focus session.',
    estimatedDuration: 120,
    actualDuration: 0,
    progress: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    recurrence: 'daily',
    subtasks: [
      { id: 'st-201', title: 'Silence notifications', completed: true },
      { id: 'st-202', title: 'Complete 4 Pomodoro loops', completed: false },
    ],
    isPinned: true,
    isFavourite: false,
  },
  {
    id: 'task-3',
    userId: 'default-user',
    title: 'Monthly Financial Cashflow & Investment Rebalance',
    description: 'Sync account balances, calculate savings rate, and review asset allocations.',
    status: 'inbox',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dueTime: '10:00',
    reminder: null,
    category: 'Finance',
    tags: ['Finance', 'Assets'],
    labels: [{ id: 'lbl-4', name: 'Wealth', color: '#3b82f6' }],
    attachments: [],
    notes: 'Export monthly PDF ledger from Finance Module.',
    estimatedDuration: 45,
    actualDuration: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    recurrence: 'monthly',
    subtasks: [],
    isPinned: false,
    isFavourite: true,
  },
  {
    id: 'task-4',
    userId: 'default-user',
    title: 'Weekly Workout & Bio-Tracking Log Review',
    description: 'Log cardiovascular activity and review sleep recovery trends in Fitness Module.',
    status: 'done',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    dueTime: '09:00',
    reminder: null,
    category: 'Health & Fitness',
    tags: ['Fitness', 'BioMetrics'],
    labels: [{ id: 'lbl-5', name: 'Health', color: '#06b6d4' }],
    attachments: [],
    notes: 'Achieved 85% sleep score average.',
    estimatedDuration: 30,
    actualDuration: 30,
    progress: 100,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    recurrence: 'weekly',
    subtasks: [
      { id: 'st-401', title: 'Record 5km run time', completed: true },
      { id: 'st-402', title: 'Sync Oura ring metrics', completed: true },
    ],
    isPinned: false,
    isFavourite: false,
  },
];
