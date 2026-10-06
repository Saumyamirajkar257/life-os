/**
 * @file TaskItem.tsx
 * @description List item row representation for list view with quick status toggles and actions.
 * @module Features/Tasks/Components/TaskItem
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  Pin,
  Star,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { TaskItem as TaskItemType } from '../types/task.types';
import { PRIORITY_CONFIG } from '../constants/taskConstants';
import { formatDueDateLabel, isOverdue } from '../utils/taskDateUtils';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';

interface TaskItemProps {
  task: TaskItemType;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { togglePinTask, toggleFavouriteTask } = useTaskStore();
  const { openDetailDrawer, openFormModal, openFocusModal, selectedTaskIds, toggleSelectTask, focusedTaskId, setFocusedTask } = useTaskUIStore();
  const { completeTask, undoComplete, deleteTask, duplicateTask, archiveTask } = useTaskMutations();

  const isSelected = selectedTaskIds.includes(task.id);
  const isFocused = focusedTaskId === task.id;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => {
        setFocusedTask(task.id);
        openDetailDrawer(task.id);
      }}
      className={`group flex items-start gap-3 p-3 sm:px-4 rounded-xl transition-all duration-200 cursor-pointer ${
        task.status === 'done' ? 'opacity-50 hover:opacity-100' : ''
      } ${
        isFocused
          ? 'bg-[var(--color-surface-elevated)] ring-2 ring-[var(--color-accent)] shadow-md'
          : isSelected
          ? 'bg-[var(--color-surface-elevated)] ring-1 ring-[var(--color-accent)]/50'
          : 'hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-border)]/50'
      }`}
      id={`task-item-row-${task.id}`}
    >
      {/* Checkbox (Complete) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (task.status === 'done') {
            undoComplete(task.id, task.title);
          } else {
            completeTask(task.id, task.title);
          }
        }}
        className={`mt-0.5 shrink-0 transition-colors ${task.status === 'done' ? 'text-emerald-500' : 'text-[var(--color-text-secondary)] hover:text-emerald-400'}`}
        id={`task-item-complete-${task.id}`}
      >
        {task.status === 'done' ? (
          <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          {/* Title & Badges */}
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={`text-[15px] font-medium truncate ${
                  task.status === 'done' ? 'line-through text-[var(--color-text-secondary)]' : 'text-white'
                }`}
              >
                {task.title}
              </h4>
              {task.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />}
              {task.isFavourite && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/30 shrink-0" />}
            </div>

            {/* Meta row: Category, Subtasks, Due Date */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mt-1 flex-wrap">
              {task.category && (
                <span className="font-medium text-[var(--color-text-primary)]">
                  {task.category}
                </span>
              )}
              
              {task.category && (task.tags.length > 0 || task.subtasks.length > 0 || task.dueDate) && (
                <span className="text-[var(--color-text-secondary)]/50">·</span>
              )}

              {task.tags.slice(0, 2).map((t, idx) => (
                <span key={t} className="flex items-center gap-2">
                  <span>{t}</span>
                  {(idx < task.tags.slice(0, 2).length - 1 || task.subtasks.length > 0 || task.dueDate) && (
                    <span className="text-[var(--color-text-secondary)]/50">·</span>
                  )}
                </span>
              ))}

              {task.subtasks.length > 0 && (
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                  {task.dueDate && <span className="text-[var(--color-text-secondary)]/50 ml-1">·</span>}
                </span>
              )}

              {task.dueDate && (
                <span
                  className={`flex items-center gap-1 ${
                    overdue && task.status !== 'done' ? 'text-rose-400 font-medium' : ''
                  }`}
                >
                  {overdue && task.status !== 'done' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {formatDueDateLabel(task.dueDate, task.dueTime)}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Priority & Hover Actions */}
          <div className="flex items-center gap-3 shrink-0 mt-0.5">
            {/* Subtle Priority */}
            {task.priority === 'urgent' && <span className="w-2 h-2 rounded-full bg-rose-500" title="Urgent Priority" />}
            {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-amber-500" title="High Priority" />}
            {task.priority === 'medium' && <span className="w-2 h-2 rounded-full bg-blue-500" title="Medium Priority" />}
            
            {/* Actions visible on hover or keyboard focus */}
            <div className={`flex items-center gap-1 transition-opacity ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {isFocused && (
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)]">
                  ↵ view · x done
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFocusModal(task.id);
                }}
                className="px-2 py-1 text-xs font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-md transition-colors cursor-pointer"
                title="Deep Focus Mode"
              >
                Focus
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFormModal(task);
                }}
                className="px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] rounded-md transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
