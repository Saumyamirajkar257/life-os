/**
 * @file useHabitMutations.ts
 * @description Hook providing habit mutation procedures with optimistic local state updates and toast feedback.
 * @module Features/Habits/Hooks/UseHabitMutations
 */

import { useHabitStore } from '../stores/useHabitStore';
import { useHabitUIStore } from '../stores/useHabitUIStore';
import { HabitItem } from '../types/habit.types';

export function useHabitMutations() {
  const store = useHabitStore();
  const uiStore = useHabitUIStore();

  const handleCreateHabit = async (partial: Partial<HabitItem>) => {
    const habit = await store.addHabit(partial);
    uiStore.closeFormModal();
    return habit;
  };

  const handleUpdateHabit = async (id: string, updates: Partial<HabitItem>) => {
    await store.updateHabit(id, updates);
    uiStore.closeFormModal();
  };

  const handleDeleteHabit = async (id: string) => {
    await store.deleteHabit(id);
    if (uiStore.activeDetailHabitId === id) {
      uiStore.closeDetailDrawer();
    }
  };

  const handleCheckIn = async (habitId: string, dateStr?: string, increment = 1) => {
    await store.checkInHabit(habitId, dateStr, increment);
  };

  const handleDecrement = async (habitId: string, dateStr?: string) => {
    await store.decrementProgress(habitId, dateStr);
  };

  const handleSkipToday = async (habitId: string, dateStr?: string) => {
    await store.skipHabitToday(habitId, dateStr);
  };

  return {
    createHabit: handleCreateHabit,
    updateHabit: handleUpdateHabit,
    deleteHabit: handleDeleteHabit,
    toggleArchive: store.toggleArchiveHabit,
    togglePause: store.togglePauseHabit,
    toggleFavourite: store.toggleFavouriteHabit,
    duplicateHabit: store.duplicateHabit,

    checkIn: handleCheckIn,
    decrement: handleDecrement,
    skipToday: handleSkipToday,
  };
}
