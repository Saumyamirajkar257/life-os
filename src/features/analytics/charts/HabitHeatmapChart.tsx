/**
 * @file HabitHeatmapChart.tsx
 * @description GitHub-style habit completion heatmap grid showing 30-day consistency density.
 * @module Features/Analytics/Charts
 */

import React from 'react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export const HabitHeatmapChart: React.FC = () => {
  const { habitHeatmap } = useAnalyticsData();

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-emerald-500 border-emerald-400';
      case 2:
        return 'bg-emerald-600/70 border-emerald-500/50';
      case 1:
        return 'bg-emerald-900/50 border-emerald-800/40';
      default:
        return 'bg-slate-800/60 border-slate-700/30';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100">30-Day Routine Consistency Matrix</h3>
          <p className="text-[11px] text-slate-400">Heatmap density of habit completions and check-in adherence</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-900/50 border border-emerald-800/40"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-600/70 border border-emerald-500/50"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400"></span>
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 pt-1">
        {habitHeatmap.map((item) => (
          <div
            key={item.date}
            title={`${item.date}: ${item.count} completions`}
            className={`aspect-square rounded-md border transition-all hover:scale-110 cursor-pointer ${getHeatmapColor(item.level)}`}
          />
        ))}
      </div>
    </div>
  );
};
