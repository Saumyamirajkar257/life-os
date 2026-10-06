/**
 * @file module.ts
 * @description Aura Module SDK registration for the Tasks Module (Milestone 12).
 * @module Features/Tasks/Module
 */

import React from 'react';
import { createModule } from '../../sdk/registration/registerModule';
import { taskRoutes } from './routes';
import { TasksPage } from './pages/TasksPage';
import { useTaskStore } from './stores/useTaskStore';
import { useTaskUIStore } from './stores/useTaskUIStore';

export const TasksModule = createModule(
  'tasks',
  'Tasks Engine',
  'productivity',
  (builder) =>
    builder
      .setDescription('Flagship task management engine inspired by Todoist, TickTick, Things 3 and Notion')
      .setVersion('1.0.0')
      .setIcon('CheckSquare')
      .setTags(['tasks', 'todo', 'kanban', 'pomodoro', 'calendar', 'productivity'])
      .addSidebarItem({
        itemId: 'tasks-sidebar-main',
        label: 'Tasks',
        icon: 'CheckSquare',
        path: '/tasks',
        badge: 'Flagship',
        section: 'primary',
        order: 1,
      })
      .addRoute({
        path: '/tasks',
        component: TasksPage,
        protected: true,
        title: 'Tasks — Aura Life OS',
      })
      .addCommand({
        commandId: 'tasks-command-create',
        title: 'Create New Task',
        category: 'Tasks',
        action: () => {
          useTaskUIStore.getState().openFormModal();
        },
      })
      .addCommand({
        commandId: 'tasks-command-focus',
        title: 'Launch Focus Mode & Pomodoro',
        category: 'Tasks',
        action: () => {
          useTaskUIStore.getState().openFocusModal();
        },
      })
      .addCommand({
        commandId: 'tasks-command-kanban',
        title: 'Switch to Kanban Board',
        category: 'Tasks',
        action: () => {
          useTaskUIStore.getState().setActiveView('kanban');
        },
      })
      .addCommand({
        commandId: 'tasks-command-calendar',
        title: 'Switch to Calendar View',
        category: 'Tasks',
        action: () => {
          useTaskUIStore.getState().setActiveView('calendar');
        },
      })
      .addSearchProvider({
        providerId: 'tasks-search-provider',
        entityName: 'Tasks Search',
        searchHandler: async (query: string) => {
          const q = query.toLowerCase().trim();
          if (!q) return [];

          const tasks = useTaskStore.getState().tasks;
          return tasks
            .filter(
              (t) =>
                t.title.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.tags.some((tag) => tag.toLowerCase().includes(q))
            )
            .slice(0, 5)
            .map((t) => ({
              id: `search-task-${t.id}`,
              title: t.title,
              subtitle: `${t.category} • ${t.priority.toUpperCase()} priority`,
              category: 'Tasks',
              icon: 'CheckSquare',
              metadata: { taskId: t.id },
            }));
        },
        onSelect: (result) => {
          if (result.metadata?.taskId) {
            useTaskUIStore.getState().openDetailDrawer(result.metadata.taskId);
          }
        },
      })
);
