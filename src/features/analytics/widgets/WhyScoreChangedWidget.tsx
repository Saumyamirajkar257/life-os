/**
 * @file WhyScoreChangedWidget.tsx
 * @description Extracts and presents the most impactful insights for the user.
 * @module Features/Analytics/Widgets
 */

import React from 'react';
import { useInsights } from '../hooks/useInsights';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export const WhyScoreChangedWidget: React.FC = () => {
  const { insights } = useInsights();

  // Sort insights by impact score
  const topInsights = [...insights]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 2); // take top 2 most impactful to allow wider, stacked cards

  if (topInsights.length === 0) {
    return (
      <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-4">Why your score changed</h2>
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-background)]">
          <Info className="w-8 h-8 text-[var(--color-text-tertiary)] mb-3" />
          <p className="text-[var(--color-text-secondary)] font-medium mb-1">Not enough activity yet</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">Complete a few tasks and habits to generate insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8">
      <h2 className="text-lg font-bold text-white mb-6">Why your score changed</h2>
      <div className="grid grid-cols-1 gap-4">
        {topInsights.map((insight) => {
          const isPositive = insight.category === 'achievement' || insight.category === 'highlight' || insight.category === 'streak' || insight.category === 'milestone';
          return (
            <div key={insight.id} className="bg-[var(--color-background)] border border-[var(--color-border)] p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group hover:border-[var(--color-border-hover)] transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-1 ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className={`text-sm font-bold leading-tight mb-1 ${isPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isPositive ? '↑' : '↓'} {insight.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
