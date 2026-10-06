/**
 * @file tasksConverter.ts
 * @description Strongly-typed FirestoreDataConverter for converting TaskItem objects to and from Firestore documents.
 * @module Features/Tasks/Services/TasksConverter
 */

import type { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { TaskItem } from '../types/task.types';

export const taskFirestoreConverter: FirestoreDataConverter<TaskItem> = {
  toFirestore(task: TaskItem): DocumentData {
    // Strip undefined properties before writing to Firestore
    const data: Record<string, any> = {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || null,
      dueTime: task.dueTime || null,
      reminder: task.reminder || null,
      category: task.category || 'Inbox',
      tags: task.tags || [],
      labels: task.labels || [],
      attachments: task.attachments || [],
      notes: task.notes || '',
      estimatedDuration: task.estimatedDuration || 0,
      actualDuration: task.actualDuration || 0,
      progress: task.progress || 0,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt || null,
      color: task.color || '#10b981',
      icon: task.icon || 'CheckSquare',
      recurrence: task.recurrence || 'none',
      parentTaskId: task.parentTaskId || null,
      subtasks: task.subtasks || [],
      isPinned: Boolean(task.isPinned),
      isFavourite: Boolean(task.isFavourite),
    };

    return data;
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): TaskItem {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      userId: data.userId || 'default-user',
      title: data.title || 'Untitled Task',
      description: data.description || '',
      status: data.status || 'inbox',
      priority: data.priority || 'none',
      dueDate: data.dueDate || null,
      dueTime: data.dueTime || null,
      reminder: data.reminder || null,
      category: data.category || 'Inbox',
      tags: Array.isArray(data.tags) ? data.tags : [],
      labels: Array.isArray(data.labels) ? data.labels : [],
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      notes: data.notes || '',
      estimatedDuration: data.estimatedDuration || 0,
      actualDuration: data.actualDuration || 0,
      progress: data.progress || 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      completedAt: data.completedAt || null,
      color: data.color || '#10b981',
      icon: data.icon || 'CheckSquare',
      recurrence: data.recurrence || 'none',
      parentTaskId: data.parentTaskId || null,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      isPinned: Boolean(data.isPinned),
      isFavourite: Boolean(data.isFavourite),
    };
  },
};
