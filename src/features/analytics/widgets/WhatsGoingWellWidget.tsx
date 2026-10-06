/**
 * @file WhatsGoingWellWidget.tsx
 * @description Extracts and presents positive feedback and achievements.
 * @module Features/Analytics/Widgets
 */

import React from 'react';
import { useInsights } from '../hooks/useInsights';
import { Sparkles, Trophy, Flame } from 'lucide-react';

export const WhatsGoingWellWidget: React.FC = () => {
  const { insights } = useInsights();

  // Filter for positive insights only
  const positiveInsights = insights
    .filter(i => i.category === 'achievement' || i.category === 'streak' || i.category === 'highlight' || i.category === 'milestone')
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3);

  if (positiveInsights.length === 0) {
    return null;
  }

  const getIcon = (category: string) => {
    switch(category) {
      case 'achievement': return <Trophy className="w-5 h-5 text-emerald-400" />;
      case 'streak': return <Flame className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-white mb-6">What's going well</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {positiveInsights.map((insight) => (
          <div key={insight.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                {getIcon(insight.category)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{insight.title}</h3>
                <span className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">{insight.domain}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
