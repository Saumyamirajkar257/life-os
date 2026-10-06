/**
 * @file TaskListView.tsx
 * @description List view component supporting smart grouping and clean consumer-focused empty states.
 * @module Features/Tasks/Components/TaskListView
 */

import React from 'react';
import { TaskItem as TaskItemType } from '../types/task.types';
import { TaskItem } from './TaskItem';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { groupTasks } from '../utils/taskSortFilter';
import { Plus, Inbox, CheckCircle2 } from 'lucide-react';
import { isOverdue } from '../utils/taskDateUtils';


interface TaskListViewProps {
  tasks: TaskItemType[];
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {
  const { groupBy, openFormModal } = useTaskUIStore();
  const { activeView, setActiveView } = useTaskFilters();

  const grouped = groupTasks(tasks, groupBy);
  const allIds = tasks.map((t) => t.id);

  // Smart Grouping for Today View
  const renderSmartTodayGrouping = () => {
    const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status) && t.status !== 'done');
    const today = tasks.filter(t => !isOverdue(t.dueDate, t.status) && t.status !== 'done');
    const completed = tasks.filter(t => t.status === 'done');

    return (
      <div className="space-y-8">
        {overdue.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 pl-1">Overdue</h3>
            {overdue.map(task => <TaskItem key={task.id} task={task} />)}
          </div>
        )}
        
        {today.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3 pl-1">Due Today</h3>
            {today.map(task => <TaskItem key={task.id} task={task} />)}
          </div>
        )}

        {completed.length > 0 && (
          <div className="space-y-2 opacity-70">
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3 pl-1">Completed</h3>
            {completed.map(task => <TaskItem key={task.id} task={task} />)}
          </div>
        )}
      </div>
    );
  };

  if (tasks.length === 0) {
    if (activeView === 'today') {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Today is clear</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Nothing needs your attention right now.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => openFormModal()}
              className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:opacity-90 text-white font-medium flex items-center gap-2 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
            <button
              onClick={() => setActiveView('upcoming')}
              className="px-6 py-2.5 rounded-xl bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] font-medium transition-colors"
            >
              View Upcoming
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-6 border border-[var(--color-border)]">
          <Inbox className="w-8 h-8 text-[var(--color-text-secondary)]" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No tasks found</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">Your list is empty. Take a break or add something new.</p>
        <button
          onClick={() => openFormModal()}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] hover:opacity-90 text-white font-medium flex items-center gap-2 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="task-list-view">
      {activeView === 'today' && groupBy === 'none' ? (
        renderSmartTodayGrouping()
      ) : (
        Object.entries(grouped).map(([groupKey, groupTasksList]) => (
          <div key={groupKey} className="space-y-2">
            {groupBy !== 'none' && (
              <div className="flex items-center gap-2 pt-2 pb-1 border-b border-[var(--color-border)]/50">
                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {groupKey}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                  {groupTasksList.length}
                </span>
              </div>
            )}
            <div className="space-y-1">
              {groupTasksList.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
