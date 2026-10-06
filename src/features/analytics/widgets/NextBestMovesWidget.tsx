/**
 * @file NextBestMovesWidget.tsx
 * @description Analyzes lowest performing domains and provides actionable next steps.
 * @module Features/Analytics/Widgets
 */

import React from 'react';
import { useLifeScore } from '../hooks/useLifeScore';
import { ArrowRight, Lightbulb, Target } from 'lucide-react';

export const NextBestMovesWidget: React.FC = () => {
  const { domainScores } = useLifeScore();

  // Find lowest scores that are below 70 or dropping
  const focusAreas = [...domainScores]
    .filter(d => d.score < 75 || d.change < 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  if (focusAreas.length === 0) {
    return null;
  }

  const getActionLink = (domain: string) => {
    switch(domain) {
      case 'tasks':
      case 'productivity': return '/tasks';
      case 'habits':
      case 'consistency': return '/habits';
      case 'finance': return '/finance';
      case 'goals': return '/goals';
      default: return '/';
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-white mb-6">Your next best moves</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {focusAreas.map((area, idx) => (
          <div key={area.domain} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 hover:border-[var(--color-border-hover)] transition-colors flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Strengthen {area.title}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                {area.explanation}
              </p>
            </div>
            <button 
              onClick={() => console.log('Navigate to:', getActionLink(area.domain))}
              className="flex items-center gap-2 text-xs font-bold text-white bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl transition-colors w-fit"
            >
              Take Action <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
