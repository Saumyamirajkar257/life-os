import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'down' | 'exhausted';
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (title: string, content: string, mood: JournalEntry['mood']) => void;
  deleteEntry: (id: string) => void;
}

const initialEntries: JournalEntry[] = [];

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: initialEntries,
      addEntry: (title, content, mood) =>
        set((state) => ({
          entries: [
            {
              id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              title,
              content,
              date: new Date().toISOString().split('T')[0],
              mood,
            },
            ...state.entries,
          ],
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: 'life-os-journal',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
