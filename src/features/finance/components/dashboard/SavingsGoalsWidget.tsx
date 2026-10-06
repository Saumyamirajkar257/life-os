/**
 * @file SavingsGoalsWidget.tsx
 * @description Compact widget showing active savings goals.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { Target } from 'lucide-react';
import { SavingsGoal } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';
import { getFinanceIcon } from '../../utils/financeIcons';

interface SavingsGoalsWidgetProps {
  goals: SavingsGoal[];
  currency: string;
}

export const SavingsGoalsWidget: React.FC<SavingsGoalsWidgetProps> = ({ goals, currency }) => {
  if (goals.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Savings Goals</h3>
      </div>

      <div className="flex flex-col gap-4">
        {goals.slice(0, 3).map((g) => {
          const IconComp = getFinanceIcon(g.icon, Target);
          const percent = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
          
          return (
            <div key={g.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${g.color}20` }}>
                    <IconComp className="w-3 h-3" style={{ color: g.color }} />
                  </div>
                  <div className="text-sm font-medium text-white">{g.name}</div>
                </div>
                <div className="text-xs font-bold text-white">
                  {percent.toFixed(0)}%
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-[10px] text-[var(--color-text-secondary)] mb-1">
                  <span>{formatCurrency(g.currentAmount, currency, true)} / {formatCurrency(g.targetAmount, currency, true)}</span>
                  <span>{formatCurrency(g.targetAmount - g.currentAmount, currency, true)} remaining</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all" 
                    style={{ width: `${percent}%`, backgroundColor: g.color || 'var(--color-accent)' }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
