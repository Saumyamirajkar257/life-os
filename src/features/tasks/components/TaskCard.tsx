/**
 * @file TaskCard.tsx
 * @description Compact task card component used in Kanban board and grid layouts with motion animations.
 * @module Features/Tasks/Components/TaskCard
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Pin,
  Star,
  CheckSquare,
  AlertCircle,
  MoreVertical,
  Paperclip,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { TaskItem } from '../types/task.types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../constants/taskConstants';
import { formatDueDateLabel, isOverdue } from '../utils/taskDateUtils';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';

interface TaskCardProps {
  task: TaskItem;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { togglePinTask, toggleFavouriteTask } = useTaskStore();
  const { openDetailDrawer, openFormModal, selectedTaskIds, toggleSelectTask } = useTaskUIStore();
  const { completeTask, undoComplete } = useTaskMutations();

  const isSelected = selectedTaskIds.includes(task.id);
  const priorityInfo = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={() => openDetailDrawer(task.id)}
      className={`group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700 hover:shadow-lg ${
        task.status === 'done' ? 'opacity-65' : ''
      } ${isSelected ? 'ring-2 ring-emerald-500/50 bg-emerald-950/20' : ''}`}
      id={`task-card-${task.id}`}
    >
      {/* Top Header: Select Checkbox, Category & Badges */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelectTask(task.id);
            }}
            className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer shrink-0"
            id={`task-card-select-${task.id}`}
          />
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700/60 truncate">
            {task.category}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {task.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400/20" />}
          {task.isFavourite && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400/30" />}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${priorityInfo.bg} ${priorityInfo.color} ${priorityInfo.border}`}
          >
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* Main Title & Complete Toggle */}
      <div className="flex items-start gap-2.5 mb-2">
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
          className="mt-0.5 text-neutral-400 hover:text-emerald-400 transition-colors shrink-0"
          id={`task-card-toggle-${task.id}`}
        >
          {task.status === 'done' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Circle className="w-4 h-4 hover:border-emerald-400" />
          )}
        </button>

        <h3
          className={`text-sm font-semibold text-neutral-100 leading-snug line-clamp-2 ${
            task.status === 'done' ? 'line-through text-neutral-400' : ''
          }`}
        >
          {task.title}
        </h3>
      </div>

      {/* Optional Description Preview */}
      {task.description && (
        <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Progress Bar if subtasks exist */}
      {totalSubtasks > 0 && (
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 font-mono">
              <CheckSquare className="w-3 h-3 text-emerald-400" />
              {completedSubtasks}/{totalSubtasks} subtasks
            </span>
            <span className="font-mono">{task.progress}%</span>
          </div>
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Metadata Footer */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/60">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 font-mono ${
                overdue ? 'text-rose-400 font-semibold' : 'text-neutral-400'
              }`}
            >
              {overdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {formatDueDateLabel(task.dueDate, task.dueTime)}
            </span>
          )}

          {task.estimatedDuration ? (
            <span className="font-mono text-neutral-500">
              {task.estimatedDuration}m
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-neutral-500">
              <Paperclip className="w-3 h-3" />
              {task.attachments.length}
            </span>
          )}

          {/* Quick Edit Hover Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFormModal(task);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-200 rounded hover:bg-neutral-800 transition-opacity"
            title="Edit task"
            id={`task-card-edit-${task.id}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
