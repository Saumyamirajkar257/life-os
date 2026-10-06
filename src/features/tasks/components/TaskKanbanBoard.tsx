/**
 * @file TaskKanbanBoard.tsx
 * @description Interactive Kanban board component with status columns, drop zones, and quick status changes.
 * @module Features/Tasks/Components/TaskKanbanBoard
 */

import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskItem, TaskStatus } from '../types/task.types';
import { STATUS_CONFIG } from '../constants/taskConstants';
import { TaskCard } from './TaskCard';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';

interface TaskKanbanBoardProps {
  tasks: TaskItem[];
}

const KANBAN_COLUMNS: TaskStatus[] = ['inbox', 'todo', 'in_progress', 'done'];

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({ tasks }) => {
  const { openFormModal } = useTaskUIStore();
  const { updateTask } = useTaskMutations();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, {
        status: newStatus,
        progress: newStatus === 'done' ? 100 : newStatus === 'in_progress' ? 50 : 0,
        completedAt: newStatus === 'done' ? new Date().toISOString() : null,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-8" id="task-kanban-board">
      {KANBAN_COLUMNS.map((columnStatus) => {
        const config = STATUS_CONFIG[columnStatus];
        const columnTasks = tasks.filter((t) => t.status === columnStatus);

        return (
          <div
            key={columnStatus}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnStatus)}
            className="flex flex-col rounded-2xl bg-neutral-950/60 border border-neutral-800/80 p-3.5 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${config.bg} border ${config.border}`} />
                <h3 className="text-xs font-bold text-neutral-200 tracking-wide uppercase font-mono">
                  {config.label}
                </h3>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700/60">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openFormModal(null, columnStatus === 'inbox' ? 'Inbox' : 'Work & Engineering')}
                className="p-1 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
                title="Add task to column"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards Column List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-800/80 rounded-xl text-neutral-600 text-xs text-center p-4">
                  <span>No tasks in {config.label}</span>
                  <span className="text-[10px] mt-1 text-neutral-500">Drag items here or click +</span>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', task.id);
                    }}
                  >
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
