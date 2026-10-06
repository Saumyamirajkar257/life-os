/**
 * @file TaskFormModal.tsx
 * @description Modal dialog for creating and editing tasks with full property support and Zod validation.
 * @module Features/Tasks/Components/TaskFormModal
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Pin,
  Star,
  CheckSquare,
  AlignLeft,
  Flame,
} from 'lucide-react';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { TASK_CATEGORIES, PRIORITY_CONFIG, STATUS_CONFIG } from '../constants/taskConstants';
import { TaskPriority, TaskStatus, TaskRecurrence } from '../types/task.types';
import { taskSchema } from '../validation/taskSchema';

export const TaskFormModal: React.FC = () => {
  const { isFormModalOpen, closeFormModal, editingTask, formInitialCategory } = useTaskUIStore();
  const { createTask, updateTask } = useTaskMutations();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('inbox');
  const [priority, setPriority] = useState<TaskPriority>('none');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState('Inbox');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(30);
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  const [isPinned, setIsPinned] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
      setCategory(editingTask.category || 'Inbox');
      setTags(editingTask.tags || []);
      setNotes(editingTask.notes || '');
      setEstimatedDuration(editingTask.estimatedDuration || 30);
      setRecurrence(editingTask.recurrence || 'none');
      setIsPinned(editingTask.isPinned);
      setIsFavourite(editingTask.isFavourite);
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('inbox');
      setPriority('none');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('12:00');
      setCategory(formInitialCategory || 'Inbox');
      setTags([]);
      setNotes('');
      setEstimatedDuration(30);
      setRecurrence('none');
      setIsPinned(false);
      setIsFavourite(false);
      setSubtasks([]);
    }
    setValidationError(null);
  }, [editingTask, isFormModalOpen, formInitialCategory]);

  if (!isFormModalOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      category,
      tags,
      notes: notes.trim(),
      estimatedDuration: Number(estimatedDuration) || 0,
      actualDuration: editingTask?.actualDuration || 0,
      progress: editingTask?.progress || 0,
      recurrence,
      isPinned,
      isFavourite,
      subtasks,
      labels: editingTask?.labels || [],
      attachments: editingTask?.attachments || [],
    };

    // Zod Validation
    const validationResult = taskSchema.safeParse(payload);
    if (!validationResult.success) {
      setValidationError(validationResult.error.issues[0]?.message || 'Invalid task input');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      createTask(payload);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
      onClick={closeFormModal}
      id="task-form-backdrop"
    >
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="task-form-container"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-xs text-neutral-400">Specify details, due dates, and priorities</p>
            </div>
          </div>

          <button
            onClick={closeFormModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800"
            id="task-form-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {validationError && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Title & Pinned/Fav Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Task Title *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border transition-colors ${
                    isPinned
                      ? 'bg-amber-950/40 border-amber-800/50 text-amber-400'
                      : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" /> Pinned
                </button>
                <button
                  type="button"
                  onClick={() => setIsFavourite(!isFavourite)}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border transition-colors ${
                    isFavourite
                      ? 'bg-yellow-950/40 border-yellow-800/50 text-yellow-400'
                      : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" /> Favourite
                </button>
              </div>
            </div>

            <input
              type="text"
              required
              placeholder="e.g., Complete Milestone 12 Tasks Module implementation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500/60"
              id="task-form-title-input"
            />
          </div>

          {/* Status, Priority & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/60"
                id="task-form-status-select"
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/60"
                id="task-form-priority-select"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/60"
                id="task-form-category-select"
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/60"
                id="task-form-duedate-input"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" /> Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/60"
                id="task-form-duetime-input"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                Estimated Duration (min)
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500/60 font-mono"
                id="task-form-duration-input"
              />
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-neutral-400" /> Description (Rich Text / Notes)
            </label>
            <textarea
              rows={3}
              placeholder="Add contextual details, links, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed"
              id="task-form-description-textarea"
            />
          </div>

          {/* Subtasks Section */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
              Subtasks ({subtasks.length})
            </label>
            <div className="space-y-2 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs"
                >
                  <span className="text-neutral-200">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="p-1 text-neutral-500 hover:text-rose-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none"
                id="task-form-subtask-input"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-neutral-400" /> Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                >
                  #{t}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-emerald-200"
                    onClick={() => handleRemoveTag(t)}
                  />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none"
                id="task-form-tag-input"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-950/30 transition-all"
              id="task-form-submit-button"
            >
              {editingTask ? 'Save Task Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
