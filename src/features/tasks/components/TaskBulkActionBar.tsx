/**
 * @file TaskBulkActionBar.tsx
 * @description Floating action bar appearing when tasks are selected for bulk updates and deletes.
 * @module Features/Tasks/Components/TaskBulkActionBar
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trash2, Tag, AlertCircle, X, Layers } from 'lucide-react';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { TASK_CATEGORIES, PRIORITY_CONFIG, STATUS_CONFIG } from '../constants/taskConstants';
import { TaskPriority, TaskStatus } from '../types/task.types';

export const TaskBulkActionBar: React.FC = () => {
  const { selectedTaskIds, clearSelection } = useTaskUIStore();
  const { bulkDelete, bulkStatusChange, bulkPriorityChange } = useTaskMutations();

  const count = selectedTaskIds.length;

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl px-5 py-3 text-neutral-200 flex items-center gap-4 max-w-2xl w-[92vw] sm:w-auto"
        id="task-bulk-bar-container"
      >
        <div className="flex items-center gap-2 border-r border-neutral-800 pr-3">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-bold font-mono text-xs flex items-center justify-center">
            {count}
          </span>
          <span className="text-xs font-semibold text-neutral-100 hidden sm:inline">
            Selected
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
          {/* Quick Complete */}
          <button
            onClick={() => bulkStatusChange('done')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 text-xs font-medium flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
          </button>

          {/* Quick Priority Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                bulkPriorityChange(e.target.value as TaskPriority);
                e.target.value = '';
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none cursor-pointer shrink-0"
          >
            <option value="">Set Priority...</option>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          {/* Quick Status Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                bulkStatusChange(e.target.value as TaskStatus);
                e.target.value = '';
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none cursor-pointer shrink-0"
          >
            <option value="">Set Status...</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          {/* Bulk Delete */}
          <button
            onClick={bulkDelete}
            className="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-medium flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>

        {/* Clear Selection */}
        <button
          onClick={clearSelection}
          className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 ml-auto"
          title="Clear Selection"
          id="task-bulk-bar-clear"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
