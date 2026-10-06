/**
 * @file TaskTimelineView.tsx
 * @description Timeline and Gantt-style progress chart for task duration tracking and scheduling.
 * @module Features/Tasks/Components/TaskTimelineView
 */

import React from 'react';
import { Clock, Calendar, CheckSquare, ChevronRight, Play } from 'lucide-react';
import { TaskItem } from '../types/task.types';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../constants/taskConstants';
import { formatDueDateLabel } from '../utils/taskDateUtils';

interface TaskTimelineViewProps {
  tasks: TaskItem[];
}

export const TaskTimelineView: React.FC<TaskTimelineViewProps> = ({ tasks }) => {
  const { openDetailDrawer, openFocusModal } = useTaskUIStore();

  return (
    <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-5 space-y-4" id="task-timeline-view">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <h2 className="text-sm font-bold text-neutral-100 font-mono tracking-wide uppercase">
            Task Timeline & Progress Schedule
          </h2>
          <p className="text-xs text-neutral-400">Execution roadmap with duration and completion tracking</p>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-400 border border-neutral-800">
          {tasks.length} Scheduled Items
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center text-neutral-500 text-xs font-mono">
          No tasks found for current timeline filter.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const pInfo = PRIORITY_CONFIG[task.priority];
            const sInfo = STATUS_CONFIG[task.status];

            return (
              <div
                key={task.id}
                onClick={() => openDetailDrawer(task.id)}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all duration-150 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${pInfo.bg} ${pInfo.color} ${pInfo.border}`}
                    >
                      {pInfo.label}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-100 truncate">{task.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {task.estimatedDuration || 30}m est.
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {formatDueDateLabel(task.dueDate, task.dueTime)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFocusModal(task.id);
                      }}
                      className="p-1 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                      title="Focus on this task"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Timeline Progress Track */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${sInfo.bg}`} />
                      {sInfo.label}
                    </span>
                    <span>{task.progress}% Progress</span>
                  </div>

                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
