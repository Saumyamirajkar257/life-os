import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Task } from '@/features/tasks/types';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

const initialTasks: Task[] = [];

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              completed: false,
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
    }),
    {
      name: 'life-os-tasks',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
