/**
 * @file habitsConverter.ts
 * @description Firestore Data Converters for HabitItem and HabitLog models.
 * @module Features/Habits/Services/HabitsConverter
 */

import type { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { HabitItem, HabitLog } from '../types/habit.types';
import { sanitizeHabitItem } from '../validation/habitValidation';

export const habitFirestoreConverter: FirestoreDataConverter<HabitItem> = {
  toFirestore(habit: HabitItem) {
    return {
      id: habit.id,
      userId: habit.userId,
      name: habit.name,
      description: habit.description || '',
      icon: habit.icon,
      emoji: habit.emoji,
      category: habit.category,
      color: habit.color,
      frequency: habit.frequency,
      frequencyDays: habit.frequencyDays || [],
      frequencyInterval: habit.frequencyInterval || 1,
      dailyGoal: habit.dailyGoal,
      dailyGoalUnit: habit.dailyGoalUnit,
      weeklyGoal: habit.weeklyGoal || null,
      monthlyGoal: habit.monthlyGoal || null,
      timeOfDay: habit.timeOfDay,
      reminder: habit.reminder,
      reminderTime: habit.reminderTime || '',
      startDate: habit.startDate,
      endDate: habit.endDate || null,
      difficulty: habit.difficulty,
      motivationNote: habit.motivationNote || '',
      habitType: habit.habitType,
      tags: habit.tags || [],
      notes: habit.notes || '',
      status: habit.status,
      isFavourite: habit.isFavourite,
      currentStreak: habit.currentStreak || 0,
      bestStreak: habit.bestStreak || 0,
      totalCompletions: habit.totalCompletions || 0,
      lastCompletedDate: habit.lastCompletedDate || null,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): HabitItem {
    const data = snapshot.data(options);
    return sanitizeHabitItem(
      {
        ...data,
        id: snapshot.id,
      },
      data.userId || 'guest_user'
    );
  },
};

export const habitLogFirestoreConverter: FirestoreDataConverter<HabitLog> = {
  toFirestore(log: HabitLog) {
    return {
      id: log.id,
      habitId: log.habitId,
      userId: log.userId,
      date: log.date,
      status: log.status,
      value: log.value,
      target: log.target,
      notes: log.notes || '',
      completedAt: log.completedAt || null,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): HabitLog {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      habitId: data.habitId || '',
      userId: data.userId || '',
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status || 'completed',
      value: typeof data.value === 'number' ? data.value : 1,
      target: typeof data.target === 'number' ? data.target : 1,
      notes: data.notes || '',
      completedAt: data.completedAt || undefined,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  },
};
