/**
 * @file BudgetCard.tsx
 * @description Card rendering budget allocation, progress bar, alert thresholds, and over-budget warnings.
 * @module Features/Finance/Components/Budgets
 */

import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Budget, Transaction } from '../../types/finance.types';
import { calculateBudgetProgress, formatCurrency } from '../../utils/financeUtils';

interface BudgetCardProps {
  budget: Budget;
  transactions: Transaction[];
  onEdit: (bgt: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  transactions,
  onEdit,
  onDelete,
}) => {
  const { spent, limit, remaining, percentSpent, isOverBudget, isWarning } = calculateBudgetProgress(
    budget,
    transactions
  );

  let badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  let barColor = 'bg-indigo-500';

  if (isOverBudget) {
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    barColor = 'bg-rose-500';
  } else if (isWarning) {
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4 relative group">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-white">{budget.name}</h4>
          <span className="text-[11px] text-slate-400">{budget.category} • Monthly</span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(budget)}
            title="Edit"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            title="Delete"
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300">Spent: <strong className="text-white">{formatCurrency(spent)}</strong></span>
          <span className="text-slate-400">Limit: {formatCurrency(limit)}</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${barColor}`}
            style={{ width: `${Math.min(100, percentSpent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className={`px-2 py-0.5 rounded border font-semibold ${badgeColor}`}>
            {percentSpent.toFixed(0)}% Used
          </span>
          <span className="text-slate-400">
            {isOverBudget ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Over by {formatCurrency(spent - limit)}
              </span>
            ) : (
              <span>{formatCurrency(remaining)} remaining</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
