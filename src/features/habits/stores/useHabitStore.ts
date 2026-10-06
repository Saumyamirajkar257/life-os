/**
 * @file useHabitStore.ts
 * @description Zustand server-state store for Habit documents and HabitLog records with real-time Firestore sync.
 * @module Features/Habits/Stores/UseHabitStore
 */

import { create } from 'zustand';
import { auth } from '@/lib/firebase/config';
import { HabitItem, HabitLog } from '../types/habit.types';
import { PRESET_HABIT_TEMPLATES } from '../constants/habitConstants';
import { sanitizeHabitItem } from '../validation/habitValidation';
import {
  saveHabitToFirestore,
  deleteHabitFromFirestore,
  saveHabitLogToFirestore,
  deleteHabitLogFromFirestore,
  subscribeToHabits,
  subscribeToHabitLogs,
  testHabitsConnection,
} from '../services/habitsFirestoreService';
import { getTodayDateString } from '../utils/habitDateUtils';

interface HabitState {
  habits: HabitItem[];
  logs: HabitLog[];
  isLoading: boolean;
  isSyncedWithFirestore: boolean;
  activeUserId: string;

  // Actions
  initializeHabits: (userId?: string) => Promise<void>;
  addHabit: (habit: Partial<HabitItem>) => Promise<HabitItem>;
  updateHabit: (id: string, updates: Partial<HabitItem>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleArchiveHabit: (id: string) => Promise<void>;
  togglePauseHabit: (id: string) => Promise<void>;
  toggleFavouriteHabit: (id: string) => Promise<void>;
  duplicateHabit: (id: string) => Promise<HabitItem | null>;

  // Check-In Log Actions
  checkInHabit: (habitId: string, dateStr?: string, valueIncrement?: number) => Promise<void>;
  decrementProgress: (habitId: string, dateStr?: string) => Promise<void>;
  skipHabitToday: (habitId: string, dateStr?: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  logs: [],
  isLoading: false,
  isSyncedWithFirestore: false,
  activeUserId: 'guest_aura_user',

  initializeHabits: async (userId) => {
    const activeUid = userId || auth.currentUser?.uid;
    if (!activeUid) {
      set({ isLoading: false, isSyncedWithFirestore: false, activeUserId: 'guest_aura_user' });
      return;
    }
    set({ activeUserId: activeUid });
    if (get().habits.length === 0) {
      set({ isLoading: true });
    }

    // Test Firestore connection
    const isOnline = await testHabitsConnection();

    if (isOnline) {
      set({ isSyncedWithFirestore: true });

      // Subscribe to real-time Firestore changes for habits
      subscribeToHabits(
        activeUid,
        (fetchedHabits) => {
          set({ habits: fetchedHabits, isLoading: false });
        },
        (err) => console.warn('Habits Firestore subscribe error:', err)
      );

      // Subscribe to real-time logs
      subscribeToHabitLogs(
        activeUid,
        (fetchedLogs) => {
          set({ logs: fetchedLogs });
        },
        (err) => console.warn('Habit logs Firestore subscribe error:', err)
      );
    } else {
      // Offline fallback
      set({ isSyncedWithFirestore: false, isLoading: false });
    }
  },

  addHabit: async (partial) => {
    const userId = auth.currentUser?.uid || get().activeUserId;
    set({ activeUserId: userId });
    const newHabit = sanitizeHabitItem({ ...partial, userId }, userId);

    // Optimistic local update
    set((state) => ({ habits: [newHabit, ...state.habits] }));

    // Sync to Firestore
    if (get().isSyncedWithFirestore) {
      await saveHabitToFirestore(newHabit);
    }

    return newHabit;
  },

  updateHabit: async (id, updates) => {
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id
          ? {
              ...h,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : h
      ),
    }));

