/**
 * @file InsightsWidget.tsx
 * @description Widget displaying dynamic AI financial insights and proactive suggestions.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, Info } from 'lucide-react';
import { FinancialInsight } from '../../types/finance.types';
import { FinanceTab } from '../../stores/useFinanceUIStore';

interface InsightsWidgetProps {
  insights: FinancialInsight[];
  onNavigateTab: (tab: FinanceTab) => void;
}

export const InsightsWidget: React.FC<InsightsWidgetProps> = ({ insights, onNavigateTab }) => {
  const getInsightIcon = (type: FinancialInsight['type']) => {
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    if (type === 'opportunity') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (type === 'tip') return <Lightbulb className="w-4 h-4 text-amber-400" />;
    return <Info className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
        <Sparkles className="w-4 h-4" />
        <span>Financial Intelligence & Insights</span>
      </div>

      {insights.length === 0 ? (
        <div className="py-4 text-center text-xs text-slate-500">
          No insights currently triggered. Keep logging transactions!
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-3.5 bg-slate-800/40 border border-slate-700/40 rounded-xl space-y-2 text-xs"
            >
              <div className="flex items-center gap-2 font-semibold text-slate-100">
                {getInsightIcon(ins.type)}
                <span>{ins.title}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{ins.message}</p>
              {ins.actionableText && ins.actionTab && (
                <button
                  onClick={() => onNavigateTab(ins.actionTab as FinanceTab)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
                >
                  {ins.actionableText} →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
