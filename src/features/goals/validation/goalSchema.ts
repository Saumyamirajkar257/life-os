/**
 * @file goalSchema.ts
 * @description Validation rules and sanitization schemas for Goal, Project, and Milestone entities.
 * @module Features/Goals/Validation
 */

import { GoalItem, ProjectItem, MilestoneItem } from '../types/goal.types';

export interface GoalValidationError {
  field: string;
  message: string;
}

export function validateGoalPayload(goal: Partial<GoalItem>): GoalValidationError[] {
  const errors: GoalValidationError[] = [];

  if (!goal.title || goal.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Goal title is required.' });
  } else if (goal.title.length > 200) {
    errors.push({ field: 'title', message: 'Goal title cannot exceed 200 characters.' });
  }

  if (goal.description && goal.description.length > 5000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 5000 characters.' });
  }

  if (goal.motivationStatement && goal.motivationStatement.length > 2000) {
    errors.push({ field: 'motivationStatement', message: 'Motivation statement cannot exceed 2000 characters.' });
  }

  if (goal.visionStatement && goal.visionStatement.length > 2000) {
    errors.push({ field: 'visionStatement', message: 'Vision statement cannot exceed 2000 characters.' });
  }

  if (goal.progress !== undefined && (goal.progress < 0 || goal.progress > 100)) {
    errors.push({ field: 'progress', message: 'Progress percentage must be between 0 and 100.' });
  }

  return errors;
}

export function validateProjectPayload(project: Partial<ProjectItem>): GoalValidationError[] {
  const errors: GoalValidationError[] = [];

  if (!project.title || project.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Project title is required.' });
  } else if (project.title.length > 200) {
    errors.push({ field: 'title', message: 'Project title cannot exceed 200 characters.' });
  }

  if (project.description && project.description.length > 5000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 5000 characters.' });
  }

  if (project.progress !== undefined && (project.progress < 0 || project.progress > 100)) {
    errors.push({ field: 'progress', message: 'Progress must be between 0 and 100.' });
  }

  return errors;
}

export function validateMilestonePayload(milestone: Partial<MilestoneItem>): GoalValidationError[] {
  const errors: GoalValidationError[] = [];

  if (!milestone.title || milestone.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Milestone title is required.' });
  } else if (milestone.title.length > 200) {
    errors.push({ field: 'title', message: 'Milestone title cannot exceed 200 characters.' });
  }

  if (!milestone.projectId) {
    errors.push({ field: 'projectId', message: 'Milestone must be associated with a parent Project.' });
  }

  return errors;
}
