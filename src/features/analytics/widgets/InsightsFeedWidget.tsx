/**
 * @file InsightsFeedWidget.tsx
 * @description Feed for Achievements, Warnings, Highlights, Streaks, Milestones, and Recommendations.
 * @module Features/Analytics/Widgets
 */

import React, { useState } from 'react';
import { useInsights } from '../hooks/useInsights';
import { InsightCategory } from '../types';
import { Trophy, AlertTriangle, Sparkles, Flame, Flag, Lightbulb, Search } from 'lucide-react';

export const InsightsFeedWidget: React.FC = () => {
  const { insights, searchQuery, setSearchQuery } = useInsights();
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | 'all'>('all');

  const categories: { id: InsightCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Insights' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'streak', label: 'Streaks' },
    { id: 'warning', label: 'Warnings' },
    { id: 'highlight', label: 'Highlights' },
  ];

  const getCategoryBadge = (cat: InsightCategory) => {
    switch (cat) {
      case 'achievement':
        return { icon: <Trophy className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'streak':
        return { icon: <Flame className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'warning':
        return { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'highlight':
        return { icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'milestone':
        return { icon: <Flag className="w-3.5 h-3.5" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' };
    }
  };

  const filtered = insights.filter((i) => selectedCategory === 'all' || i.category === selectedCategory);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white">Automated Intelligence Feed</h3>
          <p className="text-xs text-slate-400">Achievements, warnings, streaks, and milestone alerts</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            id="insights-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search insights..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            id={`insight-cat-${c.id}`}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No insights matched your query.</div>
        ) : (
          filtered.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border mt-0.5 ${badge.color}`}>{badge.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                      <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">[{item.domain}]</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    {item.actionableStep && (
                      <p className="text-[11px] text-emerald-400/90 mt-1.5 flex items-center gap-1 font-mono">
                        💡 Action Step: {item.actionableStep}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    Impact {item.impactScore}/10
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
