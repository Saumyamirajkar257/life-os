/**
 * @file progressCalculator.ts
 * @description Automatic calculation engines for Goal, Project, and Milestone progress aggregation.
 * @module Features/Goals/Utils
 */

import { GoalItem, ProjectItem, MilestoneItem } from '../types/goal.types';

/**
 * Calculates project progress derived from its child milestones.
 */
export function calculateProjectProgress(
  project: ProjectItem,
  projectMilestones: MilestoneItem[]
): number {
  if (!projectMilestones || projectMilestones.length === 0) {
    return project.progress || 0;
  }

  const totalProgress = projectMilestones.reduce((acc, m) => {
    if (m.status === 'completed') return acc + 100;
    return acc + (m.progress || 0);
  }, 0);

  return Math.min(100, Math.max(0, Math.round(totalProgress / projectMilestones.length)));
}

/**
 * Calculates goal progress derived from its linked projects and standalone milestones.
 */
export function calculateGoalProgress(
  goal: GoalItem,
  goalProjects: ProjectItem[],
  goalMilestones: MilestoneItem[]
): number {
  // If there are linked projects or milestones, derive automatically
  const components: number[] = [];

  goalProjects.forEach((p) => {
    components.push(p.status === 'completed' ? 100 : p.progress || 0);
  });

  goalMilestones.forEach((m) => {
    components.push(m.status === 'completed' ? 100 : m.progress || 0);
  });

  if (components.length === 0) {
    return goal.progress || 0;
  }

  const sum = components.reduce((acc, val) => acc + val, 0);
  return Math.min(100, Math.max(0, Math.round(sum / components.length)));
}

/**
 * Computes estimated completion velocity and weeks remaining.
 */
export function calculateEstimatedCompletion(
  startDateStr: string,
  targetDateStr: string,
  progress: number
): { daysRemaining: number; weeksRemaining: number; isOnTrack: boolean; projectedCompletionDate: string } {
  const start = new Date(startDateStr).getTime() || Date.now() - 30 * 24 * 60 * 60 * 1000;
  const target = new Date(targetDateStr).getTime() || Date.now() + 60 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const totalDuration = Math.max(1, target - start);
  const elapsedDuration = Math.max(1, now - start);
  const expectedProgress = Math.min(100, (elapsedDuration / totalDuration) * 100);

  const daysRemaining = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
  const weeksRemaining = Math.max(0, Math.ceil(daysRemaining / 7));

  const isOnTrack = progress >= expectedProgress - 10;

  // Estimate projected completion date based on daily progress rate
  const daysElapsed = Math.max(1, Math.ceil(elapsedDuration / (1000 * 60 * 60 * 24)));
  const dailyRate = Math.max(0.01, progress / daysElapsed);
  const remainingProgress = Math.max(0, 100 - progress);
  const projectedDaysNeeded = Math.ceil(remainingProgress / dailyRate);

  const projectedDate = new Date(now + projectedDaysNeeded * 24 * 60 * 60 * 1000);
  const projectedCompletionDate = projectedDate.toISOString().split('T')[0];

  return {
    daysRemaining,
    weeksRemaining,
    isOnTrack,
    projectedCompletionDate,
  };
}
