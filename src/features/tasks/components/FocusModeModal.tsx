/**
 * @file FocusModeModal.tsx
 * @description Fullscreen distraction-free execution mode for single task completion with integrated Pomodoro timer.
 * @module Features/Tasks/Components/FocusModeModal
 */

import React from 'react';
import { X, CheckCircle2, Circle, Flame, Target, Sparkles } from 'lucide-react';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { PomodoroTimer } from './PomodoroTimer';

export const FocusModeModal: React.FC = () => {
  const { isFocusModalOpen, closeFocusModal, focusedTaskId } = useTaskUIStore();
  const { tasks } = useTaskStore();
  const { completeTask, undoComplete } = useTaskMutations();

  if (!isFocusModalOpen) return null;

  const task = tasks.find((t) => t.id === focusedTaskId) || tasks[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-6 sm:p-12 text-neutral-100 animate-in fade-in duration-200"
      id="focus-mode-overlay"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono tracking-wider text-purple-400 uppercase">
              Aura Deep Execution Mode
            </h2>
            <p className="text-xs text-neutral-400">Distraction-free focus environment</p>
          </div>
        </div>

        <button
          onClick={closeFocusModal}
          className="px-4 py-2 text-xs font-mono rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 flex items-center gap-1.5"
          id="focus-mode-exit"
        >
          <X className="w-4 h-4" /> Exit Focus Mode
        </button>
      </div>

      {/* Centered Focus Core */}
      <div className="max-w-xl w-full mx-auto space-y-8 my-auto text-center">
        {task ? (
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/50 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Active Target Task
            </div>

            <h1 className="text-xl sm:text-2xl font-bold leading-snug text-neutral-100">
              {task.title}
            </h1>

            {task.description && (
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto line-clamp-3">
                {task.description}
              </p>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (task.status === 'done') {
                    undoComplete(task.id, task.title);
                  } else {
                    completeTask(task.id, task.title);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  task.status === 'done'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
                    : 'bg-emerald-400 text-neutral-950 border-emerald-300 hover:bg-emerald-300 shadow-lg shadow-emerald-950/40'
                }`}
              >
                {task.status === 'done' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Task Completed!
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" /> Mark Task Complete
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-neutral-500 text-xs font-mono">Select a task to focus on.</div>
        )}

        {/* Pomodoro Timer */}
        <PomodoroTimer />
      </div>

      {/* Footer Quote */}
      <div className="text-center text-xs font-mono text-neutral-400 border-t border-neutral-900 pt-4">
        "Focus is a muscle. Train it with deep work loops." — Aura Life OS
      </div>
    </div>
  );
};
