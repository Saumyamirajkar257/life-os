import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Transaction, type SavingsGoal, type Budget } from '@/features/finance/types';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

interface FinanceState {
  transactions: Transaction[];
  goals: SavingsGoal[];
  budgets: Budget[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateGoalSaved: (id: string, saved: number) => void;
  deleteGoal: (id: string) => void;
  updateBudgetLimit: (category: string, limit: number) => void;
}

const initialTransactions: Transaction[] = [];
const initialGoals: SavingsGoal[] = [];
const initialBudgets: Budget[] = [
  { category: 'Groceries', limit: 15000, spent: 0 },
  { category: 'Housing', limit: 25000, spent: 0 },
  { category: 'Entertainment', limit: 5000, spent: 0 },
  { category: 'Transport', limit: 8000, spent: 0 }
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      goals: initialGoals,
      budgets: initialBudgets,
      addTransaction: (txData) =>
        set((state) => {
          const newTx: Transaction = {
            ...txData,
            id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            date: new Date().toISOString().split('T')[0],
          };

          // If this is an expense, automatically update the matching budget category spent amount
          const updatedBudgets = state.budgets.map((b) => {
            if (txData.type === 'expense' && b.category.toLowerCase() === txData.category.toLowerCase()) {
              return { ...b, spent: b.spent + Math.abs(txData.amount) };
            }
            return b;
          });

          return {
            transactions: [newTx, ...state.transactions],
            budgets: updatedBudgets,
          };
        }),
      deleteTransaction: (id) =>
        set((state) => {
          const targetTx = state.transactions.find((tx) => tx.id === id);
          if (!targetTx) return {};

          // Deduct from budget spent if deleting an expense
          const updatedBudgets = state.budgets.map((b) => {
            if (targetTx.type === 'expense' && b.category.toLowerCase() === targetTx.category.toLowerCase()) {
              return { ...b, spent: Math.max(0, b.spent - Math.abs(targetTx.amount)) };
            }
            return b;
          });

          return {
            transactions: state.transactions.filter((tx) => tx.id !== id),
            budgets: updatedBudgets,
          };
        }),
      addGoal: (goalData) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goalData,
              id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            },
          ],
        })),
      updateGoalSaved: (id, saved) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, saved } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      updateBudgetLimit: (category, limit) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.category.toLowerCase() === category.toLowerCase() ? { ...b, limit } : b
          ),
        })),
    }),
    {
      name: 'life-os-finance',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