    const target = get().habits.find((h) => h.id === id);
    if (target && get().isSyncedWithFirestore) {
      await saveHabitToFirestore(target);
    }
  },

  deleteHabit: async (id) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      logs: state.logs.filter((l) => l.habitId !== id),
    }));

    if (get().isSyncedWithFirestore) {
      await deleteHabitFromFirestore(id);
    }
  },

  toggleArchiveHabit: async (id) => {
    const target = get().habits.find((h) => h.id === id);
    if (!target) return;

    const nextStatus = target.status === 'archived' ? 'active' : 'archived';
    await get().updateHabit(id, { status: nextStatus });
  },

  togglePauseHabit: async (id) => {
    const target = get().habits.find((h) => h.id === id);
    if (!target) return;

    const nextStatus = target.status === 'paused' ? 'active' : 'paused';
    await get().updateHabit(id, { status: nextStatus });
  },

  toggleFavouriteHabit: async (id) => {
    const target = get().habits.find((h) => h.id === id);
    if (!target) return;

    await get().updateHabit(id, { isFavourite: !target.isFavourite });
  },

  duplicateHabit: async (id) => {
    const target = get().habits.find((h) => h.id === id);
    if (!target) return null;

    const copy = await get().addHabit({
      ...target,
      id: undefined,
      name: `${target.name} (Copy)`,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      lastCompletedDate: undefined,
      createdAt: undefined,
    });

    return copy;
  },

  checkInHabit: async (habitId, dateStr, valueIncrement = 1) => {
    const today = dateStr || getTodayDateString();
    const userId = get().activeUserId;
    const targetHabit = get().habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const logId = `log_${habitId}_${today}`;
    const existingLog = get().logs.find((l) => l.id === logId);

    let nextValue = (existingLog?.value || 0) + valueIncrement;
    if (nextValue > targetHabit.dailyGoal) nextValue = targetHabit.dailyGoal;

    const isFullyCompleted = nextValue >= targetHabit.dailyGoal;
    const logStatus = isFullyCompleted
      ? 'completed'
      : nextValue > 0
      ? 'partial'
      : 'missed';

    const updatedLog: HabitLog = {
      id: logId,
      habitId,
      userId,
      date: today,
      status: logStatus,
      value: nextValue,
      target: targetHabit.dailyGoal,
      completedAt: isFullyCompleted ? new Date().toISOString() : existingLog?.completedAt,
      createdAt: existingLog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic log update
    set((state) => ({
      logs: state.logs.filter((l) => l.id !== logId).concat(updatedLog),
    }));

    // Update habit streak and lastCompletedDate
    if (isFullyCompleted) {
      const nextCurrentStreak = targetHabit.currentStreak + 1;
      const nextBestStreak = Math.max(targetHabit.bestStreak, nextCurrentStreak);

      await get().updateHabit(habitId, {
        currentStreak: nextCurrentStreak,
        bestStreak: nextBestStreak,
        totalCompletions: targetHabit.totalCompletions + 1,
        lastCompletedDate: today,
      });
    }

    if (get().isSyncedWithFirestore) {
      await saveHabitLogToFirestore(updatedLog);
    }
  },

  decrementProgress: async (habitId, dateStr) => {
    const today = dateStr || getTodayDateString();
    const targetHabit = get().habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const logId = `log_${habitId}_${today}`;
    const existingLog = get().logs.find((l) => l.id === logId);
    if (!existingLog || existingLog.value <= 0) return;

    const nextValue = existingLog.value - 1;
    if (nextValue <= 0) {
      // Remove log
      set((state) => ({ logs: state.logs.filter((l) => l.id !== logId) }));
      if (get().isSyncedWithFirestore) {
        await deleteHabitLogFromFirestore(logId);
      }
    } else {
      const updatedLog: HabitLog = {
        ...existingLog,
        value: nextValue,
        status: 'partial',
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        logs: state.logs.filter((l) => l.id !== logId).concat(updatedLog),
      }));
      if (get().isSyncedWithFirestore) {
        await saveHabitLogToFirestore(updatedLog);
      }
    }
  },

  skipHabitToday: async (habitId, dateStr) => {
    const today = dateStr || getTodayDateString();
    const userId = get().activeUserId;
    const targetHabit = get().habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const logId = `log_${habitId}_${today}`;
    const updatedLog: HabitLog = {
      id: logId,
      habitId,
      userId,
      date: today,
      status: 'skipped',
      value: 0,
      target: targetHabit.dailyGoal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      logs: state.logs.filter((l) => l.id !== logId).concat(updatedLog),
    }));

    if (get().isSyncedWithFirestore) {
      await saveHabitLogToFirestore(updatedLog);
    }
  },
}));
