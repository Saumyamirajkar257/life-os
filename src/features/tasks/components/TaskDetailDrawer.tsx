/**
 * @file TaskDetailDrawer.tsx
 * @description Slide-over inspection drawer for task details, subtasks, notes, and quick actions.
 * @module Features/Tasks/Components/TaskDetailDrawer
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  Pin,
  Star,
  Tag,
  Copy,
  Trash2,
  Archive,
  RotateCcw,
  Play,
  Edit2,
  Plus,
  CheckSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../constants/taskConstants';
import { formatDueDateLabel, isOverdue } from '../utils/taskDateUtils';


export const TaskDetailDrawer: React.FC = () => {
  const { activeDetailTaskId, closeDetailDrawer, openFormModal, openFocusModal } = useTaskUIStore();
  const { tasks, toggleSubtask, addSubtask, deleteSubtask, togglePinTask, toggleFavouriteTask } = useTaskStore();
  const { completeTask, undoComplete, deleteTask, duplicateTask, archiveTask, restoreTask } = useTaskMutations();

  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  const task = tasks.find((t) => t.id === activeDetailTaskId);

  if (!activeDetailTaskId || !task) return null;

  const priorityInfo = PRIORITY_CONFIG[task.priority];
  const statusInfo = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task.dueDate, task.status);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskInput.trim()) {
      addSubtask(task.id, newSubtaskInput.trim());
      setNewSubtaskInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={closeDetailDrawer}
      id="task-drawer-backdrop"
    >
      <div
        className="w-full max-w-lg bg-[var(--color-bg)] border-l border-[var(--color-border)] h-full flex flex-col text-[var(--color-text-primary)] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
        id="task-drawer-container"
      >
        {/* Top Navigation */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePinTask(task.id)}
              className={`p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-amber-400 hover:bg-[var(--color-surface)] ${task.isPinned ? 'text-amber-400' : ''}`}
              title="Pin Task"
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavouriteTask(task.id)}
              className={`p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-yellow-400 hover:bg-[var(--color-surface)] ${task.isFavourite ? 'text-yellow-400' : ''}`}
              title="Favourite Task"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={closeDetailDrawer}
            className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8">
          
          {/* Header Section */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => task.status === 'done' ? undoComplete(task.id, task.title) : completeTask(task.id, task.title)}
              className={`mt-1 shrink-0 transition-colors ${task.status === 'done' ? 'text-emerald-500' : 'text-[var(--color-text-secondary)] hover:text-emerald-400'}`}
            >
              {task.status === 'done' ? <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" /> : <Circle className="w-6 h-6" />}
            </button>
            <div className="flex-1">
              <h1 className={`text-xl sm:text-2xl font-semibold leading-tight ${task.status === 'done' ? 'line-through text-[var(--color-text-secondary)]' : 'text-white'}`}>
                {task.title}
              </h1>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div className="space-y-1">
              <span className="text-[var(--color-text-secondary)]">Status</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusInfo.bg}`} />
                <span className="font-medium">{statusInfo.label}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-[var(--color-text-secondary)]">Priority</span>
              <div className="flex items-center gap-2">
                {task.priority === 'urgent' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                {task.priority === 'medium' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                {task.priority === 'low' && <span className="w-2 h-2 rounded-full bg-neutral-500" />}
                <span className="font-medium">{priorityInfo.label}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--color-text-secondary)]">Due Date</span>
              <div className="flex items-center gap-2">
                {overdue && task.status !== 'done' ? (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                ) : (
                  <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                )}
                <span className={`font-medium ${overdue && task.status !== 'done' ? 'text-rose-400' : ''}`}>
                  {task.dueDate ? formatDueDateLabel(task.dueDate, task.dueTime) : 'No due date'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--color-text-secondary)]">Category</span>
              <div className="font-medium">{task.category || 'None'}</div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Subtasks */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> Subtasks
            </h3>
            
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleSubtask(task.id, subtask.id)} className={`${subtask.completed ? 'text-emerald-500' : 'text-[var(--color-text-secondary)]'}`}>
                      {subtask.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <span className={`text-sm ${subtask.completed ? 'line-through text-[var(--color-text-secondary)]' : 'text-white'}`}>
                      {subtask.title}
                    </span>
                  </div>
                  <button onClick={() => deleteSubtask(task.id, subtask.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-text-secondary)] hover:text-rose-400 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddSubtask} className="mt-2">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-secondary)]"
              />
            </form>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
                <Tag className="w-4 h-4" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs text-[var(--color-text-secondary)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-[var(--color-border)]/50 text-xs text-[var(--color-text-secondary)] flex items-center justify-between">
            <span>Created {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {task.updatedAt && <span>Updated {new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { openFormModal(task); closeDetailDrawer(); }}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { duplicateTask(task.id); closeDetailDrawer(); }}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => { task.status === 'archived' ? restoreTask(task.id) : archiveTask(task.id); closeDetailDrawer(); }}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] transition-colors"
              title={task.status === 'archived' ? 'Restore' : 'Archive'}
            >
              {task.status === 'archived' ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { deleteTask(task.id); closeDetailDrawer(); }}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => { openFocusModal(task.id); closeDetailDrawer(); }}
            className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" /> Focus
          </button>
        </div>
      </div>
    </div>
  );
};
