/**
 * @file BudgetOverviewWidget.tsx
 * @description Summary widget displaying budget compliance bars and over-budget highlights.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { PieChart, ArrowRight, PlusCircle } from 'lucide-react';
import { Budget, Transaction } from '../../types/finance.types';
import { BudgetProgressChart } from '../../charts/BudgetProgressChart';

interface BudgetOverviewWidgetProps {
  budgets: Budget[];
  transactions: Transaction[];
  onOpenBudgetModal: () => void;
  onNavigateBudgetsTab: () => void;
  currency: string;
}

export const BudgetOverviewWidget: React.FC<BudgetOverviewWidgetProps> = ({
  budgets,
  transactions,
  onOpenBudgetModal,
  onNavigateBudgetsTab,
  currency,
}) => {
  return (
    <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <PieChart className="w-4 h-4 text-indigo-400" />
          <span>Budget Allocation</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBudgetModal}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Budget</span>
          </button>
          <button
            onClick={onNavigateBudgetsTab}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <BudgetProgressChart budgets={budgets} transactions={transactions} currency={currency} />
    </div>
  );
};
