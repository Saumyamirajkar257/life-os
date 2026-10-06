/**
 * @file TaskEisenhowerMatrix.tsx
 * @description Eisenhower 2x2 Decision Matrix view for strategic task prioritization.
 * Divides tasks into Urgent/Important quadrants with drag-and-drop categorization.
 * @module Features/Tasks/Components/TaskEisenhowerMatrix
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Calendar,
  Users,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { TaskItem, TaskPriority, TaskStatus } from '../types/task.types';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { isOverdue } from '../utils/taskDateUtils';

interface TaskEisenhowerMatrixProps {
  tasks: TaskItem[];
}

interface QuadrantConfig {
  id: 'q1' | 'q2' | 'q3' | 'q4';
  title: string;
  subtitle: string;
  actionLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  defaultPriority: TaskPriority;
}

const QUADRANTS: QuadrantConfig[] = [
  {
    id: 'q1',
    title: 'Do First',
    subtitle: 'Urgent & Important',
    actionLabel: 'Immediate Action Required',
    icon: Flame,
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
    borderColor: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400',
    defaultPriority: 'urgent',
  },
  {
    id: 'q2',
    title: 'Schedule',
    subtitle: 'Not Urgent & Important',
    actionLabel: 'Long-term Strategic Value',
    icon: Calendar,
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    borderColor: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    defaultPriority: 'high',
  },
  {
    id: 'q3',
    title: 'Delegate',
    subtitle: 'Urgent & Not Important',
    actionLabel: 'Triage or Automate',
    icon: Users,
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    defaultPriority: 'medium',
  },
  {
    id: 'q4',
    title: 'Eliminate',
    subtitle: 'Not Urgent & Not Important',
    actionLabel: 'Drop or Reconsider',
    icon: Trash2,
    accentColor: '#71717a',
    bgGradient: 'from-neutral-500/10 via-neutral-500/5 to-transparent',
    borderColor: 'border-neutral-700/50',
    badgeBg: 'bg-neutral-800/60',
    badgeText: 'text-neutral-400',
    defaultPriority: 'none',
  },
];

export const TaskEisenhowerMatrix: React.FC<TaskEisenhowerMatrixProps> = ({ tasks }) => {
  const { openDetailDrawer, openFormModal } = useTaskUIStore();
  const { completeTask, undoComplete, updateTask, createTask } = useTaskMutations();

  // Classify active tasks into 4 Eisenhower quadrants based on priority and due urgency
  const categorizedTasks = React.useMemo(() => {
    const q1: TaskItem[] = [];
    const q2: TaskItem[] = [];
    const q3: TaskItem[] = [];
    const q4: TaskItem[] = [];

    const activeTasks = tasks.filter((t) => t.status !== 'archived');

    activeTasks.forEach((t) => {
      const overdueOrDueSoon = isOverdue(t.dueDate, t.status) || t.dueDate === new Date().toISOString().split('T')[0];

      if (t.priority === 'urgent' || (t.priority === 'high' && overdueOrDueSoon)) {
        q1.push(t);
      } else if (t.priority === 'high' || (t.priority === 'medium' && !overdueOrDueSoon)) {
        q2.push(t);
      } else if (t.priority === 'medium' && overdueOrDueSoon) {
        q3.push(t);
      } else {
        q4.push(t);
      }
    });

    return { q1, q2, q3, q4 };
  }, [tasks]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, quadrantId: 'q1' | 'q2' | 'q3' | 'q4') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const targetQuadrant = QUADRANTS.find((q) => q.id === quadrantId);
    if (!targetQuadrant) return;

    updateTask(taskId, {
      priority: targetQuadrant.defaultPriority,
    });
  };

  const handleQuickAdd = (quadrant: QuadrantConfig) => {
    createTask({
      title: `New ${quadrant.title} action`,
      priority: quadrant.defaultPriority,
      status: 'todo',
      category: 'Work & Engineering',
      estimatedDuration: 30,
      tags: ['Matrix', quadrant.title],
      isPinned: false,
      isFavourite: false,
      recurrence: 'none',
      progress: 0,
      labels: [],
      attachments: [],
      subtasks: [],
    });
  };

  return (
    <div className="space-y-4 pb-12" id="task-eisenhower-matrix-container">
      {/* Top Matrix Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div>
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            Eisenhower Decision Matrix
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Categorize cognitive load by urgency versus importance. Drag and drop items between quadrants.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Urgent: {categorizedTasks.q1.length + categorizedTasks.q3.length}
          </span>
          <span className="text-[var(--color-border)]">|</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Important: {categorizedTasks.q1.length + categorizedTasks.q2.length}
          </span>
        </div>
      </div>

      {/* 2x2 Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {QUADRANTS.map((quadrant) => {
          const items = categorizedTasks[quadrant.id];
          const completedCount = items.filter((t) => t.status === 'done').length;
          const completionPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
          const Icon = quadrant.icon;

          return (
            <div
              key={quadrant.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, quadrant.id)}
              className={`flex flex-col rounded-2xl p-5 border bg-gradient-to-b ${quadrant.bgGradient} ${quadrant.borderColor} bg-[var(--color-surface)] min-h-[380px] transition-all`}
              id={`matrix-quadrant-${quadrant.id}`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-xl border"
                    style={{
                      backgroundColor: `${quadrant.accentColor}15`,
                      borderColor: `${quadrant.accentColor}30`,
                      color: quadrant.accentColor,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                        {quadrant.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${quadrant.badgeBg} ${quadrant.badgeText}`}>
                        {quadrant.subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{quadrant.actionLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-[var(--color-text-secondary)]">
                    {completedCount}/{items.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(quadrant)}
                    className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                    title={`Add task to ${quadrant.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--color-border)]/40 h-1 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${completionPct}%`,
                    backgroundColor: quadrant.accentColor,
                  }}
                />
              </div>

              {/* Task Items List */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[320px] pr-1 scrollbar-none">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
                      <p className="text-xs font-mono">No tasks in this quadrant</p>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(quadrant)}
                        className="mt-2 text-[11px] text-[var(--color-accent)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Quick Add
                      </button>
                    </div>
                  ) : (
                    items.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        draggable
                        onDragStart={(e: any) => {
                          e.dataTransfer?.setData('text/plain', task.id);
                        }}
                        onClick={() => openDetailDrawer(task.id)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)]/50 transition-all cursor-pointer ${
                          task.status === 'done' ? 'opacity-50 line-through' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
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
                            className={`shrink-0 transition-colors ${
                              task.status === 'done' ? 'text-emerald-500' : 'text-[var(--color-text-muted)] hover:text-emerald-400'
                            }`}
                          >
                            {task.status === 'done' ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <div className="truncate">
                            <span className="text-xs font-medium text-[var(--color-text-primary)] block truncate">
                              {task.title}
                            </span>
                            {task.dueDate && (
                              <span className="text-[10px] font-mono text-[var(--color-text-muted)] flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                            {task.category}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
