/**
 * @file TasksPage.tsx
 * @description Main entry point view component for Tasks Module, selecting active view renderer and modals.
 * @module Features/Tasks/Pages/TasksPage
 */

import React from 'react';
import { TasksLayout } from '../layouts/TasksLayout';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { TaskListView } from '../components/TaskListView';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { TaskCalendarView } from '../components/TaskCalendarView';
import { TaskTimelineView } from '../components/TaskTimelineView';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskBulkActionBar } from '../components/TaskBulkActionBar';
import { FocusModeModal } from '../components/FocusModeModal';
import { useTasks } from '../hooks/useTasks';
import { useTaskUIStore } from '../stores/useTaskUIStore';

export const TasksPage: React.FC = () => {
  const { displayedTasks, isLoading } = useTasks();
  const { activeView } = useTaskUIStore();

  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400">Loading tasks engine state...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'kanban':
        return <TaskKanbanBoard tasks={displayedTasks} />;
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
      {renderActiveView()}

      {/* Global Task Modals and Slide-Over Drawers */}
      <TaskDetailDrawer />
      <TaskFormModal />
      <TaskBulkActionBar />
      <FocusModeModal />
    </TasksLayout>
  );
};
