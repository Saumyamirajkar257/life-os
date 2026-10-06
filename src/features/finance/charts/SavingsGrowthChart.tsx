/**
 * @file SavingsGrowthChart.tsx
 * @description Line chart tracking milestone growth across active Savings Goals.
 * @module Features/Finance/Charts
 */

import React from 'react';
import { SavingsGoal } from '../types/finance.types';
import { formatCurrency } from '../utils/financeUtils';

interface SavingsGrowthChartProps {
  goals: SavingsGoal[];
}

export const SavingsGrowthChart: React.FC<SavingsGrowthChartProps> = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-slate-400 text-sm">
        No active savings goals configured.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {goals.map((goal) => {
        const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
        return (
          <div key={goal.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-100">{goal.name}</span>
              <span className="text-emerald-400 font-bold">{percent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Current: {formatCurrency(goal.currentAmount)}</span>
              <span>Target: {formatCurrency(goal.targetAmount)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
