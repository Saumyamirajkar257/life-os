import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export type ConditionType = 'habit_streak' | 'productivity_score' | 'finance_budget' | 'mood_trend';
export type OperatorType = 'greater_than' | 'less_than' | 'equals';
export type ActionType = 'create_achievement' | 'show_recovery_plan' | 'generate_warning' | 'suggest_break';

export interface AutomationRule {
  id: string;
  name: string;
  active: boolean;
  condition: {
    type: ConditionType;
    operator: OperatorType;
    value: number | string;
  };
  action: {
    type: ActionType;
    payload?: any;
  };
  lastTriggered?: string;
}

interface AutomationsState {
  rules: AutomationRule[];
  addRule: (rule: Omit<AutomationRule, 'id'>) => void;
  updateRule: (id: string, updates: Partial<AutomationRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
}

export const useAutomationsStore = create<AutomationsState>()(
  persist(
    (set) => ({
      rules: [
        {
          id: 'rule-1',
          name: 'Habit Consistency Reward',
          active: true,
          condition: { type: 'habit_streak', operator: 'greater_than', value: 29 },
          action: { type: 'create_achievement', payload: { title: '30-Day Master' } }
        },
        {
          id: 'rule-2',
          name: 'Burnout Prevention',
          active: true,
          condition: { type: 'productivity_score', operator: 'less_than', value: 50 },
          action: { type: 'show_recovery_plan' }
        },
        {
          id: 'rule-3',
          name: 'Budget Alert',
          active: true,
          condition: { type: 'finance_budget', operator: 'greater_than', value: 100 },
          action: { type: 'generate_warning' }
        }
      ],
      addRule: (rule) => set((state) => ({
        rules: [...state.rules, { ...rule, id: `rule-${Date.now()}` }]
      })),
      updateRule: (id, updates) => set((state) => ({
        rules: state.rules.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteRule: (id) => set((state) => ({
        rules: state.rules.filter(r => r.id !== id)
      })),
      toggleRule: (id) => set((state) => ({
        rules: state.rules.map(r => r.id === id ? { ...r, active: !r.active } : r)
      }))
    }),
    {
      name: 'life-os-automations',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
