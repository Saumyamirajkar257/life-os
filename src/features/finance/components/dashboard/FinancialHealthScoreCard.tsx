/**
 * @file FinancialHealthScoreCard.tsx
 * @description Financial Health Score gauge (0-100) with rating breakdown and recommendations.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { FinancialHealth } from '../../types/finance.types';

interface FinancialHealthScoreCardProps {
  healthScore: FinancialHealth;
}

export const FinancialHealthScoreCard: React.FC<FinancialHealthScoreCardProps> = ({ healthScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Financial Health Score</span>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getScoreColor(healthScore.score)}`}>
          {healthScore.rating}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-800/80 border-4 border-indigo-500/30 shadow-inner">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-white">{healthScore.score}</span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Emergency Fund:</span>
            <span className="font-bold text-white">{healthScore.emergencyFundMonths} Months</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Budget Adherence:</span>
            <span className="font-bold text-white">{healthScore.budgetAdherencePercent}%</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Savings Rate:</span>
            <span className="font-bold text-emerald-400">{healthScore.savingsRatePercent}%</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-800/40 rounded-xl text-xs space-y-1.5 border border-slate-700/40">
        <div className="flex items-center gap-1.5 font-semibold text-indigo-300 text-[11px] uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>AI Recommendations</span>
        </div>
        <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
          {healthScore.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
