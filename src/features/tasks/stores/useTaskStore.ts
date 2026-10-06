/**
 * @file useTaskStore.ts
 * @description Server state & optimistic local cache store for tasks with Firestore sync.
 * @module Features/Tasks/Stores/UseTaskStore
 */

import { create } from 'zustand';
import { TaskItem, TaskPriority, TaskStatus } from '../types/task.types';
import { INITIAL_DEMO_TASKS } from '../constants/taskConstants';
import { auth } from '@/lib/firebase/config';
import {
  saveTaskToFirestore,
  deleteTaskFromFirestore,
  bulkDeleteTasksInFirestore,
  bulkUpdateTasksInFirestore,
  subscribeToTasks,
} from '../services/tasksFirestoreService';

interface TaskStoreState {
  tasks: TaskItem[];
  isLoading: boolean;
  isSyncedWithFirestore: boolean;
  lastError: string | null;

  // Actions
  setTasks: (tasks: TaskItem[]) => void;
  initializeStore: (userId?: string) => () => void;
  createTask: (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => TaskItem;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => TaskItem | null;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  completeTask: (id: string) => void;
  undoCompleteTask: (id: string) => void;
  togglePinTask: (id: string) => void;
  toggleFavouriteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: TaskStatus) => void;
  bulkUpdatePriority: (ids: string[], priority: TaskPriority) => void;
  bulkUpdateCategory: (ids: string[], category: string) => void;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: INITIAL_DEMO_TASKS,
  isLoading: false,
  isSyncedWithFirestore: false,
  lastError: null,

  setTasks: (tasks) => set({ tasks }),

  initializeStore: (userId) => {
    const activeUid = userId || auth.currentUser?.uid;
    if (!activeUid) {
      set({ isLoading: false, isSyncedWithFirestore: false });
      return () => {};
    }
    if (get().tasks.length === 0) {
      set({ isLoading: true });
    }

    // Set up real-time listener from Firestore
    const unsubscribe = subscribeToTasks(
      activeUid,
      (remoteTasks) => {
        if (remoteTasks.length > 0) {
          set({ tasks: remoteTasks, isSyncedWithFirestore: true, isLoading: false });
        } else {
          // Empty list for clean user or fallback
          set({ tasks: [], isSyncedWithFirestore: true, isLoading: false });
        }
      },
      (error) => {
        console.warn('[TasksStore] Firestore sync fallback to local cache:', error);
        set({ isLoading: false, isSyncedWithFirestore: false });
      }
    );

    return unsubscribe;
  },

  createTask: (taskData) => {
    const activeUid = auth.currentUser?.uid || (taskData as any).userId || 'guest-user';
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: activeUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: taskData.subtasks || [],
      attachments: taskData.attachments || [],
      labels: taskData.labels || [],
      tags: taskData.tags || [],
      progress: taskData.progress || 0,
      isPinned: Boolean(taskData.isPinned),
      isFavourite: Boolean(taskData.isFavourite),
    };

    // Optimistic local update
    set((state) => ({ tasks: [newTask, ...state.tasks] }));

    // Sync to Firestore
    saveTaskToFirestore(newTask);

    return newTask;
  },

  updateTask: (id, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.id === id) {
          const updated = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          // Sync update to Firestore
          saveTaskToFirestore(updated);
          return updated;
        }
        return task;
      });
      return { tasks: updatedTasks };
    });
  },

  deleteTask: (id) => {
    // Optimistic local update
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    deleteTaskFromFirestore(id);
  },

  duplicateTask: (id) => {
    const existing = get().tasks.find((t) => t.id === id);
    if (!existing) return null;

    const dupData: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
      ...existing,
      title: `${existing.title} (Copy)`,
      subtasks: existing.subtasks.map((s) => ({ ...s, id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` })),
    };

    return get().createTask(dupData);
  },

  archiveTask: (id) => {
    get().updateTask(id, { status: 'archived' });
  },

  restoreTask: (id) => {
    get().updateTask(id, { status: 'todo' });
  },

  completeTask: (id) => {
    get().updateTask(id, {
      status: 'done',
      progress: 100,
      completedAt: new Date().toISOString(),
    });
  },

  undoCompleteTask: (id) => {
    get().updateTask(id, {
      status: 'todo',
      progress: 0,
      completedAt: null,
    });
  },

  togglePinTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) {
      get().updateTask(id, { isPinned: !task.isPinned });
    }
  },

  toggleFavouriteTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) {
      get().updateTask(id, { isFavourite: !task.isFavourite });
    }
  },

  toggleSubtask: (taskId, subtaskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const completedCount = updatedSubtasks.filter((s) => s.completed).length;
    const totalCount = updatedSubtasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : task.progress;

    get().updateTask(taskId, {
      subtasks: updatedSubtasks,
      progress,
      status: progress === 100 ? 'done' : task.status === 'done' ? 'in_progress' : task.status,
    });
  },

  addSubtask: (taskId, title) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task || !title.trim()) return;

    const newSubtask = {
      id: `st-${Date.now()}`,
      title: title.trim(),
      completed: false,
    };

    const updatedSubtasks = [...task.subtasks, newSubtask];
    get().updateTask(taskId, { subtasks: updatedSubtasks });
  },

  deleteSubtask: (taskId, subtaskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.filter((s) => s.id !== subtaskId);
    get().updateTask(taskId, { subtasks: updatedSubtasks });
  },

  bulkDelete: (ids) => {
    set((state) => ({ tasks: state.tasks.filter((t) => !ids.includes(t.id)) }));
    bulkDeleteTasksInFirestore(ids);
  },

  bulkUpdateStatus: (ids, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (ids.includes(t.id) ? { ...t, status } : t)),
    }));
    bulkUpdateTasksInFirestore(ids, { status });
  },

  bulkUpdatePriority: (ids, priority) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (ids.includes(t.id) ? { ...t, priority } : t)),
    }));
    bulkUpdateTasksInFirestore(ids, { priority });
  },

  bulkUpdateCategory: (ids, category) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (ids.includes(t.id) ? { ...t, category } : t)),
    }));
    bulkUpdateTasksInFirestore(ids, { category });
  },
}));
