'use client';

import { Calendar, Trash2, Edit3, Check } from 'lucide-react';
import { type Task } from '../types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) &&
    !task.completed;

  const priorityColors = {
    high: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]',
    medium: 'bg-zinc-400',
    low: 'bg-zinc-700',
  };

  const tagBorderColors: Record<string, string> = {
    Work: 'border-zinc-700 text-zinc-300',
    Personal: 'border-zinc-600 text-zinc-400',
    Health: 'border-zinc-800 text-zinc-500',
    Urgent: 'border-white text-white',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300",
        task.completed
          ? "bg-white/[0.01] border-white/5 opacity-50"
          : "glass-panel border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
      )}
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 shrink-0",
          task.completed
            ? "bg-white border-white text-black"
            : "border-white/20 group-hover:border-white/40 hover:scale-105"
        )}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h4
            className={cn(
              "text-sm font-medium transition-all duration-300 truncate",
              task.completed && "line-through text-white/30"
            )}
          >
            {task.title}
          </h4>

          {/* Action Buttons (Visible on Group Hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Edit Task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-3">
          {/* Due Date */}
          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-[11px] font-mono",
                isOverdue
                  ? "text-zinc-300 border-zinc-500 border px-2 py-0.5 rounded-md"
                  : "text-white/40"
              )}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{task.dueDate}</span>
              {isOverdue && <span className="ml-1 text-[9px] uppercase tracking-wider font-bold">Overdue</span>}
            </div>
          )}

          {/* Project */}
          {task.project && (
            <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-md">
              {task.project}
            </span>
          )}

          {/* Tags */}
          {task.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "text-[10px] font-mono border px-2 py-0.5 rounded-md",
                tagBorderColors[tag] || 'border-white/10 text-white/50'
              )}
            >
              {tag}
            </span>
          ))}

          {/* Priority Dot */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-mono text-white/30 capitalize">{task.priority}</span>
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", priorityColors[task.priority])} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
