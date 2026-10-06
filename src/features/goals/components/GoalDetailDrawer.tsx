/**
 * @file GoalDetailDrawer.tsx
 * @description Detail drawer for a specific goal, showing hierarchy, progress, related projects, milestones, tasks, and habits.
 * @module Features/Goals/Components
 */

import React from 'react';
import { X, Target, Calendar, CheckCircle2, Circle, AlertCircle, Play, Pause, Archive } from 'lucide-react';
import { useGoalStore } from '../stores/useGoalStore';
import { GoalItem, ProjectItem, MilestoneItem } from '../types/goal.types';

// Assuming we might need to tap into tasks/habits eventually, but sticking to existing data relationships for now.

export const GoalDetailDrawer: React.FC = () => {
  const { isDetailDrawerOpen, activeDetailGoalId, closeDetailDrawer, goals, projects, milestones } = useGoalStore();

  const goal = goals.find((g) => g.id === activeDetailGoalId);

  if (!isDetailDrawerOpen || !goal) return null;

  const goalProjects = projects.filter((p) => p.goalId === goal.id);
  const goalMilestones = milestones.filter((m) => m.goalId === goal.id || goalProjects.some((p) => p.id === m.projectId));

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 flex justify-end">
      <div 
        className="w-full max-w-lg bg-[var(--color-bg)] border-l border-[var(--color-border)] text-white shadow-2xl flex flex-col h-full"
        id="goal-detail-drawer"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between p-6 border-b border-[var(--color-border)]/50">
          <div className="flex gap-4 items-center">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm`} style={{ backgroundColor: goal.color || 'var(--color-accent)' }}>
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] block mb-1">
                {goal.category}
              </span>
              <h2 className="text-xl font-bold leading-tight">{goal.title}</h2>
            </div>
          </div>
          <button
            onClick={closeDetailDrawer}
            className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Progress & KPIs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text-secondary)] font-medium">Progress</span>
              <span className="text-white font-bold">{goal.progress}% {goal.status === 'in_progress' ? '· IN PROGRESS' : ''}</span>
            </div>
            <div className="h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Target Date</span>
                <span className="text-sm font-medium text-white">{formatDate(goal.targetDate)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-1">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Status</span>
                <span className="text-sm font-medium text-white capitalize">{goal.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Vision / Purpose */}
          {goal.visionStatement && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Vision / Purpose</span>
              <p className="italic text-[var(--color-text-secondary)] text-sm leading-relaxed p-4 bg-[var(--color-surface-elevated)]/50 rounded-xl border border-[var(--color-border)]/50 border-l-2 border-l-[var(--color-accent)]">
                "{goal.visionStatement}"
              </p>
            </div>
          )}

          {/* Description */}
          {goal.description && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Description</span>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {goal.description}
              </p>
            </div>
          )}

          {/* Projects */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between">
              Projects ({goalProjects.length})
            </span>
            {goalProjects.length > 0 ? (
              <div className="space-y-2">
                {goalProjects.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">{p.title}</h4>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">Target: {formatDate(p.targetDate)}</p>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-accent)]">{p.progress}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)]">No projects connected to this goal.</p>
            )}
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Milestones ({goalMilestones.length})
            </span>
            {goalMilestones.length > 0 ? (
              <div className="space-y-2">
                {goalMilestones.map(m => (
                  <div key={m.id} className="flex items-start gap-3 p-2">
                    {m.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : m.status === 'in_progress' ? (
                      <Play className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--color-text-secondary)] mt-0.5 shrink-0" />
                    )}
                    <div>
                      <h4 className={`text-sm font-medium ${m.status === 'completed' ? 'text-[var(--color-text-secondary)] line-through' : 'text-white'}`}>{m.title}</h4>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">Due {formatDate(m.dueDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)]">No milestones defined.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
