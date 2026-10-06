/**
 * @file taskSchema.ts
 * @description Zod validation schema for Task creation and editing in Milestone 12 Tasks Module.
 * @module Features/Tasks/Validation
 */

import { z } from 'zod';

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Subtask title cannot be empty').max(200),
  completed: z.boolean(),
  dueDate: z.string().optional(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  size: z.number(),
  type: z.string(),
});

export const labelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const taskSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  title: z.string().min(1, 'Task title is required').max(200, 'Title max length is 200 characters'),
  description: z.string().max(5000, 'Description max length is 5000 characters').optional().default(''),
  status: z.enum(['inbox', 'todo', 'in_progress', 'done', 'archived']).default('inbox'),
  priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']).default('none'),
  dueDate: z.string().nullable().optional(),
  dueTime: z.string().nullable().optional(),
  reminder: z.string().nullable().optional(),
  category: z.string().max(50).default('Inbox'),
  tags: z.array(z.string()).default([]),
  labels: z.array(labelSchema).default([]),
  attachments: z.array(attachmentSchema).default([]),
  notes: z.string().max(2000).optional().default(''),
  estimatedDuration: z.number().min(0).max(1440).optional().default(0),
  actualDuration: z.number().min(0).max(1440).optional().default(0),
  progress: z.number().min(0).max(100).default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly', 'weekdays', 'custom']).default('none'),
  parentTaskId: z.string().nullable().optional(),
  subtasks: z.array(subtaskSchema).default([]),
  isPinned: z.boolean().default(false),
  isFavourite: z.boolean().default(false),
});

export type TaskFormData = z.infer<typeof taskSchema>;
