/**
 * @file GoalCard.tsx
 * @description Card representing a strategic active goal.
 * @module Features/Goals/Components
 */

import React from 'react';
import { Target, Calendar, ChevronRight, LayoutList, Layers } from 'lucide-react';
import { useGoalStore } from '../stores/useGoalStore';
import { GoalItem } from '../types/goal.types';

interface GoalCardProps {
  goal: GoalItem;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { openDetailDrawer, projects, milestones } = useGoalStore();

  const goalProjects = projects.filter(p => p.goalId === goal.id);
  const goalMilestones = milestones.filter(m => m.goalId === goal.id || goalProjects.some(p => p.id === m.projectId));

  // Determine next milestone
  const nextMilestone = goalMilestones
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const getStatusText = () => {
    if (goal.status === 'not_started') return 'Not Started';
    if (goal.status === 'paused') return 'Paused';
    if (goal.status === 'completed') return 'Completed';
    // Logic: If past due date, might be at risk. For now, just use 'In Progress' if none else.
    // The prompt says "Only use statuses already supported by the existing goal model... If the existing system calculates status differently, preserve that logic."
    // `goal.status` is directly on the model. It's 'in_progress', 'not_started', etc.
    return 'In Progress';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-accent)]/50 transition-colors group shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: goal.color || 'var(--color-accent)' }}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-[var(--color-accent)] transition-colors leading-tight line-clamp-1">{goal.title}</h3>
            {goal.description && <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-1">{goal.description}</p>}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="text-[var(--color-text-secondary)]">{getStatusText()}</span>
            <span className="text-white">{goal.progress}%</span>
          </div>
          <div className="h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider">
          {goal.targetDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(goal.targetDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{goalProjects.length} Proj · {goalMilestones.length} Mile</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--color-border)]/50 flex flex-col gap-2">
          {nextMilestone ? (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-wider">Next Step</span>
              <span className="text-xs text-white line-clamp-1">{nextMilestone.title}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Next Step</span>
              <span className="text-xs text-[var(--color-text-secondary)] italic line-clamp-1">No next milestone defined</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => openDetailDrawer(goal.id)}
          className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-white bg-[var(--color-surface-elevated)] rounded-lg transition-colors mt-2"
        >
          <span>Open Goal</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
