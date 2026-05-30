import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface RoutineStep {
  id: string;
  name: string;
  type: 'journal' | 'habit' | 'task' | 'focus' | 'custom';
  durationMinutes?: number;
}

export interface Routine {
  id: string;
  name: string;
  steps: RoutineStep[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  completedDates: string[]; // YYYY-MM-DD
}

interface RoutinesState {
  routines: Routine[];
  addRoutine: (routine: Omit<Routine, 'id' | 'completedDates'>) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  markCompleted: (id: string, date: string) => void;
}

export const useRoutinesStore = create<RoutinesState>()(
  persist(
    (set) => ({
      routines: [
        {
          id: 'routine-1',
          name: 'Morning Routine',
          timeOfDay: 'morning',
          steps: [
            { id: 's1', name: 'Morning Journal', type: 'journal', durationMinutes: 10 },
            { id: 's2', name: 'Review Habits', type: 'habit' },
            { id: 's3', name: 'Plan Daily Tasks', type: 'task', durationMinutes: 15 }
          ],
          completedDates: []
        },
        {
          id: 'routine-2',
          name: 'Deep Study Routine',
          timeOfDay: 'any',
          steps: [
            { id: 's4', name: 'Block Distractions', type: 'custom' },
            { id: 's5', name: 'Focus Session', type: 'focus', durationMinutes: 60 },
            { id: 's6', name: 'AI Summary Briefing', type: 'custom' }
          ],
          completedDates: []
        }
      ],
      addRoutine: (routine) => set((state) => ({
        routines: [...state.routines, { ...routine, id: `routine-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, completedDates: [] }]
      })),
      updateRoutine: (id, updates) => set((state) => ({
        routines: state.routines.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteRoutine: (id) => set((state) => ({
        routines: state.routines.filter(r => r.id !== id)
      })),
      markCompleted: (id, date) => set((state) => ({
        routines: state.routines.map(r => {
          if (r.id === id && !r.completedDates.includes(date)) {
            return { ...r, completedDates: [...r.completedDates, date] };
          }
          return r;
        })
      }))
    }),
    {
      name: 'life-os-routines',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
