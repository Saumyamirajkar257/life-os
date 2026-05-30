import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface Achievement {
  id: string;
  year: number;
  title: string;
  category: 'Skills' | 'Projects' | 'Career' | 'Personal';
  description: string;
  dateAdded: string;
}

interface AchievementState {
  achievements: Achievement[];
  addAchievement: (year: number, title: string, category: Achievement['category'], description: string) => void;
  deleteAchievement: (id: string) => void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    year: 2025,
    title: 'Learned C Programming Language',
    category: 'Skills',
    description: 'Mastered memory allocation (malloc/free), pointer arithmetic, data structures, and compiled three custom utility shells in C.',
    dateAdded: '2025-03-15T12:00:00.000Z'
  },
  {
    id: 'ach-2',
    year: 2025,
    title: 'Built Professional Developer Portfolio',
    category: 'Projects',
    description: 'Designed and deployed a glassmorphism portfolio site showcasing system designs, compiler modules, and dynamic telemetry widgets.',
    dateAdded: '2025-07-20T15:30:00.000Z'
  },
  {
    id: 'ach-3',
    year: 2026,
    title: 'Mastered AI Engineering & LLM APIs',
    category: 'Skills',
    description: 'Studied transformer architecture, retrieval-augmented generation (RAG), neural networks, and integrated Google Gemini and OpenAI model endpoints.',
    dateAdded: '2026-02-10T09:00:00.000Z'
  }
];

export const useAchievementsStore = create<AchievementState>()(
  persist(
    (set) => ({
      achievements: initialAchievements,
      addAchievement: (year, title, category, description) =>
        set((state) => ({
          achievements: [
            {
              id: `ach-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              year,
              title,
              category,
              description,
              dateAdded: new Date().toISOString()
            },
            ...state.achievements
          ].sort((a, b) => b.year - a.year || new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        })),
      deleteAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.filter((a) => a.id !== id)
        })),
      updateAchievement: (id, updates) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          )
        }))
    }),
    {
      name: 'life-os-achievements',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
