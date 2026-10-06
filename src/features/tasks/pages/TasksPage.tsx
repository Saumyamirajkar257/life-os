/**
 * @file TasksPage.tsx
 * @description Main entry point view component for Tasks Module, selecting active view renderer and modals.
 * @module Features/Tasks/Pages/TasksPage
 */

import React from 'react';
import { TasksLayout } from '../layouts/TasksLayout';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { TaskQuickAddBar } from '../components/TaskQuickAddBar';
import { TaskListView } from '../components/TaskListView';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { TaskEisenhowerMatrix } from '../components/TaskEisenhowerMatrix';
import { TaskCalendarView } from '../components/TaskCalendarView';
import { TaskTimelineView } from '../components/TaskTimelineView';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskBulkActionBar } from '../components/TaskBulkActionBar';
import { FocusModeModal } from '../components/FocusModeModal';
import { useTasks } from '../hooks/useTasks';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskKeyboardShortcuts } from '../hooks/useTaskKeyboardShortcuts';

export const TasksPage: React.FC = () => {
  const { displayedTasks, isLoading } = useTasks();
  const { activeView } = useTaskUIStore();

  // Active keyboard-first navigation and triage listeners
  useTaskKeyboardShortcuts(displayedTasks);

  const renderActiveView = () => {
    if (isLoading && displayedTasks.length === 0) {
      return (
        <div className="py-8 space-y-2.5 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] animate-pulse"
            />
          ))}
        </div>
      );
    }

    switch (activeView) {
      case 'kanban':
        return <TaskKanbanBoard tasks={displayedTasks} />;
      case 'matrix':
        return <TaskEisenhowerMatrix tasks={displayedTasks} />;
      case 'calendar':
        return <TaskCalendarView tasks={displayedTasks} />;
      case 'timeline':
        return <TaskTimelineView tasks={displayedTasks} />;
      case 'inbox':
      case 'today':
      case 'upcoming':
      case 'completed':
      case 'archived':
      case 'overdue':
      case 'list':
      default:
        return <TaskListView tasks={displayedTasks} />;
    }
  };

  return (
    <TasksLayout>
      <TaskFilterBar />
      <TaskQuickAddBar />
      {renderActiveView()}

      {/* Global Task Modals and Slide-Over Drawers */}
      <TaskDetailDrawer />
      <TaskFormModal />
      <TaskBulkActionBar />
      <FocusModeModal />
    </TasksLayout>
  );
};
