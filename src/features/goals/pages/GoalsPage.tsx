/**
 * @file GoalsPage.tsx
 * @description Master page component for Goals & Projects OS (Milestone 14).
 * @module Features/Goals/Pages
 */

import React from 'react';
import { Target, Flag, Sparkles, Plus, Layers, Circle, Play, CheckCircle2 } from 'lucide-react';
import { useGoalStore } from '../stores/useGoalStore';
import { GoalCard } from '../components/GoalCard';
import { GoalDetailDrawer } from '../components/GoalDetailDrawer';

export const GoalsPage: React.FC = () => {
  const { goals, projects, milestones, openFormModal } = useGoalStore();

  const activeGoals = goals.filter(g => g.status !== 'completed' && g.status !== 'archived');
  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'archived');
  const upcomingMilestones = milestones
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())
    .slice(0, 5); // Just show top 5 upcoming

  const overallProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length) 
    : 0;

  // Retrieve the first vision statement available for display, or show empty state if none
  const mainVision = activeGoals.find(g => g.visionStatement)?.visionStatement;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-screen space-y-12">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">GOALS</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Turn long-term plans into measurable progress.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex gap-4 sm:gap-6 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-[var(--color-text-secondary)] uppercase">Active</span>
              <span className="text-white font-bold">{activeGoals.length} goals</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--color-text-secondary)] uppercase">Projects</span>
              <span className="text-white font-bold">{activeProjects.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--color-text-secondary)] uppercase">Progress</span>
              <span className="text-[var(--color-accent)] font-bold">{overallProgress}%</span>
            </div>
          </div>
          
          <button
            onClick={() => openFormModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* 2. VISION */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">My Direction</h2>
        {mainVision ? (
          <div className="p-6 md:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
            <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed">
              "{mainVision}"
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed text-center space-y-4 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-white">DEFINE YOUR DIRECTION</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Start with the bigger picture. Why are you setting these goals?</p>
            <button
              onClick={() => openFormModal()}
              className="inline-flex px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-white text-xs font-bold hover:border-[var(--color-text-secondary)] transition-colors"
            >
              Create Vision
            </button>
          </div>
        )}
      </section>

      {/* Empty States Handling */}
      {goals.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed text-center space-y-4 max-w-2xl mx-auto w-full">
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">START WITH A DIRECTION</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Goals turn your long-term vision into something you can act on.</p>
          <button
            onClick={() => openFormModal()}
            className="mt-4 px-6 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>
      ) : (
        <>
          {/* 3. ACTIVE GOALS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Active Goals</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {activeGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>

            {/* If there are goals, but no projects */}
            {activeGoals.length > 0 && projects.length === 0 && (
              <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">YOUR GOAL NEEDS A PROJECT</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">Break this goal into a project to start moving forward.</p>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-white text-xs font-bold hover:border-[var(--color-text-secondary)] transition-colors shrink-0"
                >
                  + Add Project
                </button>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* 6. PROJECTS */}
            <section className="space-y-4">
              <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Active Projects</h2>
              <div className="space-y-3">
                {activeProjects.map(project => {
                  const parentGoal = goals.find(g => g.id === project.goalId);
                  return (
                    <div key={project.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer group flex items-center justify-between">
                      <div className="flex flex-col gap-1.5 w-full pr-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">{project.title}</h4>
                          <span className="text-[10px] text-white font-bold">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--color-accent)] transition-all duration-500" 
                            style={{ width: `${project.progress}%` }} 
                          />
                        </div>
                        {parentGoal && (
                          <span className="text-[10px] text-[var(--color-text-secondary)] mt-1 line-clamp-1">Goal: {parentGoal.title}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {activeProjects.length === 0 && projects.length > 0 && (
                  <p className="text-sm text-[var(--color-text-secondary)] italic">No active projects found.</p>
                )}
              </div>
            </section>

            {/* 7. MILESTONES */}
            <section className="space-y-4">
              <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Upcoming Milestones</h2>
              <div className="space-y-3">
                {upcomingMilestones.map(milestone => {
                  const isCompleted = milestone.status === 'completed';
                  const isInProgress = milestone.status === 'in_progress';
                  return (
                    <div key={milestone.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer flex items-start gap-3 group">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isInProgress ? (
                          <Play className="w-4 h-4 text-[var(--color-accent)]" />
                        ) : (
                          <Circle className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white group-hover:text-[var(--color-accent)] transition-colors">{milestone.title}</h4>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Due {formatDate(milestone.dueDate)}</p>
                      </div>
                    </div>
                  );
                })}

                {/* If there are projects, but no milestones */}
                {upcomingMilestones.length === 0 && projects.length > 0 && milestones.length === 0 && (
                  <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">ADD YOUR NEXT MILESTONE</h3>
                      <p className="text-xs text-[var(--color-text-secondary)]">Define the next measurable step.</p>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-white text-xs font-bold hover:border-[var(--color-text-secondary)] transition-colors shrink-0"
                    >
                      + Add Milestone
                    </button>
                  </div>
                )}
                
                {upcomingMilestones.length === 0 && milestones.length > 0 && (
                  <p className="text-sm text-[var(--color-text-secondary)] italic">No upcoming milestones found.</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}

      <GoalDetailDrawer />
    </div>
  );
};
