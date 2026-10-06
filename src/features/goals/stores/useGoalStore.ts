/**
 * @file useGoalStore.ts
 * @description Main Zustand store managing Goals, Projects, and Milestones.
 * @module Features/Goals/Stores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GoalItem, ProjectItem, MilestoneItem } from '../types/goal.types';

interface GoalState {
  goals: GoalItem[];
  projects: ProjectItem[];
  milestones: MilestoneItem[];
  activeGoalViewMode: string;
  isDetailDrawerOpen: boolean;
  activeDetailGoalId: string | null;
  isFormModalOpen: boolean;
  editingGoalId: string | null;

  // Actions
  setGoalViewMode: (mode: string) => void;
  openDetailDrawer: (goalId: string) => void;
  closeDetailDrawer: () => void;
  openFormModal: (goalId?: string) => void;
  closeFormModal: () => void;
  
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

      setGoalViewMode: (mode) => set({ activeGoalViewMode: mode }),
      openDetailDrawer: (goalId) => set({ isDetailDrawerOpen: true, activeDetailGoalId: goalId }),
      closeDetailDrawer: () => set({ isDetailDrawerOpen: false, activeDetailGoalId: null }),
      openFormModal: (goalId) => set({ isFormModalOpen: true, editingGoalId: goalId || null }),
      closeFormModal: () => set({ isFormModalOpen: false, editingGoalId: null }),

      createGoal: (payload) => {
        const id = `goal_${Date.now()}`;
        const now = new Date().toISOString();
        const newGoal: GoalItem = {
          ...payload,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ goals: [newGoal, ...state.goals] }));
        return newGoal;
      },

      updateGoal: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: now } : g)),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
      },
    }),
    {
      name: 'aura-goals-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
