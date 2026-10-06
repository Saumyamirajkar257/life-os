/**
 * @file SavingsGoalCard.tsx
 * @description Card rendering savings goal progress, target date, monthly target, and top-up modal trigger.
 * @module Features/Finance/Components/Savings
 */

import React from 'react';
import { Target, PlusCircle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { SavingsGoal } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onContribute: (id: string) => void;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  onContribute,
  onEdit,
  onDelete,
}) => {
  const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4 relative group">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-white">{goal.name}</h4>
          <span className="text-[11px] text-slate-400">{goal.category} • Target: {goal.targetDate}</span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(goal)}
            title="Edit"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            title="Delete"
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-200">
            Current: <strong className="text-emerald-400">{formatCurrency(goal.currentAmount)}</strong>
          </span>
          <span className="text-slate-400">Target: {formatCurrency(goal.targetAmount)}</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-emerald-400 font-bold">{percent.toFixed(0)}% Achieved</span>
          <button
            onClick={() => onContribute(goal.id)}
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Savings
          </button>
        </div>
      </div>
    </div>
  );
};
