import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  targetDays: number[]; // 0-6 for Sunday-Saturday
  completedDates: string[]; // ISO date strings
  currentStreak: number;
  bestStreak: number;
  icon: string;
  color: string;
  category?: string;
}

interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'bestStreak'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (id: string, date: string) => void;
}

const initialHabits: Habit[] = [];

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: initialHabits,
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              completedDates: [],
              currentStreak: 0,
              bestStreak: 0,
            },
          ],
        })),
      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),
      toggleHabitComplete: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            
            const completed = habit.completedDates.includes(date);
            const newDates = completed
              ? habit.completedDates.filter((d) => d !== date)
              : [...habit.completedDates, date].sort();
              
            return {
              ...habit,
              completedDates: newDates,
              currentStreak: completed ? Math.max(0, habit.currentStreak - 1) : habit.currentStreak + 1,
              bestStreak: completed ? habit.bestStreak : Math.max(habit.bestStreak, habit.currentStreak + 1),
            };
          }),
        })),
    }),
    {
      name: 'life-os-habits',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
