/**
 * @file SpendingBreakdownWidget.tsx
 * @description Compact widget showing category breakdown of expenses.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { PieChart, MoreHorizontal } from 'lucide-react';
import { Transaction } from '../../types/finance.types';
import { calculateCategoryTotals, formatCurrency } from '../../utils/financeUtils';
import { getFinanceIcon } from '../../utils/financeIcons';

interface SpendingBreakdownWidgetProps {
  transactions: Transaction[];
  currency: string;
}

export const SpendingBreakdownWidget: React.FC<SpendingBreakdownWidgetProps> = ({ transactions, currency }) => {
  const totals = calculateCategoryTotals(transactions, 'expense').slice(0, 5); // Top 5 categories

  if (totals.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Spending Breakdown</h3>
        <button className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {totals.map((t, idx) => {
          const IconComp = getFinanceIcon(t.icon, PieChart);
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}20` }}>
                  <IconComp className="w-4 h-4" style={{ color: t.color }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.category}</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)]">{t.percentage.toFixed(0)}% of expenses</div>
                </div>
              </div>
              <div className="text-sm font-bold text-white">
                {formatCurrency(t.totalAmount, currency)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
