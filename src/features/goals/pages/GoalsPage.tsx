/**
 * @file GoalsPage.tsx
 * @description Master page component for Goals & Projects OS with clean editorial hierarchy for Aura Life OS 2.0.
 * @module Features/Goals/Pages
 */

import React from 'react';
import { Target, Flag, Sparkles, Plus, Layers, Circle, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { useGoalStore } from '../stores/useGoalStore';
import { GoalCard } from '../components/GoalCard';
import { GoalDetailDrawer } from '../components/GoalDetailDrawer';
import { GoalFormModal } from '../components/GoalFormModal';

export const GoalsPage: React.FC = () => {
  const { goals, projects, milestones, openFormModal, loadGoals } = useGoalStore();

  React.useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const activeGoals = goals.filter((g) => g.status !== 'completed' && g.status !== 'archived');
  const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'archived');
  const upcomingMilestones = milestones
    .filter((m) => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())
    .slice(0, 5);

  const overallProgress =
    activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
      : 0;

  const mainVision = activeGoals.find((g) => g.visionStatement)?.visionStatement;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full min-h-screen space-y-8">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)]/60 pb-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
            Life Strategy & Alignment
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Goals & <span className="font-semibold">Milestones</span>
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Turn long-term aspirations into tangible weekly executions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-xs font-mono border-r border-[var(--color-border)] pr-4">
            <div className="flex flex-col">
              <span className="text-[var(--color-text-muted)] uppercase text-[10px]">Active Goals</span>
              <span className="text-white font-medium">{activeGoals.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--color-text-muted)] uppercase text-[10px]">Projects</span>
              <span className="text-white font-medium">{activeProjects.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--color-text-muted)] uppercase text-[10px]">Average</span>
              <span className="text-white font-medium">{overallProgress}%</span>
            </div>
          </div>

          <button
            onClick={() => openFormModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* 2. VISION STATEMENT — "WHERE AM I GOING?" */}
      <section className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
            WHERE AM I GOING? · Vision
          </h2>
        </div>
        {mainVision ? (
          <p className="text-base sm:text-lg text-neutral-200 font-serif italic leading-relaxed">
            "{mainVision}"
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-[var(--color-text-secondary)]">
              No vision statement defined yet. Frame your guiding purpose to orient daily decisions.
            </p>
            <button
              onClick={() => openFormModal()}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] text-white text-xs font-medium border border-[var(--color-border)] transition-colors cursor-pointer shrink-0"
            >
              Set Vision
            </button>
          </div>
        )}
      </section>

      {/* EMPTY STATE */}
      {goals.length === 0 ? (
        <div className="py-16 px-4 rounded-2xl bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-neutral-300 flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">Define Your First Goal</h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Connect high-level aspirations to projects, milestones, and daily habits.
          </p>
          <button
            onClick={() => openFormModal()}
            className="mt-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      ) : (
        <>
          {/* 3. ACTIVE GOALS GRID — BALANCED 3-COLUMN */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Active Goals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </section>

          {/* 4. SPLIT HIERARCHY: WHAT AM I WORKING ON? & WHAT IS NEXT? */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* PROJECTS — WHAT AM I WORKING ON? (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border)]">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  WHAT AM I WORKING ON? · Projects
                </h2>
              </div>

              {activeProjects.length > 0 ? (
                <div className="space-y-2.5">
                  {activeProjects.map((project) => {
                    const parentGoal = goals.find((g) => g.id === project.goalId);
                    return (
                      <div
                        key={project.id}
                        className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-neutral-700 transition-colors cursor-pointer group space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-neutral-200 group-hover:text-white truncate">
                            {project.title}
                          </span>
                          <span className="font-mono text-[var(--color-text-muted)]">
                            {project.progress}%
                          </span>
                        </div>

                        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>

                        {parentGoal && (
                          <div className="text-[10px] text-[var(--color-text-muted)] truncate">
                            Goal: {parentGoal.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 px-4 rounded-xl bg-[var(--color-surface)]/50 border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
                  No active projects currently linked to goals.
                </div>
              )}
            </div>

            {/* MILESTONES — WHAT IS NEXT? (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border)]">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  WHAT IS NEXT? · Milestones
                </h2>
              </div>

              {upcomingMilestones.length > 0 ? (
                <div className="space-y-2.5">
                  {upcomingMilestones.map((milestone) => {
                    const isCompleted = milestone.status === 'completed';
                    const isInProgress = milestone.status === 'in_progress';
                    return (
                      <div
                        key={milestone.id}
                        className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-neutral-700 transition-colors flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isInProgress ? (
                            <Play className="w-4 h-4 text-white shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 shrink-0" />
                          )}
                          <span className="font-medium text-neutral-200 truncate">
                            {milestone.title}
                          </span>
                        </div>

                        {milestone.dueDate && (
                          <span className="text-[11px] font-mono text-[var(--color-text-muted)] shrink-0">
                            Due {formatDate(milestone.dueDate)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 px-4 rounded-xl bg-[var(--color-surface)]/50 border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
                  No upcoming milestones scheduled.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <GoalDetailDrawer />
      <GoalFormModal />
    </div>
  );
};

export default GoalsPage;
