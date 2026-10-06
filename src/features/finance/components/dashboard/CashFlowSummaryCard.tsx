/**
 * @file CashFlowSummaryCard.tsx
 * @description Monthly cash flow card showing Income, Expenses, Net Savings, and trend sparklines.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, PiggyBank, Scale } from 'lucide-react';
import { formatCurrency } from '../../utils/financeUtils';

interface CashFlowSummaryCardProps {
  income: number;
  expense: number;
  netSavings: number;
  currency: string;
}

export const CashFlowSummaryCard: React.FC<CashFlowSummaryCardProps> = ({
  income,
  expense,
  netSavings,
  currency,
}) => {
  const savingsRate = income > 0 ? Math.max(0, (netSavings / income) * 100) : 0;

  return (
    <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Monthly Cash Flow</span>
        </div>
        <span className="text-[11px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-medium">
          {savingsRate.toFixed(0)}% Savings Rate
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Income</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">{formatCurrency(income, currency)}</div>
        </div>

        <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Expenses</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">{formatCurrency(expense, currency)}</div>
        </div>

        <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Net Saved</span>
          </div>
          <div
            className={`text-base sm:text-lg font-bold ${
              netSavings >= 0 ? 'text-indigo-300' : 'text-rose-400'
            }`}
          >
            {formatCurrency(netSavings, currency)}
          </div>
        </div>
      </div>
    </div>
  );
};
