/**
 * @file BudgetProgressChart.tsx
 * @description Horizontal progress bar chart rendering budget limits vs actual spending across categories.
 * @module Features/Finance/Charts
 */

import React from 'react';
import { Budget, Transaction } from '../types/finance.types';
import { calculateBudgetProgress, formatCurrency } from '../utils/financeUtils';

interface BudgetProgressChartProps {
  budgets: Budget[];
  transactions: Transaction[];
  currency: string;
}

export const BudgetProgressChart: React.FC<BudgetProgressChartProps> = ({ budgets, transactions, currency }) => {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-slate-400 text-sm">
        No active budgets created yet.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {budgets.slice(0, 5).map((budget) => {
        const { spent, limit, percentSpent, isOverBudget, isWarning } = calculateBudgetProgress(
          budget,
          transactions
        );

        let barColor = 'bg-indigo-500';
        if (isOverBudget) barColor = 'bg-rose-500';
        else if (isWarning) barColor = 'bg-amber-500';

        return (
          <div key={budget.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-200">{budget.name}</span>
              <span className="text-slate-400">
                <span className={isOverBudget ? 'text-rose-400 font-bold' : 'text-slate-200 font-semibold'}>
                  {formatCurrency(spent, currency)}
                </span>{' '}
                / {formatCurrency(limit, currency)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(100, percentSpent)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
