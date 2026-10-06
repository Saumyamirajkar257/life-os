/**
 * @file SavingsGoalList.tsx
 * @description Master view for user savings goals, emergency fund progress, and milestone trackers.
 * @module Features/Finance/Components/Savings
 */

import React from 'react';
import { PlusCircle, Target } from 'lucide-react';
import { SavingsGoalCard } from './SavingsGoalCard';
import { useFinance } from '../../hooks/useFinance';

export const SavingsGoalList: React.FC = () => {
  const { savingsGoals, contributeToSavingsGoal, deleteSavingsGoal, openModal } = useFinance();

  const handleQuickAdd = (goalId: string) => {
    const input = prompt('Enter contribution amount ($):', '250');
    if (input) {
      const val = parseFloat(input);
      if (!isNaN(val) && val > 0) {
        contributeToSavingsGoal(goalId, val);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Savings Goals & Buckets</h2>
          <p className="text-xs text-slate-400 mt-1">
            Build emergency funds, plan vacations, and automate down payment contributions.
          </p>
        </div>

        <button
          onClick={() => openModal('savings_goal')}
          id="btn-add-goal-page"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {savingsGoals.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <Target className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No savings goals created.</p>
          <p className="text-xs text-slate-500">
            Click "New Goal" to set target amounts for emergency cushions or future purchases.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onContribute={handleQuickAdd}
              onEdit={(g) => openModal('savings_goal', { goal: g })}
              onDelete={deleteSavingsGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
