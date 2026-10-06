/**
 * @file index.ts
 * @description Barrel exports for the Habits Module (Milestone 13).
 * @module Features/Habits
 */

export * from './types/habit.types';
export * from './constants/habitConstants';
export * from './stores/useHabitStore';
export * from './stores/useHabitUIStore';
export * from './hooks/useHabits';
export * from './hooks/useHabitMutations';
export * from './hooks/useHabitReminders';
export * from './analytics/useHabitAnalytics';
export * from './pages/HabitsPage';
export * from './module';
