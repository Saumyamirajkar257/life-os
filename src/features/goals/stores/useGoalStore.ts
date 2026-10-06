/**
 * @file useGoalStore.ts
 * @description Main Zustand store managing Goals, Projects, and Milestones with Firestore persistence.
 * @module Features/Goals/Stores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GoalItem, ProjectItem, MilestoneItem } from '../types/goal.types';
import { auth } from '@/lib/firebase/config';
import { goalsFirestoreService } from '../services/goalsFirestoreService';

interface GoalState {
  goals: GoalItem[];
  projects: ProjectItem[];
  milestones: MilestoneItem[];
  activeGoalViewMode: string;
  isDetailDrawerOpen: boolean;
  activeDetailGoalId: string | null;
  isFormModalOpen: boolean;
  editingGoalId: string | null;
  isLoading: boolean;

  // Actions
  setGoalViewMode: (mode: string) => void;
  openDetailDrawer: (goalId: string) => void;
  closeDetailDrawer: () => void;
  openFormModal: (goalId?: string) => void;
  closeFormModal: () => void;
  
  loadGoals: (userId?: string) => Promise<void>;
  createGoal: (goal: Omit<GoalItem, 'id' | 'createdAt' | 'updatedAt'>) => GoalItem;
  updateGoal: (id: string, updates: Partial<GoalItem>) => void;
  deleteGoal: (id: string) => void;
}

const SEED_GOALS: GoalItem[] = [
  {
    id: 'goal_1',
    userId: 'default_user',
    title: 'Master Autonomous AI Engineering',
    description: 'Build full-stack intelligent systems with agentic workflows and real-time state synchronization.',
    category: 'Career',
    priority: 'urgent',
    status: 'in_progress',
    icon: 'Target',
    color: '#8B5CF6',
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    progress: 75,
    motivationStatement: 'Empower developers worldwide with instant software generation.',
    visionStatement: 'Lead the next era of AI studio engineering.',
    notes: 'Focus on clean architecture and modular design patterns.',
    tags: ['AI', 'Engineering', 'Aura'],
    attachments: [],
    isFavourite: true,
    isPinned: true,
    linkedHabitIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: SEED_GOALS,
      projects: [],
      milestones: [],
      activeGoalViewMode: 'dashboard',
      isDetailDrawerOpen: false,
      activeDetailGoalId: null,
      isFormModalOpen: false,
      editingGoalId: null,
      isLoading: false,

      setGoalViewMode: (mode) => set({ activeGoalViewMode: mode }),
      openDetailDrawer: (goalId) => set({ isDetailDrawerOpen: true, activeDetailGoalId: goalId }),
      closeDetailDrawer: () => set({ isDetailDrawerOpen: false, activeDetailGoalId: null }),
      openFormModal: (goalId) => set({ isFormModalOpen: true, editingGoalId: goalId || null }),
      closeFormModal: () => set({ isFormModalOpen: false, editingGoalId: null }),

      loadGoals: async (userId?: string) => {
        const uid = userId || auth.currentUser?.uid;
        if (!uid) return;
        set({ isLoading: true });
        try {
          const [fetchedGoals, fetchedProjects, fetchedMilestones] = await Promise.all([
            goalsFirestoreService.fetchGoals(uid),
            goalsFirestoreService.fetchProjects(uid),
            goalsFirestoreService.fetchMilestones(uid),
          ]);
          set({
            goals: fetchedGoals.length > 0 ? fetchedGoals : get().goals,
            projects: fetchedProjects.length > 0 ? fetchedProjects : get().projects,
            milestones: fetchedMilestones.length > 0 ? fetchedMilestones : get().milestones,
            isLoading: false,
          });
        } catch (err) {
          console.warn('[useGoalStore] Firestore sync fallback:', err);
          set({ isLoading: false });
        }
      },

      createGoal: (payload) => {
        const id = `goal_${Date.now()}`;
        const now = new Date().toISOString();
        const userId = auth.currentUser?.uid || payload.userId || 'default_user';
        const newGoal: GoalItem = {
          ...payload,
          priority: payload.priority || 'medium',
          status: payload.status || 'not_started',
          category: payload.category || 'Personal',
          id,
          userId,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ goals: [newGoal, ...state.goals] }));
        if (auth.currentUser) {
          goalsFirestoreService.saveGoal(newGoal);
        }
        return newGoal;
      },

      updateGoal: (id, updates) => {
        const now = new Date().toISOString();
        let updated: GoalItem | undefined;
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id === id) {
              updated = { ...g, ...updates, updatedAt: now };
              return updated;
            }
            return g;
          }),
        }));
        if (updated && auth.currentUser) {
          goalsFirestoreService.saveGoal(updated);
        }
      },

      deleteGoal: (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
        if (auth.currentUser) {
          goalsFirestoreService.deleteGoal(id);
        }
      },
    }),
    {
      name: 'aura-goals-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
