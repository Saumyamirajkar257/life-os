/**
 * @file usePlannerStore.ts
 * @description Store for managing daily planner notes, focus timer, and daily summaries.
 * @module Features/Calendar/Stores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlannerNote } from '../types/calendar.types';
import { saveUserPlannerNote, fetchUserPlannerNote } from '../services/calendarFirestore.service';

interface PlannerState {
  plannerNotes: Record<string, PlannerNote>; // Keyed by YYYY-MM-DD
  focusMinutesToday: number;
  isFocusTimerRunning: boolean;

  // Actions
  loadPlannerNote: (dateStr: string, userId?: string) => Promise<void>;
  updateDailyNote: (dateStr: string, text: string, userId?: string) => void;
  addFocusTime: (dateStr: string, minutes: number) => void;
  toggleTaskCompletion: (dateStr: string, taskId: string) => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      plannerNotes: {},
      focusMinutesToday: 0,
      isFocusTimerRunning: false,

      loadPlannerNote: async (dateStr, userId = 'default_user') => {
        const fetched = await fetchUserPlannerNote(userId, dateStr);
        if (fetched) {
          set((state) => ({
            plannerNotes: { ...state.plannerNotes, [dateStr]: fetched },
          }));
        }
      },

      updateDailyNote: (dateStr, text, userId = 'default_user') => {
        const current = get().plannerNotes[dateStr] || {
          id: `${userId}_${dateStr}`,
          userId,
          date: dateStr,
          notes: '',
          focusScore: 85,
          focusMinutes: 0,
          completedTaskIds: [],
          completedHabitIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updated: PlannerNote = {
          ...current,
          notes: text,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          plannerNotes: { ...state.plannerNotes, [dateStr]: updated },
        }));

        saveUserPlannerNote(updated);
      },

      addFocusTime: (dateStr, minutes) => {
        const current = get().plannerNotes[dateStr];
        if (current) {
          const updated = {
            ...current,
            focusMinutes: (current.focusMinutes || 0) + minutes,
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            plannerNotes: { ...state.plannerNotes, [dateStr]: updated },
          }));
          saveUserPlannerNote(updated);
        }
      },

      toggleTaskCompletion: (dateStr, taskId) => {
        const current = get().plannerNotes[dateStr];
        if (!current) return;
        const exists = current.completedTaskIds.includes(taskId);
        const updatedIds = exists
          ? current.completedTaskIds.filter((id) => id !== taskId)
          : [...current.completedTaskIds, taskId];

        const updated = {
          ...current,
          completedTaskIds: updatedIds,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          plannerNotes: { ...state.plannerNotes, [dateStr]: updated },
        }));
        saveUserPlannerNote(updated);
      },
    }),
    {
      name: 'aura-planner-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
