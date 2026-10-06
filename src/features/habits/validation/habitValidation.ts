/**
 * @file habitValidation.ts
 * @description Input sanitization and data validation for the Habits Module conforming to firebase-blueprint schema.
 * @module Features/Habits/Validation
 */

import { HabitItem, HabitLog } from '../types/habit.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateHabitItem(habit: Partial<HabitItem>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!habit.name || typeof habit.name !== 'string' || habit.name.trim().length === 0) {
    errors.name = 'Habit name is required.';
  } else if (habit.name.length > 200) {
    errors.name = 'Habit name must not exceed 200 characters.';
  }

  if (habit.description && habit.description.length > 2000) {
    errors.description = 'Description must not exceed 2000 characters.';
  }

  if (habit.motivationNote && habit.motivationNote.length > 1000) {
    errors.motivationNote = 'Motivation note must not exceed 1000 characters.';
  }

  if (habit.dailyGoal !== undefined && (isNaN(habit.dailyGoal) || habit.dailyGoal < 1)) {
    errors.dailyGoal = 'Daily goal target must be at least 1.';
  }

  if (!habit.category || habit.category.trim().length === 0) {
    errors.category = 'Category is required.';
  }

  if (!habit.status || !['active', 'paused', 'archived'].includes(habit.status)) {
    errors.status = 'Invalid habit status.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sanitizeHabitItem(raw: Partial<HabitItem>, userId: string): HabitItem {
  const now = new Date().toISOString();
  const todayStr = now.split('T')[0];

  return {
    id: raw.id || `habit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    userId: raw.userId || userId,
    name: (raw.name || 'Untitled Habit').trim().slice(0, 200),
    description: (raw.description || '').trim().slice(0, 2000),
    icon: raw.icon || 'Flame',
    emoji: raw.emoji || '⚡',
    category: raw.category || 'Health',
    color: raw.color || '#10b981',
    frequency: raw.frequency || 'daily',
    frequencyDays: raw.frequencyDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    frequencyInterval: raw.frequencyInterval || 1,
    dailyGoal: raw.dailyGoal && raw.dailyGoal > 0 ? Number(raw.dailyGoal) : 1,
    dailyGoalUnit: (raw.dailyGoalUnit || 'times').trim().slice(0, 30),
    weeklyGoal: raw.weeklyGoal || undefined,
    monthlyGoal: raw.monthlyGoal || undefined,
    timeOfDay: raw.timeOfDay || 'anytime',
    reminder: Boolean(raw.reminder),
    reminderTime: raw.reminderTime || '09:00',
    startDate: raw.startDate || todayStr,
    endDate: raw.endDate || undefined,
    difficulty: raw.difficulty || 'medium',
    motivationNote: (raw.motivationNote || '').trim().slice(0, 1000),
    habitType: raw.habitType || 'build',
    tags: Array.isArray(raw.tags) ? raw.tags.map((t) => String(t).trim().slice(0, 30)) : [],
    notes: (raw.notes || '').trim().slice(0, 2000),
    status: raw.status || 'active',
    isFavourite: Boolean(raw.isFavourite),

    currentStreak: raw.currentStreak || 0,
    bestStreak: raw.bestStreak || 0,
    totalCompletions: raw.totalCompletions || 0,
    lastCompletedDate: raw.lastCompletedDate || undefined,

    createdAt: raw.createdAt || now,
    updatedAt: now,
  };
}
